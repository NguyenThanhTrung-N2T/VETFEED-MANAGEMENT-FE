import React from "react";
import { CalendarDays, Folder, BarChart3, ShoppingCart, Users, Package } from "lucide-react";
import AnimatedHeader from "@/components/ui/AnimatedHeader";

export type PageHeaderType = 'cong-no' | 'danh-muc' | 'bao-cao';

const HEADER_CONFIG: Record<PageHeaderType, { icon: React.ElementType, color: string }> = {
    'cong-no': {
        icon: CalendarDays,
        color: "bg-gradient-to-br from-[#25396f] to-[#1e2e5a]" // Dark Blue
    },
    'danh-muc': {
        icon: Folder,
        color: "bg-gradient-to-br from-[#25396f] to-[#1e2e5a]" // Dark Blue
    },
    'bao-cao': {
        icon: BarChart3,
        color: "bg-gradient-to-br from-[#25396f] to-[#1e2e5a]" // Dark Blue
    }
};

interface PageHeaderProps {
    type: PageHeaderType;
    title: string;
    description: string;
}

// This is a Server Component
export default function PageHeader({ type, title, description }: PageHeaderProps) {
    const config = HEADER_CONFIG[type] || HEADER_CONFIG['cong-no']; // Fallback
    const IconComponent = config.icon;

    return (
        <AnimatedHeader
            title={title}
            description={description}
            // We render the icon here on the server to avoid serialization errors
            icon={<IconComponent size={24} />}
            iconColorClass={config.color}
        />
    );
}