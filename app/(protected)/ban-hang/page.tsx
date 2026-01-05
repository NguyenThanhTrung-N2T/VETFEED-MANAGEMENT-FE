"use client";

import React, { useState } from 'react';
import {
    Search, Plus, Filter, Edit, Trash2,
    ChevronDown, DollarSign
} from 'lucide-react';
import SalesModals from '@/components/SalesModals';

const SALES_DATA = [
    { id: '10000', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10001', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10002', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10003', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10004', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10005', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10006', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
    { id: '10007', date: '01/10/2000', customer: 'Nguyễn Văn A', phone: '0123456789', total: '1.800.000', note: 'Không có' },
];

export default function SalesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // State quản lý Modal
    const [modalType, setModalType] = useState<'filter' | 'add' | 'edit' | 'detail' | 'delete' | null>(null);

    // Lọc dữ liệu (Giả lập)
    const filteredData = SALES_DATA.filter(item =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.includes(searchTerm)
    );

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">

            {/* --- HEADER --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-sans">
                    <DollarSign className="text-slate-800" size={28} />
                    Bán hàng
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

            {/* --- MAIN CARD --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[500px] border border-gray-100">

                {/* Card Header: Tiêu đề + Nút Filter + Nút Thêm */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800">Danh sách phiếu</h2>
                        {/* Click vào icon phễu để mở modal Filter */}
                        <Filter
                            onClick={() => setModalType('filter')}
                            size={24}
                            strokeWidth={1.5}
                            className="text-slate-800 cursor-pointer hover:text-green-600 transition-colors ml-1"
                        />
                    </div>

                    <button
                        onClick={() => setModalType('add')}
                        className="flex items-center gap-2 px-6 py-2 bg-[#388e3c] hover:bg-green-700 text-white rounded-lg font-bold transition-colors shadow-green-100 shadow-lg"
                    >
                        <span>Thêm</span>
                        <Plus size={20} />
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-[#e2e8f0] text-slate-800 text-sm font-bold uppercase tracking-wide">
                                <th className="p-4 border-b border-gray-200">Số phiếu</th>
                                <th className="p-4 border-b border-gray-200">Ngày bán</th>
                                <th className="p-4 border-b border-gray-200">Khách hàng</th>
                                <th className="p-4 border-b border-gray-200">Số điện thoại</th>
                                <th className="p-4 border-b border-gray-200">Tiền thanh toán (VNĐ)</th>
                                <th className="p-4 border-b border-gray-200">Ghi chú</th>
                                <th className="p-4 border-b border-gray-200 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {filteredData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 
                    ${index % 2 === 0 ? 'bg-white' : 'bg-[#f1f5f9]'}` // Zebra stripe: Trắng / Xám nhạt
                                    }
                                    onDoubleClick={() => setModalType('detail')}
                                >
                                    <td className="p-4 font-medium text-slate-600 cursor-pointer" onClick={() => setModalType('detail')}>{item.id}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4 font-semibold text-slate-800">{item.customer}</td>
                                    <td className="p-4 font-mono text-slate-600">{item.phone}</td>
                                    <td className="p-4 font-medium text-slate-800">{item.total}</td>
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

            {/* --- NHÚNG COMPONENT MODAL --- */}
            <SalesModals
                isOpen={modalType !== null}
                type={modalType}
                onClose={() => setModalType(null)}
            />

        </div>
    );
}