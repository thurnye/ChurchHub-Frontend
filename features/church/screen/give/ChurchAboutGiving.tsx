import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DollarSign } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import GiveFormScreen from '../../components/GiveFormScreen';

interface ChurchAboutGivingProps {
  church: IChurch;
}
 const bullets = [
    'Support our local ministry and outreach',
    'Maintain our facilities',
    'Fund missions and missionaries',
    'Help those in need',
    'Invest in the next generation',
  ];
export function ChurchAboutGiving({ church }: ChurchAboutGivingProps) {
  const [open, setOpen] = useState<string | null>(null);

  const ways = useMemo(
    () => [
      {
        title: 'Online Giving',
        desc: 'Secure online donations via card or bank transfer',
      },
      {
        title: 'During Service',
        desc: 'Give through offering baskets during worship',
      },
      { title: 'Bank Transfer', desc: 'Direct deposit to church account' },
      { title: 'Check / Cash', desc: 'Mail or drop off at church office' },
    ],
    [],
  );

  const items = [
    {
      id: 'why-we-give',
      title: 'Why We Give',
      body: <View className='gap-4'>
                  <View>
                    <Text className='text-sm text-gray-600'>
                      Giving is an act of worship and obedience to God. Through your
                      generous giving, we can:
                    </Text>
                  </View>
      
                  <View className='gap-2'>
                    {bullets.map((t) => (
                      <Text key={t} className='text-sm text-gray-700'>
                        • {t}
                      </Text>
                    ))}
                  </View>
      
                  <View className='bg-indigo-50 p-3 rounded-xl'>
                    <Text className='text-sm italic text-gray-700'>
                      "Each of you should give what you have decided in your heart to
                      give, not reluctantly or under compulsion, for God loves a
                      cheerful giver." — 2 Corinthians 9:7
                    </Text>
                  </View>
                </View>,
    },
    {
      id: 'how-to-give',
      title: 'How to Give',
      body: <View className='gap-2'>
              {ways.map((w) => (
                <Card key={w.title} className='bg-gray-50'>
                  <CardContent className='p-3'>
                    <Text className='font-medium text-sm text-gray-900 mb-1'>
                      {w.title}
                    </Text>
                    <Text className='text-xs text-gray-600'>{w.desc}</Text>
                  </CardContent>
                </Card>
              ))}
            </View>,
    },
  ];
 

  return (
    <ChurchScreenTemplate church={church} title='Giving' icon={DollarSign}>
      <GiveFormScreen/>

      <View className='gap-2 py-4'>
        {items.map((it) => {
          const isOpen = open === it.id;
          return (
            <View
              key={it.id}
              className='overflow-hidden rounded-xl border border-gray-200 bg-white'
            >
              <Pressable
                onPress={() => setOpen(isOpen ? null : it.id)}
                className='px-4 py-3 flex-row items-center justify-between'
              >
                <Text className='font-semibold text-gray-900'>{it.title}</Text>
                <Text className='text-gray-500'>{isOpen ? '−' : '+'}</Text>
              </Pressable>

              {isOpen ? (
                <View className='px-4 pb-4'>
                  <View className='text-sm text-gray-600'>{it.body}</View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </ChurchScreenTemplate>
  );
}
