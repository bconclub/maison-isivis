"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <p className="text-sm text-neutral-600">{description}</p>
      <div className="mt-6 flex gap-3">
        <Button variant="ghost" size="sm" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
