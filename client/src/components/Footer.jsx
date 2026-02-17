import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
            <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-xs">
                <p>&copy; {new Date().getFullYear()} ClassUp. 초등학교 반편성 도우미 서비스</p>
            </div>
        </footer>
    );
};

export default Footer;
