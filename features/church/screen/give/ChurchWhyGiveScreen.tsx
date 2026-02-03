import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchWhyGiveScreenProps {
  church: IChurch;
}

export function ChurchWhyGiveScreen({ church }: ChurchWhyGiveScreenProps) {
  const bullets = [
    'Support our local ministry and outreach',
    'Maintain our facilities',
    'Fund missions and missionaries',
    'Help those in need',
    'Invest in the next generation',
  ];

  return (
    <ChurchScreenTemplate church={church} title='Why We Give' icon={Heart}>
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                The Heart of Giving
              </Text>
              <Text className='text-sm text-gray-600'>
                Giving is an act of worship and obedience to God. Through your
                generous giving, we can:
              </Text>
            </View>

            <View className='gap-2'>
              {bullets.map((t) => (
                <Text key={t} className='text-sm text-gray-700'>
                  • {t}
                </Text>
              ))}
            </View>

            <View className='bg-indigo-50 p-3 rounded-xl'>
              <Text className='text-sm italic text-gray-700'>
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver." — 2 Corinthians 9:7
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
