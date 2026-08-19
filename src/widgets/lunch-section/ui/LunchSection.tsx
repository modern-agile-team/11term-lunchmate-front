import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import LunchMenuEditorModal, { type LunchMenuEditorFormValues } from '@/features/lunch/editor';
import DeleteLunchMenuConfirmModal, { useDeleteLunchMenuAction } from '@/features/lunch/delete';
import { useLunchMenuReactionAction } from '@/features/lunch/react';
import AppDialog from '@/shared/ui/modal/AppDialog';
import { useLunchSelection } from '../model/useLunchSelection';
import type { MainLunchMenu } from '../model/types';
import LunchMenuCard from './LunchMenuCard';
import LunchMenuDetail from './LunchMenuDetail';

interface LunchSectionProps {
  lunchMenus: MainLunchMenu[];
  isAdmin: boolean;
  onRequireLogin: () => void;
}

const toEditorFormValues = (menu: MainLunchMenu): LunchMenuEditorFormValues => ({
  mealType: menu.mealType,
  menuName: menu.menuName,
  price: menu.price ?? 0,
  calorie: menu.calorie ?? 0,
  schoolInfo: menu.schoolInfo,
  componentsText: menu.components.join(', '),
});

const LunchSection = ({ lunchMenus, isAdmin, onRequireLogin }: LunchSectionProps) => {
  const queryClient = useQueryClient();
  const { selectedLunchMenuId, setSelectedLunchMenuId, selectedLunchMenu } = useLunchSelection({
    lunchMenus,
  });
  const [editorTarget, setEditorTarget] = useState<MainLunchMenu | 'create' | null>(null);
  const isEditorOpen = editorTarget !== null;
  const isEditMode = editorTarget !== null && editorTarget !== 'create';

  const [deleteTarget, setDeleteTarget] = useState<MainLunchMenu | null>(null);
  const deleteAction = useDeleteLunchMenuAction({
    targetMenu: deleteTarget,
    queryClient,
    selectedLunchMenuId,
    setSelectedLunchMenuId,
    closeDeleteConfirm: () => setDeleteTarget(null),
  });

  const reactionAction = useLunchMenuReactionAction({ onRequireLogin });

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-sm text-emerald-800">
        <span>
          {isAdmin
            ? '관리자 계정으로 학식 메뉴를 등록·수정할 수 있어요.'
            : '메뉴 상세 확인과 좋아요, 싫어요 반응을 남길 수 있습니다.'}
        </span>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setEditorTarget('create')}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            메뉴 추가
          </button>
        ) : null}
      </div>

      {lunchMenus.map((mockLunchMenu) => (
        <LunchMenuCard
          key={mockLunchMenu.id}
          menu={mockLunchMenu}
          isSelected={selectedLunchMenuId === mockLunchMenu.id}
          onSelect={setSelectedLunchMenuId}
          isAdmin={isAdmin}
          onEdit={setEditorTarget}
          onDelete={setDeleteTarget}
        />
      ))}

      <AppDialog
        isOpen={selectedLunchMenu !== null}
        onClose={() => setSelectedLunchMenuId(null)}
        title={selectedLunchMenu?.menuName ?? '학식 메뉴 상세'}
      >
        {selectedLunchMenu ? (
          <>
            <LunchMenuDetail
              menu={selectedLunchMenu}
              onLike={() => void reactionAction.handleLike(selectedLunchMenu)}
              onDislike={() => void reactionAction.handleDislike(selectedLunchMenu)}
              isReactionPending={reactionAction.isReactionPending}
            />
            {reactionAction.reactionErrorMessage ? (
              <p className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {reactionAction.reactionErrorMessage}
              </p>
            ) : null}
          </>
        ) : null}
      </AppDialog>

      <LunchMenuEditorModal
        isOpen={isEditorOpen}
        onClose={() => setEditorTarget(null)}
        mode={isEditMode ? 'edit' : 'create'}
        menuId={isEditMode ? editorTarget.id : undefined}
        initialValues={isEditMode ? toEditorFormValues(editorTarget) : undefined}
      />

      <DeleteLunchMenuConfirmModal
        isOpen={deleteTarget !== null}
        isPending={deleteAction.isDeleteLunchMenuPending}
        errorMessage={deleteAction.deleteErrorMessage}
        menuName={deleteTarget?.menuName}
        onClose={() => {
          setDeleteTarget(null);
          deleteAction.setDeleteErrorMessage('');
        }}
        onConfirm={deleteAction.handleDeleteLunchMenu}
      />
    </section>
  );
};

export default LunchSection;