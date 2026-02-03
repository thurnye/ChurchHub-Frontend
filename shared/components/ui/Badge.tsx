import { View, Text, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";
import type { ReactNode } from "react";

const badgeVariants = cva(
  "flex-row items-center justify-center rounded-md px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-gray-900",
        secondary: "bg-gray-100",
        destructive: "bg-red-600",
        outline: "border border-gray-300 bg-transparent",
        success: "bg-green-100",
        warning: "bg-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const textVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-gray-900",
      destructive: "text-white",
      outline: "text-gray-900",
      success: "text-green-800",
      warning: "text-amber-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends ViewProps,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, variant, className, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {typeof children === "string" ? (
        <Text className={cn(textVariants({ variant }))}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
