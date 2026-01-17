"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Tag, AlertCircle } from "lucide-react";
import { sanPhamService } from "@/services/san-pham.service";
import { ProductSearchParams, ProductSearchResult } from "@/types/product-search";

interface Props {
    onSelect: (product: ProductSearchResult) => void;
    selectedItem: ProductSearchResult | null;
    onClear: () => void;
    error?: boolean;
}

export default function ProductSearch({ onSelect, selectedItem, onClear, error }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductSearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // --- REAL API SEARCH LOGIC ---
    useEffect(() => {
        let isActive = true; // prevent stale state updates

        const fetchProducts = async () => {
            if (!query.trim()) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);

            try {
                const params = {
                    Keyword: query,
                    Page: 1,
                    PageSize: 10
                };
                const data = await sanPhamService.getAll(params);
                if (!isActive) return;
                setResults(data.items ?? []);
                setIsOpen(true);
            } catch (err) {
                console.error("Product search error:", err);
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };
        const timeoutId = setTimeout(fetchProducts, 300);
        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [query]);


    // --- RENDER SELECTED STATE ---
    if (selectedItem) {
        return (
            <div className="flex items-center justify-between h-10 bg-blue-50 border border-blue-200 rounded-md px-2">
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                    <div className="p-1 bg-blue-100 rounded text-blue-600 shrink-0">
                        <Tag size={16} />
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-semibold text-blue-900 truncate">
                            {selectedItem.tenSP}
                        </span>
                        <span className="text-xs text-blue-600 font-mono bg-white px-1 rounded border border-blue-100 whitespace-nowrap">
                            {selectedItem.maSPCode}
                        </span>
                        <span className="text-xs text-blue-600 whitespace-nowrap">• {selectedItem.donViCoSo}</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => { onClear(); setQuery(""); }}
                    className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }


    // --- RENDER INPUT STATE ---
    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Nhập tên hoặc mã sản phẩm"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                    onFocus={() => query && setIsOpen(true)}
                    className={`w-full pl-9 pr-8 h-10 rounded-md border text-sm outline-none transition-all shadow-sm ${error
                        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                />
                {isLoading ? (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-blue-500" />
                ) : query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setResults([]); }}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* DROPDOWN RESULTS */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5">
                    {results.map((item) => (
                        <div
                            key={item.maSP}
                            onClick={() => { onSelect(item); setIsOpen(false); }}
                            className="cursor-pointer px-4 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 group transition-colors"
                        >
                            <div className="font-medium text-sm text-slate-700 group-hover:text-blue-700">
                                {item.tenSP}
                            </div>
                            <div className="mt-0.5 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex gap-2">
                                    <span className="font-mono bg-slate-100 px-1.5 rounded border border-slate-200">
                                        {item.maSPCode}
                                    </span>
                                    <span>{item.donViCoSo}</span>
                                </div>
                                {item.donGia && item.donGia > 0 && (
                                    <span className="text-slate-400">
                                        ~{item.donGia.toLocaleString()} đ
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NO RESULTS STATE */}
            {isOpen && query && !isLoading && results.length === 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white p-4 shadow-lg text-center">
                    <AlertCircle className="mx-auto h-5 w-5 text-slate-400 mb-1" />
                    <p className="text-sm text-slate-500">Không tìm thấy sản phẩm nào.</p>
                </div>
            )}
        </div>
    );
}