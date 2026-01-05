"use client";

import React, { useState } from 'react';
import {
    Search, Plus, ChevronDown, Edit, Trash2, ArrowRightLeft, Filter, FileText
} from 'lucide-react';
import TransferModals from '@/components/TransferModals';

const TRANSFER_DATA = [
    { id: '10001', date: '22/04/2022', from: 'Kho Thủ Đức', to: 'Kho Tân Thông', note: 'Không có' },
    { id: '10002', date: '11/05/2022', from: 'Kho Củ Chi', to: 'Kho Tân Thông', note: 'Cần gấp' },
    { id: '10003', date: '11/06/2023', from: 'Kho Hóc Môn', to: 'Kho Thủ Đức', note: 'Không có' },
    { id: '10004', date: '17/07/2023', from: 'Kho Thủ Đức', to: 'Kho Củ Chi', note: 'Không có' },
    { id: '10005', date: '20/07/2024', from: 'Kho Thủ Đức', to: 'Kho Linh Trung', note: 'Cần gấp' },
    { id: '10006', date: '11/06/2025', from: 'Kho Nhà Bè', to: 'Kho Thủ Đức', note: 'Không có' },
    { id: '10007', date: '11/08/2025', from: 'Kho Thủ Đức', to: 'Kho Tân Phú', note: 'Đổi nơi lưu trữ' },
    { id: '10008', date: '21/09/2025', from: 'Kho Tân Phú', to: 'Kho Thủ Đức', note: 'Không có' },
    { id: '10009', date: '11/11/2025', from: 'Kho Thủ Đức', to: 'Kho Củ Chi', note: 'Không có' },
];

export default function TransferPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    // Lọc dữ liệu đơn giản
    const filteredData = TRANSFER_DATA.filter(item =>
        item.id.includes(searchTerm) ||
        item.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.to.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">

            {/* --- HEADER --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1 bg-slate-800 rounded text-white">
                        <ArrowRightLeft size={20} />
                    </div>
                    Chuyển kho
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
                            Danh sách phiếu chuyển
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
                                <th className="p-4 border-b border-gray-200">Ngày lập</th>
                                <th className="p-4 border-b border-gray-200">Kho xuất</th>
                                <th className="p-4 border-b border-gray-200">Kho nhận</th>
                                <th className="p-4 border-b border-gray-200">Ghi chú</th>
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
                                    <td className="p-4 font-medium text-slate-800">{item.from}</td>
                                    <td className="p-4 font-medium text-slate-800">{item.to}</td>
                                    <td className="p-4 text-slate-500">{item.note}</td>
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
            <TransferModals
                isOpen={modalType !== null}
                type={modalType}
                onClose={() => setModalType(null)}
            />

        </div>
    );
}