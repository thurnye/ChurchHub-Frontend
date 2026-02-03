import React from 'react';
import { View, Text, Image } from 'react-native';
import { Church as ChurchIcon } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchArchitectureScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchArchitectureScreen({
  church,
}: ChurchArchitectureScreenProps) {
  return (
    <ChurchScreenTemplate
      church={church}
      title='Architecture & Heritage'
      icon={ChurchIcon}
    >
      <Card>
        <CardContent className='p-4 gap-4'>
          <Image
            source={{ uri: church.image }}
            className='w-full h-48 rounded-xl'
            resizeMode='cover'
          />

          <View>
            <Text className='font-semibold text-gray-900 mb-2'>
              Architectural Features
            </Text>
            <Text className='text-sm text-gray-600 leading-5'>
              Our building features traditional {church.denomination}{' '}
              architecture with beautiful stained glass windows, a spacious
              sanctuary, and modern facilities.
            </Text>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
