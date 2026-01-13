"use client";

import React from "react";
import { Plus } from "lucide-react";

type AddButtonProps = {
    onClick: () => void;
    label?: string; // default to "Thêm"
    className?: string; // optional additional classes
};

const AddButton: React.FC<AddButtonProps> = ({ onClick, label = "Thêm", className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`justify-center w-30 inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-[#43a047] hover:bg-green-700 text-white font-medium transition-colors shadow-green-100 shadow-lg 
        leading-none cursor-pointer group ${className}`}
        >
            <Plus size={16} className="text-white transition-transform duration-300 group-hover:rotate-90" />
            <span>{label}</span>
        </button>
    );
};

export default AddButton;
