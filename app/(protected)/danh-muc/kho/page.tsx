"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Edit, Trash2, Search, ChevronDown, Plus, Filter, Loader2 } from "lucide-react";
import {
    KhoHangResponse,
    CreateKhoHangRequest,
    UpdateKhoHangRequest
} from "@/client/types.gen";
import AddKhoModal from "@/components/kho/AddKhoModal";
import EditKhoModal from "@/components/kho/EditKhoModal";
import DeleteKhoModal from "@/components/kho/DeleteKhoModal";
import { khoHangService } from "@/services/kho-hang.service";
import AddButton from "@/components/ui/AddButton";
export default function KhoPage() {
    const [query, setQuery] = useState("");
    const [khoData, setKhoData] = useState<KhoHangResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhoHangResponse | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await khoHangService.getAll();
            setKhoData(data);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            // Optional: Add toast error here
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const filteredData = khoData.filter((k) =>
        `${k.tenKho} ${k.diaChi} ${k.ghiChu ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );
    // --- Modal Handlers ---
    const openAdd = () => {
        setModalType('add');
    };
    const openEdit = (kho: KhoHangResponse) => {
        setSelectedItem(kho);
        setModalType('edit');
    };
    const openDelete = (kho: KhoHangResponse) => {
        setSelectedItem(kho);
        setModalType('delete');
    };
    const openFilter = () => {
        setModalType('filter');
    };
    const closeModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };
    // --- CRUD Handlers ---
    const handleCreate = async (newData: CreateKhoHangRequest) => {
        try {
            await khoHangService.create(newData);
            await fetchData();
            closeModal();
        } catch (error) {
            alert("Tạo kho hàng mới thất bại!");
        }
    };
    const handleUpdate = async (id: string, updatedData: UpdateKhoHangRequest) => {
        try {
            await khoHangService.update(id, updatedData);
            await fetchData();
            closeModal();
        } catch (error) {
            alert("Failed to update warehouse");
        }
    };
    const handleDelete = async (id: string) => {
        try {
            await khoHangService.delete(id);
            setKhoData(prev => prev.filter(k => k.maKho !== id));
            closeModal();
        } catch (error) {
            alert("Failed to delete warehouse.");
        }
    };
    const renderStatus = (status: string | null | undefined) => {
        const isActive = status === "HOAT_DONG";
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>
                {isActive ? "Hoạt động" : "Ngưng hoạt động"}
            </span>
        );
    };
    // TODO: Get real role from auth/session
    const userRole: "manager" | "staff" = "manager";

    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-end w-full mb-6">
                <div className="flex shadow-sm rounded-md overflow-hidden bg-white border-slate-200">
                    {/* Dropdown */}
                    <button className="px-4 py-2 text-sm font-medium flex items-center gap-2 bg-[#25396f] text-white rounded-l-lg hover:bg-[#1e2e5a] transition-colors shadow-md">
                        <span>Tất cả</span>
                        <ChevronDown size={14} />
                    </button>

                    {/* Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-72 py-2 pl-4 pr-10 text-sm border-0 focus:ring-0 outline-none h-full"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Search size={16} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách kho
                            <Filter
                                onClick={() => openFilter()}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    {(userRole === "manager") &&
                        (<AddButton onClick={() => openAdd()} />)}
                </div>

                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm border-separate border-spacing-y-1 table-fixed min-w-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold bg-[#e9eff6] text-slate-800 uppercase tracking-wider">
                                <th className="py-3 pl-3 rounded-l-lg w-[10%]">Mã kho</th>
                                <th className="py-3 w-[20%]">Tên kho</th>
                                <th className="py-3 w-[25%]">Địa chỉ</th>
                                <th className="py-3 text-center w-[13%]">Trạng thái</th>
                                <th className="py-3 w-[20%]">Ghi chú</th>
                                <th className="py-3 px-4 text-right rounded-r-lg whitespace-nowrap w-[12%]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="animate-pulse bg-white border-b border-slate-100">
                                        {/* Column 1: Ma Kho */}
                                        <td className="py-4 pl-3 border-y border-l border-slate-50 rounded-l-lg">
                                            <div className="h-4 bg-slate-200 rounded w-12"></div>
                                        </td>
                                        {/* Column 2: Ten Kho */}
                                        <td className="py-4 border-y border-slate-50">
                                            <div className="h-4 bg-slate-200 rounded w-32 mb-1"></div>
                                            <div className="h-3 bg-slate-100 rounded w-20"></div>
                                        </td>
                                        {/* Column 3: Dia Chi */}
                                        <td className="py-4 border-y border-slate-50">
                                            <div className="h-4 bg-slate-200 rounded w-48"></div>
                                        </td>
                                        {/* Column 4: Trang Thai */}
                                        <td className="py-4 border-y border-slate-50 text-center flex justify-center">
                                            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                                        </td>
                                        {/* Column 5: Ghi Chu */}
                                        <td className="py-4 border-y border-slate-50">
                                            <div className="h-4 bg-slate-200 rounded w-24"></div>
                                        </td>
                                        {/* Column 6: Actions */}
                                        <td className="py-4 px-4 text-right border-y border-r border-slate-50 rounded-r-lg">
                                            <div className="flex justify-end gap-2">
                                                <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                                                <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredData.map((k) => (
                                    <tr
                                        key={k.maKho}
                                        className="group hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f1f5f9] text-left">

                                        <td className="py-3 pl-3 font-medium text-slate-700 border-y border-l border-slate-100 rounded-l-lg group-hover:border-slate-200">
                                            {k.maKhoCode || '-'}
                                        </td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-700 font-medium">{k.tenKho}</td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 text-slate-500">{k.diaChi}</td>
                                        <td className="py-3 text-center">
                                            {renderStatus(k.trangThai)}
                                        </td>
                                        <td className="py-3 border-y border-slate-100 group-hover:border-slate-200 font-medium text-slate-700">{k.ghiChu ?? "-"}</td>
                                        <td className="py-3 px-4 text-right border-y border-r border-slate-100 rounded-r-lg group-hover:border-slate-200 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2 justify-end">
                                                {(userRole === "manager") && (
                                                    <button
                                                        onClick={() => openEdit(k)}
                                                        className="p-2 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer">
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {userRole === "manager" && (
                                                    <button
                                                        onClick={() => openDelete(k)}
                                                        className="p-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalType === 'add' && (
                <AddKhoModal
                    onClose={() => closeModal()}
                    onAdd={handleCreate}
                />
            )}
            {modalType === 'edit' && selectedItem && (
                <EditKhoModal
                    kho={selectedItem}
                    onClose={() => closeModal()}
                    onUpdate={handleUpdate}
                />
            )}
            {modalType === 'delete' && selectedItem && (
                <DeleteKhoModal
                    kho={selectedItem}
                    onClose={() => closeModal()}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}