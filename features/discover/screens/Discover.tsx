import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Image, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  MapPin,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  Church,
} from 'lucide-react-native';
import { denominations } from '@/data/mockData';
import { Button, Card, CardContent, Badge } from '@/shared/components/ui';
import { TopBar } from '@/shared/components';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchDiscoverItems } from '../redux/slices/discover.slice';

interface DiscoverProps {
  // onNavigateToChurch?: (churchId: string) => void;
}

export function Discover({  }: DiscoverProps) {
  const dispatch = useAppDispatch();
  const { items: churches, status } = useAppSelector((state) => state.discover);
  const [selectedDenomination, setSelectedDenomination] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChurchId, setSelectedChurchId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    dispatch(fetchDiscoverItems());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      console.log('Search query:', searchQuery);
    }
  }, [searchQuery]);

  const filteredChurches = selectedDenomination
    ? churches.filter((c) => c.denomination === selectedDenomination)
    : churches;

  // Calculate initial region based on churches
  const initialRegion = {
    latitude: churches[0]?.lat || 40.7128,
    longitude: churches[0]?.lng || -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (status === 'loading') {
    return (
      <View className='flex-1 bg-gray-50'>
        <TopBar title='Find Churches' showSearch={true} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
          <Text className='text-gray-600 mt-4'>Loading churches...</Text>
        </View>
      </View>
    );
  }

  const handleNavigateToChurch = (churchId: string) => {
     router.push({
      pathname: '/church/[id]',
      params: {
        id: churchId,
        from: 'discover',
      },
    });
  };

  const handleMarkerPress = (churchId: string) => {
    setSelectedChurchId(churchId);
    const church = churches.find((c) => c.id === churchId);
    if (church && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: church.lat,
        longitude: church.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  };

  return (
    <View className='flex-1 bg-gray-50'>
      <TopBar
        title='Find Churches'
          onSearchSubmit={(text) => {
            if (text){
              console.log('Search submitted:', text);
              setSearchQuery(text);
            }
        }}
        showSearch={true}
      />
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Map View */}
        <View className='relative h-64'>
          <MapView
            ref={mapRef}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={{ width: '100%', height: '100%' }}
            initialRegion={initialRegion}
            showsUserLocation
            showsMyLocationButton
          >
            {filteredChurches.map((church) => (
              <Marker
                key={church.id}
                coordinate={{
                  latitude: church.lat,
                  longitude: church.lng,
                }}
                title={church.name}
                description={`${church.denomination} • ${church.distance}`}
                onPress={() => handleMarkerPress(church.id)}
                pinColor={selectedChurchId === church.id ? '#4f46e5' : '#ef4444'}
              >
                <View className={`w-10 h-10 rounded-full border-4 border-white shadow-lg items-center justify-center ${
                  selectedChurchId === church.id ? 'bg-indigo-600' : 'bg-red-500'
                }`}>
                  <Church size={20} color='#ffffff' />
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Church count overlay */}
          <View className='absolute top-3 left-3 bg-white/95 px-3 py-2 rounded-full shadow-md'>
            <Text className='text-xs font-semibold text-gray-700'>
              {filteredChurches.length} churches nearby
            </Text>
          </View>
        </View>

        {/* Filter Bar */}
        <View className='bg-white border-b border-gray-200 px-4 py-3'>
          <View className='flex-row items-center gap-2 mb-3'>
            <Button variant='outline' size='sm'>
              <View className='flex-row items-center gap-2'>
                <SlidersHorizontal size={16} color='#111827' />
                <Text className='text-sm text-gray-900 font-medium'>
                  Filters
                </Text>
              </View>
            </Button>

            <Button variant='outline' size='sm'>
              <Text className='text-sm text-gray-900 font-medium'>
                Distance
              </Text>
            </Button>

            <Button variant='outline' size='sm'>
              <Text className='text-sm text-gray-900 font-medium'>
                Service Time
              </Text>
            </Button>
          </View>

          {/* Denomination Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='-mx-4 px-4'
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            <Pressable
              onPress={() => setSelectedDenomination(null)}
              className={`px-4 py-2 rounded-full ${
                selectedDenomination === null ? 'bg-indigo-600' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedDenomination === null ? 'text-white' : 'text-gray-700'
                }`}
              >
                All
              </Text>
            </Pressable>
            {denominations.map((denomination) => (
              <Pressable
                key={denomination.id}
                onPress={() => setSelectedDenomination(denomination.name)}
                className={`px-4 py-2 rounded-full ${
                  selectedDenomination === denomination.name
                    ? 'bg-indigo-600'
                    : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedDenomination === denomination.name
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {denomination.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Church List */}
        <View className='px-4 py-4'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-sm text-gray-600'>
              {filteredChurches.length}{' '}
              {filteredChurches.length === 1 ? 'church' : 'churches'} found
            </Text>
          </View>

          <View className='gap-3'>
            {filteredChurches.map((church) => (
              <Pressable
                key={church.id}
                onPress={() => handleNavigateToChurch(church.id)}
              >
                <Card className='overflow-hidden'>
                  <CardContent className='p-0'>
                    <View className='flex-row'>
                      <Image
                        source={{ uri: church.image }}
                        className='w-24 h-24'
                        resizeMode='cover'
                      />

                      <View className='flex-1 p-3 pr-2'>
                        <Text
                          className='font-semibold text-gray-900 mb-1'
                          numberOfLines={1}
                          ellipsizeMode='tail'
                        >
                          {church.name}
                        </Text>

                        <View className='flex-row items-center gap-2 mb-2'>
                          <Badge variant='secondary'>
                            <Text className='text-xs text-gray-700'>
                              {church.denomination}
                            </Text>
                          </Badge>

                          {church.hasLivestream && (
                            <Badge variant='outline'>
                              <Text className='text-xs text-gray-700'>
                                Online
                              </Text>
                            </Badge>
                          )}
                        </View>

                        <View className='flex-row items-center gap-3'>
                          <View className='flex-row items-center gap-1'>
                            <MapPin size={12} color='#6b7280' />
                            <Text className='text-xs text-gray-500'>
                              {church.distance}
                            </Text>
                          </View>

                          <View className='flex-row items-center gap-1'>
                            <Clock size={12} color='#6b7280' />
                            <Text className='text-xs text-gray-500'>
                              {church.nextService}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View className='justify-center pr-3'>
                        <ChevronRight size={20} color='#9ca3af' />
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bottom padding */}
        <View className='h-20' />
      </ScrollView>
    </View>
  );
}
