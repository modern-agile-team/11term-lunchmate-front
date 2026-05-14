import axios from 'axios';

export interface UserProfile {
  id: string;
  nickname: string;
  profileImageUrl: string;
  email: string;
}
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>('/api/v1/users/me/profile');

  return response.data;
};
