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
import type { GetMyProfileResponse } from '@/entities/user';

const currentUserId = 1;

let profile: GetMyProfileResponse = {
  name: '홍길동',
  nickname: '점심대장',
  introduce: '오늘도 같이 먹을 사람을 찾고 있어요.',
  mbti: 'ENFP',
  profileImageUrl: '',
};

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
  1: [
    { userId: 1, nickname: '점심대장' },
    { userId: 2, nickname: '든든한밥친구' },
  ],
  2: [{ userId: 3, nickname: '도서관러' }],
  3: [
    { userId: 4, nickname: '파스타좋아' },
    { userId: 5, nickname: '새내기' },
    { userId: 6, nickname: '소스추가' },
  ],
  4: [
    { userId: 7, nickname: '공대생' },
    { userId: 8, nickname: '제육파' },
  ],
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
  http.get('/api/v1/users/me', async () => {
    await wait();
    return HttpResponse.json({ id: currentUserId });
  }),

  http.get('/api/v1/users/me/profile', async () => {
    await wait();
    return HttpResponse.json(profile);
  }),

  http.patch('/api/v1/users/me/profile', async ({ request }) => {
    await wait();
    const payload = (await request.json()) as Partial<GetMyProfileResponse>;
    profile = { ...profile, ...payload };
    return HttpResponse.json(profile);
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
    membersByRoomId[nextRoom.id] = [{ userId: currentUserId, nickname: profile.nickname }];

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
      { userId: currentUserId, nickname: profile.nickname },
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
  http.post('/api/v1/auth/login', async () => {
    return HttpResponse.json(
      {
        user: {
          id: 1,
          name: 'dd',
          nickname: 'dd',
          profileImage: 'https://via.placeholder.com/150',
        },
        accessToken: 'mock-access-token-12345',
        refreshToken: 'mock-refresh-token-67890',
      },
      { status: 200 },
    );
  }),

  http.get('/api/v1/users/me', () => {
    return HttpResponse.json({
      id: 1,
      name: 'dd',
      email: 'example@email.com',
      nickname: 'dd',
    });
  }),
];
