"use client";
import React from 'react';
import { X, Plus, Trash2, Save, Filter, Edit, Info, Search } from 'lucide-react';

type ModalType = 'filter' | 'add' | 'edit' | 'detail' | 'delete' | null;

interface SalesModalsProps {
    isOpen: boolean;
    type: ModalType;
    onClose: () => void;
}

export default function SalesModals({ isOpen, type, onClose }: SalesModalsProps) {
    if (!isOpen) return null;

    if (type === 'filter') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[600px] animate-in fade-in zoom-in duration-200">
                    <div className="p-8 flex flex-col items-center">
                        {/* Icon phễu lớn */}
                        <Filter size={48} strokeWidth={1} className="text-slate-800 mb-2" />
                        <h2 className="text-2xl font-bold font-serif mb-8 text-slate-800">Lọc phiếu bán</h2>

                        <div className="w-full grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Từ ngày</label>
                                <input type="date" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" defaultValue="2022-04-22" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Đến ngày</label>
                                <input type="date" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" defaultValue="2022-04-27" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Khách hàng</label>
                                <input type="text" placeholder="Nguyễn Văn A" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Tiền tối thiểu (VNĐ)</label>
                                <input type="text" placeholder="1.800.000" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                        </div>

                        <div className="flex gap-4 w-full mt-8">
                            <button className="flex-1 py-3 bg-[#388e3c] hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-100">
                                Lọc phiếu
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

    // --- 2. MODAL XÓA (Giống Image 10) ---
    if (type === 'delete') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[450px] p-8 animate-in fade-in zoom-in duration-200 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>

                    <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">Xác nhận xóa?</h3>
                    <p className="text-slate-600 mb-8 text-sm leading-relaxed px-4">
                        Phiếu bán hàng <b className="text-slate-800">10000</b> sẽ bị xóa, tồn kho sẽ được hoàn trả, công nợ (nếu có) sẽ được cập nhật lại.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button className="px-8 py-2.5 bg-[#388e3c] text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-100">Xóa</button>
                        <button onClick={onClose} className="px-8 py-2.5 border border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-50">Hủy</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- 3. MODAL FORM CHUNG (Thêm / Sửa / Chi tiết - Giống Image 8, 9) ---
    const isDetail = type === 'detail';
    const isEdit = type === 'edit';

    let title = "Tạo phiếu bán hàng";
    let icon = <Plus size={24} />;
    if (isEdit) { title = "Cập nhật thông tin"; icon = <Edit size={24} />; }
    if (isDetail) { title = "Thông tin chi tiết"; icon = <Info size={24} />; }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        {isEdit && <Edit className="text-slate-800" size={28} />}
                        {isDetail && <Info className="text-slate-800" size={28} />}
                        {!isEdit && !isDetail && <Plus className="text-slate-800" size={28} />}
                        <h2 className="text-2xl font-bold font-serif text-slate-800">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">

                    {/* SECTION 1: Thông tin phiếu & Khách hàng */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">

                        {/* Cột trái: Thông tin phiếu */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800">Thông tin phiếu</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Tổng cộng (VNĐ):</label>
                                    <input disabled type="text" defaultValue="1.800.000" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Ghi chú:</label>
                                    <input disabled={isDetail} defaultValue="Không có" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Còn nợ:</label>
                                    <input disabled type="text" defaultValue="1.000.000" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Hạn trả:</label>
                                    <input disabled type="text" defaultValue="1.000.000" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thông tin khách hàng */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800">Thông tin khách hàng</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Khách hàng:</label>
                                    <input disabled={isDetail} defaultValue="Khách A" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Loại khách hàng:</label>
                                    <input disabled defaultValue="Trang trại" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Số điện thoại:</label>
                                    <input disabled={isDetail} defaultValue="0987654321" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Địa chỉ:</label>
                                    <input disabled={isDetail} defaultValue="099, xã A, tỉnh B" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Danh sách sản phẩm */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-slate-800 mb-3">Danh sách sản phẩm</h3>

                        {/* Input Row (Ẩn khi xem chi tiết) */}
                        {!isDetail && (
                            <div className="flex flex-wrap gap-2 mb-4 items-end bg-blue-50/30 p-3 rounded-lg">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-xs text-slate-500 block mb-1">Sản phẩm:</label>
                                    <input placeholder="Thuốc A" className="w-full bg-white border border-blue-100 rounded px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div className="w-[120px]">
                                    <label className="text-xs text-slate-500 block mb-1">Loại SP:</label>
                                    <select className="w-full bg-white border border-blue-100 rounded px-3 py-2 text-sm text-slate-800 disabled:opacity-100 disabled:text-slate-700">
                                        <option>Thuốc</option>
                                    </select>
                                </div>
                                <div className="w-[120px]">
                                    <label className="text-xs text-slate-500 block mb-1">Đơn giá:</label>
                                    <input placeholder="9.000" className="w-full bg-white border border-blue-100 rounded px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div className="w-[80px]">
                                    <label className="text-xs text-slate-500 block mb-1">SL:</label>
                                    <input placeholder="30" type="number" className="w-full bg-white border border-blue-100 rounded px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-xs text-slate-500 block mb-1">Ghi chú:</label>
                                    <input placeholder="Không có" className="w-full bg-white border border-blue-100 rounded px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                                </div>
                                <button className="bg-[#388e3c] hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 h-[38px]">
                                    Thêm <Plus size={16} />
                                </button>
                            </div>
                        )}

                        {/* Table */}
                        <div className="overflow-hidden rounded-lg border border-gray-100">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-blue-100/50 text-slate-800 font-bold border-b border-blue-100">
                                        <th className="p-3">STT</th>
                                        <th className="p-3">Mã lô</th>
                                        <th className="p-3">Tên SP</th>
                                        <th className="p-3">Loại SP</th>
                                        <th className="p-3 text-center">Số lượng</th>
                                        <th className="p-3 text-right">Đơn giá (VNĐ)</th>
                                        <th className="p-3 text-right">Thành tiền (VNĐ)</th>
                                        <th className="p-3">Ghi chú</th>
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {[1, 2, 3, 4].map((i) => (
                                        <tr key={i} className="hover:bg-slate-50 group">
                                            {/* Đã thêm text-slate-500/700/800 vào các ô bên dưới */}
                                            <td className="p-3 text-slate-500">10</td>
                                            <td className="p-3 text-slate-700">L001</td>
                                            <td className="p-3 font-medium text-slate-700">Thuốc {i % 2 === 0 ? 'A' : 'B'}</td>
                                            <td className="p-3 text-slate-700">Thuốc</td>
                                            <td className="p-3 text-center text-slate-700">10</td>
                                            <td className="p-3 text-right text-slate-700">9.000</td>
                                            <td className="p-3 text-right font-medium text-slate-800">90.000</td>
                                            <td className="p-3 text-slate-500">Note</td>
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

                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-gray-100 flex justify-end gap-4 bg-white">
                    {(type === 'add' || isEdit) ? (
                        <>
                            <button className="px-8 py-2.5 bg-[#388e3c] hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-100 transition-all">
                                {isEdit ? 'Cập nhật' : 'Lưu phiếu'}
                            </button>
                            <button onClick={onClose} className="px-8 py-2.5 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all">
                                {isEdit ? 'Hủy thay đổi' : 'Hủy bỏ'}
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all">
                            Đóng
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}