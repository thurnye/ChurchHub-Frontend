import React from 'react';
import { View, Text, Linking, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchLocationScreenProps {
  church: IChurch;
}

const openMaps = (address: string) => {
  const encoded = encodeURIComponent(address);
  const url =
    Platform.OS === 'ios'
      ? `maps:0,0?q=${encoded}`
      : `geo:0,0?q=${encoded}`;
  Linking.openURL(url);
};

export function ChurchLocationScreen({ church }: ChurchLocationScreenProps) {
  return (
    <ChurchScreenTemplate
      church={church}
      title='Location & Map'
      icon={MapPin}
    >
      <Card className='mb-4'>
        <CardContent className='p-0'>
          <View className='h-48 bg-gray-200 rounded-t-2xl flex-row items-center justify-center'>
            <MapPin size={40} color='#9ca3af' />
            <Text className='text-sm text-gray-500 ml-2'>Map placeholder</Text>
          </View>

          <View className='p-4'>
            <Text className='font-semibold text-gray-900 mb-2'>Address</Text>
            <Text className='text-sm text-gray-600 mb-3'>{church.address}</Text>

            <Button className='w-full' onPress={() => openMaps(church.address)}>
              <Text className='text-white font-medium'>Get Directions</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-2'>Parking</Text>
          <Text className='text-sm text-gray-600'>{church.parkingInfo}</Text>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
