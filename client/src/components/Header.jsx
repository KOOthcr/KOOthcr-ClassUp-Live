import React from 'react';
import { Grid } from 'lucide-react';

const Header = ({ onGoHome, onGoUsage, onGoFeedback }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50 h-16">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-2 text-lime-600 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.reload()}>
                    <Grid className="w-7 h-7" />
                    <h1 className="text-2xl font-black tracking-tight font-sans text-lime-600">ClassUp</h1>
                </div>

                <nav className="flex gap-2 text-sm font-bold text-gray-500">
                    <button
                        onClick={onGoHome}
                        className="hover:text-lime-600 hover:bg-lime-50 px-3 py-2 rounded-lg transition-all"
                    >
                        반편성
                    </button>
                    <button
                        onClick={onGoUsage}
                        className="hover:text-lime-600 hover:bg-lime-50 px-3 py-2 rounded-lg transition-all"
                    >
                        사용법
                    </button>
                    <button
                        onClick={onGoFeedback}
                        className="hover:text-lime-600 hover:bg-lime-50 px-3 py-2 rounded-lg transition-all"
                    >
                        문의/피드백
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
