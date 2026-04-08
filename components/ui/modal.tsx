"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              "relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/50 bg-[#f8fbff] shadow-ambient",
              className,
            )}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-mesh opacity-80" />
            <div className="relative flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-slate-950">
                  {title}
                </h2>
                {description ? (
                  <p className="max-w-2xl text-sm text-slate-500">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-900"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative max-h-[80vh] overflow-y-auto px-6 py-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
