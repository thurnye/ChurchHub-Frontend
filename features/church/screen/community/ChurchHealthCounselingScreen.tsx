import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchHealthCounselingScreenProps {
  church: IChurch;
}

export function ChurchHealthCounselingScreen({
  church,
}: ChurchHealthCounselingScreenProps) {
  return (
    <ChurchScreenTemplate
      church={church}
      title='Health & Counseling'
      icon={Heart}
    >
      <View className='gap-4'>
        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Health Services
            </Text>
            <Text className='text-sm text-gray-600 mb-3'>
              Free health screenings and wellness programs.
            </Text>
            <Text className='text-sm text-gray-600'>
              First Saturday of each month
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Counseling Services
            </Text>
            <Text className='text-sm text-gray-600 mb-3'>
              Professional pastoral counseling available.
            </Text>
            <Button size='sm' className='w-full'>
              <Text className='text-white font-medium'>
                Request Appointment
              </Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ChurchScreenTemplate>
  );
}
