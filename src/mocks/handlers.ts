import { delay, http, HttpResponse } from 'msw';
import type {
  GetRoomMembersResponse,
  GetRoomsResponse,
  RoomDetailResponse,
  RoomListItemResponse,
} from '@/entities/room';
import type { GetCommentsResponse, CommentListItemResponse } from '@/entities/comment/model/types';
import type {
  GetPostsResponse,
  PostDetailResponse,
  PostListItemResponse,
} from '@/entities/post/model/types';
import type {
  DeleteMyUserResponse,
  Gender,
  GetMyProfileResponse,
  GetMyUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UpdateMyUserRequest,
} from '@/entities/user';
import type { GetFriendRequestsResponse, GetFriendsResponse } from '@/entities/friend';

const currentUserId = 1;
const MOCK_ACCESS_TOKEN = 'mock-access-token-12345';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-67890';
let isAccountDeleted = false;

let currentUser: GetMyUserResponse = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  nickname: '점심대장',
  profileImageUrl: '',
  mbti: 'ENFP',
  introduce: '오늘도 같이 먹을 사람을 찾고 있어요.',
  birthDate: '2000-05-15',
  gender: 'ANY',
  createdAt: '2025-03-01T09:00:00.000Z',
};

let profile: GetMyProfileResponse = {
  name: currentUser.name,
  nickname: currentUser.nickname,
  introduce: currentUser.introduce,
  mbti: currentUser.mbti || 'ENFP',
  profileImageUrl: currentUser.profileImageUrl,
};

const mockUsers: GetMyUserResponse[] = [
  currentUser,
  {
    id: 2,
    name: '김대건',
    email: 'daegeon@example.com',
    nickname: '든든한밥친구',
    profileImageUrl: '',
    mbti: 'ISTJ',
    introduce: '학생회관 맛집 위주로 다녀요.',
    birthDate: '1999-11-20',
    gender: 'MALE',
    createdAt: '2025-03-10T09:00:00.000Z',
  },
  {
    id: 3,
    name: '이수진',
    email: 'sujin@example.com',
    nickname: '도서관러',
    profileImageUrl: '',
    mbti: 'INTP',
    introduce: '조용한 점심 좋아해요.',
    birthDate: '2001-08-02',
    gender: 'FEMALE',
    createdAt: '2025-03-12T09:00:00.000Z',
  },
  {
    id: 4,
    name: '박민호',
    email: 'minho@example.com',
    nickname: '제육파',
    profileImageUrl: '',
    mbti: 'ESTP',
    introduce: '매운 음식 환영!',
    birthDate: '1998-01-09',
    gender: 'MALE',
    createdAt: '2025-03-20T09:00:00.000Z',
  },
];

const memberMetaByUserId: Record<
  number,
  {
    nickname: string;
    mbti: string;
    profileImageUrl: string;
    schoolName: string;
    age: number;
  }
> = {
  1: {
    nickname: '점심대장',
    mbti: 'ENFP',
    profileImageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 컴퓨터공학과',
    age: 25,
  },
  2: {
    nickname: '든든한밥친구',
    mbti: 'ISTJ',
    profileImageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 경영학과',
    age: 26,
  },
  3: {
    nickname: '도서관러',
    mbti: 'INTP',
    profileImageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 국어국문학과',
    age: 24,
  },
  4: {
    nickname: '파스타좋아',
    mbti: 'ESFP',
    profileImageUrl:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 시각디자인학과',
    age: 23,
  },
  5: {
    nickname: '새내기',
    mbti: 'ISFJ',
    profileImageUrl:
      'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 생명과학과',
    age: 20,
  },
  6: {
    nickname: '소스추가',
    mbti: 'ENTJ',
    profileImageUrl:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 화학과',
    age: 22,
  },
  7: {
    nickname: '공대생',
    mbti: 'ISTP',
    profileImageUrl:
      'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 기계공학과',
    age: 27,
  },
  8: {
    nickname: '제육파',
    mbti: 'ESTP',
    profileImageUrl:
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=300&q=80',
    schoolName: '한국대학교 전자공학과',
    age: 28,
  },
};

let friendIds = [2];
let friendRequests = [
  {
    id: 1,
    fromUserId: 3,
    toUserId: 1,
    senderNickname: '도서관러',
    receiverNickname: '점심대장',
    message: '도서관 근처에서 자주 점심 드시면 친구해요.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    direction: 'INCOMING' as const,
    status: 'PENDING' as const,
  },
  {
    id: 2,
    fromUserId: 1,
    toUserId: 4,
    senderNickname: '점심대장',
    receiverNickname: '제육파',
    message: '다음에 제육 같이 먹어요.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    direction: 'OUTGOING' as const,
    status: 'PENDING' as const,
  },
];

let rooms: RoomDetailResponse[] = [
  {
    id: 1,
    hostUserId: 1,
    title: '학생회관 김치찌개 같이 먹어요',
    roomType: 'ANY',
    maxMembersCount: 4,
    minAge: 20,
    maxAge: 27,
    place: '학생회관 2층',
    lunchAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'OPEN',
    description: '수업 끝나고 바로 가볍게 점심 먹을 사람 구해요.',
    currentMembersCount: 2,
  },
  {
    id: 2,
    hostUserId: 2,
    title: '도서관 앞 돈까스',
    roomType: 'ANY',
    maxMembersCount: 3,
    minAge: 21,
    maxAge: 29,
    place: '정문 돈까스집',
    lunchAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    status: 'OPEN',
    description: '조용히 밥 먹고 다시 공부하러 갈 예정입니다.',
    currentMembersCount: 1,
  },
  {
    id: 3,
    hostUserId: 3,
    title: '여학생 파스타 모임',
    roomType: 'FEMALE',
    maxMembersCount: 4,
    minAge: 20,
    maxAge: 25,
    place: '후문 파스타집',
    lunchAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'OPEN',
    description: '처음 보는 사람도 편하게 오세요.',
    currentMembersCount: 3,
  },
  {
    id: 4,
    hostUserId: 4,
    title: '남학생 제육 정식',
    roomType: 'MALE',
    maxMembersCount: 2,
    minAge: 22,
    maxAge: 30,
    place: '공대 식당',
    lunchAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    status: 'FULL',
    description: '빠르게 먹고 팀플하러 갑니다.',
    currentMembersCount: 2,
  },
];

const membersByRoomId: Record<number, GetRoomMembersResponse['items']> = {
  1: [toRoomMember(1), toRoomMember(2)],
  2: [toRoomMember(3)],
  3: [toRoomMember(4), toRoomMember(5), toRoomMember(6)],
  4: [toRoomMember(7), toRoomMember(8)],
};

let posts: PostDetailResponse[] = [
  {
    id: 1,
    userId: 2,
    categoryId: 1,
    category: 'FREE',
    title: '오늘 학식 메뉴 꽤 괜찮네요',
    content: '김치찌개랑 계란말이가 나왔는데 생각보다 든든했어요. 점심 고민 중이면 추천합니다.',
    likeCount: 12,
    dislikeCount: 1,
    commentCount: 2,
    liked: false,
    disliked: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userId: 3,
    categoryId: 2,
    category: 'REVIEW',
    title: '후문 쌀국수집 후기',
    content: '양이 많고 국물이 진해요. 점심 피크 시간에는 10분 정도 기다렸습니다.',
    likeCount: 8,
    dislikeCount: 0,
    commentCount: 1,
    liked: false,
    disliked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

let comments: CommentListItemResponse[] = [
  {
    id: 1,
    postId: 1,
    userId: 1,
    content: '오 좋네요. 오늘은 학식 가야겠어요.',
    likeCount: 3,
    dislikeCount: 0,
    liked: false,
    disliked: false,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    nickname: '점심대장',
    isMine: true,
  },
  {
    id: 2,
    postId: 1,
    userId: 4,
    content: '계란말이 인정합니다.',
    likeCount: 1,
    dislikeCount: 0,
    liked: false,
    disliked: false,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    nickname: '든든한밥친구',
  },
  {
    id: 3,
    postId: 2,
    userId: 5,
    content: '고수 빼달라고 할 수 있나요?',
    likeCount: 0,
    dislikeCount: 0,
    liked: false,
    disliked: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    nickname: '쌀국수입문',
  },
];

const wait = () => delay(250);

const isAuthorized = (request: Request) =>
  request.headers.get('Authorization') === `Bearer ${MOCK_ACCESS_TOKEN}` && !isAccountDeleted;

const unauthorizedResponse = () =>
  HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

const findUserById = (userId: number) => mockUsers.find((user) => user.id === userId);

function toRoomMember(userId: number): GetRoomMembersResponse['items'][number] {
  const memberMeta = memberMetaByUserId[userId];

  return {
    userId,
    nickname: memberMeta?.nickname ?? `사용자${userId}`,
    mbti: memberMeta?.mbti ?? '미설정',
    profileImageUrl: memberMeta?.profileImageUrl ?? '',
    schoolName: memberMeta?.schoolName ?? '학교 정보 미등록',
    age: memberMeta?.age ?? 0,
  };
}

const syncCurrentUserProfile = () => {
  currentUser = {
    ...currentUser,
    name: profile.name,
    nickname: profile.nickname,
    profileImageUrl: profile.profileImageUrl,
    introduce: profile.introduce,
    mbti: profile.mbti,
  };

  const userIndex = mockUsers.findIndex((user) => user.id === currentUser.id);
  if (userIndex >= 0) {
    mockUsers[userIndex] = currentUser;
  }

  memberMetaByUserId[currentUser.id] = {
    ...memberMetaByUserId[currentUser.id],
    nickname: profile.nickname,
    mbti: profile.mbti,
    profileImageUrl: profile.profileImageUrl,
  };
};

const toRoomListItem = (room: RoomDetailResponse): RoomListItemResponse => ({
  id: room.id,
  title: room.title,
  roomType: room.roomType,
  maxMembersCount: room.maxMembersCount,
  minAge: room.minAge,
  maxAge: room.maxAge,
  place: room.place,
  lunchAt: room.lunchAt,
  currentCount: room.currentMembersCount,
});

const getRoom = (roomId: number) => rooms.find((room) => room.id === roomId);

const toPostListItem = (post: PostDetailResponse): PostListItemResponse => ({
  id: post.id,
  categoryId: post.categoryId,
  category: post.category,
  title: post.title,
  summary: post.content,
  content: post.content,
  likeCount: post.likeCount,
  dislikeCount: post.dislikeCount,
  commentCount: comments.filter((comment) => comment.postId === post.id).length,
  createdAt: post.createdAt,
  authorNickname: post.userId === currentUserId ? profile.nickname : '점심친구',
});

export const handlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    await wait();
    if (isAccountDeleted) {
      return HttpResponse.json({ message: '탈퇴한 계정입니다.' }, { status: 410 });
    }

    const payload = (await request.json()) as LoginRequest;

    if (!payload.email?.trim() || !payload.password?.trim()) {
      return HttpResponse.json({ message: '이메일 또는 비밀번호가 필요합니다.' }, { status: 401 });
    }

    return HttpResponse.json<LoginResponse>({
      user: currentUser,
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
  }),

  http.post('/api/v1/auth/logout', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    return HttpResponse.json<LogoutResponse>({
      message: '로그아웃되었습니다.',
    });
  }),

  http.get('/api/v1/users/me', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    return HttpResponse.json<GetMyUserResponse>(currentUser);
  }),

  http.patch('/api/v1/users/me', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    const payload = (await request.json()) as Partial<UpdateMyUserRequest>;
    currentUser = {
      ...currentUser,
      name: payload.name ?? currentUser.name,
      email: payload.email ?? currentUser.email,
      birthDate: payload.birthDate ?? currentUser.birthDate,
      gender: (payload.gender as Gender | undefined) ?? currentUser.gender,
    };
    profile.name = currentUser.name;
    syncCurrentUserProfile();

    return HttpResponse.json<GetMyUserResponse>(currentUser);
  }),

  http.delete('/api/v1/users/me', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    isAccountDeleted = true;
    friendIds = [];
    friendRequests = [];

    return HttpResponse.json<DeleteMyUserResponse>({
      message: '회원탈퇴가 완료되었습니다.',
    });
  }),

  http.get('/api/v1/users/me/profile', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    return HttpResponse.json(profile);
  }),

  http.patch('/api/v1/users/me/profile', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    const payload = (await request.json()) as Partial<GetMyProfileResponse>;
    profile = { ...profile, ...payload };
    syncCurrentUserProfile();
    return HttpResponse.json(profile);
  }),

  http.get('/api/v1/friends', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    const items = friendIds
      .map((friendId) => findUserById(friendId))
      .filter((friend): friend is GetMyUserResponse => Boolean(friend))
      .map((friend) => ({
        id: friend.id,
        name: friend.name,
        nickname: friend.nickname,
        mbti: friend.mbti,
        introduce: friend.introduce,
        profileImageUrl: friend.profileImageUrl,
      }));

    return HttpResponse.json<GetFriendsResponse>({ items });
  }),

  http.get('/api/v1/friends/requests', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    return HttpResponse.json<GetFriendRequestsResponse>({
      items: friendRequests,
    });
  }),

  http.post('/api/v1/friends/requests', async ({ request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    const payload = (await request.json()) as { target?: string; message?: string };
    const target = payload.target?.trim().toLowerCase();
    const targetUser = mockUsers.find(
      (user) =>
        user.id !== currentUserId &&
        (user.nickname.toLowerCase() === target || user.email.toLowerCase() === target),
    );

    if (!targetUser) {
      return HttpResponse.json({ message: '대상 사용자를 찾을 수 없어요.' }, { status: 404 });
    }

    const duplicated = friendRequests.some((item) => item.toUserId === targetUser.id);
    if (duplicated || friendIds.includes(targetUser.id)) {
      return HttpResponse.json({ message: '이미 친구 또는 신청된 사용자예요.' }, { status: 409 });
    }

    const nextRequest = {
      id: Math.max(0, ...friendRequests.map((item) => item.id)) + 1,
      fromUserId: currentUserId,
      toUserId: targetUser.id,
      senderNickname: profile.nickname,
      receiverNickname: targetUser.nickname,
      message: payload.message?.trim() ?? '',
      createdAt: new Date().toISOString(),
      direction: 'OUTGOING' as const,
      status: 'PENDING' as const,
    };

    friendRequests = [nextRequest, ...friendRequests];
    return HttpResponse.json(nextRequest, { status: 201 });
  }),

  http.patch('/api/v1/friends/requests/:requestId', async ({ params, request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    const requestId = Number(params.requestId);
    const payload = (await request.json()) as { accepted?: boolean };
    const targetRequest = friendRequests.find((item) => item.id === requestId);

    if (!targetRequest) {
      return HttpResponse.json({ message: '친구 신청을 찾을 수 없어요.' }, { status: 404 });
    }

    if (payload.accepted) {
      friendIds = Array.from(new Set([...friendIds, targetRequest.fromUserId]));
    }

    friendRequests = friendRequests.filter((item) => item.id !== requestId);

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('/api/v1/friends/requests/:requestId', async ({ params, request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    friendRequests = friendRequests.filter((item) => item.id !== Number(params.requestId));

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('/api/v1/friends/:friendId', async ({ params, request }) => {
    await wait();
    if (!isAuthorized(request)) {
      return unauthorizedResponse();
    }

    friendIds = friendIds.filter((friendId) => friendId !== Number(params.friendId));

    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/v1/rooms', async ({ request }) => {
    await wait();
    const url = new URL(request.url);
    const roomType = url.searchParams.get('roomType');
    const status = url.searchParams.get('status');
    const minAge = Number(url.searchParams.get('minAge') ?? NaN);
    const maxAge = Number(url.searchParams.get('maxAge') ?? NaN);
    const size = Number(url.searchParams.get('size') ?? 10);
    const cursor = Number(url.searchParams.get('cursor') ?? 0);

    const filteredRooms = rooms.filter((room) => {
      if (roomType && room.roomType !== roomType) return false;
      if (status && room.status !== status) return false;
      if (Number.isFinite(minAge) && room.maxAge < minAge) return false;
      if (Number.isFinite(maxAge) && room.minAge > maxAge) return false;
      return true;
    });
    const pageItems = filteredRooms.slice(cursor, cursor + size);
    const nextCursor = cursor + size < filteredRooms.length ? String(cursor + size) : null;

    return HttpResponse.json<GetRoomsResponse>({
      items: pageItems.map(toRoomListItem),
      nextCursor,
    });
  }),

  http.post('/api/v1/rooms', async ({ request }) => {
    await wait();
    const payload = (await request.json()) as Partial<RoomDetailResponse>;
    const nextRoom: RoomDetailResponse = {
      id: Math.max(0, ...rooms.map((room) => room.id)) + 1,
      hostUserId: currentUserId,
      title: payload.title ?? '새 점심 방',
      roomType: payload.roomType ?? 'ANY',
      maxMembersCount: payload.maxMembersCount ?? 4,
      minAge: payload.minAge ?? 20,
      maxAge: payload.maxAge ?? 29,
      place: payload.place ?? '학생회관',
      lunchAt: payload.lunchAt ?? new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'OPEN',
      description: payload.description ?? '',
      currentMembersCount: 1,
    };

    rooms = [nextRoom, ...rooms];
    membersByRoomId[nextRoom.id] = [toRoomMember(currentUserId)];

    return HttpResponse.json(nextRoom, { status: 201 });
  }),

  http.get('/api/v1/rooms/:roomId/members', async ({ params }) => {
    await wait();
    const roomId = Number(params.roomId);
    return HttpResponse.json<GetRoomMembersResponse>({
      items: membersByRoomId[roomId] ?? [],
    });
  }),

  http.post('/api/v1/rooms/:roomId/join', async ({ params }) => {
    await wait();
    const roomId = Number(params.roomId);
    const room = getRoom(roomId);
    if (!room) return HttpResponse.json({ message: '방을 찾을 수 없어요.' }, { status: 404 });

    membersByRoomId[roomId] = [
      ...(membersByRoomId[roomId] ?? []),
      toRoomMember(currentUserId),
    ];
    room.currentMembersCount = Math.min(room.maxMembersCount, room.currentMembersCount + 1);
    room.status = room.currentMembersCount >= room.maxMembersCount ? 'FULL' : 'OPEN';

    return HttpResponse.json({
      roomId,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    });
  }),

  http.post('/api/v1/rooms/:roomId/leave', async ({ params }) => {
    await wait();
    const roomId = Number(params.roomId);
    const room = getRoom(roomId);
    if (room) {
      room.currentMembersCount = Math.max(1, room.currentMembersCount - 1);
      room.status = 'OPEN';
    }
    membersByRoomId[roomId] = (membersByRoomId[roomId] ?? []).filter(
      (member) => member.userId !== currentUserId,
    );
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/v1/rooms/:roomId', async ({ params }) => {
    await wait();
    const room = getRoom(Number(params.roomId));
    return room
      ? HttpResponse.json(room)
      : HttpResponse.json({ message: '방을 찾을 수 없어요.' }, { status: 404 });
  }),

  http.patch('/api/v1/rooms/:roomId', async ({ params, request }) => {
    await wait();
    const roomId = Number(params.roomId);
    const payload = (await request.json()) as Partial<RoomDetailResponse>;
    rooms = rooms.map((room) => (room.id === roomId ? { ...room, ...payload } : room));
    return HttpResponse.json(getRoom(roomId));
  }),

  http.delete('/api/v1/rooms/:roomId', async ({ params }) => {
    await wait();
    const roomId = Number(params.roomId);
    rooms = rooms.filter((room) => room.id !== roomId);
    delete membersByRoomId[roomId];
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/v1/posts', async ({ request }) => {
    await wait();
    const url = new URL(request.url);
    const categoryId = Number(url.searchParams.get('categoryId') ?? NaN);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 10);
    const filteredPosts = Number.isFinite(categoryId)
      ? posts.filter((post) => post.categoryId === categoryId)
      : posts;
    const start = (page - 1) * size;
    const pageItems = filteredPosts.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / size));

    return HttpResponse.json<GetPostsResponse>({
      items: pageItems.map(toPostListItem),
      pagination: {
        page,
        size,
        totalCount: filteredPosts.length,
        totalPages,
        hasNext: page < totalPages,
      },
    });
  }),

  http.post('/api/v1/posts', async ({ request }) => {
    await wait();
    const payload = (await request.json()) as Partial<PostDetailResponse>;
    const post: PostDetailResponse = {
      id: Math.max(0, ...posts.map((item) => item.id)) + 1,
      userId: currentUserId,
      categoryId: payload.categoryId ?? 1,
      title: payload.title ?? '새 게시글',
      content: payload.content ?? '',
      likeCount: 0,
      dislikeCount: 0,
      commentCount: 0,
      liked: false,
      disliked: false,
      createdAt: new Date().toISOString(),
    };
    posts = [post, ...posts];
    return HttpResponse.json(post, { status: 201 });
  }),

  http.get('/api/v1/posts/:postId/comments', async ({ params }) => {
    await wait();
    const postId = Number(params.postId);
    const items = comments.filter((comment) => comment.postId === postId);
    return HttpResponse.json<GetCommentsResponse>({
      items,
      pagination: {
        page: 1,
        size: items.length,
        totalCount: items.length,
        totalPages: 1,
        hasNext: false,
      },
    });
  }),

  http.post('/api/v1/posts/:postId/comments', async ({ params, request }) => {
    await wait();
    const postId = Number(params.postId);
    const payload = (await request.json()) as { content?: string };
    const comment: CommentListItemResponse = {
      id: Math.max(0, ...comments.map((item) => item.id)) + 1,
      postId,
      userId: currentUserId,
      content: payload.content ?? '',
      likeCount: 0,
      dislikeCount: 0,
      liked: false,
      disliked: false,
      createdAt: new Date().toISOString(),
      nickname: profile.nickname,
      isMine: true,
    };
    comments = [comment, ...comments];
    return HttpResponse.json(comment, { status: 201 });
  }),

  http.get('/api/v1/posts/:postId', async ({ params }) => {
    await wait();
    const post = posts.find((item) => item.id === Number(params.postId));
    return post
      ? HttpResponse.json(post)
      : HttpResponse.json({ message: '게시글을 찾을 수 없어요.' }, { status: 404 });
  }),

  http.patch('/api/v1/posts/:postId', async ({ params, request }) => {
    await wait();
    const postId = Number(params.postId);
    const payload = (await request.json()) as Partial<PostDetailResponse>;
    posts = posts.map((post) => (post.id === postId ? { ...post, ...payload } : post));
    return HttpResponse.json(posts.find((post) => post.id === postId));
  }),

  http.delete('/api/v1/posts/:postId', async ({ params }) => {
    await wait();
    const postId = Number(params.postId);
    posts = posts.filter((post) => post.id !== postId);
    comments = comments.filter((comment) => comment.postId !== postId);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/v1/posts/:postId/like', async ({ params }) => {
    await wait();
    const post = posts.find((item) => item.id === Number(params.postId));
    if (!post) return HttpResponse.json({ message: '게시글을 찾을 수 없어요.' }, { status: 404 });
    post.liked = !post.liked;
    post.likeCount = Math.max(0, (post.likeCount ?? 0) + (post.liked ? 1 : -1));
    return HttpResponse.json({ liked: post.liked, likeCount: post.likeCount });
  }),

  http.post('/api/v1/posts/:postId/dislike', async ({ params }) => {
    await wait();
    const post = posts.find((item) => item.id === Number(params.postId));
    if (!post) return HttpResponse.json({ message: '게시글을 찾을 수 없어요.' }, { status: 404 });
    post.disliked = !post.disliked;
    post.dislikeCount = Math.max(0, (post.dislikeCount ?? 0) + (post.disliked ? 1 : -1));
    return HttpResponse.json({ disliked: post.disliked, dislikeCount: post.dislikeCount });
  }),

  http.patch('/api/v1/posts/:postId/comments/:commentId', async ({ params, request }) => {
    await wait();
    const commentId = Number(params.commentId);
    const payload = (await request.json()) as { content?: string };
    comments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, content: payload.content ?? comment.content }
        : comment,
    );
    return HttpResponse.json(comments.find((comment) => comment.id === commentId));
  }),

  http.delete('/api/v1/posts/:postId/comments/:commentId', async ({ params }) => {
    await wait();
    comments = comments.filter((comment) => comment.id !== Number(params.commentId));
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/v1/posts/:postId/comments/:commentId/like', async ({ params }) => {
    await wait();
    const comment = comments.find((item) => item.id === Number(params.commentId));
    if (!comment) return HttpResponse.json({ message: '댓글을 찾을 수 없어요.' }, { status: 404 });
    comment.liked = !comment.liked;
    comment.likeCount = Math.max(0, (comment.likeCount ?? 0) + (comment.liked ? 1 : -1));
    return HttpResponse.json({ liked: comment.liked, likeCount: comment.likeCount });
  }),

  http.post('/api/v1/posts/:postId/comments/:commentId/dislike', async ({ params }) => {
    await wait();
    const comment = comments.find((item) => item.id === Number(params.commentId));
    if (!comment) return HttpResponse.json({ message: '댓글을 찾을 수 없어요.' }, { status: 404 });
    comment.disliked = !comment.disliked;
    comment.dislikeCount = Math.max(0, (comment.dislikeCount ?? 0) + (comment.disliked ? 1 : -1));
    return HttpResponse.json({ disliked: comment.disliked, dislikeCount: comment.dislikeCount });
  }),
];
