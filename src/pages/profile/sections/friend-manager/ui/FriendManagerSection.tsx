import { MailPlus, UserMinus, Users } from 'lucide-react';
import { useFriendManager } from '../model/useFriendManager';

const FriendManagerSection = () => {
  const {
    friends,
    requests,
    isLoading,
    isError,
    target,
    message,
    feedback,
    feedbackTone,
    isCreating,
    handleTargetChange,
    handleMessageChange,
    handleSubmitRequest,
    handleAccept,
    handleReject,
    handleCancel,
    handleDeleteFriend,
  } = useFriendManager();

  const incomingRequests = requests.filter((item) => item.direction === 'INCOMING');
  const outgoingRequests = requests.filter((item) => item.direction === 'OUTGOING');

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-500">친구 관리</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            친구 목록과 친구 신청 관리
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            친구 조회, 신청, 수락/거절, 신청 취소, 삭제까지 한 화면에서 처리할 수 있어요.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Users className="h-4 w-4" />
          친구 {friends.length}명
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              친구 신청 대상
            </span>
            <input
              type="text"
              value={target}
              onChange={(event) => handleTargetChange(event.target.value)}
              placeholder="닉네임 또는 이메일"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">메시지</span>
            <input
              type="text"
              value={message}
              onChange={(event) => handleMessageChange(event.target.value)}
              placeholder="같이 점심 먹어요!"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300"
            />
          </label>
          <button
            type="button"
            onClick={handleSubmitRequest}
            disabled={isCreating}
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            <MailPlus className="h-4 w-4" />
            {isCreating ? '전송 중...' : '친구 신청'}
          </button>
        </div>

        {feedback ? (
          <p
            className={`mt-4 text-sm font-medium ${
              feedbackTone === 'success' ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </div>

      {isLoading ? <p className="mt-6 text-sm text-slate-500">친구 정보를 불러오는 중입니다.</p> : null}
      {isError ? <p className="mt-6 text-sm text-red-500">친구 정보를 불러오지 못했습니다.</p> : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-900">친구 목록</h3>
          <div className="mt-4 space-y-3">
            {friends.length ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{friend.nickname}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {friend.name} · {friend.mbti || 'MBTI 미설정'}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {friend.introduce || '한 줄 소개가 아직 없어요.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFriend(friend.id)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
          <h3 className="text-lg font-bold text-slate-900">받은 신청</h3>
          <div className="mt-4 space-y-3">
            {incomingRequests.length ? (
              incomingRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{request.senderNickname}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {request.message || '메시지 없이 친구 신청을 보냈어요.'}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAccept(request.id)}
                      className="h-10 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white"
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(request.id)}
                      className="h-10 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">받은 친구 신청이 없어요.</p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-900">보낸 신청</h3>
          <div className="mt-4 space-y-3">
            {outgoingRequests.length ? (
              outgoingRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{request.receiverNickname}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {request.message || '메시지 없이 친구 신청을 보냈어요.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCancel(request.id)}
                    className="mt-4 h-10 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                  >
                    신청 취소
                  </button>
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
