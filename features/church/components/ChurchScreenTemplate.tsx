import React, { ReactNode } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { IChurch } from "@/data/mockData";

type LucideIcon = React.ComponentType<{ size?: number; color?: string }>;

interface ChurchScreenTemplateProps {
  church: IChurch;
  onBack?: () => void;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

function hexToRgba(hex?: string, alpha = 0.15) {
  if (!hex) return undefined;
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return undefined;

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return undefined;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ChurchScreenTemplate({
  church,
  onBack,
  title,
  icon: Icon,
  children,
}: ChurchScreenTemplateProps) {
  const insets = useSafeAreaInsets();

  const topColor = hexToRgba(church.accentColor, 0.18) ?? "rgba(243,244,246,1)";
  const bottomColor = hexToRgba(church.accentColor, 0.10) ?? "rgba(229,231,235,1)";

  return (
    <View className="flex-1 bg-gray-50 ">
      {/* Header */}
      <View
        // style={{ paddingTop: insets.top }}
        className="bg-white border-b border-gray-200 px-4 py-3"
      >
        <View className="flex-row items-center gap-3">
         {onBack && <Pressable
            onPress={onBack}
            className="w-10 h-10 rounded-full items-center justify-center active:bg-gray-100"
          >
            <ArrowLeft size={20} color="#111827" />
          </Pressable>}

          <View className="flex-row items-center gap-2 flex-1">
            {Icon ? <Icon size={20} color="#4b5563" /> : null}

            <Text
              className="font-semibold text-lg text-gray-900 flex-1"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>
      </View>

      {/* Church Banner */}
      {/* <View className="h-32 items-center justify-center" style={{ backgroundColor: topColor }}>
        <View className="absolute inset-0" style={{ backgroundColor: bottomColor, opacity: 0.6 }} />

        <Image
          source={{ uri: church.image }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        />
      </View> */}

      {/* Content */}
      <View className="p-4 pb-20">{children}</View>
    </View>
  );
}
