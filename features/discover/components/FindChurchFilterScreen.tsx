// FindChurchFilterScreen.tsx (React Native + NativeWind)
// No Button/Checkbox/Slider/RadioGroup components — only Pressable + RN

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ArrowLeft, X, Check } from "lucide-react-native";

interface FindChurchFilterScreenProps {
  onBack: () => void;
  onApply?: (filters: any) => void;
}

function Pill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-full border ${
        selected ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-200"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
      {selected && <X size={14} color="#ffffff" style={{ marginLeft: 6 }} />}
    </Pressable>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center gap-3 p-3 bg-white rounded-xl border border-gray-200"
    >
      <View
        className={`w-5 h-5 rounded-md border items-center justify-center ${
          checked ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"
        }`}
      >
        {checked && <Check size={14} color="#ffffff" />}
      </View>
      <Text className="flex-1 text-sm text-gray-800">{label}</Text>
    </Pressable>
  );
}

function PrimaryBtn({
  label,
  onPress,
  right,
}: {
  label: string;
  onPress: () => void;
  right?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 h-12 rounded-xl bg-indigo-600 items-center justify-center flex-row"
    >
      <Text className="text-white font-semibold text-base">{label}</Text>
      {right}
    </Pressable>
  );
}

function OutlineBtn({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 h-12 rounded-xl border border-gray-300 bg-white items-center justify-center"
    >
      <Text className="text-gray-900 font-semibold text-base">{label}</Text>
    </Pressable>
  );
}

export function FindChurchFilterScreen({
  onBack,
  onApply,
}: FindChurchFilterScreenProps) {
  const [denominations, setDenominations] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [serviceTime, setServiceTime] = useState<string[]>([]);
  const [worshipStyle, setWorshipStyle] = useState<string[]>([]);
  const [hasOnline, setHasOnline] = useState(false);
  const [hasAccessibility, setHasAccessibility] = useState(false);

  const denominationOptions = useMemo(
    () => [
      "Pentecostal",
      "Anglican",
      "Catholic",
      "Baptist",
      "Adventist",
      "African-initiated",
      "Methodist",
      "Presbyterian",
    ],
    []
  );

  const serviceTimeOptions = useMemo(
    () => [
      "Early Morning (Before 9 AM)",
      "Morning (9 AM - 12 PM)",
      "Afternoon (12 PM - 5 PM)",
      "Evening (After 5 PM)",
    ],
    []
  );

  const worshipStyleOptions = useMemo(
    () => ["Traditional", "Contemporary", "Blended", "Liturgical", "Charismatic"],
    []
  );

  const toggleInArray = (value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const handleReset = () => {
    setDenominations([]);
    setDistance(10);
    setServiceTime([]);
    setWorshipStyle([]);
    setHasOnline(false);
    setHasAccessibility(false);
  };

  const handleApply = () => {
    onApply?.({
      denominations,
      distance,
      serviceTime,
      worshipStyle,
      hasOnline,
      hasAccessibility,
    });
    onBack();
  };

  const activeFilterCount =
    denominations.length +
    serviceTime.length +
    worshipStyle.length +
    (hasOnline ? 1 : 0) +
    (hasAccessibility ? 1 : 0);

  // simple stepper instead of Slider component
  const decDistance = () => setDistance((d) => Math.max(1, d - 1));
  const incDistance = () => setDistance((d) => Math.min(50, d + 1));

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={onBack}
              className="w-10 h-10 rounded-full items-center justify-center"
              hitSlop={10}
            >
              <ArrowLeft size={20} color="#111827" />
            </Pressable>

            <View>
              <Text className="font-semibold text-lg text-gray-900">
                Filter Churches
              </Text>
              {activeFilterCount > 0 && (
                <Text className="text-xs text-gray-500">
                  {activeFilterCount} filters active
                </Text>
              )}
            </View>
          </View>

          <Pressable onPress={handleReset} hitSlop={10}>
            <Text className="text-sm font-semibold text-indigo-600">Reset</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-28">
        {/* Denomination */}
        <View className="mb-6">
          <Text className="mb-3 text-base font-semibold text-gray-900">
            Denomination
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {denominationOptions.map((d) => (
              <Pill
                key={d}
                label={d}
                selected={denominations.includes(d)}
                onPress={() => toggleInArray(d, setDenominations)}
              />
            ))}
          </View>
        </View>

        {/* Distance (Stepper instead of Slider) */}
        <View className="mb-6 bg-white rounded-xl p-4 border border-gray-200">
          <Text className="mb-3 font-semibold text-gray-900">
            Distance Radius: {distance} km
          </Text>

          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={decDistance}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
            >
              <Text className="font-semibold text-gray-900">-</Text>
            </Pressable>

            <View className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
              <Text className="font-semibold text-gray-900">{distance} km</Text>
            </View>

            <Pressable
              onPress={incDistance}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
            >
              <Text className="font-semibold text-gray-900">+</Text>
            </Pressable>
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-xs text-gray-500">1 km</Text>
            <Text className="text-xs text-gray-500">50 km</Text>
          </View>
        </View>

        {/* Service Time */}
        <View className="mb-6">
          <Text className="mb-3 text-base font-semibold text-gray-900">
            Service Time
          </Text>

          <View className="gap-2">
            {serviceTimeOptions.map((t) => (
              <CheckRow
                key={t}
                label={t}
                checked={serviceTime.includes(t)}
                onToggle={() => toggleInArray(t, setServiceTime)}
              />
            ))}
          </View>
        </View>

        {/* Worship Style */}
        <View className="mb-6">
          <Text className="mb-3 text-base font-semibold text-gray-900">
            Worship Style
          </Text>

          <View className="gap-2">
            {worshipStyleOptions.map((s) => (
              <CheckRow
                key={s}
                label={s}
                checked={worshipStyle.includes(s)}
                onToggle={() => toggleInArray(s, setWorshipStyle)}
              />
            ))}
          </View>
        </View>

        {/* Additional Features */}
        <View className="mb-2">
          <Text className="mb-3 text-base font-semibold text-gray-900">
            Additional Features
          </Text>

          <View className="gap-2">
            <CheckRow
              label="Online Services Available"
              checked={hasOnline}
              onToggle={() => setHasOnline((v) => !v)}
            />
            <CheckRow
              label="Wheelchair Accessible"
              checked={hasAccessibility}
              onToggle={() => setHasAccessibility((v) => !v)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row gap-3">
          <OutlineBtn label="Clear All" onPress={handleReset} />
          <PrimaryBtn
            label="Apply Filters"
            onPress={handleApply}
            right={
              activeFilterCount > 0 ? (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-white">
                  <Text className="text-indigo-600 text-xs font-bold">
                    {activeFilterCount}
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
