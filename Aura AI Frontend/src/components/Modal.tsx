import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[80vh] glass rounded-3xl z-[70] overflow-hidden flex flex-col shadow-2xl border-white/10"
          >
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-2xl font-display font-bold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
