import { UserCircle2, Users } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';
import type { ProfileTab } from '../model/types';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const tabItems: Array<{ key: ProfileTab; label: string; icon: typeof UserCircle2 }> = [
  { key: 'PROFILE', label: '프로필', icon: UserCircle2 },
  { key: 'FRIEND', label: '친구', icon: Users },
];

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => (
  <section className="rounded-[28px] border border-slate-200/80 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
    <div className="grid grid-cols-2 gap-2">
      {tabItems.map((tabItem) => {
        const Icon = tabItem.icon;

        return (
          <button
            key={tabItem.key}
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

export default ProfileTabs;
