import type { OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/Badge";

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: "primary" | "default" | "sale" | "new" | "success" | "warning" | "info" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "primary" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "new" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "sale" },
  refunded: { label: "Refunded", variant: "default" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
