// EventDetailScreen.tsx (React Native + NativeWind)
// No Button/Badge components — only Pressable + RN

import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Users,
  Plus,
} from 'lucide-react-native';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchEvents } from '../redux/slices/events.slice';

interface EventDetailScreenProps {}

function Chip({ label }: { label: string }) {
  return (
    <View className='self-start px-3 py-1 rounded-full bg-gray-100 border border-gray-200'>
      <Text className='text-xs font-semibold text-gray-700'>{label}</Text>
    </View>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <View className='self-start px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100'>
      <Text className='text-xs font-semibold text-indigo-700'>{label}</Text>
    </View>
  );
}

function PrimaryBtn({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='flex-1 h-12 rounded-xl bg-indigo-600 items-center justify-center'
    >
      <Text className='text-white font-semibold text-base'>{label}</Text>
    </Pressable>
  );
}

function IconBtn({
  onPress,
  children,
  variant = 'ghost',
}: {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'ghost' | 'outline';
}) {
  const base = 'h-12 w-12 rounded-xl items-center justify-center';
  const styles =
    variant === 'outline'
      ? 'bg-white border border-gray-300'
      : 'bg-white/90 border border-white/40';

  return (
    <Pressable onPress={onPress} className={`${base} ${styles}`}>
      {children}
    </Pressable>
  );
}

function InfoRow({
  icon,
  title,
  value,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  extra?: React.ReactNode;
}) {
  return (
    <View className='flex-row items-start gap-3'>
      <View className='mt-0.5'>{icon}</View>
      <View className='flex-1'>
        <Text className='font-semibold text-gray-900'>{title}</Text>
        <Text className='text-sm text-gray-600 mt-0.5'>{value}</Text>
        {extra}
      </View>
    </View>
  );
}

export function EventDetailScreen({}: EventDetailScreenProps) {
  const dispatch = useAppDispatch();
  const { items: events, status } = useAppSelector((state) => state.events);
  const { eventId, from } = useLocalSearchParams<{
    eventId: string;
    from: string;
  }>();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const event = useMemo(
    () => events.find((e) => e.id === eventId) || events[0],
    [events, eventId],
  );

  if (status === 'loading' || !event) {
    return (
      <View className='flex-1 bg-gray-50'>
        <HiddenScreensTopBar show={true} title='Loading...' navigateTo={from} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#4f46e5' />
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <HiddenScreensTopBar
        show={true}
        title={event.title}
        navigateTo={'community'}
      />

     <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className='relative'>
          <Image
            source={{ uri: event.image }}
            accessibilityLabel={event.title}
            className='w-full h-56'
            resizeMode='cover'
          />

          <View className='absolute top-4 right-4'>
            <IconBtn onPress={() => {}}>
              <Share2 size={20} color='#111827' />
            </IconBtn>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerClassName='pb-28'>
          <View className='-mt-6 bg-white rounded-t-3xl px-4 pt-6 pb-6'>
            <Chip label={event.denomination} />

            <Text className='text-2xl font-bold text-gray-900 mt-3'>
              {event.title}
            </Text>

            <View className='flex-row items-center gap-2 mt-2'>
              <Users size={16} color='#4b5563' />
              <Text className='text-sm text-gray-600'>{event.church}</Text>
            </View>

            {/* Details */}
            <View className='mt-6 gap-4'>
              <InfoRow
                icon={<Calendar size={20} color='#4f46e5' />}
                title='Date & Time'
                value={`${event.date} at ${event.time}`}
              />

              <InfoRow
                icon={<MapPin size={20} color='#4f46e5' />}
                title='Location'
                value='123 Main Street, Downtown'
                extra={
                  <Pressable onPress={() => {}} className='mt-2 self-start'>
                    <Text className='text-sm font-semibold text-indigo-600'>
                      Get Directions
                    </Text>
                  </Pressable>
                }
              />
            </View>

            {/* Description */}
            <View className='mt-6'>
              <Text className='font-semibold text-gray-900 mb-2'>
                About This Event
              </Text>
              <Text className='text-sm text-gray-600 leading-relaxed'>
                {event.description}
              </Text>
              <Text className='text-sm text-gray-600 leading-relaxed mt-3'>
                Join us for an inspiring evening of worship, fellowship, and
                spiritual growth. This event is open to all members of the
                community. Light refreshments will be served.
              </Text>
            </View>

            {/* Organizer */}
            <View className='mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100'>
              <Text className='font-semibold text-gray-900 mb-2'>
                Organizer
              </Text>
              <Text className='text-sm text-gray-600'>{event.church}</Text>
              <Text className='text-sm text-indigo-600 mt-1'>
                contact@church.org
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
          <View className='flex-row gap-3'>
            <PrimaryBtn label='RSVP Now' onPress={() => {}} />
            <IconBtn onPress={() => {}} variant='outline'>
              <Plus size={20} color='#111827' />
            </IconBtn>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
