import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchSpecialServicesScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchSpecialServicesScreen({
  church,
}: ChurchSpecialServicesScreenProps) {
  const services = [
    { title: 'Easter Sunday', date: 'April 20, 2026' },
    { title: 'Christmas Eve Service', date: 'December 24, 2026' },
    { title: 'Thanksgiving Service', date: 'November 26, 2026' },
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Special Services'
      icon={Calendar}
    >
      <Card>
        <CardContent className='p-4'>
          {services.map((service, idx) => (
            <View
              key={idx}
              className={`py-3 ${idx !== services.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <Text className='font-medium text-sm text-gray-900 mb-1'>
                {service.title}
              </Text>
              <Text className='text-xs text-gray-600'>{service.date}</Text>
            </View>
          ))}
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
