import React from 'react';
import { View, Text } from 'react-native';
import { FileText } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchFormsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchFormsScreen({ church }: ChurchFormsScreenProps) {
  const forms = [
    'Membership Application',
    'Baptism Request',
    'Wedding Request',
    'Volunteer Application',
    'Prayer Request',
  ];

  return (
    <ChurchScreenTemplate church={church} title='Forms' icon={FileText}>
      <View className='gap-2'>
        {forms.map((form, idx) => (
          <Card key={idx}>
            <CardContent className='p-4 flex-row items-center justify-between'>
              <Text className='font-medium text-sm text-gray-900 flex-1'>
                {form}
              </Text>

              <Button variant='outline' size='sm' onPress={() => {}}>
                <Text className='text-sm'>Download</Text>
              </Button>
            </CardContent>
          </Card>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
