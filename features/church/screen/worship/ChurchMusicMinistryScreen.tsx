import React from 'react';
import { View, Text } from 'react-native';
import { Music } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchMusicMinistryScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchMusicMinistryScreen({
  church,
}: ChurchMusicMinistryScreenProps) {
  const items = ['Main Choir', 'Youth Choir', 'Worship Band'];

  return (
    <ChurchScreenTemplate church={church} title='Music Ministry' icon={Music}>
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Our Music Ministry
              </Text>
              <Text className='text-sm text-gray-600'>
                Join our vibrant worship team in leading the congregation in
                praise and worship.
              </Text>
            </View>

            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Choirs & Ensembles
              </Text>
              <View className='gap-2'>
                {items.map((it) => (
                  <Text key={it} className='text-sm text-gray-700'>
                    • {it}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
