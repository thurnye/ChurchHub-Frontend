import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchReceiptsScreenProps {
  church: IChurch;
}

export function ChurchReceiptsScreen({ church }: ChurchReceiptsScreenProps) {
  const receipts = useMemo(
    () => [
      { date: 'Jan 15, 2026', type: 'Tithe', amount: 100 },
      { date: 'Jan 8, 2026', type: 'Tithe', amount: 100 },
      { date: 'Jan 1, 2026', type: 'Tithe', amount: 50 },
    ],
    [],
  );

  const total = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <ChurchScreenTemplate church={church} title='Receipts' icon={FileText}>
      <Card className='mb-4'>
        <CardContent className='p-6 bg-indigo-600 rounded-2xl'>
          <Text className='text-sm text-white/80 mb-1'>
            Total Giving (2026)
          </Text>
          <Text className='text-3xl font-bold text-white'>
            ${total.toFixed(2)}
          </Text>
        </CardContent>
      </Card>

      <View className='gap-2'>
        {receipts.map((r, idx) => (
          <Card key={idx}>
            <CardContent className='p-4 flex-row items-center justify-between'>
              <View>
                <Text className='font-medium text-sm text-gray-900'>
                  {r.date}
                </Text>
                <Text className='text-xs text-gray-600'>{r.type}</Text>
              </View>

              <View className='items-end'>
                <Text className='font-semibold text-gray-900'>${r.amount}</Text>
                <Pressable onPress={() => {}} className='mt-2 px-2 py-1'>
                  <Text className='text-sm text-indigo-600 font-semibold'>
                    Download
                  </Text>
                </Pressable>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
