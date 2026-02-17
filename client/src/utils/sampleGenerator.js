export const createSampleData = (count = 30) => {
    return Array.from({ length: count }, (_, i) => ({
        '이름': `학생${i + 1}`,
        '성별': i % 2 === 0 ? '남' : '여',
        '점수': Math.floor(Math.random() * 41) + 60, // 60-100 random score
        '전학년반': `${Math.floor(Math.random() * 5) + 1}반`, // 1-5 random class
        '번호': i + 1
    }));
};
