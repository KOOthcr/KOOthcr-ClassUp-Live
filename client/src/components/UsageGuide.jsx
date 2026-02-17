import React from 'react';
import { Target, FileText, Settings as Gear, Zap, Users, Download, AlertTriangle, ShieldCheck } from 'lucide-react';

const UsageGuide = () => {
    return (
        <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-green-100 p-8 h-full overflow-y-auto">
            <h2 className="text-2xl font-black text-emerald-600 mb-6 flex items-center gap-2">
                <Target className="w-8 h-8" />
                ClassUp 사용 가이드
            </h2>

            {/* 0. 보안 및 데이터 안내 (최상단) */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                    <ShieldCheck className="w-5 h-5" />
                    데이터 보안 및 안심 사용 안내
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed mb-2">
                    <strong>모든 데이터는 실시간으로 보여지기만 할 뿐, 어딘가에 저장되지 않습니다.</strong><br />
                    Socket.io를 활용해 메모리상에서만 데이터가 실시간 중계되며,
                    <strong>클라이언트 측 암호화(E2EE)</strong>를 적용하여 서버 운영자도 데이터를 절대 볼 수 없습니다.
                    안심하고 사용하시기 바랍니다.
                </p>
                <a
                    href="https://github.com/KOOthcr/KOOthcr-ClassUp-Live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                >
                    오픈소스 코드 확인하기 (GitHub)
                </a>
            </div>

            <div className="space-y-8">
                {/* 1. 데이터 준비 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        1. 데이터 준비 (엑셀)
                    </h3>
                    <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 text-sm text-gray-700 space-y-2">
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>시트 구분:</strong> 반별로 시트를 나누어 작성해주세요. 시트 이름은 <strong>'1반', '2반'</strong>과 같이 구체적으로 적는 것이 좋습니다.</li>
                            <li><strong>동명이인 처리:</strong> 이름이 같은 학생이 있다면, <strong>'김철수(1반)'</strong> 또는 <strong>'김철수(0105)'</strong>와 같이 반 번호를 함께 적어 구분해주세요.</li>
                            <li><strong>필수 항목:</strong> 이름, 성별 (남/여)</li>
                            <li><strong>선택 항목:</strong> 성적, 이전반, 분리희망, 같은반희망, 주의요망, 특기사항</li>
                        </ul>
                    </div>
                </section>

                {/* 2. 옵션 설정 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Gear className="w-5 h-5 text-amber-500" />
                        2. 반편성 옵션
                    </h3>
                    <ul className="grid grid-cols-1 gap-3 text-sm">
                        <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800">성별 균등:</span> 각 반의 남녀 비율을 동일하게 맞춥니다.
                        </li>
                        <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800">전학년반 균등:</span> 같은 반이었던 학생들이 한 반에 뭉치지 않도록 섞습니다.
                        </li>
                        <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800">성적 균등:</span> 반별 평균 점수 차이를 최소화합니다.
                        </li>
                        <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800">같은반 요청:</span> 특정 학생들을 같은 반에 배정합니다.
                        </li>
                        <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800">분리 요청:</span> 특정 학생들을 서로 다른 반으로 떼어놓습니다. (최우선 반영)
                        </li>
                        <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <span className="font-bold text-amber-800">주의필요 학생:</span> 주의가 필요한 학생들을 각 반에 골고루 분산시킵니다.
                        </li>
                    </ul>
                </section>

                {/* 3. 실행 및 조작 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        3. 실행 및 조작
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <p className="font-bold text-purple-800 mb-1">🤖 AI 자동 편성</p>
                            <p className="text-sm text-gray-600">옵션을 하나라도 선택하면 알고리즘이 최적의 조합을 찾아 자동으로 배치합니다.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <p className="font-bold text-purple-800 mb-1">🖐 수동 편성 / 수정</p>
                            <p className="text-sm text-gray-600 mb-2">모든 옵션을 해제하고 실행하면 빈 반이 생성됩니다. 결과 생성 후에도 언제든 수정할 수 있습니다.</p>
                            <ul className="list-disc list-inside text-sm text-purple-900 space-y-1 ml-1">
                                <li><strong>이동 (Move):</strong> 학생 카드를 <strong>드래그 앤 드롭</strong>하여 다른 반으로 옮길 수 있습니다.</li>
                                <li><strong>상세 정보 (Detail):</strong> 학생 카드를 <strong>왼쪽클릭(Click)</strong>하면 상세 정보(성적, 특기사항 등)와 반 이동 메뉴가 나타납니다.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. 실시간 협업 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        4. 실시간 협업
                    </h3>
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm space-y-2">
                        <p><span className="badge bg-blue-200 text-blue-800 px-1 rounded font-bold">Host</span> 선생님 한 분이 반편성을 실행하면 <strong>초대코드</strong>가 생성됩니다.</p>
                        <p><span className="badge bg-gray-200 text-gray-800 px-1 rounded font-bold">Guest</span> 다른 선생님들은 '참여하기'에 코드를 입력하고 입장합니다.</p>
                        <p className="font-bold text-blue-700 mt-2">→ 누군가 학생을 옮기면 모든 화면에서 동시에 움직입니다!</p>
                    </div>
                </section>

                {/* 5. 결과 활용 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Download className="w-5 h-5 text-gray-500" />
                        5. 결과 저장
                    </h3>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-3 flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 font-bold">
                            주의: 브라우저나 페이지가 꺼지면 데이터가 즉시 사라집니다. <br />
                            작업 중간중간 꼭 엑셀 파일로 결과를 저장해주세요!
                        </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                        완성된 반편성 결과는 <strong>Excel 파일</strong>로 다운로드할 수 있습니다.
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        <li className="bg-gray-50 p-2 rounded text-center border">이름순 정렬 저장</li>
                        <li className="bg-gray-50 p-2 rounded text-center border">성별순 정렬 저장</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default UsageGuide;
