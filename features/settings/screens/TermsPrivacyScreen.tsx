import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";

export function TermsPrivacyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" >
      {/* Header */}
       <HiddenScreensTopBar show={true} title='Terms & Privacy' />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Terms of Service */}
        <Text className="text-xl font-bold text-gray-900 mb-2">Terms of Service</Text>
        <Text className="text-sm text-gray-500 mb-4">Last updated: January 25, 2026</Text>
        <Text className="text-sm text-gray-600 mb-4 leading-5">
          Welcome to ChurchHub. By using our app, you agree to these terms of service.
        </Text>

        <Text className="text-lg font-semibold text-gray-900 mb-2">1. Use of Service</Text>
        <Text className="text-sm text-gray-600 mb-4 leading-5">
          ChurchHub is provided as an aggregator platform to help users discover and connect with churches across denominations.
        </Text>

        <Text className="text-lg font-semibold text-gray-900 mb-2">2. User Accounts</Text>
        <Text className="text-sm text-gray-600 mb-4 leading-5">
          You are responsible for maintaining the security of your account and for all activities that occur under your account.
        </Text>

        <Text className="text-lg font-semibold text-gray-900 mb-2">3. Content</Text>
        <Text className="text-sm text-gray-600 mb-6 leading-5">
          Church information is provided by participating churches and community members. We strive for accuracy but cannot guarantee all information is current.
        </Text>

        {/* Privacy Policy */}
        <Text className="text-xl font-bold text-gray-900 mb-2 mt-4">Privacy Policy</Text>
        <Text className="text-sm text-gray-600 mb-4 leading-5">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </Text>

        <Text className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</Text>
        <View className="mb-4">
          <Text className="text-sm text-gray-600 leading-5">• Account information (name, email)</Text>
          <Text className="text-sm text-gray-600 leading-5">• Church preferences and saved churches</Text>
          <Text className="text-sm text-gray-600 leading-5">• Donation history (securely encrypted)</Text>
          <Text className="text-sm text-gray-600 leading-5">• Usage data and analytics</Text>
        </View>

        <Text className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</Text>
        <View className="mb-4">
          <Text className="text-sm text-gray-600 leading-5">• To provide and improve our services</Text>
          <Text className="text-sm text-gray-600 leading-5">• To send service updates and notifications</Text>
          <Text className="text-sm text-gray-600 leading-5">• To personalize your experience</Text>
        </View>

        <Text className="text-lg font-semibold text-gray-900 mb-2">Data Security</Text>
        <Text className="text-sm text-gray-600 mb-4 leading-5">
          We implement industry-standard security measures to protect your personal information and donation data.
        </Text>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
