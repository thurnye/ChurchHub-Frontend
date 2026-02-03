import { View, Text, type ViewProps } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";

export interface AvatarProps extends ViewProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const getFallbackText = () => {
    if (fallback) return fallback;
    if (alt) {
      return alt
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "?";
  };

  if (!src || hasError) {
    return (
      <View
        style={sizeStyles[size]}
        className={`rounded-full bg-gray-200 items-center justify-center ${className || ""}`}
        {...props}
      >
        <Text className={`font-medium text-gray-600 ${textSizeClasses[size]}`}>
          {getFallbackText()}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={sizeStyles[size]}
      className={`rounded-full overflow-hidden ${className || ""}`}
      {...props}
    >
      <Image
        source={{ uri: src }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        onError={() => setHasError(true)}
      />
    </View>
  );
}
