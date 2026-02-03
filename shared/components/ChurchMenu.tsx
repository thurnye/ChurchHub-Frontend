import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {
  X,
  Church,
  MapPin,
  Calendar,
  Heart,
  DollarSign,
  Phone,
  FileText,
  Boxes,
  Users,
  BookOpen,
  Music,
  Droplet,
  Gift,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  MailIcon as Mail,
  HandHeart,
  HandCoins,
  Globe,
  Workflow,
  ReceiptText,
  Banknote,
  Cross,
  Newspaper,
  GalleryHorizontalEnd,
} from 'lucide-react-native';

type LucideIcon = React.ComponentType<{ size?: number; color?: string }>;

interface MenuItem {
  icon: LucideIcon;
  label: string;
  action: string;
}

interface MenuSection {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
}

interface ChurchMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: string) => void;
  churchName: string;
}

// Simple Mail icon (fallback)
function MailIcon({
  size = 20,
  color = '#6b7280',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          borderWidth: 2,
          borderColor: color,
          borderRadius: 4,
          width: size,
          height: size * 0.78,
          marginTop: size * 0.11,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: -size * 0.1,
            right: -size * 0.1,
            top: size * 0.22,
            height: 2,
            backgroundColor: color,
            transform: [{ rotate: '25deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: -size * 0.1,
            right: -size * 0.1,
            top: size * 0.22,
            height: 2,
            backgroundColor: color,
            transform: [{ rotate: '-25deg' }],
          }}
        />
      </View>
    </View>
  );
}

const menuSections: MenuSection[] = [
  // About Section
  {
    title: 'About',
    icon: BookOpen,
    items: [
      { icon: Church, label: 'Who We Are', action: 'who-we-are' },
      { icon: Heart, label: 'Mission & Vision', action: 'mission-vision' },
      { icon: BookOpen, label: 'Beliefs / Doctrine', action: 'beliefs' },
      { icon: GalleryHorizontalEnd, label: 'History', action: 'history' },
      { icon: Users, label: 'Structure', action: 'structure' },
      {
        icon: Church,
        label: 'Architecture & Heritage',
        action: 'architecture',
      },
      { icon: Users, label: 'Clergy & Leadership', action: 'clergy' },
      // { icon: Briefcase, label: 'Staff & Lay Leaders', action: 'staff' },
      { icon: Globe, label: 'Church News', action: 'global-church-news' },
      { icon: Briefcase, label: 'Careers', action: 'careers' },
    ],
  },
  // Worship Section
  {
    title: 'Worship',
    icon: Church,
    items: [
      // { icon: Church, label: 'Sunday Services', action: 'sunday-services' },
      {
        icon: Calendar,
        label: 'Weekday & Special Services',
        action: 'weekday-services',
      },
      // { icon: Workflow, label: 'Worship Online', action: 'worship-online' },
      { icon: FileText, label: 'Sermons & Homilies', action: 'sermons' },
      { icon: Music, label: 'Music Ministry', action: 'music' },
      {
        icon: Droplet,
        label: 'Baptism & Weddings',
        action: 'baptism-weddings',
      },
      { icon: Gift, label: 'Stewardship', action: 'stewardship' },
      {
        icon: BookOpen,
        label: 'Sacraments / Ordinances',
        action: 'sacraments',
      },
      // { icon: Newspaper, label: 'Newsletters', action: 'newsletters' },
    ],
  },

  // Ministries Section
  {
    title: 'Ministries',
    icon: Users,
    items: [
      {
        icon: GraduationCap,
        label: 'Faith Formation',
        action: 'faith-formation',
      },
      {
        icon: BookOpen,
        label: 'Bible Study / Catechism',
        action: 'bible-study',
      },
      // {
      //   icon: Users,
      //   label: 'Children, Youth & Family',
      //   action: 'youth-family',
      // },
      { icon: Boxes, label: 'Church Groups / Bodies', action: 'groups' },
      { icon: Cross, label: 'Pastoral Care', action: 'pastoral-care' },
      {
        icon: Church,
        label: 'Membership & Confirmation',
        action: 'membership',
      },
    ],
  },
  // Give / Donate Section
  {
    title: 'Give / Donate',
    icon: DollarSign,
    items: [
      // { icon: HandHeart, label: 'Why We Give', action: 'why-give' },
      { icon: HandCoins, label: 'About Giving', action: 'about-giving' },
      // { icon: DollarSign, label: 'Online Giving', action: 'online-giving' },
      { icon: Banknote, label: 'Pledges', action: 'pledges' },
      { icon: ReceiptText, label: 'Receipts', action: 'receipts' },
    ],
  },
  // Events Section
  {
    title: 'Events',
    icon: Calendar,
    items: [
      // { icon: Calendar, label: "What's On", action: 'events' },
      { icon: Calendar, label: 'Church Calendar', action: 'church-calendar' },
      {
        icon: Calendar,
        label: 'Conferences / Retreats',
        action: 'conferences',
      },
      { icon: Music, label: 'Lectures / Recitals', action: 'lectures' },
      // { icon: FileText, label: 'Past Events Archive', action: 'past-events' },
    ],
  },
  // Community Section
  {
    title: 'Community',
    icon: HeartHandshake,
    items: [
      {
        icon: Users,
        label: 'Community Programs',
        action: 'community-programs',
      },
      { icon: Heart, label: 'Outreach & Charity', action: 'outreach' },
      {
        icon: HeartHandshake,
        label: 'Food Banks / Drop-in',
        action: 'food-banks',
      },
      {
        icon: Heart,
        label: 'Health & Counseling',
        action: 'health-counseling',
      },
      { icon: Users, label: 'Volunteer Opportunities', action: 'volunteer' },
    ],
  },
  // Resources Section
  {
    title: 'Resources',
    icon: FileText,
    items: [
      { icon: FileText, label: 'Sermon Library', action: 'sermons' },
      { icon: BookOpen, label: 'Devotionals', action: 'devotionals' },
      { icon: GraduationCap, label: 'Study Guides', action: 'study-guides' },
      { icon: FileText, label: 'Forms', action: 'forms' },
    ],
  },
  // Contact & Visit Section
  {
    title: 'Contact & Visit',
    icon: Phone,
    items: [
      { icon: Phone, label: 'Contact Officials', action: 'contact-clergy' },
      { icon: Mail, label: 'General Enquiries', action: 'general-enquiries' },
      { icon: MapPin, label: 'Location & Map', action: 'location' },
      { icon: Users, label: 'Accessibility', action: 'accessibility' },
    ],
  },
];

export function ChurchMenu({
  isOpen,
  onClose,
  onNavigate,
  churchName,
}: ChurchMenuProps) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(320);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : 320, { duration: 250 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleItemPress = (action: string) => {
    onNavigate(action);
    onClose();
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
        <View className='px-4 py-3.5 border-b border-gray-100'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2 flex-1'>
              <View className='w-8 h-8 rounded-lg bg-indigo-600 items-center justify-center'>
                <Text className='text-white font-bold text-xs'>CH</Text>
              </View>

              <View className='flex-1 pr-3'>
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  className='text-lg font-semibold text-gray-900 leading-tight'
                >
                  {churchName}
                </Text>
              </View>
            </View>

            <Pressable
              className='w-10 h-10 rounded-full items-center justify-center'
              onPress={onClose}
            >
              <X size={22} color='#6b7280' />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView className='flex-1'>
          <View className='p-4'>
            {menuSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              return (
                <View key={sectionIndex} className='mb-5'>
                  {/* Section title (right-aligned) */}
                  <View className='flex-row items-center justify-end gap-2 px-2 mb-2'>
                    <SectionIcon size={16} color='#6b7280' />
                    <Text className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      {section.title}
                    </Text>
                  </View>

                  {/* Items */}
                  <View className='space-y-1'>
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      return (
                        <Pressable
                          key={itemIndex}
                          onPress={() => handleItemPress(item.action)}
                          className='flex-row items-center justify-between px-3 py-3 rounded-xl active:bg-gray-100'
                        >
                          <View className='flex-row items-center gap-3'>
                            <Icon size={18} color='#4b5563' />
                            <Text className='text-sm text-gray-900'>
                              {item.label}
                            </Text>
                          </View>
                          {/* If you want the chevron back, uncomment */}
                          {/* <ChevronRight size={18} color="#9ca3af" /> */}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
