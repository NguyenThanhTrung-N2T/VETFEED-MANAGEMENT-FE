import { ReactNode } from "react";

// 1. Define available sizes
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

type Props = {
    children: ReactNode;
    size?: ModalSize; // Make it optional
};

// 2. Map sizes to Tailwind max-width classes
const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',      // Small (Confirmations)
    md: 'max-w-lg',      // Medium (Simple forms)
    lg: 'max-w-2xl',     // Large 
    xl: 'max-w-4xl',     // Extra Large
    '2xl': 'max-w-6xl',  // Huge 
    full: 'max-w-[95%]'  // Almost full screen
};

export default function Modal({ children, size = 'lg' }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className={`relative w-full ${sizeClasses[size]} rounded-2xl bg-white shadow-xl overflow-hidden`}>
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}