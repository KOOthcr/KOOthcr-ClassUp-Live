
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const data = [
    { '이름': '홍길동', '성별': '남', '점수': 85 },
    { '이름': '김영희', '성별': '여', '점수': 92 },
    { '이름': '이철수', '성별': '남', '점수': 78 },
    { '이름': '박민지', '성별': '여', '점수': 88 },
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "학생명단");

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

XLSX.writeFile(wb, path.join(publicDir, 'sample_class.xlsx'));
console.log("Sample Excel file created in public/sample_class.xlsx");
