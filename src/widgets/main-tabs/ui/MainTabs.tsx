import { List, Soup, TrendingUp, UsersRound } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { MainTab } from '../model/types';

interface MainTabsProps {
  activeTab: MainTab;
  onTabChange: (mainTab: MainTab) => void;
}

const tabItems: Array<{ key: MainTab; label: string; icon: typeof UsersRound }> = [
  { key: 'ROOM', label: '점심 방', icon: UsersRound },
  { key: 'LUNCH', label: '학식 메뉴', icon: Soup },
  { key: 'RANKING', label: '랭킹', icon: TrendingUp },
  { key: 'POST', label: '자유게시판', icon: List },
];

const MainTabs = ({ activeTab, onTabChange }: MainTabsProps) => {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {tabItems.map((tabItem) => {
          const Icon = tabItem.icon;

          return (
            <button
              key={tabItem.label}
              type="button"
              onClick={() => onTabChange(tabItem.key)}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-[14px] text-[15px] font-semibold transition',
                activeTab === tabItem.key
                  ? 'bg-indigo-500 text-white shadow-[0_10px_24px_rgba(99,102,241,0.24)]'
                  : 'text-slate-500 hover:bg-slate-50',
              )}
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
