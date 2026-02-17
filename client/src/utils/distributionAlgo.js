
// Helper: Shuffle array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper: Parse student identifier string (e.g., "김철수(0302)", "이영희")
// Returns: { name: "김철수", classNum: "3", studentNum: "2" } or { name: "이영희", classNum: null, studentNum: null }
const parseStudentString = (str) => {
    if (!str) return null;
    const cleanStr = str.trim();
    // Regex to capture Name and optional (ClassNum) or (Class-Num)
    // Matches: "Name(1234)", "Name(1-2)", "Name (101)"
    const match = cleanStr.match(/^([^(]+)(?:\s*\((\d{1,2})[-.]?(\d{1,2})\))?$/);

    if (match) {
        return {
            name: match[1].trim(),
            currentClass: match[2] ? String(parseInt(match[2])) : null, // Normalize '03' -> '3'
            number: match[3] ? String(parseInt(match[3])) : null,       // Normalize '02' -> '2'
            raw: cleanStr
        };
    }
    return { name: cleanStr, currentClass: null, number: null, raw: cleanStr };
};

// Helper: Find student object from normalized list based on parsed info
const findStudent = (students, parsedInfo, contextStudent) => {
    if (!parsedInfo) return null;

    // 1. Try Exact Match (Name + Class + Number)
    if (parsedInfo.currentClass && parsedInfo.number) {
        const exact = students.find(s =>
            s.name === parsedInfo.name &&
            String(parseInt(s.currentClass)) === parsedInfo.currentClass &&
            String(parseInt(s.number)) === parsedInfo.number
        );
        if (exact) return exact;
    }

    // 2. Try Name + Class Match (if Number missing or mismatch)
    if (parsedInfo.currentClass) {
        const classMatch = students.find(s =>
            s.name === parsedInfo.name &&
            String(parseInt(s.currentClass)) === parsedInfo.currentClass
        );
        if (classMatch) return classMatch;
    }

    // 3. Try Name Only Match (Scoping rule)
    //    a. Prefer same class as contextStudent
    if (contextStudent) {
        const sameClassMatch = students.find(s =>
            s.name === parsedInfo.name &&
            s.currentClass === contextStudent.currentClass &&
            s.id !== contextStudent.id
        );
        if (sameClassMatch) return sameClassMatch;
    }

    //    b. Global search (if name is unique)
    const candidates = students.filter(s => s.name === parsedInfo.name && s.id !== contextStudent?.id);
    if (candidates.length === 1) return candidates[0];

    //    c. If multiple candidates, pick first (Linear scan fallback) - or could be smarter but risky
    if (candidates.length > 0) return candidates[0];

    return null;
};

export const distributeStudents = (students, classCount, options = {}) => {
    // 1. Initialize classes
    const classes = Array.from({ length: classCount }, (_, i) => ({
        id: `class-${i + 1}`,
        name: `${i + 1}반`,
        type: 'target',
        students: [],
        stats: {
            male: 0,
            female: 0,
            total: 0,
            scoreSum: 0,
            attentionCount: 0, // Track "Attention Needed" count
            sourceClassCounts: {} // Track counts from each source class
        }
    }));

    // 2. Extract Options
    const useGender = options.bGender !== false;
    const useScore = options.bScore !== false;
    const useClassBalance = options.bClass !== false;

    // 3. Normalize Data & Pre-process 
    const normalizedStudents = students.map((s, index) => {
        const genderKey = Object.keys(s).find(k => /성별|gender/i.test(k)) || '성별';
        const nameKey = Object.keys(s).find(k => /이름|name/i.test(k)) || '이름';
        const scoreKey = Object.keys(s).find(k => /점수|성적|score/i.test(k)) || '점수';

        let gender = s[genderKey];
        if (gender === '남' || gender === '남자' || gender === 'M') gender = 'Male';
        if (gender === '여' || gender === '여자' || gender === 'F') gender = 'Female';

        return {
            id: `student-${index}`,
            originalId: index,
            name: s[nameKey] || `Student ${index + 1}`,
            gender: gender || 'Unknown',
            score: Number(s[scoreKey]) || 0,
            currentClass: s.currentClass ? String(s.currentClass) : 'Unknown',
            number: s.number,
            sameClassRequest: s.sameClassRequest,
            separationRequest: s.separationRequest,
            caution: s.caution,
            remarks: s.remarks,
            raw: s,
            clusterId: null,
        };
    });

    // 4. Calculate Global Ideals (Targets)
    const totalStudents = normalizedStudents.length;
    // const idealSize = totalStudents / classCount; // Not used directly in new penalty logic to avoid negative deviation issue

    const totalMales = normalizedStudents.filter(s => s.gender === 'Male').length;
    // const idealMaleCount = useGender ? (totalMales / classCount) : 0;

    const totalFemales = normalizedStudents.filter(s => s.gender === 'Female').length;
    // const idealFemaleCount = useGender ? (totalFemales / classCount) : 0;

    const totalScore = normalizedStudents.reduce((sum, s) => sum + s.score, 0);
    const globalAvgScore = useScore ? (totalScore / totalStudents) : 0;


    // 5. Build Constraints Graph (Clustering)
    const sameClassAdj = new Map();

    normalizedStudents.forEach(student => {
        if (!sameClassAdj.has(student.id)) sameClassAdj.set(student.id, new Set());

        if (student.sameClassRequest) {
            const requestStrs = student.sameClassRequest.split(',').map(s => s.trim()).filter(s => s);
            requestStrs.forEach(reqStr => {
                const parsed = parseStudentString(reqStr);
                const target = findStudent(normalizedStudents, parsed, student);
                if (target) {
                    sameClassAdj.get(student.id).add(target.id);
                    if (!sameClassAdj.has(target.id)) sameClassAdj.set(target.id, new Set());
                    sameClassAdj.get(target.id).add(student.id);
                }
            });
        }
    });

    let clusterCounter = 0;
    const clusters = [];
    const visited = new Set();

    normalizedStudents.forEach(student => {
        if (!visited.has(student.id)) {
            const cluster = [];
            const stack = [student.id];
            visited.add(student.id);

            while (stack.length > 0) {
                const currId = stack.pop();
                const currStudent = normalizedStudents.find(s => s.id === currId);
                cluster.push(currStudent);
                currStudent.clusterId = clusterCounter;

                const neighbors = sameClassAdj.get(currId) || new Set();
                neighbors.forEach(neighborId => {
                    if (!visited.has(neighborId)) {
                        visited.add(neighborId);
                        stack.push(neighborId);
                    }
                });
            }
            clusters.push(cluster);
            clusterCounter++;
        }
    });

    // 6. Build Separation Conflict Clique
    const separationAdj = new Map();

    normalizedStudents.forEach(student => {
        if (!separationAdj.has(student.id)) separationAdj.set(student.id, new Set());

        if (student.separationRequest) {
            const requestStrs = student.separationRequest.split(',').map(s => s.trim()).filter(s => s);
            if (requestStrs.length > 0) {
                const conflictGroup = [student];
                requestStrs.forEach(reqStr => {
                    const parsed = parseStudentString(reqStr);
                    const target = findStudent(normalizedStudents, parsed, student);
                    if (target && !conflictGroup.find(s => s.id === target.id)) {
                        conflictGroup.push(target);
                    }
                });

                for (let i = 0; i < conflictGroup.length; i++) {
                    for (let j = i + 1; j < conflictGroup.length; j++) {
                        const u = conflictGroup[i];
                        const v = conflictGroup[j];
                        if (!separationAdj.has(u.id)) separationAdj.set(u.id, new Set());
                        if (!separationAdj.has(v.id)) separationAdj.set(v.id, new Set());
                        separationAdj.get(u.id).add(v.id);
                        separationAdj.get(v.id).add(u.id);
                    }
                }
            }
        }
    });

    // 7. Sort Clusters for Distribution
    // Priority: Attention -> Size -> Random
    shuffleArray(clusters);
    clusters.sort((a, b) => {
        const aCaution = a.some(s => s.caution);
        const bCaution = b.some(s => s.caution);
        if (aCaution && !bCaution) return -1;
        if (!aCaution && bCaution) return 1;
        if (b.length !== a.length) return b.length - a.length;
        return 0;
    });

    // 8. Weighted Greedy Allocation
    const getPenalty = (cluster, targetClass, minClassSize) => {
        let penalty = 0;

        // Weights
        const W_SEPARATION = 100000000; // Absolute Highest
        const W_STRICT_SIZE = 500000000; // Hard Constraint (Max Diff <= 1)

        // Optimization Objectives
        const W_CAUTION_VAR = 50000000; // Minimize Attention Variance
        const W_GENDER_VAR = 1000000;   // Minimize Gender Variance (External)
        const W_SIZE_VAR = 50000;       // Monotonic size penalty (Tie-breaker for exact match)
        const W_CLASS_BAL = 1000;       // Previous class scatter
        const W_SCORE_VAR = 1000;       // Score balance

        // 1. Separation Conflict (Constraint)
        let separationConflicts = 0;
        cluster.forEach(s1 => {
            const conflicts = separationAdj.get(s1.id);
            if (conflicts) {
                targetClass.students.forEach(s2 => {
                    if (conflicts.has(s2.id)) separationConflicts++;
                });
            }
        });
        penalty += separationConflicts * W_SEPARATION;

        // --- Calculate Predicted State ---
        const currentSize = targetClass.stats.total;
        const clusterSize = cluster.length;
        const predictedSize = currentSize + clusterSize;

        // 2. STRICT Size Constraint
        // Allow ONLY filling up to (MinSize + 1). 
        // If predictedSize > minClassSize + 1, applying huge penalty.
        // This forces the algorithm to fill the "holes" (smallest classes) first.
        if (predictedSize > minClassSize + 1) {
            penalty += W_STRICT_SIZE;
        }

        const currentMales = targetClass.stats.male;
        const clusterMales = cluster.filter(s => s.gender === 'Male').length;
        const predictedMales = currentMales + clusterMales;

        const currentFemales = targetClass.stats.female;
        const clusterFemales = cluster.filter(s => s.gender === 'Female').length;
        const predictedFemales = currentFemales + clusterFemales;

        const currentScoreSum = targetClass.stats.scoreSum;
        const clusterScoreSum = cluster.reduce((sum, s) => sum + s.score, 0);
        const predictedScoreSum = currentScoreSum + clusterScoreSum;
        const predictedAvgScore = predictedSize > 0 ? (predictedScoreSum / predictedSize) : 0;

        const currentAttention = targetClass.stats.attentionCount;
        const clusterAttention = cluster.filter(s => s.caution).length;
        const predictedAttention = currentAttention + clusterAttention;

        // 3. Attention Needed (Even Distribution - Monotonic Quadratic)
        if (predictedAttention > 0) {
            penalty += (predictedAttention * predictedAttention) * W_CAUTION_VAR;
        }

        // 4. Size Balance (General Variance Optimization)
        // Helps distinguish between "Size 29 vs 30" even if both are valid under Strict Constraint.
        penalty += (predictedSize * predictedSize) * W_SIZE_VAR;

        // 5. Gender Balance (Refined: External ONLY)
        if (useGender) {
            // Goal: Minimize variance between classes for each gender.
            const idealMale = totalMales / classCount;
            const idealFemale = totalFemales / classCount;

            const maleDev = predictedMales - idealMale;
            const femaleDev = predictedFemales - idealFemale;

            // Heavily penalize deviation from equal distribution
            penalty += (maleDev * maleDev) * W_GENDER_VAR;
            penalty += (femaleDev * femaleDev) * W_GENDER_VAR;
        }

        // 6. Score Balance (Deviation from Global Avg)
        if (useScore) {
            const scoreDev = predictedAvgScore - globalAvgScore;
            penalty += (scoreDev * scoreDev) * W_SCORE_VAR;
        }

        // 7. Previous Class Balance (Spread Evenly)
        if (useClassBalance) {
            const prevClassCounts = {};
            cluster.forEach(s => {
                prevClassCounts[s.currentClass] = (prevClassCounts[s.currentClass] || 0) + 1;
            });

            Object.entries(prevClassCounts).forEach(([clsName, count]) => {
                const existingCount = targetClass.stats.sourceClassCounts[clsName] || 0;
                penalty += (existingCount * count * count) * W_CLASS_BAL;
            });
        }

        return penalty;
    };

    // Distribution Loop
    clusters.forEach(cluster => {
        let bestClass = null;
        let minPenalty = Infinity;

        // Calculate Minimum Class Size currently in the set
        let minClassSize = Infinity;
        classes.forEach(cls => {
            if (cls.stats.total < minClassSize) minClassSize = cls.stats.total;
        });

        classes.forEach(cls => {
            // Pass minClassSize to enforce strict balancing
            const p = getPenalty(cluster, cls, minClassSize);
            // Random jitter to break ties (0~10)
            const pWithJitter = p + Math.random() * 10;

            if (pWithJitter < minPenalty) {
                minPenalty = pWithJitter;
                bestClass = cls;
            }
        });

        if (bestClass) {
            cluster.forEach(student => {
                bestClass.students.push(student);

                bestClass.stats.total++;
                if (student.gender === 'Male') bestClass.stats.male++;
                if (student.gender === 'Female') bestClass.stats.female++;
                bestClass.stats.scoreSum += student.score;

                if (student.caution) bestClass.stats.attentionCount++;

                const src = student.currentClass;
                bestClass.stats.sourceClassCounts[src] = (bestClass.stats.sourceClassCounts[src] || 0) + 1;
            });
        }
    });

    // 9. Post-Processing: Refine Distribution (Simulated Annealing / Hill Climbing)
    const refineDistribution = () => {
        const MAX_ITERATIONS = 5000;

        // Helper to recalculate stats for a specific class
        const updateClassStats = (cls) => {
            cls.stats.male = 0;
            cls.stats.female = 0;
            cls.stats.total = 0;
            cls.stats.scoreSum = 0;
            cls.stats.attentionCount = 0;
            cls.stats.sourceClassCounts = {};
            cls.stats.sourceClassGenderCounts = {}; // Track [SourceClass_Gender]

            cls.students.forEach(s => {
                cls.stats.total++;
                if (s.gender === 'Male') cls.stats.male++;
                if (s.gender === 'Female') cls.stats.female++;
                cls.stats.scoreSum += s.score;
                if (s.caution) cls.stats.attentionCount++;
                const src = s.currentClass;
                cls.stats.sourceClassCounts[src] = (cls.stats.sourceClassCounts[src] || 0) + 1;

                // Track by gender as well
                const srcGenderKey = `${src}_${s.gender}`;
                cls.stats.sourceClassGenderCounts[srcGenderKey] = (cls.stats.sourceClassGenderCounts[srcGenderKey] || 0) + 1;
            });
        };

        // Energy Function (Lower is better)
        const calculateSystemEnergy = () => {
            let energy = 0;

            // 1. Separation Violations (Hard Constraint)
            let separationViolations = 0;
            classes.forEach(cls => {
                for (let i = 0; i < cls.students.length; i++) {
                    const s1 = cls.students[i];
                    const conflicts = separationAdj.get(s1.id);
                    if (conflicts) {
                        for (let j = i + 1; j < cls.students.length; j++) {
                            const s2 = cls.students[j];
                            if (conflicts.has(s2.id)) separationViolations++;
                        }
                    }
                }
            });
            energy += separationViolations * 1000000; // Huge penalty

            // 2. Class Size Imbalance (Hard Constraint: Max Diff <= 1)
            const sizes = classes.map(c => c.stats.total);
            const maxParam = Math.max(...sizes);
            const minParam = Math.min(...sizes);
            if (maxParam - minParam > 1) {
                energy += 10000000; // Huge penalty (Strict limit)
            }
            // Optimize for exact evenness if possible, but the hard constraint above is what matters most.
            energy += (maxParam - minParam) * 5000;

            // 3. Previous Class Balance (Hard Constraint: Max Diff <= 1)
            // UPDATED: Now also checks Gender-Split Balance (e.g. 3-1 Male must be balanced)
            if (useClassBalance) {
                // Collect all Source-Gender Keys
                const sourceGenderKeys = new Set();
                normalizedStudents.forEach(s => {
                    if (s.currentClass && s.gender) {
                        sourceGenderKeys.add(`${s.currentClass}_${s.gender}`);
                    }
                });

                sourceGenderKeys.forEach(key => {
                    const counts = classes.map(c => c.stats.sourceClassGenderCounts[key] || 0);
                    const maxC = Math.max(...counts);
                    const minC = Math.min(...counts);

                    if (maxC - minC > 1) {
                        energy += 5000000; // Large penalty (Hard Constraint)
                    }
                    energy += (maxC - minC) * 2000;
                });
            }

            // 4. Gender Imbalance
            if (useGender) {
                const idealMale = totalMales / classCount;
                const idealFemale = totalFemales / classCount;
                let maleDevSum = 0;
                let femaleDevSum = 0;
                classes.forEach(cls => {
                    maleDevSum += Math.pow(cls.stats.male - idealMale, 2);
                    femaleDevSum += Math.pow(cls.stats.female - idealFemale, 2);
                });
                energy += (maleDevSum + femaleDevSum) * 2000;
            }

            // 5. Score Imbalance (Relaxed: Max Diff <= 5)
            if (useScore) {
                const avgScores = classes.map(c => c.stats.total > 0 ? c.stats.scoreSum / c.stats.total : 0);
                const maxScore = Math.max(...avgScores);
                const minScore = Math.min(...avgScores);

                // If difference is greater than 5, apply penalty
                if (maxScore - minScore > 5) {
                    energy += (maxScore - minScore - 5) * 10000; // Strong penalty for exceeding limit
                }
                // Small optimization to keep them somewhat close, but very low weight
                energy += (maxScore - minScore) * 1;
            }

            // 6. Attention Imbalance
            let attentionDevSum = 0;
            const totalAttention = classes.reduce((sum, c) => sum + c.stats.attentionCount, 0);
            const idealAttention = totalAttention / classCount;
            classes.forEach(cls => {
                attentionDevSum += Math.pow(cls.stats.attentionCount - idealAttention, 2);
            });
            energy += attentionDevSum * 50000;

            return energy;
        };

        // Initial Energy
        let currentEnergy = calculateSystemEnergy();

        for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
            // Pick two random classes
            const idx1 = Math.floor(Math.random() * classCount);
            let idx2 = Math.floor(Math.random() * classCount);
            while (idx1 === idx2) idx2 = Math.floor(Math.random() * classCount);

            const classA = classes[idx1];
            const classB = classes[idx2];

            // Decide Move or Swap
            // Move: A -> B
            // Swap: A <-> B
            const action = Math.random() < 0.5 ? 'MOVE' : 'SWAP';

            // Backup State
            const backupA = [...classA.students];
            const backupB = [...classB.students];

            if (action === 'MOVE') {
                if (classA.students.length === 0) continue;
                // Pick a cluster from A
                const studentA = classA.students[Math.floor(Math.random() * classA.students.length)];
                const clusterId = studentA.clusterId;
                const clusterStudents = classA.students.filter(s => s.clusterId === clusterId);

                // Move cluster to B
                classA.students = classA.students.filter(s => s.clusterId !== clusterId);
                classB.students.push(...clusterStudents);

            } else { // SWAP
                if (classA.students.length === 0 || classB.students.length === 0) continue;
                // Pick cluster from A
                const sA = classA.students[Math.floor(Math.random() * classA.students.length)];
                const clusterA = classA.students.filter(s => s.clusterId === sA.clusterId);

                // Pick cluster from B
                const sB = classB.students[Math.floor(Math.random() * classB.students.length)];
                // If same cluster (should be impossible due to different classes), skip
                if (sA.clusterId === sB.clusterId) continue;
                const clusterB = classB.students.filter(s => s.clusterId === sB.clusterId);

                // Check if swapping just these clusters makes sense?
                // Swap
                classA.students = classA.students.filter(s => s.clusterId !== sA.clusterId);
                classB.students = classB.students.filter(s => s.clusterId !== sB.clusterId);

                classA.students.push(...clusterB);
                classB.students.push(...clusterA);
            }

            // Update Stats
            updateClassStats(classA);
            updateClassStats(classB);

            // Calc New Energy
            const newEnergy = calculateSystemEnergy();

            // Greedy Acceptance (Hill Climbing)
            if (newEnergy <= currentEnergy) {
                currentEnergy = newEnergy;
                // Keep change
            } else {
                // Revert
                classA.students = backupA;
                classB.students = backupB;
                updateClassStats(classA);
                updateClassStats(classB);
            }
        }
    };

    // Execute Refinement
    refineDistribution();

    return classes;
};
