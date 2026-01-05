"use client";
import React from 'react';
import { X, Plus, Trash2, Filter, Edit, Info, Save, FileText, ArrowRight } from 'lucide-react';

type ModalType = 'filter' | 'add' | 'edit' | 'detail' | 'delete' | null;

interface TransferModalsProps {
    isOpen: boolean;
    type: ModalType;
    onClose: () => void;
}

export default function TransferModals({ isOpen, type, onClose }: TransferModalsProps) {
    if (!isOpen) return null;

    if (type === 'filter') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[650px] animate-in fade-in zoom-in duration-200">
                    <div className="p-8 flex flex-col items-center">
                        <Filter size={48} strokeWidth={1} className="text-slate-800 mb-2" />
                        <h2 className="text-3xl font-bold font-serif mb-8 text-slate-800">Lọc phiếu chuyển</h2>

                        <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Từ ngày</label>
                                <input type="date" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" defaultValue="2022-04-22" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Đến ngày</label>
                                <input type="date" className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" defaultValue="2022-04-27" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Kho xuất</label>
                                <select className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Kho Thủ Đức</option>
                                    <option>Kho Tân Phú</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Kho nhập</label>
                                <select className="w-full p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Kho Củ Chi</option>
                                    <option>Kho Quận 9</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full mt-10">
                            <button className="flex-1 py-3 bg-[#43a047] hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-100">
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

    // --- 2. MODAL XÓA (Giống hình ảnh image_36cbda.png) ---
    if (type === 'delete') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[450px] p-8 animate-in fade-in zoom-in duration-200 text-center relative">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 font-sans">Bạn có chắc là muốn xóa phiếu chuyển hàng này không?</h3>

                    <div className="flex gap-4 justify-center mt-8">
                        <button className="flex-1 py-2.5 bg-[#43a047] text-white rounded-lg font-bold hover:bg-green-700 shadow-md">Xóa</button>
                        <button onClick={onClose} className="flex-1 py-2.5 border border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-50">Hủy</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- 3. MODAL FORM CHUNG (Thêm / Sửa / Chi tiết) ---
    const isDetail = type === 'detail';
    const isEdit = type === 'edit';

    let title = "Tạo phiếu chuyển";
    let icon = <Plus size={24} />;
    if (isEdit) { title = "Cập nhật thông tin"; icon = <Edit size={24} />; }
    if (isDetail) { title = "Thông tin chi tiết"; icon = <Info size={24} />; }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-center items-center bg-white relative">
                    <h2 className="text-3xl font-bold font-serif text-slate-800 flex items-center gap-2">
                        {type === 'add' && <FileText size={32} />}
                        {isEdit && <Edit size={32} />}
                        {isDetail && <Info size={32} />}
                        {title}
                    </h2>
                    <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-red-500 transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">

                    {/* Form Thông tin chung */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-6">
                        {/* Cột Trái */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 ml-1">Ngày lập</label>
                                <input disabled={isDetail} type="date" defaultValue="2022-04-22" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 ml-1">Ghi chú</label>
                                <input disabled={isDetail} type="text" defaultValue="Hàng cần gấp" className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            </div>
                        </div>

                        {/* Cột Phải */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 ml-1">Kho xuất</label>
                                <select disabled={isDetail} className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Kho Thủ Đức</option>
                                    <option>Kho Quận 9</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 ml-1">Kho nhập</label>
                                <select disabled={isDetail} className="mt-1 w-full bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700">
                                    <option>Kho Củ Chi</option>
                                    <option>Kho Bình Chánh</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dòng Input thêm sản phẩm (Ẩn khi xem chi tiết) */}
                    {!isDetail && (
                        <div className="flex flex-wrap gap-2 mb-4 items-center bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
                            <input placeholder="Mã lô" className="w-20 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            <input placeholder="Tên sản phẩm" className="flex-1 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            <select className="w-24 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700"><option>Loại</option></select>
                            <select className="w-20 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700"><option>DVT</option></select>
                            <input placeholder="Đơn giá" className="w-24 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            <input placeholder="Số lượng" className="w-20 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            <input placeholder="HSD" type="date" className="w-32 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                            <select className="w-24 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700"><option>Trạng thái</option></select>
                            <input placeholder="Ghi chú" className="flex-1 bg-blue-50/30 border border-blue-100 rounded px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-100 disabled:text-slate-700" />
                        </div>
                    )}

                    {/* Bảng Danh sách sản phẩm */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800">Danh sách sản phẩm</h3>
                            {!isDetail && <button className="bg-[#43a047] text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-1">Thêm <Plus size={14} /></button>}
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-100">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-blue-100/50 text-slate-800 font-bold border-b border-blue-100">
                                        <th className="p-3">STT</th>
                                        <th className="p-3">Mã lô</th>
                                        <th className="p-3">Tên sản phẩm</th>
                                        <th className="p-3">Loại</th>
                                        <th className="p-3">DVT</th>
                                        <th className="p-3 text-center">Số lượng</th>
                                        <th className="p-3 text-right">Đơn giá (VNĐ)</th>
                                        <th className="p-3">Hạn dụng</th>
                                        <th className="p-3">Ghi chú</th>
                                        <th className="p-3">Trạng thái</th>
                                        <th className="p-3 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {[
                                        { id: 1, name: "Cám cho gà", type: "Thức ăn chăn nuôi", unit: "Bao", qty: 10, price: "60.000", exp: "12/01/2024", note: "Không để ướt", status: "Tạo", color: "bg-red-300 text-red-800" },
                                        { id: 2, name: "Antibiotic", type: "Thuốc thú y", unit: "Lọ", qty: 20, price: "70.000", exp: "22/01/2024", note: "Không có", status: "Tạo", color: "bg-red-300 text-red-800" },
                                        // Mock thêm trạng thái khác nếu là detail
                                        ...(isDetail ? [{ id: 3, name: "Vaccine", type: "Thuốc", unit: "Lọ", qty: 5, price: "150.000", exp: "12/12/2024", note: "", status: "Đang chuyển", color: "bg-orange-200 text-orange-800" }] : [])
                                    ].map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            <td className="p-3 text-slate-500">{index + 1}</td>
                                            <td className="p-3 font-medium text-slate-700">L00{item.id}</td>
                                            <td className="p-3 font-medium text-slate-700">{item.name}</td>
                                            <td className="p-3 text-slate-600 max-w-[100px]">{item.type}</td>
                                            <td className="p-3 text-slate-700">{item.unit}</td>
                                            <td className="p-3 text-center text-slate-700">{item.qty}</td>
                                            <td className="p-3 text-right text-slate-700">{item.price}</td>
                                            <td className="p-3 text-slate-500">{item.exp}</td>
                                            <td className="p-3 text-slate-500">{item.note}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Tạo' ? 'bg-red-400 text-white' :
                                                    item.status === 'Đang chuyển' ? 'bg-yellow-200 text-yellow-800' :
                                                        'bg-green-200 text-green-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-1 border-red-500 text-red-500 rounded hover:bg-red-50"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-gray-100 flex justify-center gap-8 bg-white">
                    {(type === 'add' || isEdit) ? (
                        <>
                            <button className="px-12 py-3 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-100 transition-all">
                                {isEdit ? 'Cập nhật' : 'Tạo phiếu'}
                            </button>
                            <button onClick={onClose} className="px-12 py-3 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all">
                                {isEdit ? 'Hủy thay đổi' : 'Hủy phiếu'}
                            </button>
                        </>
                    ) : (
                        // Nút đóng cho Detail (nếu cần)
                        <button onClick={onClose} className="px-12 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all">
                            Đóng
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}