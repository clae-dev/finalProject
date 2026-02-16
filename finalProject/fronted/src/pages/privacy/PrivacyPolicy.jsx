import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, Lock, Eye, Database, Clock, UserCheck, Share2, Globe, Trash2, Baby, Settings, FileText } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';

const sections = [
  {
    id: 1,
    icon: <FileText className="w-5 h-5" />,
    title: '개인정보처리방침 개요',
    content: `혼디(HONDI, 이하 "회사")는 「개인정보 보호법」 제30조에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.

본 개인정보처리방침은 회사가 제공하는 혼디 서비스(웹사이트, 모바일 앱 포함)에 적용됩니다.

본 방침은 2025년 1월 1일부터 시행됩니다.`,
  },
  {
    id: 2,
    icon: <Database className="w-5 h-5" />,
    title: '수집하는 개인정보 항목 및 수집 방법',
    content: `회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.

[필수 수집 항목]
• 회원가입 시: 이메일 주소, 비밀번호, 닉네임
• 소셜 로그인 시 (카카오/네이버/구글): 소셜 계정 식별자, 이메일 주소, 프로필 이미지, 닉네임
• 서비스 이용 시: 서비스 이용 기록, 접속 로그, 접속 IP 정보, 쿠키, 기기 정보(OS, 브라우저 종류)

[선택 수집 항목]
• 프로필 설정 시: 프로필 이미지, 자기소개, 관심 지역
• 게시글 작성 시: 게시글 내용, 첨부 이미지
• 숙소 예약 문의 시: 연락처(전화번호)
• 동행 모집 시: 여행 일정, 선호 활동

[자동 수집 항목]
• 서비스 이용 과정에서 IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 기기 정보가 자동으로 생성되어 수집될 수 있습니다.

[수집 방법]
• 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력
• 소셜 로그인 API를 통한 자동 수집
• 생성 정보 수집 툴을 통한 자동 수집`,
  },
  {
    id: 3,
    icon: <Eye className="w-5 h-5" />,
    title: '개인정보의 처리 목적',
    content: `회사는 수집한 개인정보를 다음의 목적으로만 처리합니다.

1. 회원 관리
   • 회원제 서비스 이용에 따른 본인 확인 및 인증
   • 회원 가입 의사 확인 및 가입 제한
   • 회원자격 유지·관리
   • 서비스 부정이용 방지
   • 각종 고지·통지 사항 전달
   • 분쟁 조정을 위한 기록 보존

2. 서비스 제공
   • 게스트하우스 정보 제공 및 예약 연결
   • 동행 찾기 서비스 매칭
   • 여행 후기 및 자유게시판 운영
   • 행사/액티비티 정보 제공
   • 항공권 예약 사이트 안내
   • AI 챗봇 서비스 제공

3. 서비스 개선 및 마케팅
   • 신규 서비스 개발 및 맞춤형 서비스 제공
   • 이벤트 및 광고성 정보 제공 (동의 시)
   • 서비스 이용 통계 분석
   • 접속 빈도 파악 및 서비스 이용에 대한 통계`,
  },
  {
    id: 4,
    icon: <Clock className="w-5 h-5" />,
    title: '개인정보의 보유 및 이용 기간',
    content: `회사는 이용자의 개인정보를 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 보존할 필요가 있는 경우 아래와 같이 일정 기간 보관합니다.

[회사 내부 방침에 의한 보유]
• 부정 이용 기록: 탈퇴 후 1년
  - 보유 사유: 부정 이용 방지 및 재가입 제한

[관련 법령에 의한 보유]
• 계약 또는 청약철회 등에 관한 기록: 5년
  - 근거: 전자상거래 등에서의 소비자보호에 관한 법률

• 대금결제 및 재화 등의 공급에 관한 기록: 5년
  - 근거: 전자상거래 등에서의 소비자보호에 관한 법률

• 소비자의 불만 또는 분쟁 처리에 관한 기록: 3년
  - 근거: 전자상거래 등에서의 소비자보호에 관한 법률

• 표시·광고에 관한 기록: 6개월
  - 근거: 전자상거래 등에서의 소비자보호에 관한 법률

• 웹사이트 방문 기록: 3개월
  - 근거: 통신비밀보호법`,
  },
  {
    id: 5,
    icon: <Share2 className="w-5 h-5" />,
    title: '개인정보의 제3자 제공',
    content: `회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

• 이용자가 사전에 동의한 경우
• 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

[현재 개인정보 제3자 제공 현황]
• 해당 없음 — 현재 제3자에게 개인정보를 제공하고 있지 않습니다.

향후 제3자 제공이 필요한 경우, 제공받는 자, 제공 목적, 제공 항목, 보유 기간 등을 명시하여 이용자의 동의를 받겠습니다.`,
  },
  {
    id: 6,
    icon: <Settings className="w-5 h-5" />,
    title: '개인정보 처리의 위탁',
    content: `회사는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리업무를 위탁하고 있습니다.

[위탁 현황]
• 위탁받는 자: Amazon Web Services (AWS)
  - 위탁 업무: 클라우드 서버 운영 및 데이터 저장
  - 보유 기간: 회원 탈퇴 시 또는 위탁 계약 종료 시까지

• 위탁받는 자: 카카오
  - 위탁 업무: 카카오 소셜 로그인 인증
  - 보유 기간: 서비스 이용 기간

• 위탁받는 자: 네이버
  - 위탁 업무: 네이버 소셜 로그인 인증
  - 보유 기간: 서비스 이용 기간

회사는 위탁 계약 시 개인정보보호 관련 법규의 준수, 개인정보에 관한 비밀 유지, 제3자 제공 금지, 사고 시의 책임 부담, 위탁 기간, 처리 종료 후의 개인정보 반환 또는 파기 등을 명확히 규정하고 있습니다.`,
  },
  {
    id: 7,
    icon: <Trash2 className="w-5 h-5" />,
    title: '개인정보의 파기 절차 및 방법',
    content: `회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.

[파기 절차]
• 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 혹은 즉시 파기됩니다.
• 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.

[파기 방법]
• 전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 완전 삭제
• 종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각하여 파기

[자동 파기]
• 개인정보 유효기간제에 따라 1년간 서비스를 이용하지 않은 이용자의 개인정보는 별도로 분리 보관하거나 파기하며, 분리 보관 시 해당 이용자에게 사전 통지합니다.`,
  },
  {
    id: 8,
    icon: <UserCheck className="w-5 h-5" />,
    title: '이용자 및 법정대리인의 권리·의무',
    content: `이용자(만 14세 미만인 경우 법정대리인)는 언제든지 다음의 권리를 행사할 수 있습니다.

1. 개인정보 열람 요구
   • 회사가 보유하고 있는 본인의 개인정보에 대해 열람을 요구할 수 있습니다.

2. 개인정보 정정·삭제 요구
   • 개인정보에 오류가 있는 경우 정정을 요구할 수 있습니다.
   • 다만, 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 삭제를 요구할 수 없습니다.

3. 개인정보 처리 정지 요구
   • 개인정보의 처리 정지를 요구할 수 있습니다.

4. 동의 철회(회원 탈퇴)
   • 마이페이지에서 직접 회원 탈퇴를 진행하거나 개인정보보호 담당자에게 서면, 이메일로 요청하실 수 있습니다.

[권리 행사 방법]
• 마이페이지에서 직접 수정·삭제·탈퇴 처리
• 개인정보보호 담당자에게 이메일(hondi@hondi.com) 또는 서면으로 요청
• 요청 접수 후 10일 이내에 조치하며, 처리 결과를 통지합니다.
• 대리인을 통해 권리를 행사하는 경우, 위임장을 제출하셔야 합니다.`,
  },
  {
    id: 9,
    icon: <Lock className="w-5 h-5" />,
    title: '개인정보의 안전성 확보 조치',
    content: `회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

1. 관리적 조치
   • 내부 관리 계획 수립 및 시행
   • 개인정보 취급 직원의 최소화 및 정기적 교육 실시
   • 개인정보 처리 관련 안전성 확보를 위한 내부 점검 시행

2. 기술적 조치
   • 비밀번호 암호화: 이용자의 비밀번호는 BCrypt 단방향 암호화하여 저장·관리
   • 해킹 등에 대비한 기술적 대책: SSL/TLS 암호화 통신, 방화벽 운영
   • 접근 통제: 개인정보에 대한 접근 권한 제한, 접근 기록 보관
   • 보안 프로그램 설치 및 주기적 갱신·점검
   • 개인정보의 암호화: 주요 개인정보는 암호화하여 저장·전송

3. 물리적 조치
   • 전산실, 자료보관실 등의 접근 통제
   • 클라우드 서버의 물리적 보안은 AWS의 보안 정책에 따름`,
  },
  {
    id: 10,
    icon: <Globe className="w-5 h-5" />,
    title: '쿠키(Cookie)의 사용',
    content: `회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키(Cookie)를 사용합니다.

[쿠키란?]
• 쿠키는 웹사이트를 운영하는데 이용되는 서버(HTTP)가 이용자의 브라우저에게 보내는 소량의 정보이며, 이용자의 기기에 저장됩니다.

[쿠키 사용 목적]
• 이용자의 로그인 상태 유지 (JWT 토큰 저장)
• 이용자의 접속 빈도 및 방문 시간 분석
• 이용자의 서비스 이용 패턴 파악을 통한 맞춤형 서비스 제공
• 보안 접속 여부 확인

[쿠키 설정 거부 방법]
• 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다.
• 브라우저 설정에서 쿠키를 허용하거나 거부할 수 있습니다.
  - Chrome: 설정 > 개인정보 및 보안 > 쿠키 및 기타 사이트 데이터
  - Firefox: 설정 > 개인 정보 및 보안 > 쿠키 및 사이트 데이터
  - Safari: 환경설정 > 개인정보 보호
  - Edge: 설정 > 쿠키 및 사이트 권한

• 단, 쿠키 설정을 거부할 경우 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.`,
  },
  {
    id: 11,
    icon: <Baby className="w-5 h-5" />,
    title: '만 14세 미만 아동의 개인정보 보호',
    content: `회사는 만 14세 미만 아동의 개인정보 보호를 위하여 다음과 같은 조치를 취합니다.

• 회사는 만 14세 미만 아동의 회원가입을 받지 않습니다.
• 만 14세 미만의 아동이 서비스에 가입하려는 경우, 법정대리인의 동의가 필요하며, 현재 해당 절차는 지원하지 않습니다.
• 만약 법정대리인의 동의 없이 만 14세 미만 아동의 개인정보가 수집된 것을 알게 된 경우, 해당 정보를 지체 없이 파기합니다.`,
  },
  {
    id: 12,
    icon: <Shield className="w-5 h-5" />,
    title: '개인정보 보호책임자 및 담당자',
    content: `회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

[개인정보 보호책임자]
• 성명: HONDI 개인정보보호팀
• 직위: 개인정보보호 책임자
• 연락처: hondi@hondi.com

[개인정보 보호 담당부서]
• 부서명: 개인정보보호팀
• 연락처: hondi@hondi.com

이용자는 서비스 이용 중 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 위 담당자에게 문의하실 수 있습니다. 회사는 이용자의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.

[기타 개인정보 침해에 대한 신고 및 상담]
• 개인정보침해신고센터 (한국인터넷진흥원): privacy.kisa.or.kr / (국번없이) 118
• 개인정보 분쟁조정위원회: www.kopico.go.kr / 1833-6972
• 대검찰청 사이버수사과: www.spo.go.kr / (국번없이) 1301
• 경찰청 사이버수사국: ecrm.police.go.kr / (국번없이) 182`,
  },
  {
    id: 13,
    icon: <FileText className="w-5 h-5" />,
    title: '개인정보처리방침의 변경',
    content: `본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.

이용자의 권리에 중대한 변경이 있는 경우에는 최소 30일 전에 공지합니다.

[시행 이력]
• 공고일자: 2025년 1월 1일
• 시행일자: 2025년 1월 1일
• 버전: v1.0`,
  },
];

function AccordionItem({ section, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-sky-200 shadow-lg shadow-sky-100/50' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100'}`}>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-4 p-5 text-left"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-md shadow-sky-200/50' : 'bg-sky-50 text-sky-500'}`}>
            {section.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-[15px] font-bold transition-colors duration-300 ${isOpen ? 'text-sky-700' : 'text-slate-700'}`}
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              제{section.id}조. {section.title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-sky-500' : 'text-slate-400'}`} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-5 pb-5">
                <div className="border-t border-sky-100 pt-4">
                  <pre
                    className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-[inherit]"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    {section.content}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        <motion.div
          className="absolute top-16 left-[8%] w-56 h-56 bg-sky-400/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-[10%] w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-sky-200">
              <Shield className="w-4 h-4 text-sky-300" />
              <span style={{ fontFamily: "'Pretendard', sans-serif" }}>Privacy Policy</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            개인정보처리방침
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-white/60 max-w-lg"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            혼디는 이용자의 개인정보를 소중히 여기며, 관련 법령을 준수합니다.
          </motion.p>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,35 C300,55 600,15 900,40 C1100,55 1300,25 1440,35 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="max-w-4xl mx-auto px-6 mt-8 mb-10">
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-sky-100/30 border border-sky-100/60 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Lock className="w-5 h-5" />, label: '비밀번호 암호화', desc: 'BCrypt 단방향' },
              { icon: <Shield className="w-5 h-5" />, label: 'SSL/TLS 보안', desc: '통신 구간 암호화' },
              { icon: <Trash2 className="w-5 h-5" />, label: '탈퇴 시 파기', desc: '지체 없이 삭제' },
              { icon: <UserCheck className="w-5 h-5" />, label: '제3자 제공 없음', desc: '동의 없이 미제공' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="text-center p-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'Pretendard', sans-serif" }}>{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 아코디언 본문 */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-3">
          {sections.map((section, index) => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openId === section.id}
              onToggle={() => handleToggle(section.id)}
              index={index}
            />
          ))}
        </div>

        {/* 하단 연락처 */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm text-slate-400 mb-2"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            개인정보 관련 문의사항이 있으시면 아래로 연락해주세요.
          </p>
          <a
            href="mailto:hondi@hondi.com"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <Shield className="w-4 h-4" />
            hondi@hondi.com
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
