import PageHeader from "@/components/ui/PageHeader";

export default function CongNoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 bg-[#eef2f6] min-h-screen relative">
            <PageHeader
                type="cong-no"
                title="Quản lý Công Nợ"
                description="Theo dõi công nợ khách hàng."
            />
            <div className="-mx-6 h-px bg-slate-300 mb-6" />
            {children}
        </div>
    );
}