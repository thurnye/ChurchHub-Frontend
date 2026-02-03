import { View, Text, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Search, Bell, X, ArrowLeft } from 'lucide-react-native';
import { cn } from '@/shared/utils/cn';
import { HamburgerMenu } from './HamburgerMenu';
import { useCallback, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

interface HiddenScreensTopBarProps {
  title?: string;
  show?: boolean;
  showSearch?: boolean;
  className?: string;
  onSearchSubmit?: (text: string) => void;
  navigateTo?: string;
  showNotification?:boolean;
}

export function HiddenScreensTopBar({
  title,
  showSearch = false,
  show = true,
  onSearchSubmit,
  className,
  navigateTo,
  showNotification = true
}: HiddenScreensTopBarProps) {
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { from, returnTo } = useLocalSearchParams();
  const backNavigateTo = from ? from : navigateTo;

  const handleMenuNavigation = () => {
    if (backNavigateTo) {
      router.push(backNavigateTo as any);
      return;
    }
    if (returnTo && typeof returnTo === 'string') {
      router.push(returnTo as any);
      return;
    }
    router.back();
  };

  useFocusEffect(
    useCallback(() => {
      setIsSearchOpen(false);
      setSearchText('');
      onSearchSubmit?.('');
    }, []),
  );

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={cn('bg-white border-b border-gray-100', className)}
    >
      {/* TOP ROW */}
      <View className='flex-row items-center justify-between px-4 h-14'>
        {/* Left */}
        <Pressable
          onPress={handleMenuNavigation}
          className='w-10 h-10 rounded-full items-center justify-center active:bg-gray-100'
        >
          <ArrowLeft size={20} color='#111827' />
        </Pressable>

        {/* Center */}
        <View className='flex-1 items-center'>
          <Text className='font-semibold text-lg text-gray-900'>{title}</Text>
        </View>

        {/* Right */}
        <View className='flex-row items-center gap-1'>
          {showSearch && (
            <Pressable
              onPress={() => setIsSearchOpen((prev) => !prev)}
              className='w-10 h-10 items-center justify-center rounded-full'
            >
              {isSearchOpen ? (
                <X size={22} color='#374151' />
              ) : (
                <Search size={22} color='#374151' />
              )}
            </Pressable>
          )}

          {showNotification && <Pressable
            onPress={
              () =>
                router.push({
                  pathname: '/notifications/app-notification-list',
                })
            }
            className='w-10 h-10 items-center justify-center rounded-full'
          >
            <Bell size={22} color='#374151' />
          </Pressable>}
          {show && (
            <Pressable
              onPress={() => setIsMenuOpen(true)}
              className='w-10 h-10 items-center justify-center rounded-full'
            >
              <Menu size={24} color='#374151' />
            </Pressable>
          )}
        </View>
      </View>

      {/* SEARCH BAR (FULL WIDTH, BELOW) */}
      {isSearchOpen && (
        <View className='px-4 pb-3'>
          <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3'>
            <Search size={16} color='#9ca3af' />
            <TextInput
              autoFocus
              value={searchText}
              onChangeText={setSearchText}
              placeholder='Search...'
              placeholderTextColor='#9ca3af'
              returnKeyType='search'
              onSubmitEditing={() => {
                onSearchSubmit?.(searchText);
              }}
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 14,
                color: '#111827',
                paddingVertical: 0,
              }}
              cursorColor='#111827'
              selectionColor='#111827'
            />
          </View>
        </View>
      )}

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </View>
  );
}
