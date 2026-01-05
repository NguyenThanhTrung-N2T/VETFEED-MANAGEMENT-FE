"use client";
import React from 'react';
import { X, Trash2, Filter, Package, AlertTriangle } from 'lucide-react';

type ModalType = 'filter' | 'delete' | null;

interface InventoryModalsProps {
    isOpen: boolean;
    type: ModalType;
    onClose: () => void;
}

export default function InventoryModals({ isOpen, type, onClose }: InventoryModalsProps) {
    if (!isOpen) return null;

    // --- 1. MODAL LỌC ---
    if (type === 'filter') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[500px] animate-in fade-in zoom-in duration-200">
                    <div className="p-8 flex flex-col items-center">
                        <Filter size={48} strokeWidth={1} className="text-slate-800 mb-2" />
                        <h2 className="text-3xl font-bold font-serif mb-8 text-slate-800">Lọc tồn kho</h2>

                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Chọn kho</label>
                                <select className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Tất cả</option>
                                    <option>Kho Vận Linh Xuân</option>
                                    <option>Kho Tame Impala</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Tên sản phẩm</label>
                                <input type="text" placeholder="Nhập tên sản phẩm..." className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Trạng thái số lượng</label>
                                <select className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Tất cả</option>
                                    <option>Sắp hết hàng</option>
                                    <option>Còn nhiều</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full mt-8">
                            <button className="flex-1 py-3 bg-[#eab308] hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors shadow-lg shadow-yellow-100">
                                Lọc kết quả
                            </button>
                            <button onClick={onClose} className="flex-1 py-3 border border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors">
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. MODAL XÓA (Xóa sản phẩm khỏi kho) ---
    if (type === 'delete') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[450px] p-8 animate-in fade-in zoom-in duration-200 text-center relative">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xóa sản phẩm?</h3>
                    <p className="text-slate-500 mb-6">
                        Bạn có chắc muốn xóa sản phẩm <b className="text-slate-800">Thuốc A</b> khỏi danh sách tồn kho? Hành động này sẽ ảnh hưởng đến báo cáo.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md">Xóa ngay</button>
                        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-bold hover:bg-gray-50">Hủy</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}