import { useEffect } from "react";
import { createPortal } from "react-dom";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: "bg-green-500/20 border-green-500/50 text-green-400",
    error: "bg-red-500/20 border-red-500/50 text-red-400",
    warning: "bg-amber-500/20 border-amber-500/50 text-amber-400",
    info: "bg-primary-500/20 border-primary-500/50 text-primary-400",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-50 animate-slide-down glass-strong border rounded-xl px-6 py-4 min-w-[300px] flex items-center gap-3 ${typeStyles[type]}`}
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 transition-colors"
      >
        ✕
      </button>
    </div>,
    document.body
  );
};

export default Toast;


