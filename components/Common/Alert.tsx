"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import React, { useState, useEffect } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  message: string;
  duration?: number; // dalam ms, default 4000
  onClose?: () => void;
}

export default function Alert({
  type = "info",
  message,
  duration = 4000,
  onClose,
}: AlertProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles: Record<AlertType, { bg: string; icon: React.ReactNode }> = {
    success: {
      bg: "bg-green-50 text-green-800",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    error: {
      bg: "bg-red-50 text-red-800",
      icon: <XCircle className="w-6 h-6" />,
    },
    warning: {
      bg: "bg-yellow-50 text-yellow-800",
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    info: {
      bg: "bg-blue-50 text-blue-800",
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
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl ring-1 ring-gray-200 ${typeStyles[type].bg}`}
        >
          <div className="flex-shrink-0">{typeStyles[type].icon}</div>
          <p className="text-base font-medium">{message}</p>
          <button
            onClick={() => setShow(false)}
            className="ml-4 text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
