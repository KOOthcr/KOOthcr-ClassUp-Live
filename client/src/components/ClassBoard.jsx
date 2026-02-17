import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

// Extended distinct colors palette (20 colors)
// Mix of High Saturation (400), Low Saturation (200), and Neutrals directly
const distinctColors = [
    'bg-white border-2 border-gray-200 hover:bg-gray-50',     // 1. White
    'bg-red-200 hover:bg-red-300',                            // 2. Pastel Red
    'bg-blue-200 hover:bg-blue-300',                          // 3. Pastel Blue
    'bg-yellow-400 hover:bg-yellow-500',                      // 4. Vivid Yellow
    'bg-gray-300 hover:bg-gray-400',                          // 5. Light Gray
    'bg-green-400 hover:bg-green-500',                        // 6. Vivid Green
    'bg-purple-200 hover:bg-purple-300',                      // 7. Pastel Purple
    'bg-orange-400 hover:bg-orange-500',                      // 8. Vivid Orange
    'bg-cyan-200 hover:bg-cyan-300',                          // 9. Pastel Cyan
    'bg-pink-400 hover:bg-pink-500',                          // 10. Vivid Pink
    'bg-lime-200 hover:bg-lime-300',                          // 11. Pastel Lime
    'bg-indigo-400 hover:bg-indigo-500',                      // 12. Vivid Indigo
    'bg-emerald-200 hover:bg-emerald-300',                    // 13. Pastel Emerald
    'bg-rose-400 hover:bg-rose-500',                          // 14. Vivid Rose
    'bg-sky-200 hover:bg-sky-300',                            // 15. Pastel Sky
    'bg-amber-400 hover:bg-amber-500',                        // 16. Vivid Amber
    'bg-violet-200 hover:bg-violet-300',                      // 17. Pastel Violet
    'bg-teal-400 hover:bg-teal-500',                          // 18. Vivid Teal
    'bg-fuchsia-200 hover:bg-fuchsia-300',                    // 19. Pastel Fuchsia
    'bg-stone-400 hover:bg-stone-500',                        // 20. Stone Gray
];

const ZOOM_LEVELS = [
    { height: 'h-6', fontSize: 'text-[10px]', gap: 'gap-0.5', padding: 'p-0.5', iconSize: 'w-0.5' }, // Level 0: Tiny
    { height: 'h-8', fontSize: 'text-xs', gap: 'gap-1', padding: 'p-1', iconSize: 'w-1' },       // Level 1: Compact (Current)
    { height: 'h-10', fontSize: 'text-sm', gap: 'gap-1.5', padding: 'p-1.5', iconSize: 'w-1.5' },   // Level 2: Normal
    { height: 'h-14', fontSize: 'text-base', gap: 'gap-2', padding: 'p-2', iconSize: 'w-2' },      // Level 3: Large
];

const StudentCard = ({ student, classId, colorIndex, onClick, zoomStyle }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData("studentId", student.id);
        e.dataTransfer.setData("sourceClassId", classId);
        e.dataTransfer.effectAllowed = "move";
    };

    // Use the passed colorIndex to select the background color
    // If colorIndex is undefined, default to white
    const bgColor = colorIndex !== undefined
        ? distinctColors[colorIndex % distinctColors.length]
        : 'bg-white hover:bg-gray-50';

    const genderColor = student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500';

    // Construct Student ID (e.g., 101 for Class 1, Number 1)
    const classNum = parseInt(student.currentClass) || 0;
    const studentNum = student.number ? parseInt(student.number) : 0;
    const displayId = (classNum > 0 && studentNum > 0)
        ? `${String(classNum).padStart(2, '0')}${String(studentNum).padStart(2, '0')}`
        : '';

    // Check if any special info exists
    const hasSpecialInfo = student.caution || student.sameClassRequest || student.separationRequest || student.remarks;

    return (
        <div
            className={`
                relative mb-0.5 w-full ${zoomStyle.height} ${bgColor} 
                shadow-sm hover:shadow-md
                flex overflow-hidden transition-all duration-200 transform hover:-translate-y-1
                cursor-pointer active:cursor-grabbing border border-gray-100/50
            `}
            draggable
            onDragStart={handleDragStart}
            onContextMenu={(e) => {
                e.preventDefault();
                onClick(student, classId);
            }}
        >
            <div className={`${zoomStyle.iconSize} h-full ${genderColor} shrink-0`} />

            <div className={`flex-1 ${zoomStyle.padding} flex flex-col justify-center items-center relative`}>
                {/* Special Info Indicator (Top Right) - Red Dot */}
                {hasSpecialInfo && (
                    <div className="absolute top-1 right-1">
                        <span className="block w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
                    </div>
                )}

                <div className="text-center w-full">
                    <div className={`${zoomStyle.fontSize} font-bold text-gray-800 leading-none truncate px-0.5`}>
                        {student.name}{displayId}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClassColumn = ({ classData, onDragOver, onDrop, classColorMap, isSource, onStudentClick, zoomStyle }) => {
    const avgScore = classData.stats.total > 0
        ? (classData.stats.scoreSum / classData.stats.total).toFixed(1)
        : 0;

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver(e);
    };

    // Determine color index for this class (only if isSource is true)
    const colorIndex = isSource ? classColorMap[classData.name] : undefined;
    const headerColorClass = colorIndex !== undefined
        ? distinctColors[colorIndex % distinctColors.length].split(' ')[0] // Extract just the bg-color class
        : null;

    return (
        <div
            className="flex-1 min-w-[200px] max-w-[240px] flex flex-col h-full transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, classData.id)}
        >
            {/* Card Header Style */}
            {/* Card Header Style - Modern Rounded */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-3 mb-2 flex flex-col transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-0.5">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Class</span>
                    {headerColorClass && (
                        <div className={`w-6 h-6 rounded-full ${headerColorClass} border-2 border-gray-900 shadow-sm`} />
                    )}
                </div>

                <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                        {classData.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                        {isSource && classData.stats.initialTotal ? (
                            <span className="text-3xl font-black text-gray-900 leading-none">
                                {classData.stats.total}<span className="text-lg text-gray-400">/{classData.stats.initialTotal}</span>
                            </span>
                        ) : (
                            <span className="text-3xl font-black text-gray-900 leading-none">{classData.stats.total}</span>
                        )}
                        <span className="text-sm font-bold text-gray-400">명</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex gap-3 text-sm font-bold text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            남 {classData.stats.male}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                            여 {classData.stats.female}
                        </span>
                    </div>
                    {!isSource && (
                        <div className="text-sm font-bold text-gray-400">
                            평균 {avgScore}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className={`
                flex-1 p-2 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50
                hover:border-blue-400 hover:bg-blue-50/30 transition-colors duration-200
                overflow-y-auto custom-scrollbar
            `}>
                <div className={`grid grid-cols-2 ${zoomStyle.gap} content-start`}>
                    {classData.students.map(student => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            classId={classData.id}
                            colorIndex={classColorMap[student.currentClass]}
                            onClick={onStudentClick}
                            zoomStyle={zoomStyle}
                        />
                    ))}
                </div>

                {classData.students.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                        <span className="text-4xl mb-2">📄</span>
                        <span className="text-sm font-medium">학생 없음</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const StudentDetailModal = ({ student, sourceClassId, targetClasses, onClose, onMove }) => {
    if (!student) return null;

    const hasDetails = student.score > 0 || student.sameClassRequest || student.separationRequest || student.caution || student.remarks;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#FFF9C4] p-4 flex justify-between items-center border-b-2 border-gray-100">
                    <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                        {student.name}
                        <span className="text-sm font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                            {student.currentClass} {student.number}번
                        </span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Details Section (Conditional) */}
                    {hasDetails ? (
                        <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {student.score > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-bold">성적</span>
                                    <span className="font-bold text-gray-800">{student.score}점</span>
                                </div>
                            )}
                            {student.sameClassRequest && (
                                <div className="text-sm">
                                    <span className="text-blue-500 font-bold block mb-0.5">같은반 요청</span>
                                    <span className="text-gray-700">
                                        {student.sameClassRequest.split(',').map((req, idx) => {
                                            const name = req.trim().split('(')[0]; // Simple parse for display matching
                                            // Find this student in targetClasses
                                            let foundClass = null;
                                            for (const cls of targetClasses) {
                                                if (cls.students.some(s => s.name === name || (s.name + s.currentClass) === name)) { // Loose match
                                                    foundClass = cls.name;
                                                    break;
                                                }
                                                // Try finding by raw string if simple name match fails (e.g. "Name(0101)")
                                                const match = cls.students.find(s => req.includes(s.name));
                                                if (match) {
                                                    foundClass = cls.name;
                                                    break;
                                                }
                                            }
                                            return (
                                                <span key={idx} className="block">
                                                    {req.trim()} {foundClass ? <span className="text-blue-600 font-bold">({foundClass})</span> : <span className="text-gray-400 text-xs">(미배정/확인불가)</span>}
                                                </span>
                                            );
                                        })}
                                    </span>
                                </div>
                            )}
                            {student.separationRequest && (
                                <div className="text-sm">
                                    <span className="text-orange-500 font-bold block mb-0.5">분리 요청</span>
                                    <span className="text-gray-700">
                                        {student.separationRequest.split(',').map((req, idx) => {
                                            const name = req.trim().split('(')[0];
                                            let foundClass = null;
                                            for (const cls of targetClasses) {
                                                // Robust search: Check if any student in this class matches the requested name
                                                // Ideally we should use the same exact match logic as algo, but for UI display simple name match is usually enough
                                                // or strictly check if the request string resembles the student.
                                                if (cls.students.some(s => s.name === name)) {
                                                    foundClass = cls.name;
                                                    break;
                                                }
                                            }
                                            return (
                                                <span key={idx} className="block">
                                                    {req.trim()} {foundClass ? <span className="text-orange-600 font-bold">({foundClass}으로 분리)</span> : <span className="text-gray-400 text-xs">(미배정/확인불가)</span>}
                                                </span>
                                            );
                                        })}
                                    </span>
                                </div>
                            )}
                            {student.caution && (
                                <div className="text-sm">
                                    <span className="text-red-500 font-bold block mb-0.5">주의 학생</span>
                                    <span className="text-gray-700">{student.caution}</span>
                                </div>
                            )}
                            {student.remarks && (
                                <div className="text-sm">
                                    <span className="text-gray-500 font-bold block mb-0.5">비고</span>
                                    <span className="text-gray-700">{student.remarks}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-4 text-sm">
                            등록된 상세 정보가 없습니다.
                        </div>
                    )}

                    {/* Move Actions */}
                    <div>
                        <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            반 이동하기
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {targetClasses.map(cls => (
                                <button
                                    key={cls.id}
                                    onClick={() => onMove(student.id, sourceClassId, cls.id)}
                                    className={`
                                        py-2 px-3 rounded-lg text-sm font-bold border transition-all
                                        ${sourceClassId === cls.id
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow active:scale-95'
                                        }
                                    `}
                                    disabled={sourceClassId === cls.id}
                                >
                                    {cls.name}
                                    {sourceClassId === cls.id && <span className="text-xs font-normal ml-1">(현재)</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClassBoard = ({ classes, onDragOver, onDrop, onMoveStudent }) => {
    const [selectedStudent, setSelectedStudent] = useState(null); // { student, sourceClassId }
    const [zoomLevel, setZoomLevel] = useState(1); // Default to Level 1 (Compact)
    const [sortOption, setSortOption] = useState(null); // 'gender', 'name', or null

    const sourceClasses = classes.filter(c => c.type === 'source');
    const targetClasses = classes.filter(c => c.type === 'target' || !c.type);

    const zoomStyle = ZOOM_LEVELS[zoomLevel];

    // Create a map of source class names to color indices
    const classColorMap = {};
    sourceClasses.forEach((cls, index) => {
        classColorMap[cls.name] = index;
    });

    const getSortedStudents = (students) => {
        if (!sortOption) return students;
        const sorted = [...students];
        if (sortOption === 'gender') {
            return sorted.sort((a, b) => {
                if (a.gender !== b.gender) return a.gender === 'Male' ? -1 : 1; // Male first
                return a.name.localeCompare(b.name);
            });
        } else if (sortOption === 'name') {
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        return sorted;
    };

    const handleStudentClick = (student, sourceClassId) => {
        setSelectedStudent({ student, sourceClassId });
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };

    const handleMoveAndClose = (studentId, sourceClassId, targetClassId) => {
        onMoveStudent(studentId, sourceClassId, targetClassId);
        handleCloseModal();
    };

    return (
        <div className="flex flex-col h-full bg-stone-100 overflow-hidden relative">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-6 flex gap-1 z-20 bg-white p-1 rounded-lg shadow-md border border-gray-200">
                <button
                    onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
                    disabled={zoomLevel === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
                >
                    <ZoomOut className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-px bg-gray-200 my-1"></div>
                <button
                    onClick={() => setZoomLevel(Math.min(ZOOM_LEVELS.length - 1, zoomLevel + 1))}
                    disabled={zoomLevel === ZOOM_LEVELS.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
                >
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {sourceClasses.length > 0 && (
                <>
                    {/* Source Classes Row */}
                    <div className="px-6 pt-4 pb-0">
                        <div className="text-blue-600 font-black text-lg mb-2 flex items-center gap-2">
                            이번 학년도
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto px-6 pb-2">
                        <div className="flex gap-6 h-full items-stretch min-w-max">
                            {sourceClasses.map((cls) => (
                                <ClassColumn
                                    key={cls.id}
                                    classData={cls}
                                    onDragOver={onDragOver}
                                    onDrop={onDrop}
                                    classColorMap={classColorMap}
                                    isSource={true}
                                    onStudentClick={handleStudentClick}
                                    zoomStyle={zoomStyle}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center py-2 shrink-0 bg-stone-100 z-10">
                        <div className="absolute inset-x-0 border-t-4 border-black h-px"></div>
                    </div>
                </>
            )}

            {/* Target Classes Row */}
            <div className={`flex flex-col flex-1 overflow-hidden ${sourceClasses.length > 0 ? '' : 'pt-4'}`}>
                {sourceClasses.length > 0 && (
                    <div className="px-6 pb-2 flex justify-between items-end">
                        <div className="text-gray-600 font-bold text-sm mb-2">
                            다음 학년도
                        </div>
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => setSortOption('gender')}
                                className={`px-3 py-1 text-xs font-bold rounded border transition-colors ${sortOption === 'gender' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                            >
                                남/녀 정렬
                            </button>
                            <button
                                onClick={() => setSortOption('name')}
                                className={`px-3 py-1 text-xs font-bold rounded border transition-colors ${sortOption === 'name' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                            >
                                이름 정렬
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-x-auto px-6 pb-6">
                    <div className="flex gap-6 h-full items-stretch min-w-max">
                        {targetClasses.map((cls) => (
                            <ClassColumn
                                key={cls.id}
                                classData={{ ...cls, students: getSortedStudents(cls.students) }}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                classColorMap={classColorMap}
                                isSource={false}
                                onStudentClick={handleStudentClick}
                                zoomStyle={zoomStyle}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent.student}
                    sourceClassId={selectedStudent.sourceClassId}
                    targetClasses={targetClasses}
                    onClose={handleCloseModal}
                    onMove={handleMoveAndClose}
                />
            )}
        </div>
    );
};

export default ClassBoard;
