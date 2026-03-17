import { List, Soup, TrendingUp, UsersRound } from 'lucide-react';

const tabItems = [
  { label: '점심 방', icon: UsersRound, active: true },
  { label: '학식 메뉴', icon: Soup, active: false },
  { label: '랭킹', icon: TrendingUp, active: false },
  { label: '자유게시판', icon: List, active: false },
];

const MainTabs = () => {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {tabItems.map((tabItem) => {
          const Icon = tabItem.icon;

          return (
            <button
              key={tabItem.label}
              type="button"
              className={[
                'inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-semibold transition',
                tabItem.active
                  ? 'bg-indigo-500 text-white shadow-[0_10px_24px_rgba(99,102,241,0.24)]'
                  : 'text-slate-500 hover:bg-slate-50',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              {tabItem.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MainTabs;
