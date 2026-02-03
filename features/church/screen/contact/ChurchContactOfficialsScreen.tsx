import React from 'react';
import { View, Text, Linking, Image } from 'react-native';
import { Phone } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchContactOfficialsScreenProps {
  church: IChurch;
}

const openEmail = (email: string) => Linking.openURL(`mailto:${email}`);

export function ChurchContactOfficialsScreen({
  church,
}: ChurchContactOfficialsScreenProps) {
  const topClergy = church.clergy?.slice(0, 2) ?? [];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Contact Officials'
      icon={Phone}
    >
      <View className='gap-3'>
        <Card>
          <CardContent className='p-4'>
            <View className='flex-row items-center gap-3 mb-3'>
              <Image
                source={{ uri: church.pastor.photo }}
                className='w-12 h-12 rounded-full'
                resizeMode='cover'
              />

              <View className='flex-1'>
                <Text
                  className='font-semibold text-gray-900'
                  numberOfLines={1}
                >
                  {church.pastor.name}
                </Text>
                <Text className='text-sm text-gray-600' numberOfLines={1}>
                  {church.pastor.role}
                </Text>
              </View>
            </View>

            <Button
              size='sm'
              className='w-full'
              onPress={() => openEmail(church.email)}
            >
              <Text className='text-white font-medium'>Send Message</Text>
            </Button>
          </CardContent>
        </Card>

        {topClergy.map((clergy, idx) => (
          <Card key={idx}>
            <CardContent className='p-4'>
              <View className='flex-row items-center gap-3 mb-3'>
                <Image
                  source={{ uri: clergy.photo }}
                  className='w-12 h-12 rounded-full'
                  resizeMode='cover'
                />

                <View className='flex-1'>
                  <Text className='font-medium text-gray-900' numberOfLines={1}>
                    {clergy.name}
                  </Text>
                  <Text className='text-sm text-gray-600' numberOfLines={1}>
                    {clergy.role}
                  </Text>
                </View>
              </View>

              <Button
                size='sm'
                variant='outline'
                className='w-full'
                onPress={() => openEmail(clergy.email)}
              >
                <Text className='text-gray-900 font-medium'>Send Message</Text>
              </Button>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
