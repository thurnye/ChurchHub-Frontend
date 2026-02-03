import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';

import { Card, CardContent } from '@/shared/components/ui';
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export function LanguageSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='Language Settings' />

      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        <Text className='text-sm text-gray-600 mb-4'>
          Select your preferred language for the app.
        </Text>

        <Card>
          <CardContent className='p-0'>
            {languages.map((lang, index) => (
              <Pressable
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                className={`flex-row items-center justify-between px-4 py-4 active:bg-gray-50 ${
                  index !== languages.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <View>
                  <Text className='font-medium text-sm text-gray-900'>
                    {lang.name}
                  </Text>
                  <Text className='text-xs text-gray-500'>
                    {lang.nativeName}
                  </Text>
                </View>
                {selectedLanguage === lang.code && (
                  <Check size={20} color='#4f46e5' />
                )}
              </Pressable>
            ))}
          </CardContent>
        </Card>

        <View className='h-8' />
      </ScrollView>
    </View>
  );
}
