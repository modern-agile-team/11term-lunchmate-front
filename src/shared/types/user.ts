//유저 관련 모든 타입을 관리하는 파일
export interface User {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
  mbti: string;
  bio: string;
  nickname: string;
}
