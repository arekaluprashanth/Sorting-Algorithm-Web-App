import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isClearAll?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  isClearAll = false,
}) => {
  const title = isClearAll ? 'Clear All History?' : `Delete ${count} Session${count > 1 ? 's' : ''}?`;
  const description = isClearAll
    ? 'This will permanently remove all saved benchmark sessions from your local storage. This action cannot be undone.'
    : `This will permanently remove ${count} benchmark session${count > 1 ? 's' : ''} from your history. This action cannot be undone.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          {isClearAll ? 'Clear All' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
};
