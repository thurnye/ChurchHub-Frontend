import React from 'react';
import { View, Text } from 'react-native';
import { Droplet } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';

interface ChurchBaptismWeddingsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchBaptismWeddingsScreen({
  church,
}: ChurchBaptismWeddingsScreenProps) {
  return (
    <ChurchScreenTemplate
      church={church}
      title='Baptism & Weddings'
      icon={Droplet}
    >
      <View className='gap-4'>
        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>Baptism</Text>
            <Text className='text-sm text-gray-600 mb-3'>
              Baptism is a sacred ordinance representing new life in Christ.
            </Text>
            <AppPressable
              label='Request Baptism'
              size='sm'
              onPress={() => {}}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>Weddings</Text>
            <Text className='text-sm text-gray-600 mb-3'>
              We would be honored to host your special day.
            </Text>
            <AppPressable
              label='Wedding Inquiry'
              size='sm'
              onPress={() => {}}
            />
          </CardContent>
        </Card>
      </View>
    </ChurchScreenTemplate>
  );
}
