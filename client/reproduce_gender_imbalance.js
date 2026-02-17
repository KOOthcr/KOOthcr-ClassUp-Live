
import { distributeStudents } from './src/utils/distributionAlgo.js';

// Scenario: 5 Classes -> 4 Classes
// Total Students: 125
// Males: 75
// Females: 50
// Ideal (5 classes): 15M, 10F per class.
// Ideal (4 classes): ~19M, ~12.5F per class.

const students = [];
for (let i = 0; i < 75; i++) {
    students.push({
        '이름': `Male ${i}`,
        '성별': '남',
        '점수': 50 + (i % 50),
        'currentClass': `${(i % 5) + 1}반`, // Distributed from 5 source classes
        'number': i
    });
}
for (let i = 0; i < 50; i++) {
    students.push({
        '이름': `Female ${i}`,
        '성별': '여',
        '점수': 50 + (i % 50),
        'currentClass': `${(i % 5) + 1}반`,
        'number': i
    });
}

console.log(`Total Students: ${students.length} (Male: 75, Female: 50)`);

// Test 5 Classes
console.log("\n--- Testing 5 Classes ---");
const classes5 = distributeStudents([...students], 5, { bGender: true, bClass: true, bScore: true });
let maxDiffM = 0;
let maxDiffF = 0;
classes5.forEach(c => {
    console.log(`${c.name}: Total ${c.stats.total} (M: ${c.stats.male}, F: ${c.stats.female})`);
});

// Test 4 Classes (The issue case)
console.log("\n--- Testing 4 Classes ---");
const classes4 = distributeStudents([...students], 4, { bGender: true, bClass: true, bScore: true });
classes4.forEach(c => {
    console.log(`${c.name}: Total ${c.stats.total} (M: ${c.stats.male}, F: ${c.stats.female})`);
});
