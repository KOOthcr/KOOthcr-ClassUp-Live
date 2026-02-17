import React, { useMemo } from 'react';
import { PieChart, Zap } from 'lucide-react';

const StatsCard = ({ title, value, subvalue, icon: Icon, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subvalue && <p className="text-sm text-gray-400">{subvalue}</p>}
            </div>
        </div>
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
    </div>
);

const StatsPanel = ({ classes, students }) => {
    const stats = useMemo(() => {
        if (!classes.length) return null;

        const totalStudents = students.length;
        const totalMales = students.filter(s => s.gender === 'Male').length;
        const totalFemales = students.filter(s => s.gender === 'Female').length;

        // Calculate max diff in class size
        const sizes = classes.map(c => c.students.length);
        const maxSize = Math.max(...sizes);
        const minSize = Math.min(...sizes);
        const sizeDiff = maxSize - minSize;

        // Calculate max diff in gender ratio
        // We'll look at male count variance
        const maleCounts = classes.map(c => c.stats.male);
        const maxMale = Math.max(...maleCounts);
        const minMale = Math.min(...maleCounts);
        const genderDiff = maxMale - minMale;

        // Calculate Average Score Variance
        const avgScores = classes.map(c => c.stats.total > 0 ? c.stats.scoreSum / c.stats.total : 0);
        const maxScore = Math.max(...avgScores);
        const minScore = Math.min(...avgScores);
        const scoreDiff = (maxScore - minScore).toFixed(1);

        return {
            totalStudents,
            genderRatio: `${totalMales}:${totalFemales}`,
            sizeDiff,
            genderDiff,
            scoreDiff
        };
    }, [classes, students]);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
                title="총 학생"
                value={`${stats.totalStudents}명`}
                subvalue={`(남${stats.genderRatio.split(':')[0]} 여${stats.genderRatio.split(':')[1]})`}
                icon={PieChart}
                colorClass="bg-blue-500"
            />
            <StatsCard
                title="학급 인원 차이"
                value={`${stats.sizeDiff}명`}
                subvalue={stats.sizeDiff === 0 ? "완벽 균형" : `최대 ${stats.sizeDiff}명 차이`}
                icon={Zap}
                colorClass="bg-green-500"
            />
            <StatsCard
                title="성비 불균형"
                value={`${stats.genderDiff}명`}
                subvalue={stats.genderDiff <= 1 ? "양호" : "조정 필요"}
                icon={Zap}
                colorClass="bg-pink-500"
            />
            <StatsCard
                title="점수 평균 차이"
                value={`${stats.scoreDiff}점`}
                subvalue={stats.scoreDiff < 2 ? "균등함" : "격차 큼"}
                icon={Zap}
                colorClass="bg-purple-500"
            />
        </div>
    );
};

export default StatsPanel;
