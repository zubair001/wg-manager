import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CardActionsButtonProps = {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
};

export function CardActionsButton({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
}: CardActionsButtonProps) {
  const baseStyle = "flex-1 text-sm font-medium transition-all";

  const variants = {
    primary:
      "bg-gray-900 text-white border border-blue-600 hover:bg-gray-500 hover:border-gray-900 hover:shadow-md",
    secondary: "bg-gray-200 text-gray-99 hover:bg-gray-500",
  };

  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyle, variants[variant], className)}
    >
      {children}
    </Button>
  );
}
