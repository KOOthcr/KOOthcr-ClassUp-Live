import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                let allStudents = [];
                let globalIndex = 1;

                // Iterate through all sheets
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    const sheetStudents = jsonData.map(row => {
                        return {
                            id: String(globalIndex++), // Generate a unique ID across all sheets
                            name: row['이름'] || '',
                            gender: row['성별'] === '남' ? 'Male' : (row['성별'] === '여' ? 'Female' : 'Unknown'),
                            score: parseFloat(row['성적']) || 0,
                            currentClass: row['현재학년반'] || sheetName, // Use sheet name if '현재학년반' is missing
                            number: row['번호'],
                            sameClassRequest: row['같은반요청학생'] || '',
                            separationRequest: row['분리요청학생'] || '',
                            caution: row['주의 학생'] || '',
                            remarks: row['비고'] || '',
                            raw: row
                        };
                    });

                    allStudents = [...allStudents, ...sheetStudents];
                });

                resolve(allStudents);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
