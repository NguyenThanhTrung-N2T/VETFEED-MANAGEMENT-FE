"use client";

import React, { useState } from 'react';
import {
    Search, ChevronDown, ChevronRight, Edit, Trash2, Filter, Upload, Package
} from 'lucide-react';
import InventoryModals from '@/components/InventoryModals';

// Mock Data: (Kho -> Danh sách sản phẩm)
const INVENTORY_DATA = [
    {
        id: 'kho1',
        name: 'Kho Vận Linh Xuân',
        items: [
            { id: '1001', code: '1001', name: 'Antibiotic', price: '70.000', qty: 100 },
            { id: '1002', code: '1001', name: 'Peptide', price: '630.000', qty: 100 },
            { id: '1003', code: '1002', name: 'Steroid', price: '1.000.000', qty: 50 },
        ]
    },
    {
        id: 'kho2',
        name: 'Kho Tame Impala',
        items: [
            { id: '2001', code: '2001', name: 'Vaccine A', price: '150.000', qty: 200 },
            { id: '2002', code: '2002', name: 'Vaccine B', price: '250.000', qty: 120 },
            { id: '2003', code: '2003', name: 'Vitamin C', price: '50.000', qty: 500 },
            { id: '2004', code: '2004', name: 'Men tiêu hóa', price: '30.000', qty: 300 },
        ]
    },
    {
        id: 'kho3',
        name: 'Kho B',
        items: [
            { id: '3001', code: '3001', name: 'Cám Gà', price: '20.000', qty: 1000 },
            { id: '3002', code: '3002', name: 'Cám Heo', price: '25.000', qty: 800 },
            { id: '3003', code: '3003', name: 'Bột Cá', price: '40.000', qty: 200 },
            { id: '3004', code: '3004', name: 'Ngô Hạt', price: '15.000', qty: 1500 },
            { id: '3005', code: '3005', name: 'Khô Đậu', price: '35.000', qty: 400 },
            { id: '3006', code: '3006', name: 'Premix', price: '120.000', qty: 100 },
        ]
    },
    {
        id: 'kho4',
        name: 'Kho 4 Non Blondes',
        items: [
            { id: '4001', code: '4001', name: 'Thuốc Sát Trùng', price: '80.000', qty: 50 },
            { id: '4002', code: '4002', name: 'Bơm Tiêm', price: '5.000', qty: 1000 },
            { id: '4003', code: '4003', name: 'Kim Tiêm', price: '1.000', qty: 5000 },
            { id: '4004', code: '4004', name: 'Khẩu Trang', price: '2.000', qty: 2000 },
            { id: '4005', code: '4005', name: 'Găng Tay', price: '3.000', qty: 3000 },
        ]
    },
    {
        id: 'kho5',
        name: 'Kho A',
        items: [
            { id: '5001', code: '5001', name: 'Thuốc Kháng Sinh', price: '90.000', qty: 300 },
            { id: '5002', code: '5002', name: 'Thuốc Bổ', price: '60.000', qty: 400 },
            { id: '5003', code: '5003', name: 'Thuốc Giảm Đau', price: '45.000', qty: 250 },
            { id: '5004', code: '5004', name: 'Thuốc Hạ Sốt', price: '35.000', qty: 600 },
            { id: '5005', code: '5005', name: 'Thuốc Tẩy Giun', price: '25.000', qty: 800 },
            { id: '5006', code: '5006', name: 'Thuốc Trị Ve', price: '75.000', qty: 150 },
            { id: '5007', code: '5007', name: 'Thuốc Trị Nấm', price: '55.000', qty: 200 },
            { id: '5008', code: '5008', name: 'Thuốc Nhỏ Mắt', price: '40.000', qty: 300 },
            { id: '5009', code: '5009', name: 'Thuốc Nhỏ Tai', price: '45.000', qty: 250 },
            { id: '5010', code: '5010', name: 'Dầu Gội Chó Mèo', price: '100.000', qty: 100 },
        ]
    },
    {
        id: 'kho6',
        name: 'Kho Kevin Parker',
        items: [
            { id: '6001', code: '6001', name: 'Vắc xin Dại', price: '120.000', qty: 100 },
            { id: '6002', code: '6002', name: 'Vắc xin Care', price: '150.000', qty: 150 },
            { id: '6003', code: '6003', name: 'Vắc xin Parvo', price: '140.000', qty: 120 },
            { id: '6004', code: '6004', name: 'Vắc xin Lepto', price: '130.000', qty: 110 },
            { id: '6005', code: '6005', name: 'Vắc xin Viêm Gan', price: '135.000', qty: 130 },
            { id: '6006', code: '6006', name: 'Huyết Thanh', price: '200.000', qty: 50 },
            { id: '6007', code: '6007', name: 'Que Test Parvo', price: '80.000', qty: 200 },
            { id: '6008', code: '6008', name: 'Que Test Care', price: '85.000', qty: 180 },
            { id: '6009', code: '6009', name: 'Sổ Khám Bệnh', price: '5.000', qty: 500 },
        ]
    },
    {
        id: 'kho7',
        name: 'Kho Kanye West',
        items: [
            { id: '7001', code: '7001', name: 'Yeezy Slide', price: '2.000.000', qty: 10 },
            { id: '7002', code: '7002', name: 'Yeezy Foam Runner', price: '3.000.000', qty: 5 },
            { id: '7003', code: '7003', name: 'Áo Hoodie', price: '1.500.000', qty: 20 },
            { id: '7004', code: '7004', name: 'Quần Jogger', price: '1.200.000', qty: 15 },
            { id: '7005', code: '7005', name: 'Mũ Lưỡi Trai', price: '500.000', qty: 30 },
            { id: '7006', code: '7006', name: 'Tất', price: '200.000', qty: 50 },
            { id: '7007', code: '7007', name: 'Balo', price: '2.500.000', qty: 8 },
            { id: '7008', code: '7008', name: 'Túi Đeo Chéo', price: '1.000.000', qty: 12 },
            { id: '7009', code: '7009', name: 'Giày Sneaker', price: '5.000.000', qty: 3 },
            { id: '7010', code: '7010', name: 'Áo Phông', price: '800.000', qty: 25 },
            { id: '7011', code: '7011', name: 'Áo Khoác', price: '4.000.000', qty: 4 },
        ]
    },
    {
        id: 'kho8',
        name: 'Kho Eminem',
        items: [
            { id: '8001', code: '8001', name: 'Micro', price: '5.000.000', qty: 10 },
            { id: '8002', code: '8002', name: 'Tai Nghe', price: '3.000.000', qty: 15 },
            { id: '8003', code: '8003', name: 'Loa', price: '4.000.000', qty: 8 },
            { id: '8004', code: '8004', name: 'Đĩa CD', price: '300.000', qty: 100 },
            { id: '8005', code: '8005', name: 'Đĩa Than', price: '800.000', qty: 50 },
            { id: '8006', code: '8006', name: 'Áo Thun Rap', price: '500.000', qty: 30 },
            { id: '8007', code: '8007', name: 'Mũ Rap', price: '300.000', qty: 40 },
            { id: '8008', code: '8008', name: 'Dây Chuyền', price: '1.000.000', qty: 20 },
            { id: '8009', code: '8009', name: 'Nhẫn', price: '500.000', qty: 25 },
        ]
    },
    {
        id: 'kho9',
        name: 'Kho Sam Sulek',
        items: [
            { id: '9001', code: '9001', name: 'Whey Protein', price: '1.500.000', qty: 50 },
            { id: '9002', code: '9002', name: 'Creatine', price: '500.000', qty: 30 },
            { id: '9003', code: '9003', name: 'Pre-workout', price: '800.000', qty: 40 },
            { id: '9004', code: '9004', name: 'BCAA', price: '600.000', qty: 35 },
            { id: '9005', code: '9005', name: 'Vitamin Tổng Hợp', price: '400.000', qty: 60 },
            { id: '9006', code: '9006', name: 'Dầu Cá', price: '300.000', qty: 70 },
            { id: '9007', code: '9007', name: 'Áo Tank Top', price: '250.000', qty: 100 },
            { id: '9008', code: '9008', name: 'Quần Short Gym', price: '300.000', qty: 80 },
            { id: '9009', code: '9009', name: 'Găng Tay Gym', price: '150.000', qty: 50 },
            { id: '9010', code: '9010', name: 'Đai Lưng', price: '400.000', qty: 20 },
            { id: '9011', code: '9011', name: 'Bình Lắc', price: '100.000', qty: 120 },
            { id: '9012', code: '9012', name: 'Tạ Đơn', price: '50.000', qty: 200 },
            { id: '9013', code: '9013', name: 'Thảm Tập', price: '200.000', qty: 40 },
        ]
    },
];

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalType, setModalType] = useState<'filter' | 'delete' | null>(null);

    // State quản lý việc mở rộng/thu gọn các Kho
    // Mặc định mở kho đầu tiên để demo
    const [expandedIds, setExpandedIds] = useState<string[]>(['kho1']);

    // Hàm toggle mở/đóng kho
    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen font-sans relative">

            {/* --- HEADER --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded text-white">
                        <Package size={20} />
                    </div>
                    Tồn kho
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
                            Danh sách tồn kho
                            <Filter
                                onClick={() => setModalType('filter')}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-5 py-2 bg-[#43a047] hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-green-100 shadow-lg">
                            <span>Xuất file</span>
                            <Upload size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Header Columns (Sticky top if needed) */}
                <div className="px-6 pb-2">
                    <div className="grid grid-cols-12 gap-4 text-sm font-bold text-slate-800 bg-[#e9eff6] p-4 rounded-t-lg">
                        <div className="col-span-4 pl-2">Kho</div>
                        <div className="col-span-2 text-center">Số phiếu nhập</div>
                        <div className="col-span-2">Sản phẩm</div>
                        <div className="col-span-2 text-right">Đơn giá (VNĐ)</div>
                        <div className="col-span-1 text-center">Số lượng</div>
                        <div className="col-span-1 text-center">Hành động</div>
                    </div>
                </div>

                {/* Accordion List */}
                <div className="px-6 pb-6 space-y-1">
                    {INVENTORY_DATA.map((warehouse) => {
                        const isExpanded = expandedIds.includes(warehouse.id);
                        return (
                            <div key={warehouse.id} className="border border-transparent rounded-lg overflow-hidden">
                                {/* WAREHOUSE HEADER ROW (Clickable) */}
                                <div
                                    onClick={() => toggleExpand(warehouse.id)}
                                    className={`flex items-center p-4 cursor-pointer transition-colors
                            ${isExpanded ? 'bg-blue-50/50' : 'bg-[#f1f5f9] hover:bg-slate-200'}
                        `}
                                >
                                    <div className="flex items-center gap-2 font-bold text-slate-700 flex-1">
                                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        {warehouse.name} ({warehouse.items.length})
                                    </div>
                                </div>

                                {/* CHILD ITEMS (Shown when expanded) */}
                                {isExpanded && (
                                    <div className="bg-white border-x border-b border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                        {warehouse.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-slate-50 items-center text-sm"
                                            >
                                                {/* Cột Kho để trống để tạo hiệu ứng thụt đầu dòng, hoặc fill nếu cần */}
                                                <div className="col-span-4"></div>

                                                <div className="col-span-2 text-center text-slate-700 font-mono">{item.code}</div>
                                                <div className="col-span-2 font-medium text-slate-700">{item.name}</div>
                                                <div className="col-span-2 text-right text-slate-700 font-medium">{item.price}</div>
                                                <div className="col-span-1 text-center text-slate-700">{item.qty}</div>

                                                <div className="col-span-1 flex justify-center gap-2">
                                                    <button className="p-1.5 border-2 border-slate-700 text-slate-700 rounded hover:bg-slate-700 hover:text-white transition-all">
                                                        <Edit size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => setModalType('delete')}
                                                        className="p-1.5 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- MODALS --- */}
            <InventoryModals
                isOpen={modalType !== null}
                type={modalType}
                onClose={() => setModalType(null)}
            />

        </div>
    );
}