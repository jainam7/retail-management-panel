"use client";

import React from "react";
import { XCircle } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-50 max-w-lg w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
