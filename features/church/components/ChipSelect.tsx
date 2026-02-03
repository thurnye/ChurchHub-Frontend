import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ChipSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export function ChipSelect({ label, value, options, onChange }: ChipSelectProps) {
  return (
    <View className='gap-2'>
      <Text className='text-sm font-medium text-gray-900'>{label}</Text>
      <View className='flex-row flex-wrap gap-2'>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              className={`px-3 py-2 rounded-full border ${
                active
                  ? 'bg-indigo-50 border-indigo-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-700'}`}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
