import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchOutreachScreenProps {
  church: IChurch;
}

export function ChurchOutreachScreen({ church }: ChurchOutreachScreenProps) {
  const items = [
    'Street Evangelism',
    'Prison Ministry',
    'Hospital Visitation',
    'Community Clean-up',
    'Homeless Support',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Outreach & Charity'
      icon={Heart}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='mb-4'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Our Outreach Ministries
            </Text>
            <Text className='text-sm text-gray-600'>
              Extending God's love to our community and beyond.
            </Text>
          </View>

          <View className='gap-2 mb-4'>
            {items.map((t) => (
              <Text key={t} className='text-sm text-gray-900'>
                • {t}
              </Text>
            ))}
          </View>

          <Button className='w-full'>
            <Text className='text-white font-medium'>Join an Outreach</Text>
          </Button>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
