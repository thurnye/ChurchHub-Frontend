import React from 'react';
import { View, Text } from 'react-native';
import { Briefcase } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchStaffScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchStaffScreen({ church }: ChurchStaffScreenProps) {
  const staff = [
    'Church Warden - John Smith',
    'Music Director - Sarah Williams',
    'Youth Coordinator - Michael Brown',
    'Administrator - Jane Doe',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Staff & Lay Leaders'
      icon={Briefcase}
    >
      <Card>
        <CardContent className='p-4'>
          {staff.map((s, idx) => (
            <View
              key={idx}
              className={[
                'py-2 flex-row items-center justify-between',
                idx !== staff.length - 1 ? 'border-b border-gray-100' : '',
              ].join(' ')}
            >
              <Text className='text-sm text-gray-900'>{s}</Text>
            </View>
          ))}
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
