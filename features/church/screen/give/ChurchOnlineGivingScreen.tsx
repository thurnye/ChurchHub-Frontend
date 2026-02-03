import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { DollarSign } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { ChipSelect } from '../../components/ChipSelect';
import { AppPressable } from '../../components/AppPressable';

interface ChurchOnlineGivingScreenProps {
  church: IChurch;
}

export function ChurchOnlineGivingScreen({
  church,
}: ChurchOnlineGivingScreenProps) {
  const [donationType, setDonationType] = useState('Tithe');
  const [amount, setAmount] = useState<number>(50);

  const presets = [25, 50, 100, 250];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Online Giving'
      icon={DollarSign}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='gap-4'>
            <ChipSelect
              label='Donation Type'
              value={donationType}
              options={['Tithe', 'Offering', 'Missions', 'Building Fund']}
              onChange={setDonationType}
            />

            <View className='gap-2'>
              <Text className='text-sm font-medium text-gray-900'>Amount</Text>

              <View className='flex-row flex-wrap gap-2'>
                {presets.map((p) => {
                  const active = amount === p;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setAmount(p)}
                      className={`px-3 py-2 rounded-xl border-2 ${
                        active
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <Text
                        className={`font-medium ${active ? 'text-indigo-700' : 'text-gray-800'}`}
                      >
                        ${p}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <TextInput
                value={String(amount)}
                onChangeText={(t) => {
                  const n = Number(t.replace(/[^\d]/g, ''));
                  setAmount(Number.isFinite(n) ? n : 0);
                }}
                keyboardType='number-pad'
                placeholder='Custom amount'
                placeholderTextColor='#9ca3af'
                className='w-full px-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900'
              />
            </View>

            <AppPressable
              label={`Give Securely ($${amount || 0})`}
              size='lg'
              onPress={() => {}}
              disabled={!amount || amount <= 0}
            />

            <Text className='text-xs text-center text-gray-500'>
              Your donation is secure and tax-deductible
            </Text>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
