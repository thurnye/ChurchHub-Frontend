import React from 'react';
import { View, Text } from 'react-native';
import { GraduationCap } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchStudyGuidesScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchStudyGuidesScreen({
  church,
}: ChurchStudyGuidesScreenProps) {
  const guides = [
    'New Believers Guide',
    'Bible Study Methods',
    'Prayer Guide',
    'Spiritual Gifts Assessment',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Study Guides'
      icon={GraduationCap}
    >
      <View className='gap-2'>
        {guides.map((guide, idx) => (
          <Card key={idx}>
            <CardContent className='p-4 flex-row items-center justify-between'>
              <Text className='font-medium text-sm text-gray-900 flex-1'>
                {guide}
              </Text>

              <Button variant='outline' size='sm' onPress={() => {}}>
                <Text className='text-sm'>Download</Text>
              </Button>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
