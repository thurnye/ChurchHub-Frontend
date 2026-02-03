import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';

interface ChurchMembershipScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchMembershipScreen({
  church,
}: ChurchMembershipScreenProps) {
  const steps = [
    'Attend New Members Class',
    'Meet with Pastor',
    'Confirmation or Transfer',
    'Welcome to the Family!',
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Membership & Confirmation'
      icon={Users}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Become a Member
              </Text>
              <Text className='text-sm text-gray-600'>
                We invite you to join our church family and participate fully in
                the life of our congregation.
              </Text>
            </View>

            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Membership Process
              </Text>
              <View className='gap-2'>
                {steps.map((s, idx) => (
                  <View key={idx} className='flex-row items-start'>
                    <Text className='text-sm text-gray-700 mr-2'>
                      {idx + 1}.
                    </Text>
                    <Text className='text-sm text-gray-700 flex-1'>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            <AppPressable
              label='Start Membership Process'
              variant='primary'
              onPress={() => {}}
            />
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
