import { View, Text, FlatList, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StoryItem } from './StoryItem';
import { Story } from '@/data/mockData';

interface StoriesRowProps {
  stories: Story[];
  height: number;
  topInset: number;
  onStoryPress: (index: number) => void;
}

export function StoriesRow({ stories, height, topInset, onStoryPress }: StoriesRowProps) {
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'transparent']}
      locations={[0, 0.5, 1]}
      style={{
        height: height + topInset,
        paddingTop: topInset,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Add Story Button */}
      <Pressable className="items-center mr-3 ml-4">
        <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center border-2 border-dashed border-white/50">
          <Plus size={24} color="#ffffff" />
        </View>
        <Text
          className="text-xs text-white mt-1.5 w-16 text-center"
          numberOfLines={1}
        >
          Add Story
        </Text>
      </Pressable>

      {/* Stories List */}
      <FlatList
        horizontal
        data={stories}
        renderItem={({ item, index }) => (
          <StoryItem item={item} onPress={() => onStoryPress(index)} />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16, paddingVertical: 12 }}
      />
    </LinearGradient>
  );
}
