"use client";

type Props = {
  stock: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function StockIndicator({
  stock,
  showCount = true,
  size = "md",
}: Props) {
  const getStatus = () => {
    if (stock === 0) return "out";
    if (stock < 5) return "critical";
    if (stock < 10) return "low";
    return "normal";
  };

  const status = getStatus();

  const statusConfig = {
    out: {
      dot: "bg-red-500",
      text: "text-red-500",
      label: "Hết hàng",
    },
    critical: {
      dot: "bg-orange-500",
      text: "text-orange-500",
      label: "Sắp hết",
    },
    low: {
      dot: "bg-yellow-500",
      text: "text-yellow-600",
      label: "Còn ít",
    },
    normal: {
      dot: "bg-green-500",
      text: "text-green-600",
      label: "Còn hàng",
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      <span
        className={`block w-2 h-2 rounded-full ${config.dot} ${
          status === "critical" ? "animate-pulse" : ""
        }`}
      />
      <span className={config.text}>
        {config.label}
        {showCount && stock > 0 && ` (${stock})`}
      </span>
    </div>
  );
}
