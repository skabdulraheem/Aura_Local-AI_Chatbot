import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-[100] glass px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border-aura-purple/20 min-w-[300px]"
        >
          <div className="w-8 h-8 rounded-full bg-aura-purple/20 flex items-center justify-center text-aura-purple">
            <Info size={18} />
          </div>
          <p className="text-sm font-medium flex-1">{message}</p>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
