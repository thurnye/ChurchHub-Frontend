import { Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Story } from '@/data/mockData';


interface StoryItemProps {
  item: Story;
  onPress: () => void;
}

export function StoryItem({ item, onPress }: StoryItemProps) {
  return (
    <Pressable className="items-center mr-3" onPress={onPress}>
      <View
        className={`w-16 h-16 rounded-full p-0.5 ${
          item.hasNew
            ? 'bg-gradient-to-r from-purple-600 to-pink-600'
            : 'bg-gray-300'
        }`}
      >
        <View className="w-full h-full rounded-full border-2 border-white overflow-hidden">
          <Image
            source={{ uri: item.avatar }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      </View>
      <Text
        className="text-xs text-white mt-1.5 w-16 text-center font-medium"
        numberOfLines={1}
      >
        {item.churchName.split(' ')[0]}
      </Text>
    </Pressable>
  );
}
