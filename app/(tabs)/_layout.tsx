import { Tabs } from 'expo-router';
import { Home, Church, Radio, Users, User, Book, BookPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const isHomeScreen = route.name === 'index';

        return {
          tabBarActiveTintColor: isHomeScreen ? '#ffffff' : '#4f46e5',
          tabBarInactiveTintColor: isHomeScreen
            ? 'rgba(255, 255, 255, 0.6)'
            : '#6b7280',
          tabBarStyle: {
            backgroundColor: isHomeScreen ? 'transparent' : '#ffffff',
            borderTopColor: isHomeScreen ? 'transparent' : '#f3f4f6',
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
            position: isHomeScreen ? 'absolute' : 'relative',
            elevation: isHomeScreen ? 0 : undefined,
          },
          tabBarBackground: isHomeScreen
            ? () => (
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
                  locations={[0, 0.5, 1]}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />
              )
            : undefined,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
          headerShown: false,
        };
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='discover'
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Church color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='worship'
        options={{
          title: 'Worship',
          tabBarIcon: ({ color, size }) => <Radio color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='community'
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='bible'
        options={{
          title: 'Bible',
          tabBarIcon: ({ color, size }) => <BookPlus color={color} size={size} />,
        }}
      />

      {/* Hidden screens - still in tabs for tab bar visibility but not shown as tabs */}
      <Tabs.Screen
        name='church/[id]'
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name='denomination/[id]'
        options={{
          href: null,
        }}
      />

      {/* Church */}
      <Tabs.Screen
        name='church/group-detail'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='church/conference/[conferenceId]'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='church/devotion/[devotionalId]'
        options={{
          href: null,
        }}
      />

      {/* Community */}
      <Tabs.Screen
        name='community/[id]'
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name='community/volunteer/[volunteerId]'
        options={{
          href: null, // Hide from tab bar
        }}
      />

      {/* Events */}
      <Tabs.Screen
        name='events/global-events'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='events/[eventId]'
        options={{
          href: null,
        }}
      />

      {/* Give/Donations */}
      <Tabs.Screen
        name='give/give-quick-link'
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name='give/give-quick-link-donation'
        options={{
          href: null, // Hide from tab bar
        }}
      />

      {/* Media-Player */}
      <Tabs.Screen
        name='media-player/[id]'
        options={{
          href: null, // Hide from tab bar
        }}
      />

      {/* Prayer */}
      <Tabs.Screen
        name='prayer/request-prayer'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='prayer/prayer-list'
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name='prayer/prayer-details'
        options={{
          href: null,
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name='profile/my-profile'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile/my-donations'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile/my-events'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile/my-churches'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile/my-prayer-list'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile/[id]'
        options={{
          href: null,
        }}
      />

      {/* Sermons */}
      <Tabs.Screen
        name='sermons/global-sermons'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='sermons/[sermonId]'
        options={{
          href: null,
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name='settings/suggest-church'
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name='settings/preferences'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='settings/help'
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name='settings/terms'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='settings/report'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='settings/language'
        options={{
          href: null,
        }}
      />

      {/* Worship */}

      {/* Bible */}
      <Tabs.Screen
        name='bible/reader'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/search'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/plans'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/plan-detail'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/notes'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/highlights'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/bookmarks'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='bible/audio'
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
