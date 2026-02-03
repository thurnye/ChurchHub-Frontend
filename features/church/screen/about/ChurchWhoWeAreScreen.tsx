import React from 'react';
import { View, Text } from 'react-native';
import { Church as ChurchIcon } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchWhoWeAreScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchWhoWeAreScreen({ church }: ChurchWhoWeAreScreenProps) {
  return (
    <ChurchScreenTemplate church={church} title='Who We Are' icon={ChurchIcon}>
      <Card>
        <CardContent className='p-4 gap-4'>
          <View>
            <Text className='font-semibold text-gray-900 mb-2'>
              About {church.name}
            </Text>
            <Text className='text-sm text-gray-600'>{church.description}</Text>
          </View>

          <View>
            <Text className='font-semibold text-gray-900 mb-2'>
              Our History
            </Text>
            <Text className='text-sm text-gray-600 leading-5'>
              Founded in 1985, we have been serving our community for over 35
              years with unwavering dedication to spreading the Gospel and
              nurturing spiritual growth.
            </Text>
          </View>

          <View>
            <Text className='font-semibold text-gray-900 mb-2'>
              What We Believe
            </Text>
            <Text className='text-sm text-gray-600 leading-5'>
              We are a {church.denomination} congregation committed to biblical
              teaching, vibrant worship, and compassionate service.
            </Text>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
