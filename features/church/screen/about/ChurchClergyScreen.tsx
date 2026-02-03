import React, { useMemo } from 'react';
import { View, Text, Image, Pressable, Linking } from 'react-native';
import { Users, Mail, Phone } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';

interface ChurchClergyScreenProps {
  church: IChurch;
}

function prettyTitle(key: string) {
  // pastors -> Pastors, churchWardens -> Church Wardens, council_members -> Council Members
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (m) => m.toUpperCase());
}

function ContactRow({ email, phone }: { email: string; phone: string }) {
  return (
    <View className="flex-row items-center gap-3 mt-3 flex-wrap">
      <Pressable
        onPress={() => Linking.openURL(`mailto:${email}`)}
        className="flex-row items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100"
      >
        <Mail size={16} color="#111827" />
        <Text className="text-xs font-medium text-gray-800">{email}</Text>
      </Pressable>

      <Pressable
        onPress={() => Linking.openURL(`tel:${phone}`)}
        className="flex-row items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100"
      >
        <Phone size={16} color="#111827" />
        <Text className="text-xs font-medium text-gray-800">{phone}</Text>
      </Pressable>
    </View>
  );
}

function LeaderCard({ leader }: { leader: IChurch['pastor'] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <View className="flex-row items-start gap-3">
          <Image
            source={{ uri: leader.photo }}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />

          <View className="flex-1">
            <Text className="font-semibold text-gray-900">{leader.name}</Text>
            <Text className="text-sm text-gray-600">{leader.role}</Text>

            {!!leader.bio && (
              <Text className="text-sm text-gray-600 leading-5 mt-2">
                {leader.bio}
              </Text>
            )}

            <ContactRow email={leader.email} phone={leader.phone} />
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

export function ChurchClergyScreen({ church }: ChurchClergyScreenProps) {
  // ✅ Build dynamic sections from leadership keys
  // ✅ Deduplicate leaders across sections (optional but recommended)
  const sections = useMemo(() => {
    const seen = new Set<string>();

    return Object.entries(church.leadership || {})
      .map(([key, leaders]) => {
        const arr = Array.isArray(leaders) ? leaders : [];
        const filtered = arr.filter((l) => {
          if (!l?.id) return false;
          if (seen.has(l.id)) return false; // remove duplicates across groups
          seen.add(l.id);
          return true;
        });

        return {
          key,
          title: prettyTitle(key),
          leaders: filtered,
        };
      })
      .filter((s) => s.leaders.length > 0);
  }, [church.leadership]);

  return (
    <ChurchScreenTemplate church={church} title="Clergy & Leadership" icon={Users}>
      <View className="gap-3">
        {sections.map((section) => (
          <View key={section.key} className="gap-2">
            {/* Dynamic section title from leadership key */}
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">
              {section.title}
            </Text>

            {section.leaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </View>
        ))}
      </View>
    </ChurchScreenTemplate>
  );
}
