"use client";

import React, { useState } from 'react';
import {
    Search, Plus, Filter, Edit, Trash2,
    ChevronDown, ShoppingCart
} from 'lucide-react';
import ImportModals from '@/components/ImportModals';

const MOCK_DATA = [
    { id: '10000', date: '01/10/2023', supplier: 'Công ty dược A', warehouse: 'Kho A', total: '1.800.000 đ', note: 'Số lượng lớn', status: 'Duyệt' },
    { id: '10001', date: '02/10/2023', supplier: 'Công ty B', warehouse: 'Kho Thủ Đức', total: '8.000.000 đ', note: 'Giao sáng', status: 'Chưa duyệt' },
    { id: '10002', date: '02/10/2023', supplier: 'NCC C', warehouse: 'Kho Củ Chi', total: '500.000 đ', note: 'Không có', status: 'Duyệt' },
];

export default function ImportPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // State quản lý Modal
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">

            {/* --- HEADER --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ShoppingCart className="text-slate-800" size={28} />
                    Nhập hàng
                </h1>
            </div>

            {/* --- TOOLBAR --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative">
                    <button className="flex items-center justify-between w-32 px-4 py-2.5 bg-[#25396f] text-white rounded-lg hover:bg-[#1e2e5a] transition-colors">
                        <span className="text-sm font-medium">Tất cả</span>
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="relative flex-1 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg border-none focus:ring-2 focus:ring-slate-300 shadow-sm outline-none bg-white text-slate-700 placeholder:text-slate-400"
                    />
                    <Search className="absolute right-3 top-2.5 text-slate-400" size={20} />
                </div>
            </div>

            {/* --- MAIN CARD --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[300px]">

                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
                    <div className="flex items-center gap-2" onClick={() => setModalType('filter')}>
                        <h2 className="text-xl font-bold text-slate-800">Danh sách phiếu</h2>
                        <Filter size={20} className="text-slate-500 cursor-pointer hover:text-slate-700" />
                    </div>

                    <button
                        onClick={() => setModalType('add')}
                        className="flex items-center gap-2 px-5 py-2 bg-[#43a047] hover:bg-[#388e3c] text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <span>Thêm</span>
                        <Plus size={20} />
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-[#eef2f6] text-slate-700 text-sm font-bold uppercase tracking-wide">
                                <th className="p-4 border-b border-gray-200">Số phiếu</th>
                                <th className="p-4 border-b border-gray-200">Ngày lập</th>
                                <th className="p-4 border-b border-gray-200">Nhà cung cấp</th>
                                <th className="p-4 border-b border-gray-200">Kho nhận</th>
                                <th className="p-4 border-b border-gray-200">Thành tiền</th>
                                <th className="p-4 border-b border-gray-200">Ghi chú</th>
                                <th className="p-4 border-b border-gray-200">Trạng thái</th>
                                <th className="p-4 border-b border-gray-200 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {MOCK_DATA.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}`
                                    }
                                    // Double click để xem chi tiết
                                    onDoubleClick={() => setModalType('detail')}
                                >
                                    <td className="p-4 font-medium cursor-pointer" onClick={() => setModalType('detail')}>{item.id}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4 font-semibold text-slate-800">{item.supplier}</td>
                                    <td className="p-4 text-slate-600">{item.warehouse}</td>
                                    <td className="p-4 font-bold text-slate-800">{item.total}</td>
                                    <td className="p-4 text-slate-500 italic">{item.note}</td>
                                    <td className="p-4 font-bold text-slate-800">{item.status}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setModalType('edit')}
                                                className="p-1.5 border-2 border-slate-700 text-slate-700 rounded hover:bg-slate-700 hover:text-white transition-all"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => setModalType('delete')}
                                                className="p-1.5 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- NHÚNG COMPONENT MODAL --- */}
            <ImportModals
                isOpen={modalType !== null}
                type={modalType}
                onClose={() => setModalType(null)}
            />

        </div>
    );
}