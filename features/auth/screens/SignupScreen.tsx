import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";

import { Button } from "@/shared/components/ui";
import { useAuth } from "@/shared/context/AuthContext";

export function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // Simulate signup by logging in
      await login(email, password);
    } catch (err) {
      setError("Could not create account");
    }
  };

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

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </Text>
        <Text className="text-gray-600 mb-8">
          Join ChurchHub and connect with your faith community
        </Text>

        <View className="gap-4">
          {/* Name Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <User size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Full name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

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

          {/* Confirm Password Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Lock size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Confirm password"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm">{error}</Text>
          ) : null}

          <Button onPress={handleSignup} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-medium">Create Account</Text>
            )}
          </Button>

          <View className="flex-row justify-center gap-1 mt-4 mb-8">
            <Text className="text-gray-600">Already have an account?</Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-indigo-600 font-medium">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
