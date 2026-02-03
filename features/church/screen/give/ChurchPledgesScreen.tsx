import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { ChipSelect } from '../../components/ChipSelect';
import { AppPressable } from '../../components/AppPressable';

interface ChurchPledgesScreenProps {
  church: IChurch;
}

export function ChurchPledgesScreen({ church }: ChurchPledgesScreenProps) {
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [frequency, setFrequency] = useState('Once');

  return (
    <ChurchScreenTemplate church={church} title='Pledges' icon={FileText}>
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <View>
              <Text className='font-semibold text-gray-900 mb-2'>
                Make a Pledge
              </Text>
              <Text className='text-sm text-gray-600'>
                Commit to supporting our ministry through a financial pledge.
              </Text>
            </View>

            <View className='gap-2'>
              <Text className='text-sm font-medium text-gray-900'>
                Pledge Amount
              </Text>
              <TextInput
                value={pledgeAmount}
                onChangeText={setPledgeAmount}
                keyboardType='number-pad'
                placeholder='Annual pledge amount'
                placeholderTextColor='#9ca3af'
                className='w-full px-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900'
              />
            </View>

            <ChipSelect
              label='Frequency'
              value={frequency}
              options={['Once', 'Weekly', 'Monthly', 'Quarterly', 'Annually']}
              onChange={setFrequency}
            />

            <AppPressable
              label='Submit Pledge'
              onPress={() => {}}
              disabled={!pledgeAmount.trim()}
            />
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
