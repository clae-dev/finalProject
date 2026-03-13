// ─── API 공통 응답 ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// ─── 회원 ─────────────────────────────────────────────────────────────────────
export interface Member {
  memberNo: number;
  memberEmail: string;
  memberNickname: string;
  memberName: string;
  memberProfileImg: string | null;
  memberRole: 'U' | 'A';
  memberPhone: string;
  memberIntro: string;
  verifiedReviewer: 'Y' | 'N';
  loginType: 'kakao' | 'naver' | 'google' | null;
  memberStatus?: string;
  createdAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  memberNo: number;
  memberName: string;
  memberNickname: string;
  memberEmail: string;
  memberProfileImg: string | null;
  memberRole: 'U' | 'A';
  memberPhone: string;
  memberIntro: string;
  verifiedReviewer: 'Y' | 'N';
  loginType?: 'kakao' | 'naver' | 'google' | null;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  memberNo?: number;
  memberName?: string;
  memberNickname?: string;
  memberEmail?: string;
  memberProfileImg?: string | null;
  memberPhone?: string;
  memberIntro?: string;
}

// ─── 숙소 ─────────────────────────────────────────────────────────────────────
export interface Accommodation {
  accommodationNo: number;
  name: string;
  region: string;
  address: string;
  description: string;
  imageUrl: string | null;
  rating: number;
  price: number;
  status: string;
}

export interface AccommodationReview {
  reviewNo: number;
  accommodationNo: number;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  rating: number;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalCount: number;
}

// ─── 동행 ─────────────────────────────────────────────────────────────────────
export interface Companion {
  companionNo: number;
  title: string;
  content: string;
  travelDate: string;
  region: string;
  tag: string;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  currentCount: number;
  maxCount: number;
  status: string;
  imageUrls: string[];
  joinList: CompanionJoin[];
  createdAt: string;
}

export interface CompanionJoin {
  joinNo: number;
  companionNo: number;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  status: 'W' | 'A' | 'R' | 'C';
  createdAt: string;
}

// ─── 자유게시판 ───────────────────────────────────────────────────────────────
export interface FreeBoard {
  boardNo: number;
  title: string;
  content: string;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  likeCount: number;
  commentCount: number;
  imageUrls: string[];
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  commentNo: number;
  boardNo?: number;
  content: string;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  parentCommentNo: number | null;
  children?: Comment[];
  createdAt: string;
}

// ─── 액티비티 게시판 ──────────────────────────────────────────────────────────
export interface Activity {
  boardNo: number;
  title: string;
  content: string;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  likeCount: number;
  commentCount: number;
  imageUrls: string[];
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── 채팅 ─────────────────────────────────────────────────────────────────────
export interface ChattingRoom {
  chattingRoomNo: number;
  targetMember: Member;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

export interface Message {
  messageNo?: number;
  chattingRoomNo: number;
  senderNo: number;
  senderNickname?: string;
  content: string;
  createdAt?: string;
  readFlag?: boolean;
}

// ─── 알림 ─────────────────────────────────────────────────────────────────────
export interface Notification {
  notificationNo: number;
  memberNo: number;
  type: string;
  message: string;
  isRead: boolean;
  targetNo?: number;
  createdAt: string;
}

// ─── 명소 ─────────────────────────────────────────────────────────────────────
export interface Spot {
  spotNo: number;
  name: string;
  category: string;
  description: string;
  address: string;
  imageUrl: string | null;
  status: string;
  orderNo: number;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export interface Faq {
  faqNo: number;
  question: string;
  answer: string;
  category: string;
  viewCount: number;
  createdAt: string;
}

// ─── 문의 ─────────────────────────────────────────────────────────────────────
export interface Inquiry {
  inquiryNo: number;
  title: string;
  content: string;
  memberNo: number;
  memberNickname: string;
  status: 'W' | 'A';
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}

// ─── 신고 ─────────────────────────────────────────────────────────────────────
export interface Report {
  reportNo: number;
  targetType: string;
  targetNo: number;
  reportType: string;
  detailReason: string;
  reporterNo: number;
  reporterNickname: string;
  status: 'W' | 'P' | 'C';
  result: string | null;
  createdAt: string;
}

// ─── 후기 (동행) ──────────────────────────────────────────────────────────────
export interface Review {
  reviewNo: number;
  companionNo: number;
  memberNo: number;
  memberNickname: string;
  memberProfileImg: string | null;
  content: string;
  rating: number;
  imageUrls: string[];
  createdAt: string;
}

// ─── 공지사항 ─────────────────────────────────────────────────────────────────
export interface Notice {
  boardNo: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 날씨 ─────────────────────────────────────────────────────────────────────
export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

// ─── 인증 ─────────────────────────────────────────────────────────────────────
export interface VerificationStatus {
  verificationNo?: number;
  status: 'W' | 'A' | 'R' | null;
  adminComment?: string;
  createdAt?: string;
}

// ─── AI 채팅 ──────────────────────────────────────────────────────────────────
export interface AiChatHistory {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
}

// ─── 대시보드 ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalMembers: number;
  totalCompanions: number;
  totalReviews: number;
  totalReports: number;
  pendingReports: number;
  totalInquiries: number;
}

// ─── TourAPI 공공 데이터 ──────────────────────────────────────────────────────
export interface TourEvent {
  title: string;
  addr1: string;
  eventstartdate: string;
  eventenddate: string;
  firstimage: string | null;
  contentid: string;
}

// ─── 그룹 채팅 ────────────────────────────────────────────────────────────────
export interface GroupMember {
  memberNo: number;
  nickname: string;
  profileImage: string | null;
}

export interface GroupChatRoom {
  groupRoomNo: number;
  companionNo: number;
  roomName: string;
  lastMessage: string | null;
  lastSendTime: string | null;
  unreadCount: number;
  memberCount: number;
  members: GroupMember[];
}

export interface GroupMessage {
  groupMsgNo: number;
  groupRoomNo: number;
  senderNo: number;
  senderNickname: string;
  senderProfile: string | null;
  msgContent: string;
  sendTime: string;
  isGroupMessage: true;
}
