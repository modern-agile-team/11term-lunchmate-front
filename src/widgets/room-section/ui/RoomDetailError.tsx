interface RoomDetailErrorProps {
  error: unknown;
}

const RoomDetailError = ({ error }: RoomDetailErrorProps) => (
  <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
    방 상세 정보를 불러오지 못했어요.
    {error instanceof Error ? ` ${error.message}` : ''}
  </div>
);

export default RoomDetailError;
