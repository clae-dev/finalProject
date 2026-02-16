import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, ChevronDown, FileText, UserCheck, ShieldCheck, AlertTriangle, Ban, CreditCard, MessageSquare, Scale, RefreshCw, Gavel, Globe, BookOpen } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';

const sections = [
  {
    id: 1,
    icon: <FileText className="w-5 h-5" />,
    title: '목적',
    content: `본 약관은 혼디(HONDI, 이하 "회사")가 운영하는 혼디 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

본 약관은 PC, 모바일 등 다양한 단말기를 통해 제공되는 서비스에 대하여 동일하게 적용됩니다.`,
  },
  {
    id: 2,
    icon: <BookOpen className="w-5 h-5" />,
    title: '용어의 정의',
    content: `본 약관에서 사용하는 용어의 정의는 다음과 같습니다.

1. "서비스"란 회사가 제공하는 제주 여행 커뮤니티 플랫폼으로, 다음의 기능을 포함합니다.
   • 게스트하우스 정보 제공 및 예약 연결
   • 동행 찾기 매칭 서비스
   • 여행 후기 게시판
   • 자유게시판
   • 행사/액티비티 정보 제공
   • 항공권 예약 사이트 안내
   • AI 챗봇 서비스
   • 실시간 채팅 서비스

2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.

3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스를 지속적으로 이용할 수 있는 자를 말합니다.

4. "비회원"이란 회원가입 없이 서비스를 이용하는 자를 말합니다.

5. "게시물"이란 회원이 서비스를 이용함에 있어 게시한 부호, 문자, 음성, 이미지, 영상 등의 정보를 말합니다.

6. "닉네임"이란 회원의 식별과 서비스 이용을 위하여 회원이 설정한 문자 및 숫자의 조합을 말합니다.`,
  },
  {
    id: 3,
    icon: <ScrollText className="w-5 h-5" />,
    title: '약관의 효력 및 변경',
    content: `1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.

2. 본 약관의 내용은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지하고, 이에 동의한 이용자가 서비스에 가입함으로써 효력이 발생합니다.

3. 회사는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.

4. 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행 약관과 함께 서비스 내 공지사항에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.

5. 이용자에게 불리한 약관 변경의 경우에는 적용일자 30일 이전부터 공지하며, 이메일 등 전자적 수단을 통해 개별적으로 통지합니다.

6. 이용자가 변경된 약관의 적용에 동의하지 않는 경우, 이용자는 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다. 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우에는 약관의 변경사항에 동의한 것으로 간주합니다.`,
  },
  {
    id: 4,
    icon: <UserCheck className="w-5 h-5" />,
    title: '회원가입 및 계정',
    content: `1. 회원가입은 이용자가 약관에 동의하고 회사가 정한 양식에 따라 회원 정보를 기입한 후 "가입" 버튼을 누르는 것으로 신청합니다.

2. 회원가입 방법은 다음과 같습니다.
   • 이메일 회원가입: 이메일 주소, 비밀번호, 닉네임 입력
   • 소셜 로그인: 카카오, 네이버, 구글 계정을 통한 간편 가입

3. 회사는 다음 각 호에 해당하는 경우 회원가입을 거부하거나 사후에 회원 자격을 제한·상실시킬 수 있습니다.
   • 가입 신청자가 만 14세 미만인 경우
   • 등록 내용에 허위, 기재 누락, 오기가 있는 경우
   • 이전에 회원 자격을 상실한 적이 있는 경우 (단, 회사의 재가입 승인을 받은 경우 예외)
   • 부정한 용도로 서비스를 이용하고자 하는 경우
   • 기타 회사가 정한 이용 조건에 위배되는 경우

4. 회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 타인에게 자신의 계정을 이용하게 해서는 안 됩니다.

5. 회원은 자신의 계정이 무단으로 사용되었음을 인지한 경우, 즉시 회사에 통보하여야 합니다.`,
  },
  {
    id: 5,
    icon: <ShieldCheck className="w-5 h-5" />,
    title: '서비스의 제공 및 변경',
    content: `1. 회사는 다음과 같은 서비스를 제공합니다.
   • 제주 게스트하우스 정보 검색 및 예약 연결 서비스
   • 제주 여행 동행자 찾기 매칭 서비스
   • 여행 후기, 자유게시판 등 커뮤니티 서비스
   • 제주 행사/축제/액티비티 정보 제공 서비스
   • 항공권 예약 외부 사이트 안내 서비스
   • AI 기반 여행 상담 챗봇 서비스
   • 실시간 회원 간 채팅 서비스
   • 제주 날씨 정보 제공 서비스

2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 단, 시스템 정기 점검, 증설 및 교체, 고장, 통신 두절, 천재지변 또는 이에 준하는 불가항력적 사유가 발생한 경우에는 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.

3. 회사는 서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용 및 제공일자 등을 그 변경 전 7일 이상 공지합니다.

4. 회사는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책 및 운영의 필요에 따라 수정, 중단, 변경할 수 있으며, 이에 대하여 관련 법령에 특별한 규정이 없는 한 별도의 보상을 하지 않습니다.`,
  },
  {
    id: 6,
    icon: <Scale className="w-5 h-5" />,
    title: '회원의 권리와 의무',
    content: `[회원의 권리]
1. 회원은 서비스를 자유롭게 이용할 수 있습니다.
2. 회원은 자신의 개인정보에 대한 열람, 수정, 삭제를 요청할 수 있습니다.
3. 회원은 언제든지 회원 탈퇴를 요청할 수 있습니다.
4. 회원은 서비스 이용과 관련하여 불만이나 의견을 제기할 수 있습니다.

[회원의 의무]
1. 회원은 본 약관 및 회사의 공지사항, 서비스 이용 안내 등을 준수하여야 합니다.
2. 회원은 다음 행위를 하여서는 안 됩니다.
   • 회원가입 또는 정보 변경 시 허위 내용을 등록하는 행위
   • 타인의 정보를 도용하는 행위
   • 회사 및 제3자의 지적재산권을 침해하는 행위
   • 회사 및 제3자의 명예를 훼손하거나 업무를 방해하는 행위
   • 외설 또는 폭력적인 메시지, 이미지 등을 게시하는 행위
   • 영리를 목적으로 서비스를 이용하는 행위 (회사의 사전 승인 없이)
   • 서비스의 안정적 운영을 방해하는 행위
   • 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 유통, 상업적으로 이용하는 행위
   • 다른 이용자의 개인정보를 무단으로 수집, 저장, 공개하는 행위
   • 자동화된 수단(봇, 크롤러 등)을 이용하여 서비스에 접근하는 행위
   • 기타 불법적이거나 부당한 행위`,
  },
  {
    id: 7,
    icon: <MessageSquare className="w-5 h-5" />,
    title: '게시물의 관리',
    content: `1. 회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.

2. 회원은 자신이 게시한 게시물에 대해 회사에 다음과 같은 이용 권한을 부여합니다.
   • 서비스 내에서의 게시물 노출, 배포, 홍보 목적의 이용
   • 서비스 개선 및 품질 향상을 위한 분석 목적의 이용
   • 위 이용 권한은 회사가 서비스를 운영하는 동안 유효하며, 회원 탈퇴 후에도 관련 법령에 따라 보존이 필요한 경우를 제외하고는 삭제됩니다.

3. 회사는 다음 각 호에 해당하는 게시물을 사전 통지 없이 삭제하거나 이동, 등록 거부할 수 있습니다.
   • 다른 이용자 또는 제3자를 비방하거나 명예를 훼손하는 내용
   • 공공질서 및 미풍양속에 위반되는 내용
   • 범죄적 행위에 결부된다고 인정되는 내용
   • 회사 또는 제3자의 저작권 등 지적재산권을 침해하는 내용
   • 음란물 또는 청소년에게 유해한 내용
   • 상업적 광고, 스팸성 게시물
   • 개인정보(연락처, 주소 등)가 포함된 내용
   • 허위 사실이나 타인을 기만하는 내용
   • 기타 관련 법령 및 회사의 운영 정책에 위반되는 내용

4. 회원은 자신의 게시물이 타인의 권리를 침해하지 않도록 주의하여야 하며, 게시물로 인해 발생하는 모든 책임은 해당 게시물을 작성한 회원에게 있습니다.

5. 이용자는 게시물에 대해 신고 기능을 통해 부적절한 게시물을 신고할 수 있으며, 회사는 신고된 게시물에 대해 내부 기준에 따라 조치합니다.`,
  },
  {
    id: 8,
    icon: <AlertTriangle className="w-5 h-5" />,
    title: '신고 및 제재',
    content: `1. 이용자는 다음의 사유로 다른 이용자 또는 게시물을 신고할 수 있습니다.
   • 스팸 또는 광고성 게시물
   • 욕설, 비방, 혐오 표현
   • 음란물 또는 불법 콘텐츠
   • 개인정보 노출
   • 허위 정보 유포
   • 기타 서비스 이용규칙 위반

2. 회사는 신고 접수 후 합리적인 기간 내에 해당 사안을 검토하고, 다음과 같은 제재 조치를 취할 수 있습니다.
   • 1차 위반: 해당 게시물 삭제 및 경고
   • 2차 위반: 게시물 삭제 및 서비스 이용 일시 제한 (7일)
   • 3차 위반: 게시물 삭제 및 서비스 이용 일시 제한 (30일)
   • 4차 이상 또는 중대 위반: 회원 자격 영구 정지 (강제 탈퇴)

3. 중대한 위반(불법 행위, 심각한 명예훼손 등)의 경우 경고 없이 즉시 회원 자격을 정지할 수 있습니다.

4. 제재를 받은 회원은 제재 사유 및 결과에 대해 이의를 제기할 수 있으며, 회사는 이의 제기에 대해 합리적인 기간 내에 답변합니다.`,
  },
  {
    id: 9,
    icon: <Ban className="w-5 h-5" />,
    title: '서비스 이용 제한 및 계약 해지',
    content: `1. 회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.

2. 회원은 언제든지 마이페이지 또는 고객지원을 통해 이용 계약의 해지(회원 탈퇴)를 신청할 수 있으며, 회사는 관련 법령에서 정하는 바에 따라 이를 즉시 처리합니다.

3. 회원 탈퇴 시 처리 사항
   • 회원 정보는 즉시 삭제됩니다. (단, 관련 법령에 따라 보존이 필요한 정보는 해당 기간 동안 보관)
   • 회원이 작성한 게시물 중 커뮤니티에 게시된 게시물은 삭제되지 않으며, 작성자 정보는 "탈퇴한 회원"으로 표시됩니다.
   • 게시물 삭제를 원하는 경우 탈퇴 전에 직접 삭제하시거나, 탈퇴 후 고객지원을 통해 요청하실 수 있습니다.

4. 회사는 최근 1년간 서비스를 이용하지 않은 회원에 대해 사전 통지 후 휴면 계정으로 전환하거나 계약을 해지할 수 있습니다.`,
  },
  {
    id: 10,
    icon: <CreditCard className="w-5 h-5" />,
    title: '유료 서비스 및 결제',
    content: `1. 현재 혼디 서비스는 무료로 제공됩니다.

2. 향후 유료 서비스가 도입되는 경우, 회사는 해당 서비스의 내용, 이용 요금, 결제 방법, 환불 정책 등을 사전에 공지하고 이용자의 동의를 받습니다.

3. 외부 연결 서비스 관련 안내
   • 서비스 내에서 제공하는 항공권 예약, 숙소 예약 등의 외부 링크를 통한 결제는 해당 외부 사이트의 이용약관 및 결제 정책에 따릅니다.
   • 회사는 외부 사이트에서의 결제 및 거래에 대해 책임을 지지 않습니다.
   • 외부 서비스 이용 시 발생하는 문제는 해당 서비스 제공자에게 직접 문의하시기 바랍니다.`,
  },
  {
    id: 11,
    icon: <RefreshCw className="w-5 h-5" />,
    title: '면책사항',
    content: `1. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.

2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.

3. 회사는 이용자가 서비스를 통해 게재한 정보, 자료, 사실의 신뢰도, 정확성 등에 대해서는 책임을 지지 않습니다.

4. 회사는 이용자 간 또는 이용자와 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.

5. 회사는 무료로 제공되는 서비스 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.

6. 공공 데이터(TourAPI 등)를 통해 제공되는 행사/액티비티 정보의 정확성에 대해서는 원 데이터 제공기관에 책임이 있으며, 회사는 데이터의 정확성을 보장하지 않습니다.

7. AI 챗봇이 제공하는 정보는 참고용이며, 회사는 AI 챗봇의 답변 내용에 대해 정확성을 보장하지 않습니다.`,
  },
  {
    id: 12,
    icon: <Globe className="w-5 h-5" />,
    title: '저작권 및 지적재산권',
    content: `1. 서비스에 포함된 모든 콘텐츠(디자인, 텍스트, 그래픽, 로고, 아이콘, 이미지, 소프트웨어 등)에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.

2. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.

3. 이용자가 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.

4. 회사는 서비스 운영·홍보 등의 목적으로 회원의 게시물을 서비스 내에서 노출할 수 있으며, 필요한 범위 내에서 게시물의 일부를 수정·편집하여 사용할 수 있습니다. 이 경우 회사는 저작권법 규정을 준수하며, 회원은 고객지원을 통해 게시물에 대한 노출 중단 등을 요청할 수 있습니다.`,
  },
  {
    id: 13,
    icon: <Gavel className="w-5 h-5" />,
    title: '분쟁 해결 및 관할법원',
    content: `1. 회사는 이용자로부터 제출되는 불만사항 및 의견을 우선적으로 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리 일정을 즉시 통보합니다.

2. 회사와 이용자 간에 발생한 분쟁과 관련하여 이용자의 피해 구제 신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.

3. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우, 회사의 본사 소재지를 관할하는 법원을 전속적 합의관할 법원으로 합니다.

4. 본 약관에 명시되지 않은 사항에 대해서는 대한민국 관련 법령 및 상관례에 따릅니다.

[분쟁 해결 관련 기관]
• 한국소비자원: www.kca.go.kr / 1372
• 전자거래분쟁조정위원회: www.ecmc.or.kr / 1661-5714
• 개인정보분쟁조정위원회: www.kopico.go.kr / 1833-6972`,
  },
  {
    id: 14,
    icon: <FileText className="w-5 h-5" />,
    title: '부칙',
    content: `1. 본 약관은 2025년 1월 1일부터 시행합니다.

2. 본 약관 시행 이전에 가입한 회원에게도 본 약관이 적용됩니다.

3. 본 약관에 대한 문의사항은 아래로 연락해주시기 바랍니다.

[문의처]
• 서비스명: 혼디 (HONDI)
• 운영 주체: HONDI
• 이메일: hondi@hondi.com
• 고객지원 페이지: /faq

[개정 이력]
• v1.0 (2025.01.01) — 최초 제정`,
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

export default function TermsOfService() {
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
              <ScrollText className="w-4 h-4 text-sky-300" />
              <span style={{ fontFamily: "'Pretendard', sans-serif" }}>Terms of Service</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            이용약관
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-white/60 max-w-lg"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            혼디 서비스 이용에 관한 기본적인 사항을 규정합니다.
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
              { icon: <UserCheck className="w-5 h-5" />, label: '만 14세 이상', desc: '가입 연령 제한' },
              { icon: <ShieldCheck className="w-5 h-5" />, label: '무료 서비스', desc: '모든 기능 무료 제공' },
              { icon: <Scale className="w-5 h-5" />, label: '권리 보장', desc: '열람·수정·탈퇴 가능' },
              { icon: <Gavel className="w-5 h-5" />, label: '법령 준수', desc: '대한민국 관련 법령' },
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
            이용약관 관련 문의사항이 있으시면 아래로 연락해주세요.
          </p>
          <a
            href="mailto:hondi@hondi.com"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <ScrollText className="w-4 h-4" />
            hondi@hondi.com
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
