import React from 'react';
import { MessageCircle, User, HelpCircle, Github, Mail, Youtube } from 'lucide-react';

const Feedback = () => {
    return (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-green-100 p-8 h-full overflow-y-auto">
            <h2 className="text-2xl font-black text-lime-600 mb-8 flex items-center gap-2">
                <MessageCircle className="w-8 h-8" />
                문의 및 피드백
            </h2>

            <div className="space-y-8">
                {/* Developer Intro */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-500" />
                        개발자 소개
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <p className="font-bold text-gray-900 text-lg mb-1">구리구리구's teacher <span className="text-sm font-medium text-gray-500">(현직 초등교사, 교육 IT 개발희망자)</span></p>
                        <p className="text-gray-600 leading-relaxed">
                            매년 반복되는 반편성 스트레스에서 벗어나세요! 선생님의 소중한 시간은 지켜드리고, 학생들에게는 데이터 기반의 가장 공정한 반 배정을 제공합니다.
                        </p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-sky-500" />
                        문의 방법
                    </h3>
                    <div className="bg-sky-50 p-5 rounded-xl border border-sky-100 space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700 font-medium">이메일:</span>
                            <a href="mailto:ui7878@korea.kr" className="text-blue-600 font-bold hover:underline">ui7878@korea.kr</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Github className="w-5 h-5 text-gray-700" />
                            <span className="text-gray-700 font-medium">오픈소스 확인:</span>
                            <a href="https://github.com/KOOthcr/KOOthcr-ClassUp-Live" target="_blank" rel="noopener noreferrer" className="text-gray-600 font-bold hover:underline hover:text-black">
                                GitHub Repository
                            </a>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-purple-500" />
                        자주 묻는 질문
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                            <p className="font-bold text-purple-700 mb-2">Q. 버그/오류가 발생하면?</p>
                            <p className="text-gray-600">A. 이메일로 상세 상황을 알려주시면 빠르게 확인하여 고치겠습니다.</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                            <p className="font-bold text-purple-700 mb-2">Q. 새로운 기능을 제안하고 싶어요.</p>
                            <p className="text-gray-600">A. 언제든 환영합니다! 선생님들의 아이디어가 더 좋은 프로그램을 만듭니다.</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                            <p className="font-bold text-purple-700 mb-2">Q. 데이터 보안이 걱정돼요.</p>
                            <p className="text-gray-600">A. 걱정하지 마세요! 모든 데이터는 선생님의 PC(브라우저) 내에서만 처리됩니다. 협업 시 전송되는 데이터 또한 <strong>강력하게 암호화(E2EE)</strong>되어 서버는 내용을 전혀 알 수 없으며, 화면을 닫는 순간 흔적 없이 사라집니다.</p>
                        </div>
                    </div>
                </section>


            </div>
        </div>
    );
};

export default Feedback;
