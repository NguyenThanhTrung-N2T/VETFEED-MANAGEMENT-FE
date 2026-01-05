"use client";

import React, { useState } from 'react';
import {
    Search, Plus, ChevronDown, Edit, Trash2, Filter, FileText, CornerUpLeft
} from 'lucide-react';
import ReturnModals from '@/components/ReturnModals';

const RETURN_DATA = [
    { id: '20001', date: '22/04/2022', type: 'Trả bán', partner: 'Chí Vỹ', warehouse: 'Kho Tân Thông' },
    { id: '20002', date: '12/05/2022', type: 'Trả nhập', partner: 'Công ty thuốc thú y An Phát', warehouse: 'Kho Thủ Đức' },
    { id: '20003', date: '10/06/2022', type: 'Trả bán', partner: 'Lê Hoài', warehouse: 'Kho Củ Chi' },
    { id: '20004', date: '20/06/2022', type: 'Trả nhập', partner: 'Công ty thức ăn chăn nuôi Việt Nam', warehouse: 'Kho Hóc Môn' },
    { id: '20005', date: '10/07/2022', type: 'Trả bán', partner: 'Lê Minh', warehouse: 'Kho Linh Trung' },
    { id: '20006', date: '11/08/2022', type: 'Trả bán', partner: 'Nguyễn Thanh Phong', warehouse: 'Kho Nhà Bè' },
    { id: '20007', date: '15/01/2023', type: 'Trả nhập', partner: 'Trang trại vui vẻ', warehouse: 'Kho Hóc Môn' },
    { id: '20008', date: '10/06/2023', type: 'Trả bán', partner: 'Lê Hoàn', warehouse: 'Kho Củ Chi' },
    { id: '20009', date: '10/07/2025', type: 'Trả bán', partner: 'Lê Long Đĩnh', warehouse: 'Kho Củ Chi' },
];

export default function ReturnPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    // Lọc dữ liệu đơn giản
    const filteredData = RETURN_DATA.filter(item =>
        item.id.includes(searchTerm) ||
        item.partner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">

            {/* --- HEADER --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    {/* Icon mũi tên quay lại (Return) */}
                    <div className="p-1.5 bg-slate-800 rounded text-white">
                        <CornerUpLeft size={20} />
                    </div>
                    Trả hàng
                </h1>
            </div>

            {/* --- TOOLBAR --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative">
                    <button className="flex items-center justify-between w-32 px-4 py-2.5 bg-[#25396f] text-white rounded-lg hover:bg-[#1e2e5a] transition-colors shadow-md">
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

            {/* --- MAIN TABLE CARD --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[500px]">

                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách phiếu trả
                            {/* Icon Filter trigger modal */}
                            <Filter
                                onClick={() => setModalType('filter')}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#25396f] hover:bg-[#1e2e5a] text-white rounded-lg font-medium transition-colors shadow-md">
                            <span>Chi tiết</span>
                            <FileText size={18} />
                        </button>
                        <button
                            onClick={() => setModalType('add')}
                            className="flex items-center gap-2 px-5 py-2 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-green-100 shadow-lg"
                        >
                            <span>Thêm</span>
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#e9eff6] text-slate-800 text-sm font-bold uppercase tracking-wide">
                                <th className="p-4 border-b border-gray-200">Số phiếu</th>
                                <th className="p-4 border-b border-gray-200">Ngày trả</th>
                                <th className="p-4 border-b border-gray-200">Loại trả</th>
                                <th className="p-4 border-b border-gray-200">Khách hàng/Nhà cung cấp</th>
                                <th className="p-4 border-b border-gray-200">Kho nhập/xuất</th>
                                <th className="p-4 border-b border-gray-200 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {filteredData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 
                    ${index % 2 === 0 ? 'bg-white' : 'bg-[#f1f5f9]'}`
                                    }
                                    onDoubleClick={() => setModalType('detail')}
                                >
                                    <td className="p-4 font-medium text-slate-600 cursor-pointer" onClick={() => setModalType('detail')}>{item.id}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">{item.type}</td>
                                    <td className="p-4 font-medium text-slate-800">{item.partner}</td>
                                    <td className="p-4 text-slate-600">{item.warehouse}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setModalType('edit')}
                                                className="p-1.5 border-2 border-slate-700 text-slate-700 rounded hover:bg-slate-700 hover:text-white transition-all"
                                            >
                                                <Edit size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => setModalType('delete')}
                                                className="p-1.5 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
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

            {/* --- MODALS --- */}
            <ReturnModals
                isOpen={modalType !== null}
                type={modalType}
                onClose={() => setModalType(null)}
            />

        </div>
    );
}