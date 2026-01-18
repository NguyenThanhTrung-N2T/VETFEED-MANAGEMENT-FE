import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export type ExportButtonProps = {
    // allow any return (sync void or Promise) by typing as unknown
    exportToCSV: (filename: string, data: any[]) => unknown;
    data?: any[] | null;
    filename?: string;
    loading?: boolean; // external loading state (e.g. tableLoading)
    disabled?: boolean; // external disabled flag
    className?: string; // extra classes
};

export const ExportButton: React.FC<ExportButtonProps> = ({
    exportToCSV,
    data = [],
    filename = "export.csv",
    loading = false,
    disabled = false,
    className = "",
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const isDisabled = disabled || loading || isExporting;

    const handleClick = async () => {
        if (isDisabled) return;

        setIsExporting(true);
        try {
            // result typed as unknown (safe)
            const result = exportToCSV(filename, data || []);

            // If result is thenable (Promise-like), await it.
            // We use a runtime check and a narrow cast to Promise<any>.
            if (result && typeof (result as any).then === "function") {
                await (result as Promise<any>);
            }
        } catch (err) {
            // optional: bubble up or show toast
            // console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-busy={isExporting || loading}
            title={isDisabled ? "Đang tải..." : "Xuất CSV"}
            className={`
        group flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200
        font-medium text-gray-700 text-sm bg-white
        transition-all duration-200 ease-in-out
        hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm
        shadow-gray-300 active:scale-95 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 
        ${className}
      `}
        >
            {isExporting || loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Download size={18} className="text-gray-500 group-hover:text-indigo-600" />
            )}

            <span>Xuất CSV</span>
        </button>
    );
};

export default ExportButton;
