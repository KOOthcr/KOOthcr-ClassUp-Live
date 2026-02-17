
import { distributeStudents } from './src/utils/distributionAlgo.js';

const mockStudents = Array.from({ length: 30 }, (_, i) => ({
    '이름': `Student ${i}`,
    '성별': i % 2 === 0 ? '남' : '여',
    '점수': Math.floor(Math.random() * 100)
}));

console.log("Mock Students generated:", mockStudents.length);

const classes = distributeStudents(mockStudents, 3);

console.log("Classes generated:", classes.length);

classes.forEach(c => {
    console.log(`Class ${c.name}: ${c.stats.total} students, Male: ${c.stats.male}, Female: ${c.stats.female}, Avg Score: ${(c.stats.scoreSum / c.stats.total).toFixed(1)}`);
});

// Verification assertions
const totalStudents = classes.reduce((sum, c) => sum + c.stats.total, 0);
if (totalStudents !== 30) {
    console.error("FAIL: Total students mismatch");
    process.exit(1);
}

const maxCount = Math.max(...classes.map(c => c.stats.total));
const minCount = Math.min(...classes.map(c => c.stats.total));
if (maxCount - minCount > 1) {
    console.error("FAIL: Class size imbalance detected");
    process.exit(1);
}

console.log("PASS: Distribution logic verified");
