"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import React from "react";

export type AlertType = "success" | "error" | "warning" | "info";

interface ConfirmAlertProps {
  type?: AlertType;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  show: boolean;
}

export default function ConfirmAlert({
  type = "warning",
  message,
  onConfirm,
  onCancel,
  show,
}: ConfirmAlertProps) {
  const typeStyles: Record<AlertType, { bg: string; icon: React.ReactNode }> = {
    success: {
      bg: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    error: {
      bg: "bg-red-100 text-red-800",
      icon: <XCircle className="w-6 h-6" />,
    },
    warning: {
      bg: "bg-yellow-100 text-yellow-800",
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    info: {
      bg: "bg-blue-100 text-blue-800",
      icon: <Info className="w-6 h-6" />,
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 p-6 rounded-xl shadow-lg ${typeStyles[type].bg} max-w-sm w-full`}
        >
          <div className="flex items-center gap-2">
            {typeStyles[type].icon}
            <p className="text-center font-medium text-gray-800">{message}</p>
          </div>

          <div className="flex gap-4 mt-4">
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Hapus
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Batal
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
