"use client";

import Icon from "@/components/Icon";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({ open, onClose, children, ariaLabel = "Dialog" }) => {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef(null);
    const dialogRef = useRef(null);
    const prevActiveRef = useRef(null);

    useEffect(() => {
        containerRef.current = document.createElement("div");
        document.body.appendChild(containerRef.current);
        setMounted(true);
        return () => {
            if (containerRef.current) document.body.removeChild(containerRef.current);
        };
    }, []);

    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        const onKey = (e) => {
            if (e.key === "Escape") onClose(e);
        };

        if (open) {
            prevActiveRef.current = document.activeElement;
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", onKey);

            setTimeout(() => dialogRef.current?.focus(), 0);
        } else {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
            (prevActiveRef.current)?.focus?.();
        }

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [open, mounted, onClose]);

    if (!mounted || !containerRef.current) return null;
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-slate-800/60"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-label={ariaLabel}
                ref={dialogRef}
                tabIndex={-1}
                className="relative z-10 w-11/12 sm:w-5/12 sm:min-w-lg mx-4 bg-[var(--background)] rounded-xl p-6 ring-1 ring-black/5 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-2 right-2 hover:bg-white/50 text-white hover:text-black p-2 rounded-full cursor-pointer"
                >
                    <Icon name="x-mark" />
                </button>
            </div>
        </div>,
        containerRef.current
    );
};

export default Modal;
