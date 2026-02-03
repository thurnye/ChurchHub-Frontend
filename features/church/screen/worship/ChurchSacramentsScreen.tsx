import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BookOpen } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchSacramentsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchSacramentsScreen({
  church,
}: ChurchSacramentsScreenProps) {
  const [open, setOpen] = useState<string | null>(null);

  const items = [
    {
      id: 'baptism',
      title: 'Baptism',
      body: 'An outward expression of an inward faith in Jesus Christ.',
    },
    {
      id: 'communion',
      title: 'Holy Communion',
      body: "Remembering Christ's sacrifice through bread and wine.",
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      body: "Affirming one's faith publicly as a mature believer.",
    },
  ];

  return (
    <ChurchScreenTemplate
      church={church}
      title='Sacraments / Ordinances'
      icon={BookOpen}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='gap-2'>
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
                    <Text className='font-semibold text-gray-900'>
                      {it.title}
                    </Text>
                    <Text className='text-gray-500'>{isOpen ? '−' : '+'}</Text>
                  </Pressable>

                  {isOpen ? (
                    <View className='px-4 pb-4'>
                      <Text className='text-sm text-gray-600'>{it.body}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
