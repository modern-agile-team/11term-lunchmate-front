import { Search, UserMinus, Users } from 'lucide-react';
import type { RelationshipStatus, UserSearchResultItem } from '@/entities/friend';
import { useFriendManager } from '../model/useFriendManager';
import FriendAvatar from './FriendAvatar';

const SEARCH_ACTION_LABEL: Record<RelationshipStatus, string> = {
  NONE: '친구 추가',
  PENDING_SENT: '신청됨',
  PENDING_RECEIVED: '받은 신청 있음',
  ACCEPTED: '이미 친구',
  REJECTED: '재신청 불가',
};

const FriendManagerSection = () => {
  const {
    friends,
    receivedRequests,
    sentRequests,
    isLoading,
    isError,
    keyword,
    handleKeywordChange,
    searchResults,
    isSearching,
    feedback,
    feedbackTone,
    isCreatingRequestId,
    handleSendRequest,
    handleAccept,
    handleReject,
    handleCancel,
    handleDeleteFriend,
  } = useFriendManager();

  const renderSearchResult = (result: UserSearchResultItem) => {
    const isSendable = result.relationshipStatus === 'NONE';
    const isSendingThis = isCreatingRequestId === result.id;

    return (
      <div
        key={result.id}
        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3"
      >
        <div className="flex min-w-0 items-center gap-3">
          <FriendAvatar
            nickname={result.nickname}
            profileImageUrl={result.profileImageUrl}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{result.nickname}</p>
            <p className="truncate text-sm text-slate-500">
              {result.schoolInfo || '학교 정보 없음'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleSendRequest(result.id)}
          disabled={!isSendable || isSendingThis}
          className={`h-10 shrink-0 rounded-2xl px-4 text-sm font-semibold transition ${
            isSendable
              ? 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-70'
              : 'border border-slate-200 text-slate-400'
          }`}
        >
          {isSendingThis ? '전송 중...' : SEARCH_ACTION_LABEL[result.relationshipStatus]}
        </button>
      </div>
    );
  };

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-500">친구 관리</p>
          <p className="mt-2 text-sm text-slate-500">
            닉네임 또는 이메일로 검색해서 친구를 추가하고, 신청을 관리할 수 있어요.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Users className="h-4 w-4" />
          친구 {friends.length}명
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">친구 검색</span>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              placeholder="닉네임 또는 이메일을 입력하세요"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-11 text-sm outline-none transition focus:border-indigo-300"
            />
          </div>
        </label>

        {feedback ? (
          <p
            className={`mt-4 text-sm font-medium ${
              feedbackTone === 'success' ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {feedback}
          </p>
        ) : null}

        {keyword.trim() ? (
          <div className="mt-4 space-y-2">
            {isSearching ? (
              <p className="text-sm text-slate-500">검색 중...</p>
            ) : searchResults.length ? (
              searchResults.map(renderSearchResult)
            ) : (
              <p className="text-sm text-slate-500">검색 결과가 없어요.</p>
            )}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-slate-500">친구 정보를 불러오는 중입니다.</p>
      ) : null}
      {isError ? (
        <p className="mt-6 text-sm text-red-500">친구 정보를 불러오지 못했습니다.</p>
      ) : null}

      <div className="mt-8 grid gap-6">
        <div className="rounded-[24px] border border-slate-100 p-5">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">친구 목록</h3>
          <div className="mt-4 space-y-3">
            {friends.length ? (
              friends.map((friend) => (
                <div
                  key={friend.friendshipId}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <FriendAvatar
                        nickname={friend.user.nickname}
                        profileImageUrl={friend.user.profileImageUrl}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{friend.user.nickname}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {friend.user.mbti || 'MBTI 미설정'}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {friend.user.introduce || '한 줄 소개가 아직 없어요.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFriend(friend.friendshipId)}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">아직 친구가 없어요.</p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-100 p-5">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">받은 신청</h3>
          <div className="mt-4 space-y-3">
            {receivedRequests.length ? (
              receivedRequests.map((request) => (
                <div
                  key={request.friendshipId}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <FriendAvatar
                        nickname={request.user.nickname}
                        profileImageUrl={request.user.profileImageUrl}
                        size="sm"
                      />
                      <p className="truncate font-semibold text-slate-900">
                        {request.user.nickname}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(request.friendshipId)}
                        className="h-10 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white"
                      >
                        수락
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(request.friendshipId)}
                        className="h-10 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">받은 친구 신청이 없어요.</p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-100 p-5">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">보낸 신청</h3>
          <div className="mt-4 space-y-3">
            {sentRequests.length ? (
              sentRequests.map((request) => (
                <div
                  key={request.friendshipId}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <FriendAvatar
                        nickname={request.user.nickname}
                        profileImageUrl={request.user.profileImageUrl}
                        size="sm"
                      />
                      <p className="truncate font-semibold text-slate-900">
                        {request.user.nickname}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancel(request.friendshipId)}
                      className="h-10 shrink-0 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                    >
                      신청 취소
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">보낸 친구 신청이 없어요.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FriendManagerSection;
