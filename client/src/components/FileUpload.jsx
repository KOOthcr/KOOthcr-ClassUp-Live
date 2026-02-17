import React, { useRef } from 'react';
import { Upload, FileDown, FolderOpen } from 'lucide-react';
import { parseExcelFile } from '../utils/fileHandler';

const FileUpload = ({ onDataLoaded, studentCount }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const data = await parseExcelFile(file);
                onDataLoaded(data);
            } catch (error) {
                console.error("Error parsing file:", error);
                alert("파일을 읽는 중 오류가 발생했습니다.");
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-green-100 pb-2">
                <FolderOpen className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-bold text-gray-700">학생 데이터 입력</h2>
            </div>

            <div className="flex flex-col justify-center h-full gap-4">
                <div className="flex flex-col gap-3">
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />

                    <div className="flex gap-2">
                        <a
                            href="/sample_class.xlsx"
                            download="반편성_기초양식.xlsx"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-3 rounded-xl font-bold flex-1 flex items-center justify-center gap-2 transition-all duration-200 border border-emerald-100 hover:shadow-sm"
                        >
                            <FileDown className="w-4 h-4" />
                            양식 다운로드
                        </a>

                        <button
                            onClick={handleUploadClick}
                            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-3 rounded-xl font-bold flex-1 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            <Upload className="w-4 h-4" />
                            파일 업로드
                        </button>
                    </div>
                </div>

                {studentCount > 0 ? (
                    <p className="text-sm text-blue-600 text-center font-bold animate-pulse">
                        전체 {studentCount}명의 학생이 업로드 되었습니다
                    </p>
                ) : (
                    <p className="text-sm text-gray-400 text-center font-medium">
                        양식 다운로드 {'>'} 파일 업로드
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
