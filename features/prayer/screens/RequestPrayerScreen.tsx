import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft, Info, X } from "lucide-react-native";
import { churchGroups, churches } from "@/data/mockData";
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";
import { useLocalSearchParams } from "expo-router";

interface RequestPrayerScreenProps {

}

type VisibilityKey = "everyone" | "pastorOnly" | "clergy" | "groups" | "churchUnits";

function SimpleCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className={`w-6 h-6 rounded-md border items-center justify-center ${
        checked ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"
      }`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {checked ? <Text className="text-white font-bold">✓</Text> : null}
    </Pressable>
  );
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <View className="flex-row items-center bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 mr-2 mb-2">
      <Text className="text-xs text-gray-700 mr-2">{label}</Text>
      <Pressable onPress={onRemove} className="p-1">
        <X size={14} color="#6b7280" />
      </Pressable>
    </View>
  );
}

export function RequestPrayerScreen({ }: RequestPrayerScreenProps) {
  const {from } = useLocalSearchParams<{
      from: string;
    }>();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  // Visibility options
  const [visibility, setVisibility] = useState<Record<VisibilityKey, boolean>>({
    everyone: true,
    pastorOnly: false,
    clergy: false,
    groups: false,
    churchUnits: false,
  });

  // Selected targets
  const [selectedClergy, setSelectedClergy] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedChurches, setSelectedChurches] = useState<string[]>([]);

  // Mock clergy list (in real app, fetch from church data)
  const clergyList = useMemo(
    () => ["Rev. James Thompson", "Sister Mary Johnson", "Brother David Lee", "Fr. David Martinez"],
    []
  );

  const toggleVisibility = (key: VisibilityKey) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));

    // Clear selections when turning OFF a section
    if (key === "clergy" && visibility.clergy) setSelectedClergy([]);
    if (key === "groups" && visibility.groups) setSelectedGroups([]);
    if (key === "churchUnits" && visibility.churchUnits) setSelectedChurches([]);
  };

  const toggleInList = (value: string, list: string[], setList: (next: string[]) => void) => {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return;
    }

    // Optional: validate nested selections if section is enabled
    if (visibility.clergy && selectedClergy.length === 0) {
      Alert.alert("Select clergy", "Please select at least one clergy member (or turn off Clergy visibility).");
      return;
    }
    if (visibility.groups && selectedGroups.length === 0) {
      Alert.alert("Select groups", "Please select at least one group (or turn off Groups visibility).");
      return;
    }
    if (visibility.churchUnits && selectedChurches.length === 0) {
      Alert.alert("Select churches", "Please select at least one church (or turn off Church Units visibility).");
      return;
    }

    // onSubmit?.();
  };

  const charCount = message.length;
  const canSubmit = title.trim().length > 0 && message.trim().length > 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <HiddenScreensTopBar show={true} title={'Prayer Request'} navigateTo={from} />


      <ScrollView contentContainerClassName="p-4 pb-28">
        {/* Info Banner */}
        <View className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
          <View className="flex-row gap-3">
            <Info size={20} color="#4f46e5" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-indigo-900 mb-1">
                Prayer Request Privacy
              </Text>
              <Text className="text-sm text-indigo-800">
                Choose who can see your prayer request. You can share it with everyone,
                specific clergy members, groups, or keep it private.
              </Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-900 mb-2">
            Prayer Title <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Healing for my mother"
            placeholderTextColor="#9ca3af"
            className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900"
          />
        </View>

        {/* Message */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-900 mb-2">
            Prayer Request <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={message}
            onChangeText={(t) => {
              if (t.length <= 500) setMessage(t);
            }}
            placeholder="Share your prayer request..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900"
            style={{ minHeight: 140 }}
          />
          <Text className="text-xs text-gray-500 mt-2">{charCount}/500 characters</Text>
        </View>

        {/* Anonymous */}
        <View className="mb-6 p-4 bg-white rounded-2xl border border-gray-200">
          <Pressable
            onPress={() => setAnonymous((v) => !v)}
            className="flex-row items-start gap-3"
          >
            <SimpleCheckbox checked={anonymous} onToggle={() => setAnonymous((v) => !v)} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">Submit anonymously</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Your name will not be shown with this request
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Visibility */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3">Who Can See This Request?</Text>

          <View className="gap-3">
            {/* Everyone */}
            <View className="p-4 bg-white rounded-2xl border border-gray-200">
              <Pressable
                onPress={() => toggleVisibility("everyone")}
                className="flex-row items-start gap-3"
              >
                <SimpleCheckbox checked={visibility.everyone} onToggle={() => toggleVisibility("everyone")} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">Everyone in Church</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    All church members can see and pray for this request
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Pastor Only */}
            <View className="p-4 bg-white rounded-2xl border border-gray-200">
              <Pressable
                onPress={() => toggleVisibility("pastorOnly")}
                className="flex-row items-start gap-3"
              >
                <SimpleCheckbox checked={visibility.pastorOnly} onToggle={() => toggleVisibility("pastorOnly")} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">Pastor / Priest Only</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Only the senior pastor can see this request
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Clergy */}
            <View className="p-4 bg-white rounded-2xl border border-gray-200">
              <Pressable
                onPress={() => toggleVisibility("clergy")}
                className="flex-row items-start gap-3"
              >
                <SimpleCheckbox checked={visibility.clergy} onToggle={() => toggleVisibility("clergy")} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">Pastor & Clergy</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Select which clergy members can see this
                  </Text>
                </View>
              </Pressable>

              {visibility.clergy && (
                <View className="mt-3 ml-9 gap-2">
                  {/* Selected chips */}
                  {selectedClergy.length > 0 && (
                    <View className="flex-row flex-wrap mb-1">
                      {selectedClergy.map((c) => (
                        <Chip
                          key={c}
                          label={c}
                          onRemove={() => setSelectedClergy(selectedClergy.filter((x) => x !== c))}
                        />
                      ))}
                    </View>
                  )}

                  {clergyList.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => toggleInList(c, selectedClergy, setSelectedClergy)}
                      className="flex-row items-center gap-3 py-2"
                    >
                      <SimpleCheckbox
                        checked={selectedClergy.includes(c)}
                        onToggle={() => toggleInList(c, selectedClergy, setSelectedClergy)}
                      />
                      <Text className="text-sm text-gray-800">{c}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Groups */}
            <View className="p-4 bg-white rounded-2xl border border-gray-200">
              <Pressable
                onPress={() => toggleVisibility("groups")}
                className="flex-row items-start gap-3"
              >
                <SimpleCheckbox checked={visibility.groups} onToggle={() => toggleVisibility("groups")} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">My Groups</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Share with groups you belong to
                  </Text>
                </View>
              </Pressable>

              {visibility.groups && (
                <View className="mt-3 ml-9 gap-2">
                  {selectedGroups.length > 0 && (
                    <View className="flex-row flex-wrap mb-1">
                      {selectedGroups.map((id) => {
                        const g = churchGroups.find((x) => x.id === id);
                        return (
                          <Chip
                            key={id}
                            label={g?.name ?? id}
                            onRemove={() => setSelectedGroups(selectedGroups.filter((x) => x !== id))}
                          />
                        );
                      })}
                    </View>
                  )}

                  {churchGroups.slice(0, 3).map((g) => (
                    <Pressable
                      key={g.id}
                      onPress={() => toggleInList(g.id, selectedGroups, setSelectedGroups)}
                      className="flex-row items-center gap-3 py-2"
                    >
                      <SimpleCheckbox
                        checked={selectedGroups.includes(g.id)}
                        onToggle={() => toggleInList(g.id, selectedGroups, setSelectedGroups)}
                      />
                      <Text className="text-sm text-gray-800">{g.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Church Units */}
            <View className="p-4 bg-white rounded-2xl border border-gray-200">
              <Pressable
                onPress={() => toggleVisibility("churchUnits")}
                className="flex-row items-start gap-3"
              >
                <SimpleCheckbox checked={visibility.churchUnits} onToggle={() => toggleVisibility("churchUnits")} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">Specific Church Units</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Share with specific churches you belong to
                  </Text>
                </View>
              </Pressable>

              {visibility.churchUnits && (
                <View className="mt-3 ml-9 gap-2">
                  {selectedChurches.length > 0 && (
                    <View className="flex-row flex-wrap mb-1">
                      {selectedChurches.map((id) => {
                        const ch = churches.find((x) => x.id === id);
                        return (
                          <Chip
                            key={id}
                            label={ch?.name ?? id}
                            onRemove={() => setSelectedChurches(selectedChurches.filter((x) => x !== id))}
                          />
                        );
                      })}
                    </View>
                  )}

                  {churches.slice(0, 3).map((ch) => (
                    <Pressable
                      key={ch.id}
                      onPress={() => toggleInList(ch.id, selectedChurches, setSelectedChurches)}
                      className="flex-row items-center gap-3 py-2"
                    >
                      <SimpleCheckbox
                        checked={selectedChurches.includes(ch.id)}
                        onToggle={() => toggleInList(ch.id, selectedChurches, setSelectedChurches)}
                      />
                      <Text className="text-sm text-gray-800">{ch.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Privacy note */}
        <View className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <Text className="text-xs text-gray-600 leading-relaxed">
            Your prayer request will be handled with care and confidentiality.
            Only the people or groups you select will be able to view your request.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed bottom submit */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className={`h-12 rounded-2xl items-center justify-center ${
            canSubmit ? "bg-indigo-600" : "bg-indigo-300"
          }`}
        >
          <Text className="text-white font-semibold">Submit Prayer Request</Text>
        </Pressable>
      </View>
    </View>
  );
}
