import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ClassBoard from './ClassBoard';
import StatsPanel from './StatsPanel';
import OptionsPanel from './OptionsPanel';
import UsageGuide from './UsageGuide';
import Feedback from './Feedback';
import { Users, LogIn } from 'lucide-react';

const MainPage = ({
    students,
    classes,
    classCount,
    currentClassCount,
    currentView,
    setClassCount,
    setCurrentClassCount,
    onDataLoaded,
    onDistribute,
    onExport,
    onReset,
    onDragOver,
    onDrop,
    onMoveStudent,
    // Collaboration Props
    onJoin,
    inviteCode
}) => {
    const [inputCode, setInputCode] = useState('');

    if (currentView === 'usage') {
        return (
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">
                <div className="max-w-4xl mx-auto w-full">
                    <UsageGuide />
                </div>
            </main>
        );
    }

    if (currentView === 'feedback') {
        return (
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">
                <div className="max-w-4xl mx-auto w-full">
                    <Feedback />
                </div>
            </main>
        );
    }

    return (
        <main className="w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">
            {currentView === 'input' ? (
                <div className="w-full">
                    <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-green-100 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr] divide-y md:divide-y-0 md:divide-x divide-green-100">
                            {/* 1. Create Title */}
                            <div className="p-6 flex items-center justify-center bg-green-50/50">
                                <h1 className="text-4xl font-black text-green-600 tracking-tighter select-none">
                                    만들기
                                </h1>
                            </div>

                            {/* 2. Upload */}
                            <div className="p-6 space-y-6">
                                <FileUpload
                                    onDataLoaded={onDataLoaded}
                                    studentCount={students.length}
                                />
                            </div>

                            {/* 3. Options */}
                            <div className="p-6">
                                <OptionsPanel
                                    classCount={classCount}
                                    currentClassCount={currentClassCount}
                                    setClassCount={setClassCount}
                                    setCurrentClassCount={setCurrentClassCount}
                                    onExecute={onDistribute}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Participate Section */}
                    <div className="mt-6 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-green-100 overflow-hidden">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-green-100">
                            {/* Title */}
                            <div className="p-6 flex items-center justify-center bg-blue-50/50 md:w-1/3">
                                <h1 className="text-4xl font-black text-blue-600 tracking-tighter select-none">
                                    참여하기
                                </h1>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex items-center justify-center gap-4">
                                <input
                                    type="text"
                                    placeholder="초대코드 6자리 입력"
                                    maxLength={6}
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                    className="max-w-xs w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center tracking-widest uppercase font-mono placeholder:font-sans placeholder:tracking-normal"
                                />
                                <button
                                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => onJoin(inputCode)}
                                    disabled={inputCode.length !== 6}
                                >
                                    <LogIn className="w-6 h-6" />
                                    입장하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Users className="w-6 h-6 text-gray-500" />
                                <span>반 배정 결과</span>
                            </div>
                            {inviteCode && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
                                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">초대코드</span>
                                    <span className="text-lg font-black text-indigo-600 font-mono tracking-widest">{inviteCode}</span>
                                </div>
                            )}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onExport('gender')}
                                className="px-3 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                            >
                                📥 성별순 저장
                            </button>
                            <button
                                onClick={() => onExport('name')}
                                className="px-3 py-2 text-sm font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                            >
                                📥 이름순 저장
                            </button>
                            <button
                                onClick={onReset}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                            >
                                조건 재설정
                            </button>
                        </div>
                    </div>

                    <StatsPanel classes={classes} students={students} />

                    <div className="flex-1 overflow-hidden">
                        <ClassBoard
                            classes={classes}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onMoveStudent={onMoveStudent}
                            inviteCode={inviteCode} // Pass to ClassBoard if needed, though MainPage already shows it header
                        />        </div>
                </div>
            )}
        </main>
    );
};

export default MainPage;
