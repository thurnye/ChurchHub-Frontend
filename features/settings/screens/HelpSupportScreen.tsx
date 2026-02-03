import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import { Button, Card, CardContent } from '@/shared/components/ui';
import { HiddenScreensTopBar } from "@/shared/components/HiddenScreensTopBar";

const faqs = [
  {
    id: 'faq1',
    question: 'How do I find churches near me?',
    answer:
      'Navigate to the "Churches" tab and enable location services. The map will show all churches in your area.',
  },
  {
    id: 'faq2',
    question: 'Can I follow multiple churches?',
    answer:
      "Yes! You can follow as many churches as you'd like. Simply tap the heart icon on any church profile.",
  },
  {
    id: 'faq3',
    question: 'How do I make a donation?',
    answer:
      'Visit the church\'s profile, go to the "Give" tab, and follow the secure payment process.',
  },
  {
    id: 'faq4',
    question: 'Is my donation information secure?',
    answer:
      'Yes, all donation transactions are encrypted and processed through secure payment gateways.',
  },
];

export function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar show={true} title='Help & Support' />

      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <Card className='mb-6'>
          <CardContent className='gap-3'>
            <Button variant='outline' className='w-full'>
              <View className='flex-row items-center gap-2'>
                <Mail size={16} color='#111827' />
                <Text className='text-gray-900 font-medium'>Email Support</Text>
              </View>
            </Button>
            <Button variant='outline' className='w-full'>
              <View className='flex-row items-center gap-2'>
                <MessageCircle size={16} color='#111827' />
                <Text className='text-gray-900 font-medium'>Live Chat</Text>
              </View>
            </Button>
            <Button variant='outline' className='w-full'>
              <View className='flex-row items-center gap-2'>
                <Phone size={16} color='#111827' />
                <Text className='text-gray-900 font-medium'>Call Us</Text>
              </View>
            </Button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Text className='font-semibold text-gray-900 mb-3'>
          Frequently Asked Questions
        </Text>
        <Card>
          <CardContent className='p-0'>
            {faqs.map((faq, index) => (
              <View
                key={faq.id}
                className={
                  index !== faqs.length - 1 ? 'border-b border-gray-100' : ''
                }
              >
                <Pressable
                  onPress={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className='flex-row items-center justify-between p-4'
                >
                  <Text className='flex-1 text-sm font-medium text-gray-900 pr-2'>
                    {faq.question}
                  </Text>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={20} color='#6b7280' />
                  ) : (
                    <ChevronDown size={20} color='#6b7280' />
                  )}
                </Pressable>
                {expandedFaq === faq.id && (
                  <View className='px-4 pb-4'>
                    <Text className='text-sm text-gray-600'>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </CardContent>
        </Card>

        <View className='h-8' />
      </ScrollView>
    </View>
  );
}
