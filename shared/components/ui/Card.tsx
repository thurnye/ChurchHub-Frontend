import { View, type ViewProps } from "react-native";
import { cn } from "@/shared/utils/cn";
import type { ReactNode } from "react";

export interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-white rounded-xl border border-gray-200 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <View className={cn("p-4", className)} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <View className={cn("p-4 pb-0", className)} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <View className={cn("p-4 pt-0", className)} {...props}>
      {children}
    </View>
  );
}
