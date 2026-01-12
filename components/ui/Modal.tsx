import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function Modal({ children }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
