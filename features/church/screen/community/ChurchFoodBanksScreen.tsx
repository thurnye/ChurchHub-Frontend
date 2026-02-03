import React from 'react';
import { View, Text } from 'react-native';
import { HeartHandshake } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchFoodBanksScreenProps {
  church: IChurch;
}

export function ChurchFoodBanksScreen({
  church,
}: ChurchFoodBanksScreenProps) {
  return (
    <ChurchScreenTemplate
      church={church}
      title='Food Banks / Drop-in'
      icon={HeartHandshake}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='mb-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Food Bank Ministry
            </Text>
            <Text className='text-sm text-gray-600'>
              Providing food assistance to families in need.
            </Text>
          </View>

          <View className='bg-indigo-50 p-3 rounded-xl mb-4'>
            <Text className='font-medium text-sm text-gray-900 mb-2'>
              Operating Hours
            </Text>
            <Text className='text-sm text-gray-800'>
              Wednesdays & Saturdays
            </Text>
            <Text className='text-sm text-gray-800'>10:00 AM - 2:00 PM</Text>
          </View>

          <View>
            <Text className='font-semibold text-gray-900 mb-2'>
              How to Help
            </Text>
            <View className='gap-2'>
              <Button size='sm' className='w-full'>
                <Text className='text-white font-medium'>Donate Food</Text>
              </Button>
              <Button size='sm' variant='outline' className='w-full'>
                <Text className='text-gray-900 font-medium'>Volunteer</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
