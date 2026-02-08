import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Linking } from 'react-native';
import {
  Share2,
  Mail,
  Clock,
  Users,
  MapPin,
  CheckCircle,
} from 'lucide-react-native';

import { Badge } from '@/shared/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchProgramById, clearSelected } from '../redux/slices/community.slice';
import { ProgramType } from '../types/community.types';

function IconBtn({
  onPress,
  children,
  className = '',
}: {
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-10 h-10 rounded-full items-center justify-center ${className}`}
      hitSlop={10}
    >
      {children}
    </Pressable>
  );
}

function PrimaryCta({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 h-12 rounded-xl bg-indigo-600 items-center justify-center"
    >
      <Text className="text-white font-semibold text-base">{label}</Text>
    </Pressable>
  );
}

function OutlineCta({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 h-12 rounded-xl border border-gray-300 bg-white items-center justify-center"
    >
      <Text className="text-gray-900 font-semibold text-base">{label}</Text>
    </Pressable>
  );
}

export function CommunityProgramDetailScreen() {
  const dispatch = useAppDispatch();
  const { selected: program, selectedStatus } = useAppSelector((state) => state.community);
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();

  useEffect(() => {
    if (id) {
      dispatch(fetchProgramById(id));
    }

    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  const handleEmailContact = () => {
    const email = program?.contact || program?.coordinator;
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleShare = async () => {
    // Implement share functionality
  };

  if (selectedStatus === 'loading' || !program) {
    return (
      <View className="flex-1 bg-gray-50">
        <HiddenScreensTopBar show={true} title="Loading..." navigateTo={from} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      </View>
    );
  }

  if (selectedStatus === 'failed') {
    return (
      <View className="flex-1 bg-gray-50">
        <HiddenScreensTopBar show={true} title="Error" navigateTo={from} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-600 text-center">Failed to load program details.</Text>
        </View>
      </View>
    );
  }

  const isVolunteer = program.type === ProgramType.VOLUNTEER;
  const contactEmail = program.contact || program.coordinator;

  return (
    <View className="flex-1 bg-gray-50">
      <HiddenScreensTopBar show={true} title={program.title} navigateTo={from} />

      {/* Header with image */}
      <View className="relative">
        {program.image ? (
          <Image
            source={{ uri: program.image }}
            className="w-full h-56"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-56 bg-gray-200 items-center justify-center">
            <Users size={48} color="#9ca3af" />
          </View>
        )}

        <View className="absolute top-4 right-4">
          <IconBtn onPress={handleShare} className="bg-white/90">
            <Share2 size={20} color="#111827" />
          </IconBtn>
        </View>
      </View>

      <ScrollView contentContainerClassName="pb-28" className="-mt-6">
        {/* Content */}
        <View className="bg-white rounded-t-3xl px-4 pt-6 pb-6">
          <View className="flex-row items-center justify-between gap-2 mb-3">
            <Badge variant="secondary">
              <Text className="text-xs">{program.category}</Text>
            </Badge>
            <Badge variant={isVolunteer ? 'warning' : 'secondary'}>
              <Text className="text-xs">{isVolunteer ? 'Volunteer' : 'Community'}</Text>
            </Badge>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {program.title}
          </Text>

          <View className="flex-row items-center gap-2 mb-6">
            <View className={`px-3 py-1 rounded-full ${program.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-semibold ${program.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                {program.isActive ? 'Active Program' : 'Inactive'}
              </Text>
            </View>
          </View>

          {/* Program Details */}
          <View className="gap-4 mb-6">
            {/* Time Commitment (for volunteer programs) */}
            {program.timeCommitment && (
              <View className="flex-row items-start gap-3">
                <Clock size={20} color="#4f46e5" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">Time Commitment</Text>
                  <Text className="text-sm text-gray-600">{program.timeCommitment}</Text>
                </View>
              </View>
            )}

            {/* Schedule */}
            {program.schedule && (
              <View className="flex-row items-start gap-3">
                <Clock size={20} color="#4f46e5" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">Schedule</Text>
                  <Text className="text-sm text-gray-600">{program.schedule}</Text>
                </View>
              </View>
            )}

            {/* Location */}
            {program.location && (
              <View className="flex-row items-start gap-3">
                <MapPin size={20} color="#4f46e5" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">Location</Text>
                  <Text className="text-sm text-gray-600">{program.location}</Text>
                </View>
              </View>
            )}

            {/* Church (for volunteer programs) */}
            {isVolunteer && program.church && (
              <View className="flex-row items-start gap-3">
                <Users size={20} color="#4f46e5" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">Hosted By</Text>
                  <Text className="text-sm text-gray-600">{program.church}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="font-semibold text-gray-900 mb-2">
              About This Program
            </Text>
            <Text className="text-sm text-gray-600 leading-6">
              {program.description}
            </Text>
          </View>

          {/* Skills Needed (for volunteer programs) */}
          {isVolunteer && program.skillsNeeded && program.skillsNeeded.length > 0 && (
            <View className="mb-6">
              <Text className="font-semibold text-gray-900 mb-3">
                Skills Needed
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {program.skillsNeeded.map((skill, idx) => (
                  <View key={idx} className="px-3 py-1.5 bg-indigo-50 rounded-full">
                    <Text className="text-sm text-indigo-700">{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Coordinator Contact */}
          {contactEmail && (
            <View className="mb-6 p-4 bg-gray-50 rounded-xl">
              <Text className="font-semibold text-gray-900 mb-2">
                {isVolunteer ? 'Program Coordinator' : 'Contact'}
              </Text>

              <Pressable onPress={handleEmailContact} className="flex-row items-center gap-2">
                <Mail size={16} color="#9ca3af" />
                <Text className="text-sm text-indigo-600">{contactEmail}</Text>
              </Pressable>
            </View>
          )}

          {/* How to Help */}
          <View className="mb-2">
            <Text className="font-semibold text-gray-900 mb-3">
              How You Can Help
            </Text>

            <View className="gap-2">
              {isVolunteer ? (
                <>
                  <View className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#4f46e5" />
                    <Text className="text-sm text-gray-600">Sign up to volunteer</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#4f46e5" />
                    <Text className="text-sm text-gray-600">Invite others to join</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#4f46e5" />
                    <Text className="text-sm text-gray-600">Pray for this ministry</Text>
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#4f46e5" />
                    <Text className="text-sm text-gray-600">Volunteer your time</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#4f46e5" />
                    <Text className="text-sm text-gray-600">Donate to support the program</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <CheckCircle size={16} color="#4f46e5" />
                    <Text className="text-sm text-gray-600">Spread the word in your community</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row gap-3">
          {isVolunteer ? (
            <>
              <OutlineCta label="Contact" onPress={handleEmailContact} />
              <PrimaryCta label="Sign Up" onPress={() => {}} />
            </>
          ) : (
            <>
              <OutlineCta label="Volunteer" onPress={() => {}} />
              <PrimaryCta label="Donate" onPress={() => {}} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}
