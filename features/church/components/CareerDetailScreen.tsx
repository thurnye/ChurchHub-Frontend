// church-screens-details.tsx (React Native + NativeWind)

import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import {
  Calendar,
  MapPin,
  Users,
} from 'lucide-react-native';

import { Badge } from '@/shared/components/ui';
import {
  careers,
} from '@/data/mockData';
import { AppPressable } from './AppPressable';


interface CareerDetailScreenProps {
  careerId: string;
  from: string;
}

export function CareerDetailScreen({
  careerId,
  from,
}: CareerDetailScreenProps) {
  const career = useMemo(
    () => careers.find((c) => c.id === careerId) || careers[0],
    [careerId],
  );

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white border-b border-gray-200 px-4 py-3'>
        <View className='flex-row items-center gap-3'>
          <Text className='font-semibold text-lg text-gray-900'>
            Job Description
          </Text>
        </View>
      </View>

      <ScrollView contentContainerClassName=' pb-28'>
        <View className='bg-white rounded-xl p-6 border border-gray-100 mb-4'>
          <View className='mb-3 self-start'>
            <Badge variant='secondary'>
              <Text className='text-xs'>{career.type}</Text>
            </Badge>
          </View>

          <Text className='text-xl font-bold text-gray-900 mb-2'>
            {career.title}
          </Text>
          <Text className='text-gray-600 mb-4'>{career.church}</Text>

          <View className='gap-3 mb-6'>
            <View className='flex-row items-center gap-2'>
              <Users size={16} color='#6b7280' />
              <Text className='text-sm text-gray-600'>{career.department}</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <MapPin size={16} color='#6b7280' />
              <Text className='text-sm text-gray-600'>{career.location}</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <Calendar size={16} color='#6b7280' />
              <Text className='text-sm text-gray-600'>
                Posted {career.postedDate}
              </Text>
            </View>
          </View>

          <View className='mb-6'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Description
            </Text>
            <Text className='text-sm text-gray-600 leading-6'>
              {career.description}
            </Text>
          </View>

          <View>
            <Text className='font-semibold text-gray-900 mb-2'>
              Requirements
            </Text>
            <View className='gap-2'>
              {career.requirements.map((req: string, index: number) => (
                <View key={index} className='flex-row items-start gap-2'>
                  <Text className='text-indigo-600 mt-1'>•</Text>
                  <Text className='text-sm text-gray-600 flex-1'>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <AppPressable label='Apply for Position' size='lg' onPress={() => {}} />
      </View>
    </View>
  );
}
