interface RoomStatusProps {
  roomCount: number;
}

const RoomStatus = ({ roomCount }: RoomStatusProps) => {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      현재 <span className="font-bold text-slate-900">{roomCount}개</span>의 점심 방이 열려있어요
    </section>
  );
};

export default RoomStatus;
