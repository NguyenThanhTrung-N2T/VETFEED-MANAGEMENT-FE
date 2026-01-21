import PageHeader from "@/components/ui/PageHeader";
import DanhMucTabs from "@/app/(protected)/danh-muc/DanhMucTabs"
export default function CongNoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen relative">
            <PageHeader
                type="danh-muc"
                title="Quản lý danh mục"
                description="Quản lý nhà cung cấp, kho, sản phẩm và khách hàng."
            />
            <div className="-mx-6 h-px bg-slate-300 mb-6" />
            <DanhMucTabs />
            {children}
        </div>
    );
}