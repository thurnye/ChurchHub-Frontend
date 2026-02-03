import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react-native";

import { Button } from "@/shared/components/ui";

export function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendReset = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSent(true);
  };

  if (isSent) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="flex-1 px-6 justify-center items-center">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <CheckCircle size={40} color="#16a34a" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Check Your Email
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            We've sent a password reset link to {email}
          </Text>
          <Button onPress={() => router.push("/login")}>
            <Text className="text-white font-medium">Back to Sign In</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
      </View>

      <View className="flex-1 px-6 justify-center">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </Text>
        <Text className="text-gray-600 mb-8">
          Enter your email and we'll send you a link to reset your password
        </Text>

        <View className="gap-4">
          {/* Email Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Mail size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Email address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm">{error}</Text>
          ) : null}

          <Button onPress={handleSendReset} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-medium">Send Reset Link</Text>
            )}
          </Button>

          <Pressable onPress={() => router.push("/login")}>
            <Text className="text-indigo-600 text-center mt-4">
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
