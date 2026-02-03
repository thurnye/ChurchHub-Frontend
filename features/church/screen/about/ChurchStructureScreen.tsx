import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchStructureScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchStructureScreen({ church }: ChurchStructureScreenProps) {
  return (
    <ChurchScreenTemplate church={church} title='Structure' icon={Users}>
      <Card>
        <CardContent className='p-4'>
          <Text className='font-semibold text-gray-900 mb-2'>
            Denominational Structure
          </Text>
          <Text className='text-sm text-gray-600 mb-3'>
            {church.denomination}
          </Text>

          <View className='pl-4 border-l-2 border-gray-200 gap-2'>
            <Text className='text-sm text-gray-900'>Region / Diocese</Text>
            <Text className='text-sm text-gray-900'>Provincial Oversight</Text>
            <Text className='text-sm text-gray-900'>
              Local Church Governance
            </Text>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
