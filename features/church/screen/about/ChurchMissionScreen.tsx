import React from 'react';
import { Text } from 'react-native';
import { Heart } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchMissionScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchMissionScreen({ church }: ChurchMissionScreenProps) {
  return (
    <ChurchScreenTemplate church={church} title='Mission & Vision' icon={Heart}>
      <Card className='mb-4'>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-2'>Our Mission</Text>
          <Text className='text-sm text-gray-600 leading-5'>
            {church.mission}
          </Text>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-2'>Our Vision</Text>
          <Text className='text-sm text-gray-600 leading-5'>
            {church.vision}
          </Text>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
