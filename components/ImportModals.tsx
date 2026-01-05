"use client";
import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Send, Filter, Info, Edit, AlertTriangle } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho props
type ModalType = 'filter' | 'add' | 'edit' | 'detail' | 'delete' | null;

interface ImportModalsProps {
    isOpen: boolean;
    type: ModalType;
    onClose: () => void;
}

export default function ImportModals({ isOpen, type, onClose }: ImportModalsProps) {
    if (!isOpen) return null;

    // --- 1. MODAL LỌC (Filter) ---
    if (type === 'filter') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-8 flex flex-col items-center">
                        <Filter size={48} className="text-slate-700 mb-4" />
                        <h2 className="text-2xl font-bold font-serif mb-8 text-slate-800">Lọc phiếu nhập</h2>

                        <div className="w-full grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Từ ngày</label>
                                <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" defaultValue="2022-04-22" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Đến ngày</label>
                                <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" defaultValue="2022-04-27" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Nhà cung cấp</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Công ty dược A</option>
                                    <option>Công ty B</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Kho chứa</label>
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Kho Củ Chi</option>
                                    <option>Kho Thủ Đức</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full mt-8">
                            <button className="flex-1 py-3 bg-[#43a047] hover:bg-green-700 text-white font-bold rounded-lg transition-colors">
                                Lọc phiếu
                            </button>
                            <button onClick={onClose} className="flex-1 py-3 border border-red-500 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-colors">
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. MODAL XÓA (Delete Confirmation) ---
    if (type === 'delete') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6 animate-in fade-in zoom-in duration-200 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h3>
                    <p className="text-slate-500 mb-6">Bạn có chắc chắn muốn xóa phiếu nhập này không? Hành động này không thể hoàn tác.</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200">Hủy</button>
                        <button className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Xóa ngay</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- 3. MODAL FORM CHUNG (Thêm / Sửa / Chi tiết) ---
    // Biến đổi tiêu đề và nút bấm dựa trên "type"
    const isDetail = type === 'detail';
    const isEdit = type === 'edit';

    let title = "Phiếu nhập hàng";
    let icon = <Plus size={24} />;
    if (isEdit) { title = "Cập nhật thông tin"; icon = <Edit size={24} />; }
    if (isDetail) { title = "Thông tin chi tiết"; icon = <Info size={24} />; }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-2">
                        {type === 'add' && <span className="text-slate-800"><span className="sr-only">Icon</span>🛒</span>}
                        {isEdit && <span className="text-slate-800"><span className="sr-only">Icon</span>✏️</span>}
                        {isDetail && <span className="text-slate-800"><span className="sr-only">Icon</span>ⓘ</span>}
                        <h2 className="text-2xl font-bold font-serif text-slate-800">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">

                    {/* Form Thông tin chung */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Nhà cung cấp:</label>
                                <input disabled={isDetail} type="text" defaultValue="NCC A" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Loại hàng:</label>
                                <select disabled={isDetail} className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded px-3 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Thuốc</option>
                                    <option>Thức ăn</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Kho nhận:</label>
                                <select disabled={isDetail} className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded px-3 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Kho Thủ Đức</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Thành tiền:</label>
                                <input disabled type="text" defaultValue="1.800.000" className="mt-1 w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-slate-600">Ghi chú:</label>
                                <input disabled={isDetail} type="text" placeholder="Không có" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded px-3 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            {/* Chỉ hiện trạng thái khi Update/Detail */}
                            {(isEdit || isDetail) && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-600">Trạng thái:</label>
                                    <div className="mt-1">
                                        <span className="bg-red-100 text-red-600 px-3 py-1.5 rounded text-sm font-medium">Tạo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Thêm sản phẩm (Ẩn khi xem chi tiết) */}
                    {!isDetail && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
                            <h3 className="text-sm font-bold text-slate-700 mb-3">Danh sách sản phẩm</h3>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                                <input placeholder="Sản phẩm" className="col-span-1 md:col-span-2 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                <select className="col-span-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700"><option>Thuốc</option></select>
                                <select className="col-span-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700"><option>Vỉ</option></select>
                                <input placeholder="SL" type="number" className="col-span-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                                <div className="col-span-1 md:col-span-2"><input type="date" className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" /></div>
                                <div className="col-span-1 md:col-span-2"><input type="date" className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" /></div>
                                <input placeholder="Đơn giá" className="col-span-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            <div className="flex gap-3">
                                <input placeholder="Ghi chú" className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                <button className="bg-[#43a047] hover:bg-green-700 text-white px-6 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                                    Thêm <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bảng danh sách sản phẩm */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-blue-100/50 text-slate-700 font-bold border-b border-blue-100">
                                    <th className="p-3">STT</th>
                                    <th className="p-3">Tên SP</th>
                                    <th className="p-3">Loại SP</th>
                                    <th className="p-3">DVT</th>
                                    <th className="p-3 text-center">Số lượng</th>
                                    <th className="p-3">Ngày SX</th>
                                    <th className="p-3">Hạn SD</th>
                                    <th className="p-3 text-right">Đơn giá</th>
                                    <th className="p-3">Ghi chú</th>
                                    <th className="p-3 text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-3 text-slate-500">{i}</td>
                                        <td className="p-3 font-medium text-slate-700">Thuốc {i === 2 || i === 4 ? 'B' : 'A'}</td>
                                        <td className="p-3 text-slate-700">Thuốc</td>
                                        <td className="p-3 text-slate-700">Vỉ</td>
                                        <td className="p-3 text-center text-slate-700">{i % 2 === 0 ? 11 : 10}</td>
                                        <td className="p-3 text-slate-500">01/01/2020</td>
                                        <td className="p-3 text-slate-500">01/01/202{i}</td>
                                        <td className="p-3 text-right text-slate-800">{i % 2 === 0 ? '10.000' : '9.000'}</td>
                                        <td className="p-3 text-slate-400 italic">Note</td>
                                        <td className="p-3 text-center">
                                            {!isDetail && (
                                                <button className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    {type === 'add' && (
                        <>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                <Send size={18} /> Xuất phiếu
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                <Save size={18} /> Lưu phiếu
                            </button>
                            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors">
                                <Trash2 size={18} /> Hủy
                            </button>
                        </>
                    )}

                    {isEdit && (
                        <>
                            <button className="flex items-center gap-2 px-6 py-2 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                Cập nhật
                            </button>
                            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors">
                                Hủy thay đổi
                            </button>
                        </>
                    )}

                    {isDetail && (
                        <button onClick={onClose} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                            Đóng
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}