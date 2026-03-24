interface RoomSummaryProps {
  roomCount: number;
}

const RoomSummary = ({ roomCount }: RoomSummaryProps) => {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white px-6 py-4 text-[15px] text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      현재 <span className="font-bold text-slate-900">{roomCount}개</span>의 점심 방이 열려있어요
    </section>
  );
};

export default RoomSummary;
