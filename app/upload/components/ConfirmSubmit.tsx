// components/ConfirmModal.tsx
"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  formId:string;
  isSubmitting?:boolean;
}
import { forwardRef,useImperativeHandle,useRef } from "react";

export default function ConfirmSubmit({
  isOpen,
  title,
  formId,
  isSubmitting = false,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {message}
        </p>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {cancelText}
          </button>
          <button
          form={formId}
            onClick={() => {
              onConfirm();
             
            }}
            disabled={isSubmitting}
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            
            {confirmText}

          </button>
        </div>
      </div>
    </div>
  );
}