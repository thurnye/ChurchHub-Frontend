import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { Users } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { AppPressable } from '../../components/AppPressable';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchGroups } from '@/features/groups/redux/slices/groups.slice';

interface ChurchGroupsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchGroupsScreen({ church }: ChurchGroupsScreenProps) {
  const dispatch = useAppDispatch();
  const { items: churchGroups, status, error } = useAppSelector((state) => state.groups);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Church Groups / Bodies'
        icon={Users}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading groups...</Text>
        </View>
      </ChurchScreenTemplate>
    );
  }

  if (status === 'failed') {
    return (
      <ChurchScreenTemplate
        church={church}
        title='Church Groups / Bodies'
        icon={Users}
      >
        <View className='flex-1 items-center justify-center py-20'>
          <Text className='text-gray-600 mb-4'>{error}</Text>
          <Pressable
            onPress={() => dispatch(fetchGroups())}
            className='bg-indigo-600 px-4 py-2 rounded-lg'
          >
            <Text className='text-white font-semibold'>Retry</Text>
          </Pressable>
        </View>
      </ChurchScreenTemplate>
    );
  }

  return (
    <ChurchScreenTemplate
      church={church}
      title='Church Groups / Bodies'
      icon={Users}
    >
      <ScrollView className='gap-3'>
        {churchGroups.map((group, idx) => (
          <Card key={idx}>
            <CardContent className='p-4'>
              <Text className='font-medium text-gray-900 mb-2'>
                {group.name}
              </Text>
              <Text className='text-sm text-gray-600 mb-3'>
                {group.description.length > 10
                  ? `${group.description.slice(0, 45)}...`
                  : group.description}
              </Text>

              <AppPressable
                label='Learn More'
                variant='outline'
                onPress={() => {
                  router.push({
                    pathname: '/church/group-detail',
                    params: {
                      groupId: group.id,
                      from: `/church/${id}`,
                      tab: 'group',
                    },
                  });
                  setSelectedCareerId(group.id);
                  setOpen(true);
                }}
              />
            </CardContent>
          </Card>
        ))}
      </ScrollView>
    </ChurchScreenTemplate>
  );
}
