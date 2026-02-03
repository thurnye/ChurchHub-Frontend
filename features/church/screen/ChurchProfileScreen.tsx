import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
  Heart,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Share2,
  Video,
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {  IChurch, IChurchLeader } from '@/data/mockData';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
} from '@/shared/components/ui';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchChurches } from '../redux/slices/church.slice';

// ABOUT
import {
  ChurchArchitectureScreen,
  ChurchBeliefsScreen,
  ChurchCareersScreen,
  ChurchClergyScreen,
  ChurchGlobalChurchNewsScreen,
  ChurchHistoryScreen,
  ChurchMissionScreen,
  // ChurchStaffScreen,
  ChurchStructureScreen,
  ChurchWhoWeAreScreen,
} from './AboutMenuSectionScreens';
// WORSHIP
import {
  ChurchBaptismWeddingsScreen,
  ChurchMusicMinistryScreen,
  ChurchSacramentsScreen,
  ChurchSermonsScreen,
  ChurchStewardshipScreen,
  // ChurchSundayServicesScreen,
  ChurchWeekdayServicesScreen,
  ChurchWorshipOnlineScreen,
} from './WorshipMenuSectionScreens';

// MINISTRIES
import {
  ChurchBibleStudyScreen,
  ChurchFaithFormationScreen,
  ChurchGroupsScreen,
  ChurchMembershipScreen,
  ChurchPastoralCareScreen,
  // ChurchYouthFamilyScreen,
} from './MinistriesMenuSectionScreens';

// GIVE
import {
  ChurchAboutGiving,
  // ChurchHowToGiveScreen,
  // ChurchOnlineGivingScreen,
  ChurchPledgesScreen,
  ChurchReceiptsScreen,
  // ChurchWhyGiveScreen,
} from './GiveMenuSectionScreens';

// EVENTS
import {
  ChurchConferencesScreen,
  ChurchCalendarScreen,
  ChurchLecturesScreen,
  // ChurchPastEventsScreen,
  ChurchSpecialServicesScreen,
} from './EventMenuSectionScreens';

// COMMUNITY
import {
  ChurchCommunityProgramsScreen,
  ChurchFoodBanksScreen,
  ChurchHealthCounselingScreen,
  ChurchOutreachScreen,
  ChurchVolunteerScreen,
} from './CommunityMenuSectionScreens';

// RESOURCES
import {
  ChurchDevotionalsScreen,
  ChurchFormsScreen,
  ChurchStudyGuidesScreen,
} from './ResourcesMenuSectionScreens';

// CONTACT
import {
  ChurchAccessibilityScreen,
  ChurchContactOfficialsScreen,
  ChurchGeneralEnquiriesScreen,
  ChurchLocationScreen,
} from './ContactMenuSectionScreens';

import { ChurchTopBar } from '@/shared/components/ChurchTopBar';
import GiveFormScreen from '../components/GiveFormScreen';

const tabs = ['Overview', 'Services', 'Clergy', 'Events', 'Give', 'Contact'];

export type ChurchScreenComponent = React.ComponentType<{
  church: IChurch;
  onBack: () => void;
}>;

export function ChurchProfileScreen() {
  const dispatch = useAppDispatch();
  const { items: churches, status } = useAppSelector((state) => state.church);
  const { id, from, tab } = useLocalSearchParams<{
    id: string;
    from: string;
    tab: string;
  }>();
  const insets = useSafeAreaInsets();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [donations, setDonations] = useState({
    amount: 50,
    type: '',
  });
  const [activeMenuAction, setActiveMenuAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchChurches());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('Overview');
      setActiveMenuAction(null);
    }, []),
  );

  const church = churches.find((c) => c.id === id);

  //if the tab is true, then setActiveTab to tab
  useEffect(() => {
    console.log('Tab:::', tab);
    if (tab && church) {
      setActiveMenuAction(tab);
    }
  }, [tab, church]);

  if (!church) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-gray-500'>Church not found</Text>
      </View>
    );
  }

  const menuScreenRegistry: Partial<Record<string, ChurchScreenComponent>> = {
    // About
    'who-we-are': ChurchWhoWeAreScreen,
    'mission-vision': ChurchMissionScreen,
    beliefs: ChurchBeliefsScreen,
    history: ChurchHistoryScreen,
    structure: ChurchStructureScreen,
    architecture: ChurchArchitectureScreen,
    clergy: ChurchClergyScreen,
    // staff: ChurchStaffScreen,
    'global-church-news': ChurchGlobalChurchNewsScreen,
    careers: ChurchCareersScreen,

    // Worship
    // 'sunday-services': ChurchSundayServicesScreen,
    'weekday-services': ChurchWeekdayServicesScreen,
    // 'worship-online': ChurchWorshipOnlineScreen,
    sermons: ChurchSermonsScreen,
    music: ChurchMusicMinistryScreen,
    'baptism-weddings': ChurchBaptismWeddingsScreen,
    stewardship: ChurchStewardshipScreen,
    sacraments: ChurchSacramentsScreen,

    // Ministries
    'faith-formation': ChurchFaithFormationScreen,
    'bible-study': ChurchBibleStudyScreen,
    // 'youth-family': ChurchYouthFamilyScreen,
    groups: ChurchGroupsScreen,
    'pastoral-care': ChurchPastoralCareScreen,
    membership: ChurchMembershipScreen,

    // Give
    // 'why-give': ChurchWhyGiveScreen,
    // 'how-to-give': ChurchHowToGiveScreen,
    'about-giving': ChurchAboutGiving,
    pledges: ChurchPledgesScreen,
    receipts: ChurchReceiptsScreen,

    // Events
    'church-calendar': ChurchCalendarScreen,
    'special-services': ChurchSpecialServicesScreen,
    conferences: ChurchConferencesScreen,
    lectures: ChurchLecturesScreen,
    // 'past-events': ChurchPastEventsScreen,

    // Community
    'community-programs': ChurchCommunityProgramsScreen,
    outreach: ChurchOutreachScreen,
    'food-banks': ChurchFoodBanksScreen,
    'health-counseling': ChurchHealthCounselingScreen,
    volunteer: ChurchVolunteerScreen,

    // Resources
    devotionals: ChurchDevotionalsScreen,
    'study-guides': ChurchStudyGuidesScreen,
    forms: ChurchFormsScreen,

    // Contact
    'contact-clergy': ChurchContactOfficialsScreen,
    'general-enquiries': ChurchGeneralEnquiriesScreen,
    location: ChurchLocationScreen,
    accessibility: ChurchAccessibilityScreen,
  };

  const handleCall = () => {
    Linking.openURL(`tel:${church.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${church.email}`);
  };

  const handleWebsite = () => {
    Linking.openURL(`https://${church.website}`);
  };

  const handleMenuNavigation = (action: string) => {
    // DO NOT DELETE THIS COMMENTED CODE:
    // If the action should just switch to an existing tab:
    const actionToTab: Record<string, (typeof tabs)[number]> = {
      // About
      'who-we-are': 'Overview',
      'mission-vision': 'Overview',
      beliefs: 'Overview',
      history: 'Overview',
      structure: 'Overview',
      architecture: 'Overview',
      clergy: 'Clergy',
      staff: 'Clergy',
      'global-church-news': 'Events',
      careers: 'Overview',

      // Worship
      'worship-online': 'Services',
      sermons: 'Services',
      music: 'Services',
      'baptism-weddings': 'Services',
      stewardship: 'Services',
      sacraments: 'Services',
      newsletters: 'Services',

      // Ministries
      'faith-formation': 'Services',
      'bible-study': 'Services',
      // 'youth-family': 'Services',
      groups: 'Services',
      'pastoral-care': 'Services',
      membership: 'Services',

      // Give
      'about-giving': 'Give',
      // 'how-to-give': 'Give',
      // 'online-giving': 'Give',
      pledges: 'Give',
      receipts: 'Give',

      // Events
      'church-calendar': 'Events',
      'special-services': 'Events',
      conferences: 'Events',
      lectures: 'Events',
      // 'past-events': 'Events',

      // Community
      'community-programs': 'Overview',
      outreach: 'Overview',
      'food-banks': 'Overview',
      'health-counseling': 'Overview',
      volunteer: 'Overview',

      // Resources
      devotionals: 'Overview',
      'study-guides': 'Overview',
      forms: 'Overview',

      // Contact
      'contact-clergy': 'Contact',
      'general-enquiries': 'Contact',
      location: 'Contact',
      accessibility: 'Contact',
    };

    // Always set the pill first (if mapped)
    const nextTab = actionToTab[action];
    if (nextTab) setActiveTab(nextTab);

    // If we have a screen for this action, show it
    if (menuScreenRegistry[action]) {
      setActiveMenuAction(action);
      return;
    }

    // If no screen exists, fall back to normal tab content
    setActiveMenuAction(null);
    console.log('No screen wired for action:', action);
  };
  const handleBackNavigation = () => {
    if (from) {
      router.push(from as any);
    } else {
      router.back();
    }
  };

  return (
    <View className='flex-1 bg-gray-50'>
      <ChurchTopBar
        churchName={church.name}
        showLogo
        onNavigate={handleMenuNavigation}
      />
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className='relative' style={{ height: 256 }}>
          <Image
            source={{ uri: church.image }}
            style={{ width: '100%', height: '100%' }}
            contentFit='cover'
          />
          <View className='absolute inset-0 bg-black/40' />

          {/* Header Actions */}
          <View
            style={{ paddingTop: insets.top }}
            className='absolute top-0 left-0 right-0'
          >
            <View className='flex-row justify-between px-4 py-2'>
              <Pressable
                onPress={handleBackNavigation}
                className='w-10 h-10 bg-white/70 rounded-full items-center justify-center'
              >
                <ArrowLeft size={20} color='#111827' />
              </Pressable>
              <View className='flex-row gap-2'>
                <Pressable
                  onPress={() => setIsFollowing(!isFollowing)}
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    isFollowing ? 'bg-red-500' : 'bg-white/70'
                  }`}
                >
                  <Heart
                    size={15}
                    color={isFollowing ? '#ffffff' : '#111827'}
                    fill={isFollowing ? '#ffffff' : 'none'}
                  />
                </Pressable>
                <Pressable className='w-6 h-6 bg-white/70 rounded-full items-center justify-center'>
                  <Share2 size={15} color='#111827' />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Church Name */}
          <View className='absolute bottom-4 left-4 right-4'>
            <Text className='text-2xl font-bold text-white mb-2'>
              {church.name}
            </Text>
            <View className='flex-row items-center gap-2 '>
              <Badge className='bg-white/90'>
                <Text className='text-gray-900 text-xs font-medium'>
                  {church.denomination}
                </Text>
              </Badge>
              <View className='flex-row items-center gap-1'>
                <MapPin size={14} color='#ffffff' />
                <Text className='text-white text-sm'>{church.distance}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className='bg-white px-4 py-4 flex-row gap-2 border-b border-gray-100'>
          {church.hasLivestream && (
            <Button size='sm' className='flex-1'>
              <View className='flex-row items-center gap-1'>
                <Video size={16} color='#ffffff' />
                <Text className='text-white text-sm font-medium'>
                  Watch Live
                </Text>
              </View>
            </Button>
          )}
          <Button variant='outline' size='sm' className='flex-1'>
            <View className='flex-row items-center gap-1'>
              <Navigation size={16} color='#111827' />
              <Text className='text-gray-900 text-sm font-medium'>
                Directions
              </Text>
            </View>
          </Button>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='bg-white border-b border-gray-100'
        >
          <View className='flex-row px-4 py-3 gap-2'>
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => {
                  setActiveMenuAction(null);
                  setActiveTab(tab);
                }}
                className={`px-4 py-2 rounded-full ${
                  activeTab === tab ? 'bg-indigo-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeTab === tab ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Tab Content */}
        <View className='px-4 py-4'>
          {activeMenuAction && menuScreenRegistry[activeMenuAction] ? (
            (() => {
              const Screen = menuScreenRegistry[activeMenuAction];
              return (
                <Screen
                  church={church}
                  onBack={() => setActiveMenuAction(null)}
                />
              );
            })()
          ) : (
            <>
              {/* existing tab content below */}
              {activeTab === 'Overview' && (
                <View className='gap-4'>
                  <Card>
                    <CardContent>
                      <Text className='font-semibold text-gray-900 mb-2'>
                        About Us
                      </Text>
                      <Text className='text-sm text-gray-600 leading-5'>
                        {church.description}
                      </Text>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Text className='font-semibold text-gray-900 mb-2'>
                        Our Mission
                      </Text>
                      <Text className='text-sm text-gray-600 leading-5'>
                        {church.mission}
                      </Text>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Text className='font-semibold text-gray-900 mb-2'>
                        Our Vision
                      </Text>
                      <Text className='text-sm text-gray-600 leading-5'>
                        {church.vision}
                      </Text>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Text className='font-semibold text-gray-900 mb-3'>
                        Ministries
                      </Text>
                      <View className='flex-row flex-wrap gap-2'>
                        {church.ministries.map((ministry:string, index:number) => (
                          <Badge key={index} variant='secondary'>
                            <Text className='text-xs text-gray-700'>
                              {ministry}
                            </Text>
                          </Badge>
                        ))}
                      </View>
                    </CardContent>
                  </Card>
                </View>
              )}

              {activeTab === 'Services' && (
                <View className='gap-4'>
                  {church.serviceTimes.map((service:{
    day: string;
    time: string;
    type: string;
  }, index:number) => (
                    <Card key={index}>
                      <CardContent>
                        <View className='flex-row items-center gap-3'>
                          <View className='w-12 h-12 bg-indigo-100 rounded-full items-center justify-center'>
                            <Clock size={24} color='#4f46e5' />
                          </View>
                          <View className='flex-1'>
                            <Text className='font-semibold text-gray-900'>
                              {service.type}
                            </Text>
                            <Text className='text-sm text-gray-600'>
                              {service.day} at {service.time}
                            </Text>
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  ))}
                  <ChurchWorshipOnlineScreen church={church}/>

                  <Card>
                    <CardContent>
                      <Text className='font-semibold text-gray-900 mb-2'>
                        Parking Information
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        {church.parkingInfo}
                      </Text>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Text className='font-semibold text-gray-900 mb-2'>
                        Accessibility
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        {church.accessibilityInfo}
                      </Text>
                    </CardContent>
                  </Card>
                </View>
              )}

              {activeTab === 'Clergy' && (
                <View className='gap-4'>
                  {/* Pastor */}
                  <Card>
                    <CardContent>
                      <View className='flex-row items-start gap-4'>
                        <Avatar
                          src={church.pastor.photo}
                          alt={church.pastor.name}
                          size='xl'
                        />
                        <View className='flex-1'>
                          <Text className='font-semibold text-gray-900 text-lg'>
                            {church.pastor.name}
                          </Text>
                          <Text className='text-sm text-indigo-600 mb-2'>
                            {church.pastor.role}
                          </Text>
                          <Text className='text-sm text-gray-600 leading-5'>
                            {church.pastor.bio}
                          </Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>

                  {/* Other Clergy */}
                  {church.clergy.map((member:IChurchLeader, index:number) => (
                    <Card key={index}>
                      <CardContent>
                        <View className='flex-row items-center gap-4'>
                          <Avatar
                            src={member.photo}
                            alt={member.name}
                            size='lg'
                          />
                          <View className='flex-1'>
                            <Text className='font-semibold text-gray-900'>
                              {member.name}
                            </Text>
                            <Text className='text-sm text-gray-600'>
                              {member.role}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() =>
                              Linking.openURL(`mailto:${member.email}`)
                            }
                            className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'
                          >
                            <Mail size={18} color='#6b7280' />
                          </Pressable>
                        </View>
                      </CardContent>
                    </Card>
                  ))}
                </View>
              )}

              {activeTab === 'Events' && (
                <View className='gap-4'>
                  <Card>
                    <CardContent className='items-center py-8'>
                      <Calendar size={48} color='#9ca3af' />
                      <Text className='text-gray-500 mt-3'>
                        No upcoming events
                      </Text>
                    </CardContent>
                  </Card>
                </View>
              )}

              {activeTab === 'Give' && (
                <GiveFormScreen/>
              )}

              {activeTab === 'Contact' && (
                <View className='gap-4'>
                  <Card>
                    <Pressable onPress={handleCall}>
                      <CardContent>
                        <View className='flex-row items-center gap-4'>
                          <View className='w-12 h-12 bg-blue-100 rounded-full items-center justify-center'>
                            <Phone size={24} color='#2563eb' />
                          </View>
                          <View className='flex-1'>
                            <Text className='font-medium text-gray-900'>
                              Phone
                            </Text>
                            <Text className='text-sm text-gray-600'>
                              {church.phone}
                            </Text>
                          </View>
                          <ChevronRight size={20} color='#9ca3af' />
                        </View>
                      </CardContent>
                    </Pressable>
                  </Card>

                  <Card>
                    <Pressable onPress={handleEmail}>
                      <CardContent>
                        <View className='flex-row items-center gap-4'>
                          <View className='w-12 h-12 bg-purple-100 rounded-full items-center justify-center'>
                            <Mail size={24} color='#9333ea' />
                          </View>
                          <View className='flex-1'>
                            <Text className='font-medium text-gray-900'>
                              Email
                            </Text>
                            <Text className='text-sm text-gray-600'>
                              {church.email}
                            </Text>
                          </View>
                          <ChevronRight size={20} color='#9ca3af' />
                        </View>
                      </CardContent>
                    </Pressable>
                  </Card>

                  <Card>
                    <Pressable onPress={handleWebsite}>
                      <CardContent>
                        <View className='flex-row items-center gap-4'>
                          <View className='w-12 h-12 bg-green-100 rounded-full items-center justify-center'>
                            <Globe size={24} color='#16a34a' />
                          </View>
                          <View className='flex-1'>
                            <Text className='font-medium text-gray-900'>
                              Website
                            </Text>
                            <Text className='text-sm text-gray-600'>
                              {church.website}
                            </Text>
                          </View>
                          <ChevronRight size={20} color='#9ca3af' />
                        </View>
                      </CardContent>
                    </Pressable>
                  </Card>

                  <Card>
                    <CardContent>
                      <View className='flex-row items-start gap-4'>
                        <View className='w-12 h-12 bg-amber-100 rounded-full items-center justify-center'>
                          <MapPin size={24} color='#d97706' />
                        </View>
                        <View className='flex-1'>
                          <Text className='font-medium text-gray-900'>
                            Address
                          </Text>
                          <Text className='text-sm text-gray-600'>
                            {church.address}
                          </Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Text className='font-medium text-gray-900 mb-1'>
                        Office Hours
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        {church.officeHours}
                      </Text>
                    </CardContent>
                  </Card>
                </View>
              )}
            </>
          )}
        </View>

        {/* Bottom padding */}
        <View className='h-8' />
      </ScrollView>

      {/* <ChurchMenu
        churchName={church.name}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleMenuNavigation}
      /> */}
    </View>
  );
}
