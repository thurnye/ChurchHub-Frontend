import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react-native";

import { Button } from "@/shared/components/ui";
import { useAuth } from "@/shared/context/AuthContext";

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
      </View>

      <View className="flex-1 px-6 justify-center">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-600 mb-8">
          Sign in to continue to ChurchHub
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

          {/* Password Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Lock size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </Pressable>
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm">{error}</Text>
          ) : null}

          <Pressable onPress={() => router.push("/forgot-password")}>
            <Text className="text-indigo-600 text-right">Forgot Password?</Text>
          </Pressable>

          <Button onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-medium">Sign In</Text>
            )}
          </Button>

          <View className="flex-row justify-center gap-1 mt-4">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text className="text-indigo-600 font-medium">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
