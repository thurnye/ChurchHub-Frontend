import { useAuth } from '@/shared/context/AuthContext';
import { router, usePathname } from 'expo-router';
import {
  Calendar,
  ChevronRight,
  Church,
  DollarSign,
  FileCheck,
  Flag,
  Globe,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  Radio,
  Settings,
  User,
  X,
} from 'lucide-react-native';
import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuSection {
  title: string;
  items: {
    icon: typeof Home;
    label: string;
    action: string;
  }[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Discover',
    items: [
      { icon: MapPin, label: 'Nearby Churches', action: 'nearby-churches' },
      { icon: Calendar, label: 'Events', action: 'global-events' },
      { icon: Radio, label: 'Sermons', action: 'global-sermons' },
    ],
  },
  {
    title: 'My Activity',
    items: [
      { icon: User, label: 'Profile', action: '/profile/my-profile' },
      { icon: Heart, label: 'My Churches', action: 'my-churches' },
      { icon: Calendar, label: 'My Events', action: 'my-events' },
      { icon: DollarSign, label: 'My Donations', action: 'my-donations' },
      {
        icon: DollarSign,
        label: 'My Prayer Requests',
        action: 'my-prayer-request',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      { icon: Settings, label: 'Preferences', action: 'preferences' },
      { icon: Flag, label: 'Report Church Info', action: 'report' },
      { icon: Church, label: 'Suggest a Church', action: 'suggest-church' },
      { icon: FileCheck, label: 'Terms & Privacy', action: 'terms' },
      { icon: Globe, label: 'Language Settings', action: 'language' },
      { icon: HelpCircle, label: 'Help & Support', action: 'help' },
    ],
  },
];

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  // onNavigate: (action: string) => void;
}

export function HamburgerMenu({
  isOpen,
  onClose,
  // onNavigate,
}: HamburgerMenuProps) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(300);
  const { logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : 300, { duration: 250 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleItemPress = (action: string) => {
    onClose();

    if (action === 'logout') {
      logout();
      return;
    }
    const returnTo = pathname;

    // Navigate to screens based on action
    switch (action) {
      case 'nearby-churches':
        router.push({ pathname: '/discover', params: { returnTo } });
        break;
      case 'global-events':
        router.push({
          pathname: '/events/global-events',
          params: { returnTo },
        });
        break;
      case 'global-sermons':
        router.push({
          pathname: '/sermons/global-sermons',
          params: { returnTo },
        });
        break;
      case 'profile':
        router.push({ pathname: '/profile/my-profile', params: { returnTo } });
        break;
      case 'my-churches':
        router.push({ pathname: '/profile/my-churches', params: { returnTo } });
        break;
      case 'my-events':
        router.push({ pathname: '/profile/my-events', params: { returnTo } });
        break;
      case 'my-donations':
        router.push({
          pathname: '/profile/my-donations',
          params: { returnTo },
        });
        break;
      case 'my-prayer-request':
        router.push({
          pathname: '/profile/my-prayer-list',
          params: { returnTo },
        });
        break;
      case 'preferences':
        router.push({
          pathname: '/settings/preferences',
          params: { returnTo },
        });
        break;
      case 'report':
        router.push({ pathname: '/settings/report', params: { returnTo } });
        break;
      case 'suggest-church':
        router.push({
          pathname: '/settings/suggest-church',
          params: { returnTo },
        });
        break;
      case 'terms':
        router.push({ pathname: '/settings/terms', params: { returnTo } });
        break;
      case 'language':
        router.push({ pathname: '/settings/language', params: { returnTo } });
        break;
      case 'help':
        router.push({ pathname: '/settings/help', params: { returnTo } });
        break;
      default:
        return;
        // onNavigate(action);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable className='absolute inset-0 bg-black/50' onPress={onClose} />

      {/* Drawer */}
      <Animated.View
        style={[
          animatedStyle,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
        className='absolute top-0 right-0 bottom-0 w-80 bg-white'
      >
        {/* Header */}
        <View className='p-4 border-b border-gray-100'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <View className='w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center'>
                <Text className='text-white font-bold text-sm'>CH</Text>
              </View>
              <Text className='font-semibold text-lg text-gray-900'>
                ChurchHub
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className='w-10 h-10 items-center justify-center rounded-full'
            >
              <X size={24} color='#6b7280' />
            </Pressable>
          </View>
        </View>

        {/* Menu Content */}
        <ScrollView className='flex-1'>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} className='py-4'>
              <Text className='px-4 text-xs font-semibold text-gray-500 uppercase mb-2'>
                {section.title}
              </Text>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <Pressable
                    key={itemIndex}
                    onPress={() => handleItemPress(item.action)}
                    className='flex-row items-center justify-between mx-2 px-3 py-3 rounded-lg active:bg-gray-100'
                  >
                    <View className='flex-row items-center gap-3'>
                      <Icon size={20} color='#6b7280' />
                      <Text className='text-sm text-gray-900'>
                        {item.label}
                      </Text>
                    </View>
                    <ChevronRight size={18} color='#9ca3af' />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View className='p-4 border-t border-gray-100'>
          <Pressable
            onPress={() => handleItemPress('logout')}
            className='flex-row items-center gap-3 px-3 py-3 rounded-lg active:bg-gray-100'
          >
            <LogOut size={20} color='#dc2626' />
            <Text className='text-sm text-red-600'>Sign Out</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}
