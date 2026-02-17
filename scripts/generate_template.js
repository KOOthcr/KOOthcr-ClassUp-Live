const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log("Script started...");

const data = [
    {
        "현재학년반": "1반",
        "번호": 1,
        "이름": "손흥민",
        "성별": "남",
        "성적": 95.5,
        "같은반요청학생": "",
        "분리요청학생": "",
        "주의 학생": "ADHD",
        "비고": ""
    },
    {
        "현재학년반": "1반",
        "번호": 2,
        "이름": "김연아",
        "성별": "여",
        "성적": 92,
        "같은반요청학생": "김연이(0303)",
        "분리요청학생": "박명수(0201), 최지우(0202)",
        "주의 학생": "",
        "비고": "쌍생아, 수학 특기"
    },
    {
        "현재학년반": "2반",
        "번호": 1,
        "이름": "박명수",
        "성별": "남",
        "성적": 88.3,
        "같은반요청학생": "",
        "분리요청학생": "이영희",
        "주의 학생": "학폭가해",
        "비고": "영어 우수"
    },
    {
        "현재학년반": "2반",
        "번호": 2,
        "이름": "최지우",
        "성별": "여",
        "성적": 90.7,
        "같은반요청학생": "",
        "분리요청학생": "",
        "주의 학생": "",
        "비고": ""
    },
    {
        "현재학년반": "3반",
        "번호": 1,
        "이름": "박민수",
        "성별": "남",
        "성적": 88,
        "같은반요청학생": "",
        "분리요청학생": "",
        "주의 학생": "",
        "비고": ""
    },
    {
        "현재학년반": "3반",
        "번호": 2,
        "이름": "이영희",
        "성별": "여",
        "성적": 96,
        "같은반요청학생": "",
        "분리요청학생": "",
        "주의 학생": "학폭피해",
        "비고": ""
    },
    {
        "현재학년반": "3반",
        "번호": 3,
        "이름": "김연이",
        "성별": "여",
        "성적": 100,
        "같은반요청학생": "김연아(0102)",
        "분리요청학생": "",
        "주의 학생": "",
        "비고": "쌍생아"
    }
];

try {
    const ws = XLSX.utils.json_to_sheet(data);

    // Define column widths
    const wscols = [
        { wch: 10 }, // 현재학년반
        { wch: 5 },  // 번호
        { wch: 10 }, // 이름
        { wch: 5 },  // 성별
        { wch: 10 }, // 성적
        { wch: 20 }, // 같은반요청학생
        { wch: 25 }, // 분리요청학생
        { wch: 15 }, // 주의 학생
        { wch: 20 }  // 비고
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "학생명단");

    // Output path: client/public/sample_class.xlsx
    const outputPath = path.join(__dirname, '../client/public/sample_class.xlsx');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    XLSX.writeFile(wb, outputPath);
    console.log(`Successfully generated sample_class.xlsx at ${outputPath}`);
} catch (error) {
    console.error("Error generating Excel file:", error);
    process.exit(1);
}
