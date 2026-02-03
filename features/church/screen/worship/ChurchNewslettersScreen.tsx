import React from 'react';
import { View, Text } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';

interface ChurchNewslettersScreenProps {
  church:IChurch;
  onBack: () => void;
}

export function ChurchNewslettersScreen({
  church,
}: ChurchNewslettersScreenProps) {
  return (
    <ChurchScreenTemplate church={church} title='Newsletters' icon={FileText}>
      

      <View className='gap-2'>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className='p-3'>
              <Text className='font-medium text-sm text-gray-900 mb-1'>
                January {i} Newsletter
              </Text>
              <Text className='text-xs text-gray-500'>
                Published Jan {i}, 2026
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
