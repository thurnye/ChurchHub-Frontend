import { Pressable, Text, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";
import type { ReactNode } from "react";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-md active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-gray-900",
        destructive: "bg-red-600",
        outline: "border border-gray-300 bg-white",
        secondary: "bg-gray-100",
        ghost: "bg-transparent",
        link: "bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const textVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-white",
      destructive: "text-white",
      outline: "text-gray-900",
      secondary: "text-gray-900",
      ghost: "text-gray-900",
      link: "text-indigo-600 underline",
    },
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
      icon: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  textClassName?: string;
}

export function Button({
  children,
  variant,
  size,
  className,
  textClassName,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size }),
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn(textVariants({ variant, size }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
