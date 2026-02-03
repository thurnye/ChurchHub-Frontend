import React from 'react';
import { View, Text } from 'react-native';
import { GraduationCap } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchFaithFormationScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchFaithFormationScreen({
  church,
}: ChurchFaithFormationScreenProps) {
  const programs = [
    'New Believers Class',
    'Discipleship Training',
    'Leadership Development',
    'Spiritual Mentoring',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Faith Formation'
      icon={GraduationCap}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Growing in Faith
              </Text>
              <Text className='text-sm text-gray-600'>
                We offer various programs to help you grow in your walk with
                Christ.
              </Text>
            </View>

            <View className='gap-2'>
              {programs.map((program, idx) => (
                <Card key={idx} className='bg-gray-50'>
                  <CardContent className='p-3'>
                    <Text className='text-sm font-medium text-gray-900'>
                      {program}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
