import React from "react";
import { Badge } from "../../../../components/ui/Badge";
import type { BadgeVariant } from "../../../../components/ui/Badge";

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const configs: Record<string, { variant: BadgeVariant; label: string }> = {
        CONFIRMED: { variant: "success", label: "Confirmed" },
        WAITLISTED: { variant: "warning", label: "Waitlisted" },
        PENDING: { variant: "warning", label: "Pending" },
        CANCELLED: { variant: "neutral", label: "Cancelled" },
        ATTENDED: { variant: "info", label: "Attended" },
    };

    const config = configs[status] || { variant: "neutral", label: "Unknown" };

    return <Badge variant={config.variant}>{config.label}</Badge>;
};
