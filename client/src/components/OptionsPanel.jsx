import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const OptionsPanel = ({ classCount, currentClassCount, setClassCount, setCurrentClassCount, onExecute }) => {
    const [options, setOptions] = useState({
        bGender: true,
        bClass: true,
        bScore: true,
        bSame: false,
        bSeparate: false,
        bCaution: false
    });

    const handleCheckboxChange = (key) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleExecute = () => {
        onExecute(options);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b border-green-100 pb-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-gray-700">반편성 옵션</h2>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex gap-4">
                        <div className="w-40">
                            <label className="block text-sm font-bold text-purple-500 mb-1">다음학년도 반 개수</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={classCount}
                                onChange={(e) => setClassCount(parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 bg-purple-50 text-purple-700 font-bold rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-purple-300 border border-purple-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4">
                        <label className="flex items-center gap-3 text-sm text-gray-600 font-bold hover:text-indigo-600 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options.bGender}
                                onChange={() => handleCheckboxChange('bGender')}
                                className="w-5 h-5 text-indigo-500 border-2 border-indigo-200 rounded-md focus:ring-indigo-200 focus:ring-offset-0 cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500"
                            />
                            성별 균등
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-600 font-bold hover:text-indigo-600 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options.bClass}
                                onChange={() => handleCheckboxChange('bClass')}
                                className="w-5 h-5 text-indigo-500 border-2 border-indigo-200 rounded-md focus:ring-indigo-200 focus:ring-offset-0 cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500"
                            />
                            전학년반 균등
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-600 font-bold hover:text-indigo-600 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options.bScore}
                                onChange={() => handleCheckboxChange('bScore')}
                                className="w-5 h-5 text-indigo-500 border-2 border-indigo-200 rounded-md focus:ring-indigo-200 focus:ring-offset-0 cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500"
                            />
                            성적 균등
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-600 font-bold hover:text-indigo-600 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options.bSame}
                                onChange={() => handleCheckboxChange('bSame')}
                                className="w-5 h-5 text-indigo-500 border-2 border-indigo-200 rounded-md focus:ring-indigo-200 focus:ring-offset-0 cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500"
                            />
                            같은반 요청
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-600 font-bold hover:text-indigo-600 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options.bSeparate}
                                onChange={() => handleCheckboxChange('bSeparate')}
                                className="w-5 h-5 text-indigo-500 border-2 border-indigo-200 rounded-md focus:ring-indigo-200 focus:ring-offset-0 cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500"
                            />
                            분리 요청
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-600 font-bold hover:text-indigo-600 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options.bCaution}
                                onChange={() => handleCheckboxChange('bCaution')}
                                className="w-5 h-5 text-indigo-500 border-2 border-indigo-200 rounded-md focus:ring-indigo-200 focus:ring-offset-0 cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500"
                            />
                            주의필요 학생
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleExecute}
                    className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                    <Settings className="w-5 h-5" />
                    반편성 실행
                </button>
            </div>
        </div>
    );
};

export default OptionsPanel;
