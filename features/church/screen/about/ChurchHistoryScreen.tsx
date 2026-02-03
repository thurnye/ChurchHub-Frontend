import React from 'react';
import { View, Text } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchHistoryScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchHistoryScreen({ church }: ChurchHistoryScreenProps) {
  const timeline = [
    { year: '1985', text: 'Church founded with 50 members' },
    { year: '1992', text: 'New building construction completed' },
    { year: '2005', text: 'Expansion to include youth center' },
    { year: '2020', text: 'Launch of online worship services' },
    { year: '2026', text: 'Over 2,000 active members' },
  ];

  return (
    <ChurchScreenTemplate church={church} title='History' icon={FileText}>
      <Card>
        <CardContent className='p-4'>
          <View className='border-l-2 border-indigo-600 pl-4 gap-4'>
            {timeline.map((t) => (
              <View key={t.year}>
                <Text className='text-sm font-semibold text-indigo-600'>
                  {t.year}
                </Text>
                <Text className='text-sm text-gray-600'>{t.text}</Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
