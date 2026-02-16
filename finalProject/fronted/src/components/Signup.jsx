import React, { useState, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Eye, EyeOff, User, Send, CheckCircle2, Loader2, RefreshCw, ArrowLeft, Sparkles, Shield, UserPlus, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../api/core/axiosAPI';
import logo from '@/assets/images/logo/혼디.png';
import bgImage from '@/assets/images/auth/협재.png';

const AVATAR_STYLES = ['adventurer', 'fun-emoji', 'avataaars', 'bottts', 'pixel-art', 'lorelei'];

const generateAvatars = () => {
  return Array.from({ length: 12 }, () => {
    const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    const seed = Math.random().toString(36).substring(2, 10);
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
  });
};

const AVATAR_PARTS = {
  top: {
    label: '헤어',
    options: [
      { value: 'shortFlat', label: '숏컷' },
      { value: 'shortCurly', label: '짧은곱슬' },
      { value: 'shortRound', label: '숏라운드' },
      { value: 'shortWaved', label: '짧은웨이브' },
      { value: 'bob', label: '단발' },
      { value: 'bun', label: '묶은머리' },
      { value: 'curly', label: '곱슬' },
      { value: 'curvy', label: '웨이브' },
      { value: 'dreads', label: '드레드' },
      { value: 'dreads01', label: '드레드1' },
      { value: 'dreads02', label: '드레드2' },
      { value: 'frida', label: '프리다' },
      { value: 'fro', label: '아프로' },
      { value: 'froBand', label: '아프로밴드' },
      { value: 'frizzle', label: '곱슬곱슬' },
      { value: 'longButNotTooLong', label: '중간머리' },
      { value: 'miaWallace', label: '긴직모' },
      { value: 'shavedSides', label: '투블록' },
      { value: 'straight01', label: '직모1' },
      { value: 'straight02', label: '직모2' },
      { value: 'straightAndStrand', label: '가르마' },
      { value: 'shaggy', label: '텁수룩' },
      { value: 'shaggyMullet', label: '멀렛' },
      { value: 'sides', label: '옆머리' },
      { value: 'theCaesar', label: '시저컷' },
      { value: 'theCaesarAndSidePart', label: '시저가르마' },
      { value: 'bigHair', label: '풍성한머리' },
      { value: 'hat', label: '모자' },
      { value: 'hijab', label: '히잡' },
      { value: 'turban', label: '터번' },
      { value: 'winterHat1', label: '겨울모자1' },
      { value: 'winterHat02', label: '겨울모자2' },
      { value: 'winterHat03', label: '겨울모자3' },
      { value: 'winterHat04', label: '겨울모자4' },
    ]
  },
  eyes: {
    label: '눈',
    options: [
      { value: 'default', label: '기본' },
      { value: 'happy', label: '행복' },
      { value: 'closed', label: '감은눈' },
      { value: 'cry', label: '울음' },
      { value: 'eyeRoll', label: '째려보기' },
      { value: 'hearts', label: '하트' },
      { value: 'side', label: '옆보기' },
      { value: 'squint', label: '찡그린' },
      { value: 'surprised', label: '놀람' },
      { value: 'wink', label: '윙크' },
      { value: 'winkWacky', label: '장난윙크' },
      { value: 'xDizzy', label: '어지러움' },
    ]
  },
  eyebrows: {
    label: '눈썹',
    options: [
      { value: 'default', label: '기본' },
      { value: 'defaultNatural', label: '내추럴' },
      { value: 'angry', label: '화남' },
      { value: 'angryNatural', label: '화남내추럴' },
      { value: 'flatNatural', label: '평평한' },
      { value: 'frownNatural', label: '찌푸린' },
      { value: 'raisedExcited', label: '놀란' },
      { value: 'raisedExcitedNatural', label: '놀란내추럴' },
      { value: 'sadConcerned', label: '슬픈' },
      { value: 'sadConcernedNatural', label: '슬픈내추럴' },
      { value: 'unibrowNatural', label: '일자눈썹' },
      { value: 'upDown', label: '한쪽올린' },
      { value: 'upDownNatural', label: '한쪽내추럴' },
    ]
  },
  mouth: {
    label: '입',
    options: [
      { value: 'default', label: '기본' },
      { value: 'smile', label: '미소' },
      { value: 'twinkle', label: '씩웃음' },
      { value: 'concerned', label: '걱정' },
      { value: 'disbelief', label: '불신' },
      { value: 'eating', label: '먹기' },
      { value: 'grimace', label: '찡그림' },
      { value: 'sad', label: '슬픔' },
      { value: 'screamOpen', label: '비명' },
      { value: 'serious', label: '진지' },
      { value: 'tongue', label: '혀' },
      { value: 'vomit', label: '구역질' },
    ]
  },
  clothing: {
    label: '옷',
    options: [
      { value: 'hoodie', label: '후드티' },
      { value: 'blazerAndShirt', label: '정장셔츠' },
      { value: 'blazerAndSweater', label: '정장니트' },
      { value: 'collarAndSweater', label: '카라니트' },
      { value: 'graphicShirt', label: '그래픽티' },
      { value: 'overall', label: '오버올' },
      { value: 'shirtCrewNeck', label: '라운드넥' },
      { value: 'shirtScoopNeck', label: 'U넥' },
      { value: 'shirtVNeck', label: 'V넥' },
    ]
  },
  accessories: {
    label: '악세사리',
    options: [
      { value: '', label: '없음' },
      { value: 'kurt', label: '커트' },
      { value: 'prescription01', label: '안경1' },
      { value: 'prescription02', label: '안경2' },
      { value: 'round', label: '동글이' },
      { value: 'sunglasses', label: '선글라스' },
      { value: 'wayfarers', label: '웨이페어러' },
      { value: 'eyepatch', label: '안대' },
    ]
  },
  facialHair: {
    label: '수염',
    options: [
      { value: '', label: '없음' },
      { value: 'beardLight', label: '옅은수염' },
      { value: 'beardMajestic', label: '풍성한수염' },
      { value: 'beardMedium', label: '중간수염' },
      { value: 'moustacheFancy', label: '멋진콧수염' },
      { value: 'moustacheMagnum', label: '큰콧수염' },
    ]
  },
  skinColor: {
    label: '피부색',
    type: 'color',
    options: [
      { value: 'ffdbb4', color: '#ffdbb4' },
      { value: 'edb98a', color: '#edb98a' },
      { value: 'fd9841', color: '#fd9841' },
      { value: 'd08b5b', color: '#d08b5b' },
      { value: 'ae5d29', color: '#ae5d29' },
      { value: '614335', color: '#614335' },
      { value: 'f8d25c', color: '#f8d25c' },
    ]
  },
  hairColor: {
    label: '머리색',
    type: 'color',
    options: [
      { value: '2c1b18', color: '#2c1b18' },
      { value: '4a312c', color: '#4a312c' },
      { value: '724133', color: '#724133' },
      { value: 'a55728', color: '#a55728' },
      { value: 'b58143', color: '#b58143' },
      { value: 'd6b370', color: '#d6b370' },
      { value: 'ecdcbf', color: '#ecdcbf' },
      { value: 'c93305', color: '#c93305' },
      { value: 'f59797', color: '#f59797' },
      { value: 'e8e1e1', color: '#e8e1e1' },
    ]
  },
  clothColor: {
    label: '옷색깔',
    type: 'color',
    options: [
      { value: '262e33', color: '#262e33' },
      { value: '65c9ff', color: '#65c9ff' },
      { value: '5199e4', color: '#5199e4' },
      { value: '25557c', color: '#25557c' },
      { value: '929598', color: '#929598' },
      { value: 'e6e6e6', color: '#e6e6e6' },
      { value: 'ffffff', color: '#ffffff' },
      { value: 'ff488e', color: '#ff488e' },
      { value: 'ff5c5c', color: '#ff5c5c' },
      { value: 'ffafb9', color: '#ffafb9' },
      { value: 'ffdeb5', color: '#ffdeb5' },
      { value: 'ff8c00', color: '#ff8c00' },
      { value: 'a7ffc4', color: '#a7ffc4' },
      { value: '3c4f5c', color: '#3c4f5c' },
    ]
  },
};

const buildCustomAvatarUrl = (parts) => {
  const params = new URLSearchParams();
  Object.entries(parts).forEach(([key, value]) => {
    if (value) {
      if (key === 'clothColor') {
        params.set('clotheColor', value);
      } else {
        params.set(key, value);
      }
    }
  });
  if (parts.accessories) params.set('accessoriesProbability', '100');
  if (parts.facialHair) params.set('facialHairProbability', '100');
  return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
};

const TERMS_CONTENT = {
  terms: {
    title: '혼디(HONDI) 이용약관',
    content: `제1조 (목적)
본 약관은 혼디(HONDI)(이하 "서비스")가 제공하는 제주 여행 커뮤니티 서비스의 이용과 관련하여 서비스와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 혼디(HONDI)가 제공하는 제주도 혼행(혼자 여행) 정보 공유, 동행 모집, 숙소 정보, 여행 후기, 맛집 추천 등 제주 여행 관련 커뮤니티 서비스를 말합니다.
② "회원"이란 본 약관에 동의하고 회원가입을 완료한 자로서, 서비스가 제공하는 정보와 서비스를 이용할 수 있는 자를 말합니다.
③ "게시물"이란 회원이 서비스에 게시한 여행 후기, 동행 모집글, 댓글, 사진, 평점 등 일체의 정보를 말합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
② 서비스는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 최소 7일 전에 공지합니다.

제4조 (회원가입)
① 회원가입은 이용자가 본 약관에 동의하고, 서비스가 정한 양식에 따라 회원정보를 기입한 후 가입을 신청하면, 서비스가 이를 승낙함으로써 체결됩니다.
② 서비스는 다음 각 호에 해당하는 경우 회원가입을 거절하거나 사후에 이용계약을 해지할 수 있습니다.
  1. 타인의 정보를 도용한 경우
  2. 허위 정보를 기재한 경우
  3. 이전에 회원자격을 상실한 적이 있는 경우
  4. 기타 서비스가 정한 이용신청 요건을 충족하지 않는 경우

제5조 (회원의 의무)
① 회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.
  1. 타인의 개인정보를 무단으로 수집, 이용, 제공하는 행위
  2. 허위 여행 정보나 리뷰를 게시하는 행위
  3. 동행 모집 시 상업적 목적이나 불건전한 목적으로 이용하는 행위
  4. 다른 회원을 비방, 모욕, 위협하거나 괴롭히는 행위
  5. 음란물, 폭력적 콘텐츠, 혐오 표현 등을 게시하는 행위
  6. 영리 목적의 광고, 홍보, 스팸을 게시하는 행위
  7. 서비스의 정상적인 운영을 방해하는 행위
  8. 관련 법령에 위반되는 행위
② 회원은 동행 활동 시 상호 존중하며, 개인의 안전에 유의해야 합니다.
③ 동행 모집글의 내용은 사실에 기반해야 하며, 여행 일정, 비용 분담 등을 명확히 기재해야 합니다.

제6조 (게시물의 관리)
① 회원이 작성한 게시물의 저작권은 해당 회원에게 귀속됩니다.
② 서비스는 다음 각 호에 해당하는 게시물을 사전 통지 없이 삭제하거나 이동 또는 등록을 거부할 수 있습니다.
  1. 타인의 명예를 훼손하거나 권리를 침해하는 게시물
  2. 허위 또는 과장된 여행 정보를 포함한 게시물
  3. 상업적 광고 목적의 게시물
  4. 음란, 폭력적이거나 공서양속에 반하는 게시물
  5. 관련 법령에 위반되는 게시물
③ 회원은 자신이 게시한 여행 후기, 사진 등이 서비스 내에서 다른 회원에게 공개됨을 인지하고 동의합니다.

제7조 (동행 서비스)
① 동행 모집 및 참여는 회원 간의 자발적 활동이며, 서비스는 회원 간의 동행 활동에서 발생하는 문제에 대해 책임을 지지 않습니다.
② 회원은 동행 활동 중 발생할 수 있는 안전 문제에 대해 스스로 주의를 기울여야 합니다.
③ 동행 모집자는 모집 내용을 성실히 이행해야 하며, 정당한 사유 없이 일방적으로 취소해서는 안 됩니다.

제8조 (서비스의 중단)
① 서비스는 시스템 점검, 장비 교체 및 고장, 통신 장애 등의 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
② 서비스는 제1항의 사유로 서비스 제공이 일시적으로 중단되는 경우 사전에 공지합니다. 다만, 불가피한 경우 사후에 공지할 수 있습니다.

제9조 (회원 탈퇴 및 자격 상실)
① 회원은 언제든지 서비스에 탈퇴를 요청할 수 있으며, 서비스는 즉시 회원 탈퇴를 처리합니다.
② 서비스는 회원이 제5조의 의무를 위반한 경우, 사전 경고 후에도 시정되지 않으면 회원자격을 제한 또는 상실시킬 수 있습니다.

제10조 (면책사항)
① 서비스는 회원이 게시한 여행 정보, 숙소 리뷰, 맛집 추천 등의 정확성, 신뢰성에 대해 보증하지 않습니다.
② 서비스는 회원 상호 간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임을 지지 않습니다.
③ 회원이 동행 활동 중 발생한 사고, 분쟁, 피해에 대해 서비스는 책임을 지지 않습니다.

제11조 (분쟁 해결)
본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 대한민국 관련 법령 및 상관례에 따릅니다.

부칙
본 약관은 2025년 1월 1일부터 시행합니다.`
  },
  privacy: {
    title: '혼디(HONDI) 개인정보 처리방침',
    content: `혼디(HONDI)(이하 "서비스")는 회원의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본 개인정보 처리방침을 통해 회원의 개인정보가 어떻게 수집, 이용, 보관, 파기되는지 안내드립니다.

제1조 (수집하는 개인정보 항목)
서비스는 회원가입 및 서비스 이용을 위해 다음과 같은 개인정보를 수집합니다.

① 필수 수집 항목
  • 이름, 닉네임, 이메일 주소, 비밀번호
  • 성별, 연령대
  • 프로필 아바타 이미지

② 서비스 이용 과정에서 자동 수집되는 항목
  • 접속 IP 주소, 접속 일시, 서비스 이용 기록
  • 기기 정보 (브라우저 종류, OS 정보)

제2조 (개인정보의 수집 및 이용 목적)
서비스는 수집한 개인정보를 다음의 목적을 위해 이용합니다.

① 회원 관리
  • 회원가입 및 본인 확인
  • 회원 식별 및 인증
  • 서비스 부정 이용 방지

② 커뮤니티 서비스 제공
  • 여행 후기, 동행 모집, 맛집 추천 등 게시물 작성 및 관리
  • 동행 모집 시 프로필 정보 제공 (닉네임, 성별, 연령대, 아바타)
  • 회원 간 커뮤니케이션 지원

③ 서비스 개선
  • 서비스 이용 통계 분석
  • 신규 서비스 개발 및 기존 서비스 개선

제3조 (개인정보의 보유 및 이용 기간)
① 서비스는 회원 탈퇴 시까지 개인정보를 보유 및 이용합니다.
② 회원 탈퇴 시 개인정보는 즉시 파기합니다. 다만, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
  • 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
  • 접속에 관한 기록: 3개월 (통신비밀보호법)

제4조 (개인정보의 제3자 제공)
① 서비스는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다.
② 다만, 다음의 경우에는 예외로 합니다.
  1. 회원이 사전에 동의한 경우
  2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보의 파기)
① 서비스는 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
② 파기 방법
  • 전자적 파일: 복구할 수 없는 기술적 방법을 사용하여 삭제
  • 종이 문서: 분쇄기로 분쇄하거나 소각

제6조 (회원의 권리와 행사 방법)
① 회원은 언제든지 자신의 개인정보를 조회하거나 수정할 수 있습니다.
② 회원은 언제든지 회원 탈퇴를 통해 개인정보의 수집 및 이용에 대한 동의를 철회할 수 있습니다.
③ 회원은 개인정보의 오류에 대한 정정을 요청할 수 있으며, 서비스는 정정을 완료하기 전까지 해당 개인정보를 이용하지 않습니다.

제7조 (개인정보의 안전성 확보 조치)
서비스는 회원의 개인정보를 안전하게 관리하기 위해 다음과 같은 조치를 취하고 있습니다.
  • 비밀번호 암호화 저장
  • 개인정보 접근 권한 제한
  • 해킹 등에 대비한 보안 시스템 운영
  • 개인정보 취급 직원의 최소화 및 교육

제8조 (쿠키의 사용)
① 서비스는 회원에게 편리한 서비스를 제공하기 위해 쿠키를 사용할 수 있습니다.
② 회원은 브라우저 설정을 통해 쿠키의 저장을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 있을 수 있습니다.

제9조 (개인정보 보호책임자)
서비스는 회원의 개인정보를 보호하고 관련 불만을 처리하기 위해 개인정보 보호책임자를 지정하고 있습니다.

  • 개인정보 보호책임자: 혼디 운영팀
  • 이메일: privacy@hondi.co.kr

제10조 (개인정보 처리방침의 변경)
본 개인정보 처리방침은 관련 법령 및 서비스 정책의 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지사항을 통해 안내합니다.

부칙
본 개인정보 처리방침은 2025년 1월 1일부터 시행합니다.`
  }
};

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    gender: '',
    age_group: '',
    profileImg: '',
    birthDate: ''
  });
  const [avatars, setAvatars] = useState(() => generateAvatars());

  const refreshAvatars = useCallback(() => {
    setAvatars(generateAvatars());
    setFormData(prev => ({ ...prev, profileImg: '' }));
  }, []);

  const [avatarMode, setAvatarMode] = useState('random');
  const [customParts, setCustomParts] = useState({
    top: 'shortFlat',
    eyes: 'default',
    eyebrows: 'default',
    mouth: 'default',
    clothing: 'hoodie',
    accessories: '',
    facialHair: '',
    skinColor: 'ffdbb4',
    hairColor: '2c1b18',
    clothColor: '65c9ff',
  });
  const [activeCategory, setActiveCategory] = useState('top');

  const customAvatarUrl = useMemo(() => buildCustomAvatarUrl(customParts), [customParts]);

  const switchAvatarMode = useCallback((mode) => {
    setAvatarMode(mode);
    if (mode === 'custom') {
      setFormData(prev => ({ ...prev, profileImg: buildCustomAvatarUrl(customParts) }));
    } else {
      setFormData(prev => ({ ...prev, profileImg: '' }));
    }
  }, [customParts]);

  const updateCustomPart = useCallback((category, value) => {
    setCustomParts(prev => {
      const newParts = { ...prev, [category]: value };
      setFormData(fd => ({ ...fd, profileImg: buildCustomAvatarUrl(newParts) }));
      return newParts;
    });
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false
  });
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [termsModal, setTermsModal] = useState({ open: false, type: null });

  const validateNickname = (nickname) => {
    if (!nickname) return '닉네임을 입력해주세요';
    if (nickname.length < 2 || nickname.length > 10) return '닉네임은 2~10자로 입력해주세요';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return '이메일을 입력해주세요';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return '비밀번호를 입력해주세요';
    if (password.length < 8 || password.length > 20) return '비밀번호는 8~20자로 입력해주세요';
    if (!/[!@#$%^&*]/.test(password)) return '특수문자를 포함해야 합니다';
    return '';
  };

  const handleSendVerificationCode = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    setIsSending(true);
    setErrors(prev => ({ ...prev, email: '', verificationCode: '' }));

    try {
      const response = await axiosApi.post('/api/email/send-code', {
        email: formData.email
      });

      if (response.data.success) {
        setIsCodeSent(true);
        setTimer(180);
        setVerificationCode('');
        alert('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
      } else {
        setErrors(prev => ({ ...prev, email: response.data.message || '인증 코드 발송에 실패했습니다.' }));
      }
    } catch (error) {
      console.error('인증 코드 발송 실패:', error);
      const errorMessage = error.response?.data?.message || '인증 코드 발송 중 오류가 발생했습니다.';
      setErrors(prev => ({ ...prev, email: errorMessage }));
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: '인증 코드를 입력해주세요' }));
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axiosApi.post('/api/email/verify-code', {
        email: formData.email,
        code: verificationCode
      });

      if (response.data.success) {
        setIsVerified(true);
        setTimer(0);
        setErrors(prev => ({ ...prev, verificationCode: '' }));
      } else {
        setErrors(prev => ({ ...prev, verificationCode: response.data.message || '인증 코드가 일치하지 않습니다' }));
      }
    } catch (error) {
      console.error('인증 코드 검증 실패:', error);
      const errorMessage = error.response?.data?.message || '인증 코드 검증 중 오류가 발생했습니다.';
      setErrors(prev => ({ ...prev, verificationCode: errorMessage }));
    } finally {
      setIsVerifying(false);
    }
  };

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = '이름을 입력해주세요';

    const nicknameError = validateNickname(formData.nickname);
    if (nicknameError) newErrors.nickname = nicknameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!isVerified) newErrors.verificationCode = '이메일 인증을 완료해주세요';
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요';
    if (!formData.age_group) newErrors.age_group = '연령대를 선택해주세요';

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요';
    } else {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 14) {
        newErrors.birthDate = '만 14세 미만은 가입할 수 없습니다';
      }
    }

    if (!agreements.terms) newErrors.terms = '이용약관에 동의해주세요';
    if (!agreements.privacy) newErrors.privacy = '개인정보 처리방침에 동의해주세요';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const signupData = {
          memberEmail: formData.email,
          memberPw: formData.password,
          memberNickname: formData.nickname,
          memberName: formData.name,
          memberPhone: '',
          memberGender: formData.gender === 'male' ? 'M' : 'F',
          memberAgeGroup: formData.age_group,
          memberProfileImg: formData.profileImg || null,
          memberBirthDate: formData.birthDate
        };

        const response = await axiosApi.post('/api/member/signup', signupData);

        if (response.data.success) {
          alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
          window.location.href = '/login';
        } else {
          alert(response.data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입 실패:', error);
        console.error('에러 응답:', error.response?.data);
        const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // 이메일 변경 시 인증 상태 초기화 (인증 우회 방지)
    if (field === 'email') {
      setIsVerified(false);
      setIsCodeSent(false);
      setVerificationCode('');
      setTimer(0);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-50 to-cyan-50">
      {/* 배경 이미지 - 상단 히어로 영역 */}
      <div className="absolute top-0 left-0 right-0 h-[420px]">
        <img src={bgImage} alt="협재 해변" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-sky-800/40 to-sky-50" />
      </div>

      {/* 상단 장식 블러 원형 */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl" />

      {/* 상단 네비게이션 */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white font-medium transition-colors duration-300 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-white/80 hover:text-white font-medium transition-colors duration-300 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            로그인
          </button>
        </div>
      </div>

      {/* 히어로 타이틀 */}
      <div className="relative z-10 text-center pt-10 pb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logo} alt="혼디" className="h-14 drop-shadow-lg" />
          <div className="flex flex-col leading-tight text-left">
            <span
              className="text-3xl font-black text-white tracking-wider drop-shadow-lg"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              HONDI
            </span>
            <span
              className="text-[11px] font-semibold text-white/70 tracking-widest"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              혼디
            </span>
          </div>
        </div>
        <h1
          className="text-2xl font-bold text-white drop-shadow-md mb-2"
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          새로운 여행의 시작
        </h1>
        <p
          className="text-white/70 text-sm"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          나만의 제주 여행을 함께할 프로필을 만들어보세요
        </p>
      </div>

      {/* 웨이브 디바이더 (메인 페이지 스타일) */}
      <div className="relative z-10 -mt-4 -mb-1">
        <svg viewBox="0 0 1200 60" className="w-full h-12" preserveAspectRatio="none">
          <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#f0f9ff" fillOpacity="0.6" />
          <path d="M0,40 C200,60 400,10 600,40 C800,60 1000,10 1200,40 L1200,60 L0,60 Z" fill="#f0f9ff" />
        </svg>
      </div>

      {/* 메인 카드 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-sky-200/40 border border-white/60 overflow-hidden">

          {/* 스텝 표시 바 */}
          <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-sky-50 px-10 py-5 border-b border-sky-100/60">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-200/50">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <span
                  className="text-sm font-semibold text-sky-600"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  기본 정보
                </span>
              </div>
              <div className="w-12 h-[2px] bg-sky-200 rounded-full" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-200/50">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span
                  className="text-sm font-semibold text-sky-600"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  프로필 꾸미기
                </span>
              </div>
              <div className="w-12 h-[2px] bg-sky-200 rounded-full" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-200/50">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span
                  className="text-sm font-semibold text-sky-600"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  인증 & 약관
                </span>
              </div>
            </div>
          </div>

          {/* 폼 영역 */}
          <form onSubmit={handleSubmit} className="p-10">
            <div className="flex gap-10">

              {/* 왼쪽: 아바타 선택 */}
              <div className="w-80 shrink-0 space-y-6">
                {/* 섹션 뱃지 - 메인 페이지 스타일 */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200/60 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span
                      className="text-xs font-bold text-sky-600 tracking-wide"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      AVATAR
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold text-slate-800 mb-1"
                    style={{ fontFamily: "'GmarketSans', sans-serif" }}
                  >
                    프로필 아바타
                  </h3>
                  <p
                    className="text-xs text-slate-400 mb-4"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    나를 표현할 아바타를 선택해주세요
                  </p>

                  {/* 탭 전환 */}
                  <div className="flex rounded-2xl bg-slate-100/80 p-1 mb-4">
                    <button
                      type="button"
                      onClick={() => switchAvatarMode('random')}
                      className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
                        avatarMode === 'random'
                          ? 'bg-white text-sky-600 shadow-sm shadow-sky-100'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      랜덤 선택
                    </button>
                    <button
                      type="button"
                      onClick={() => switchAvatarMode('custom')}
                      className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
                        avatarMode === 'custom'
                          ? 'bg-white text-sky-600 shadow-sm shadow-sky-100'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      직접 꾸미기
                    </button>
                  </div>

                  {/* 랜덤 선택 모드 */}
                  {avatarMode === 'random' && (
                    <div>
                      <div className="flex items-center justify-end mb-2">
                        <button
                          type="button"
                          onClick={refreshAvatars}
                          className="flex items-center gap-1.5 text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-full"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          <RefreshCw className="w-3 h-3" />
                          새로고침
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5 p-4 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100/60">
                        {avatars.map((url, idx) => (
                          <button
                            key={url}
                            type="button"
                            onClick={() => handleChange('profileImg', url)}
                            className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                              formData.profileImg === url
                                ? 'border-sky-400 ring-2 ring-sky-200 shadow-lg shadow-sky-200/50'
                                : 'border-transparent hover:border-sky-200'
                            }`}
                          >
                            <img src={url} alt={`아바타 ${idx + 1}`} className="w-full h-full object-cover bg-white" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 커스텀 꾸미기 모드 */}
                  {avatarMode === 'custom' && (
                    <div>
                      {/* 미리보기 */}
                      <div className="flex justify-center mb-4">
                        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-100 to-cyan-100 border-2 border-sky-200/60 overflow-hidden shadow-lg shadow-sky-200/30 p-1">
                          <img src={customAvatarUrl} alt="내 아바타" className="w-full h-full object-cover rounded-2xl bg-white" />
                        </div>
                      </div>

                      {/* 카테고리 선택 */}
                      <div className="flex gap-1 flex-wrap mb-3">
                        {Object.entries(AVATAR_PARTS).map(([key, { label }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveCategory(key)}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                              activeCategory === key
                                ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-sm shadow-sky-200/50'
                                : 'bg-sky-50 text-slate-600 hover:bg-sky-100 border border-sky-100'
                            }`}
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* 옵션 그리드 */}
                      <div className="max-h-36 overflow-y-auto p-3 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100/60">
                        {AVATAR_PARTS[activeCategory].type === 'color' ? (
                          <div className="flex gap-2.5 flex-wrap justify-center">
                            {AVATAR_PARTS[activeCategory].options.map(({ value, color }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => updateCustomPart(activeCategory, value)}
                                className={`w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                                  customParts[activeCategory] === value
                                    ? 'border-sky-400 ring-2 ring-sky-200 scale-110'
                                    : 'border-slate-200 hover:border-sky-300'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {AVATAR_PARTS[activeCategory].options.map(({ value, label }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => updateCustomPart(activeCategory, value)}
                                className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                                  customParts[activeCategory] === value
                                    ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
                                }`}
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 선택 완료 메시지 */}
                  {formData.profileImg && (
                    <p
                      className="text-sky-500 text-xs mt-3 flex items-center gap-1.5 font-medium bg-sky-50 px-3 py-2 rounded-xl"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> 아바타가 선택되었습니다
                    </p>
                  )}
                </div>

                {/* 성별, 연령대 */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200/60 mb-3">
                    <User className="w-3.5 h-3.5 text-sky-500" />
                    <span
                      className="text-xs font-bold text-sky-600 tracking-wide"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      INFO
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-sm font-semibold text-slate-600 mb-2"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        성별
                      </label>
                      <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                        <SelectTrigger
                          className={`h-12 bg-white border-sky-100 rounded-xl hover:border-sky-300 transition-colors ${errors.gender ? 'border-red-400' : ''}`}
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male" style={{ fontFamily: "'Pretendard', sans-serif" }}>남성</SelectItem>
                          <SelectItem value="female" style={{ fontFamily: "'Pretendard', sans-serif" }}>여성</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.gender}</p>}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-slate-600 mb-2"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        연령대
                      </label>
                      <Select value={formData.age_group} onValueChange={(value) => handleChange('age_group', value)}>
                        <SelectTrigger
                          className={`h-12 bg-white border-sky-100 rounded-xl hover:border-sky-300 transition-colors ${errors.age_group ? 'border-red-400' : ''}`}
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20s" style={{ fontFamily: "'Pretendard', sans-serif" }}>20대</SelectItem>
                          <SelectItem value="30s" style={{ fontFamily: "'Pretendard', sans-serif" }}>30대</SelectItem>
                          <SelectItem value="40s" style={{ fontFamily: "'Pretendard', sans-serif" }}>40대</SelectItem>
                          <SelectItem value="50s" style={{ fontFamily: "'Pretendard', sans-serif" }}>50대</SelectItem>
                          <SelectItem value="60s+" style={{ fontFamily: "'Pretendard', sans-serif" }}>60대 이상</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.age_group && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.age_group}</p>}
                    </div>
                  </div>

                  {/* 생년월일 */}
                  <div className="mt-3">
                    <label
                      className="block text-sm font-semibold text-slate-600 mb-2"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      생년월일 <span className="text-sky-500 text-xs font-medium">(만 14세 이상만 가입 가능)</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className={`h-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.birthDate ? 'border-red-400' : ''}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                    {errors.birthDate && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.birthDate}</p>}
                  </div>
                </div>
              </div>

              {/* 오른쪽: 입력 폼 */}
              <div className="flex-1 space-y-5">
                {/* 기본 정보 섹션 뱃지 */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200/60">
                  <UserPlus className="w-3.5 h-3.5 text-sky-500" />
                  <span
                    className="text-xs font-bold text-sky-600 tracking-wide"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    ACCOUNT
                  </span>
                </div>

                {/* 이름 + 닉네임 가로 배치 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-600 mb-2"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      이름
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                      <Input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`h-12 pl-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.name ? 'border-red-400' : ''}`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-600 mb-2"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      닉네임
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                      <Input
                        type="text"
                        placeholder="2~10자 한글/영문"
                        value={formData.nickname}
                        onChange={(e) => handleChange('nickname', e.target.value)}
                        maxLength={10}
                        className={`h-12 pl-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.nickname ? 'border-red-400' : ''}`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      />
                    </div>
                    {errors.nickname && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.nickname}</p>}
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label
                    className="block text-sm font-semibold text-slate-600 mb-2"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    이메일 (아이디)
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      autoComplete="off"
                      className={`h-12 pl-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.email ? 'border-red-400' : ''}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.email}</p>}
                </div>

                {/* 비밀번호 + 비밀번호 확인 가로 배치 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-600 mb-2"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      비밀번호
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="특수문자 포함 8~20자"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        maxLength={20}
                        autoComplete="new-password"
                        className={`h-12 pl-12 pr-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.password ? 'border-red-400' : ''}`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-sky-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.password}</p>}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-slate-600 mb-2"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      비밀번호 확인
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호 재입력"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        autoComplete="new-password"
                        className={`h-12 pl-12 pr-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.confirmPassword ? 'border-red-400' : ''}`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-sky-400 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* 이메일 인증 */}
                <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl p-5 border border-sky-100/60">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-sky-200/60 mb-3">
                    <Mail className="w-3.5 h-3.5 text-sky-500" />
                    <span
                      className="text-xs font-bold text-sky-600 tracking-wide"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      이메일 인증
                    </span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={formData.email}
                      disabled
                      className="h-12 bg-white border-sky-100 rounded-xl text-slate-500 text-sm"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                    <Button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={!formData.email || isVerified || isSending}
                      className={`h-12 px-6 rounded-xl whitespace-nowrap font-semibold text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isVerified ? 'bg-green-500 hover:bg-green-600 shadow-green-200/50' : 'bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 shadow-sky-200/50'}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          인증완료
                        </>
                      ) : isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          발송중
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          {isCodeSent ? '재발송' : '인증요청'}
                        </>
                      )}
                    </Button>
                  </div>

                  {isCodeSent && !isVerified && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="인증 코드 입력"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className={`h-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm ${errors.verificationCode ? 'border-red-400' : ''}`}
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        />
                        {timer > 0 && (
                          <span
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-red-500 font-semibold tabular-nums"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                          >
                            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifying || !verificationCode}
                        className="h-12 px-6 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 rounded-xl whitespace-nowrap font-semibold text-sm shadow-md shadow-sky-200/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            확인중
                          </>
                        ) : (
                          '확인'
                        )}
                      </Button>
                    </div>
                  )}

                  {errors.verificationCode && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.verificationCode}</p>}
                  {isVerified && (
                    <p
                      className="text-green-600 text-xs mt-2 flex items-center gap-1.5 font-medium bg-green-50 px-3 py-2 rounded-xl"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> 이메일 인증이 완료되었습니다
                    </p>
                  )}
                </div>

                {/* 약관 동의 */}
                <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl p-4 border border-sky-100/60">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-sky-200/60 mb-3">
                    <Shield className="w-3.5 h-3.5 text-sky-500" />
                    <span
                      className="text-xs font-bold text-sky-600 tracking-wide"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      약관 동의
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-2.5">
                        <Checkbox
                          id="terms"
                          checked={agreements.terms}
                          onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, terms: checked }))}
                          className={`border-sky-200 mt-0.5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 ${errors.terms ? 'border-red-400' : ''}`}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-slate-600 cursor-pointer leading-relaxed"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          <span className="text-sky-500 font-semibold">(필수)</span> 이용약관
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTermsModal({ open: true, type: 'terms' })}
                        className="flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors hover:underline"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        <FileText className="w-3 h-3" />
                        보기
                      </button>
                    </div>
                    {errors.terms && <p className="text-red-500 text-xs ml-6" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.terms}</p>}

                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-2.5">
                        <Checkbox
                          id="privacy"
                          checked={agreements.privacy}
                          onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, privacy: checked }))}
                          className={`border-sky-200 mt-0.5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 ${errors.privacy ? 'border-red-400' : ''}`}
                        />
                        <label
                          htmlFor="privacy"
                          className="text-sm text-slate-600 cursor-pointer leading-relaxed"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          <span className="text-sky-500 font-semibold">(필수)</span> 개인정보 처리방침
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTermsModal({ open: true, type: 'privacy' })}
                        className="flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors hover:underline"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        <FileText className="w-3 h-3" />
                        보기
                      </button>
                    </div>
                    {errors.privacy && <p className="text-red-500 text-xs ml-6" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.privacy}</p>}
                  </div>
                </div>
              </div>

            </div>

            {/* 회원가입 버튼 */}
            <div className="mt-10 pt-8 border-t border-sky-100/60">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400 hover:from-sky-500 hover:via-cyan-500 hover:to-sky-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-[1.01] transition-all duration-300 disabled:opacity-70"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    가입 처리중...
                  </>
                ) : (
                  '회원가입 완료'
                )}
              </Button>
            </div>
          </form>

          {/* 로그인 링크 */}
          <div className="text-center pb-8 px-10">
            <p
              className="text-sm text-slate-500"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sky-500 hover:text-sky-600 font-bold transition-colors"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                로그인
              </button>
            </p>
          </div>
        </div>

        {/* 하단 브랜드 텍스트 */}
        <div className="text-center mt-6">
          <p
            className="text-xs text-slate-400"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            HONDI - 혼자여서 더 자유로운 제주 여행
          </p>
        </div>
      </div>

      {/* 약관 모달 */}
      {termsModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setTermsModal({ open: false, type: null })}
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* 모달 카드 */}
          <div
            className="relative bg-white rounded-3xl shadow-2xl shadow-sky-900/20 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-sky-50 px-8 py-5 border-b border-sky-100/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-200/50">
                  {termsModal.type === 'terms' ? (
                    <FileText className="w-4.5 h-4.5 text-white" />
                  ) : (
                    <Shield className="w-4.5 h-4.5 text-white" />
                  )}
                </div>
                <h2
                  className="text-lg font-bold text-slate-800"
                  style={{ fontFamily: "'GmarketSans', sans-serif" }}
                >
                  {TERMS_CONTENT[termsModal.type]?.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setTermsModal({ open: false, type: null })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <pre
                className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                {TERMS_CONTENT[termsModal.type]?.content}
              </pre>
            </div>

            {/* 모달 하단 */}
            <div className="px-8 py-4 border-t border-sky-100/60 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 flex items-center justify-between shrink-0">
              <p
                className="text-xs text-slate-400"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                끝까지 읽어주셔서 감사합니다
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    if (termsModal.type === 'terms') {
                      setAgreements(prev => ({ ...prev, terms: true }));
                    } else {
                      setAgreements(prev => ({ ...prev, privacy: true }));
                    }
                    setTermsModal({ open: false, type: null });
                  }}
                  className="h-10 px-5 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-200/50 transition-all duration-300 hover:shadow-lg"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  동의하고 닫기
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTermsModal({ open: false, type: null })}
                  className="h-10 px-5 border-sky-200 text-slate-500 hover:bg-sky-50 font-semibold text-sm rounded-xl transition-all duration-300"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
