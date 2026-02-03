import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { Heart, Users, Mail, ChevronRight } from 'lucide-react-native';

import { TopBar } from '@/shared/components/TopBar';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchCommunityItems } from '../redux/slices/community.slice';

const categories = [
  'All',
  'Outreach & Charity',
  'Health & Counseling',
  'Community Programs',
  'Volunteer Opportunities',
];

export function CommunityScreen() {
  const dispatch = useAppDispatch();
  const { items: communityPrograms, status, error } = useAppSelector((state) => state.community);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    dispatch(fetchCommunityItems());
  }, [dispatch]);

  const filteredPrograms =
    selectedCategory === 'All'
      ? communityPrograms
      : communityPrograms.filter((p) => p.category === selectedCategory);

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50'>
        <TopBar title='Community' />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading programs...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <TopBar title='Community' />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className='bg-white px-4 py-6 border-b border-gray-100'>
          <Text className='text-lg font-semibold text-gray-900 mb-2'>
            Get Involved
          </Text>
          <Text className='text-sm text-gray-600'>
            Discover programs and volunteer opportunities in your community.
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='py-3 bg-white'
        >
          <View className='flex-row gap-2 px-4'>
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-indigo-600'
                    : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Programs Grid */}
        <View className='px-4 py-4'>
          <Text className='text-sm text-gray-500 mb-3'>
            {filteredPrograms.length} programs found
          </Text>
          <View className='gap-4'>
            {filteredPrograms.map((program) => (
              <Card key={program.id}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/community/[id]',
                      params: {
                        id: program.id,
                        from: 'community',
                      },
                    })
                  }
                >
                  <View className='relative'>
                    <Image
                      source={{ uri: program.image }}
                      style={{ width: '100%', height: 160 }}
                      contentFit='cover'
                    />
                    <View className='absolute top-3 left-3'>
                      <Badge variant='secondary' className='bg-white/90'>
                        <Text className='text-xs text-gray-700'>
                          {program.category}
                        </Text>
                      </Badge>
                    </View>
                  </View>
                </Pressable>
                <CardContent>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/community/[id]',
                        params: {
                          id: program.id,
                          from: 'community',
                        },
                      })
                    }
                  >
                    <Text className='font-semibold text-gray-900 text-base mb-2'>
                      {program.title}
                    </Text>
                    <Text className='text-sm text-gray-600 mb-4'>
                      {program.description}
                    </Text>
                  </Pressable>
                  <View className='flex-row gap-2'>
                    <Button variant='outline' size='sm' className='flex-1'>
                      <View className='flex-row items-center gap-1'>
                        <Mail size={14} color='#111827' />
                        <Text className='text-gray-900 text-sm font-medium'>
                          Contact
                        </Text>
                      </View>
                    </Button>
                    <Button size='sm' className='flex-1'>
                      <View className='flex-row items-center gap-1'>
                        <Heart size={14} color='#ffffff' />
                        <Text className='text-white text-sm font-medium'>
                          Get Involved
                        </Text>
                      </View>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>

        {/* Volunteer CTA */}
        <View className='px-4 pb-6'>
          <Card className='bg-indigo-50 border-indigo-100'>
            <CardContent>
              <View className='flex-row items-center gap-4'>
                <View className='w-12 h-12 bg-indigo-100 rounded-full items-center justify-center'>
                  <Users size={24} color='#4f46e5' />
                </View>
                <View className='flex-1'>
                  <Text className='font-semibold text-gray-900 mb-1'>
                    Become a Volunteer
                  </Text>
                  <Text className='text-sm text-gray-600'>
                    Join our network of volunteers making a difference.
                  </Text>
                </View>
                <ChevronRight size={20} color='#9ca3af' />
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
