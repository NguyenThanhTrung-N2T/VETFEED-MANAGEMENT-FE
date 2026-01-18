"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedHeaderProps {
    title: string;
    description: string;
    icon: React.ReactNode; // Receives the rendered JSX (e.g., <Wallet />)
    iconColorClass?: string;
}

export default function AnimatedHeader({
    title,
    description,
    icon,
    iconColorClass = "bg-gradient-to-br from-[#25396f] to-[#1e2e5a]"
}: AnimatedHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
        >
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <div className={`p-2 rounded-xl text-white shadow-lg ${iconColorClass}`}>
                        {icon}
                    </div>
                    {title}
                </h1>
                <p className="text-slate-500 text-sm mt-2 ml-1">{description}</p>
            </div>
        </motion.div>
    );
}