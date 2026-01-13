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

// TODO: Replace with real API call - fetch from /api/kho
// const MOCK_KhoHang: KhoHangDTO[] = [
//     {
//         MaKho: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
//         MaKhoCode: "KHO_HCM",
//         TenKho: "Kho Vận Linh Xuân",
//         DiaChi: "123 QL1A, TP. Thủ Đức, TP.HCM",
//         TrangThai: "HOAT_DONG",
//         GhiChu: "Note",
//         NgayTao: new Date().toISOString(),
//     },
//     {
//         MaKho: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
//         MaKhoCode: "KHO_A",
//         TenKho: "Kho A",
//         DiaChi: "45 Nguyễn Văn Linh, Q.7, TP.HCM",
//         TrangThai: "HOAT_DONG",
//         GhiChu: null,
//         NgayTao: new Date().toISOString(),
//     },
//     {
//         MaKho: "ccccccc3-cccc-cccc-cccc-cccccccccccc",
//         MaKhoCode: "KHO_4",
//         TenKho: "Kho 4 Non Blonds",
//         DiaChi: "210 Trần Phú, TP. Long Khánh, Đồng Nai",
//         TrangThai: "NGUNG_HOAT_DONG",
//         GhiChu: "20kg",
//         NgayTao: new Date().toISOString(),
//     },
// ];

export default function KhoPage() {
    const [query, setQuery] = useState("");
    // TODO: Replace with real data fetching
    // Example: const { data: khoHangs, isLoading } = useSWR('/api/kho', fetcher);
    const [khoData, setKhoData] = useState<KhoHangResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modalType, setModalType] = useState<'filter' | 'delete' | 'add' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<KhoHangResponse | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await khoHangService.getAll();
            // Ensure data types match. If your API returns PascalCase, it maps directly.
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
    // --- Modal States ---
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
        // MOCK
        // console.log("Saving new kho:", newData);
        // setKhoData((prev) => [newData, ...prev]); // Add to top of list

        try {
            await khoHangService.create(newData);
            await fetchData();
            closeModal();
        } catch (error) {
            alert("Tạo kho hàng mới thất bại!");
        }
    };
    const handleUpdate = async (id: string, updatedData: UpdateKhoHangRequest) => {
        // MOCK
        // console.log("Updating kho:", updatedData);
        // setKhoData((prev) =>
        //     prev.map((k) => (k.MaKho === updatedData.MaKho ? updatedData : k))
        // );
        // Real App (API Call) 
        try {
            // We need to separate the ID from the body

            await khoHangService.update(id, updatedData);
            await fetchData();
            closeModal();
        } catch (error) {
            alert("Failed to update warehouse");
        }
    };
    const handleDelete = async (id: string) => {
        // API Call here...
        //setKhoData(prev => prev.filter(k => k.MaKho !== id));
        try {
            await khoHangService.delete(id);
            setKhoData(prev => prev.filter(k => k.maKho !== id));
            closeModal();
        } catch (error) {
            alert("Failed to delete warehouse.");
        }
    };
    const renderStatus = (status: string | null | undefined) => {
        // Your API might return "0"/"1" or "Active"/"Inactive" or "HOAT_DONG"
        // Adjust this logic based on what you see in the Network tab
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-125">
                {/* Card Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Danh sách kho
                            <Filter
                                onClick={() => setModalType('filter')}
                                className="cursor-pointer hover:text-green-600 transition-colors ml-1"
                                size={20}
                                strokeWidth={1.5}
                            />
                        </h2>
                    </div>

                    {(userRole === "manager") &&
                        (<button
                            onClick={() => openAdd()}
                            className="justify-center w-30 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-[#43a047] hover:bg-green-700 text-white font-medium transition-colors shadow-green-100 shadow-lg leading-none cursor-pointer"
                        >
                            <Plus size={16} className="font-white" /><span>Thêm</span>
                        </button>)}
                </div>
                <div className="overflow-x-auto px-6 pb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-[#E3EDF9] border-separate">
                                <th className="py-3 pl-3 rounded-l-xl">Mã kho</th>
                                <th className="py-3">Tên kho</th>
                                <th className="py-3">Địa chỉ</th>
                                <th className="py-3 text-center">Trạng thái</th>
                                <th className="py-3">Ghi chú</th>
                                <th className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredData.map((k) => (
                                <tr
                                    key={k.maKho}
                                    className="hover:bg-slate-50 transition-colors last:border-0 odd:bg-white even:bg-[#E3EDF9]"
                                >

                                    <td className="py-3 pl-3 font-medium text-slate-700 rounded-l-xl">
                                        {k.maKhoCode || '-'}
                                    </td>
                                    <td className="py-3 text-slate-600">{k.tenKho}</td>
                                    <td className="py-3 text-slate-600">{k.diaChi}</td>
                                    <td className="py-3 text-center">
                                        {renderStatus(k.trangThai)}
                                    </td>
                                    <td className="py-3 text-slate-600">{k.ghiChu ?? "-"}</td>
                                    <td className="py-3 px-4 text-right rounded-r-xl w-px whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2">
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
                            ))}
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