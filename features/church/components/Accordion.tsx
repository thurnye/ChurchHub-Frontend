import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface AccordionProps {
  items: { key: string; title: string; content: string }[];
}

export function Accordion({ items }: AccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <View className='gap-2'>
      {items.map((it) => {
        const isOpen = openKey === it.key;
        return (
          <View
            key={it.key}
            className='rounded-xl border border-gray-200 bg-white overflow-hidden'
          >
            <Pressable
              onPress={() => setOpenKey(isOpen ? null : it.key)}
              className='px-4 py-3 active:bg-gray-50'
            >
              <Text className='font-semibold text-gray-900'>{it.title}</Text>
            </Pressable>

            {isOpen && (
              <View className='px-4 pb-4'>
                <Text className='text-sm text-gray-600 leading-5'>
                  {it.content}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
