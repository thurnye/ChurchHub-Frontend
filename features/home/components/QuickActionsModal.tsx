import { Modal, View, Text, Pressable } from 'react-native';
import { Bookmark, Share2, Heart } from 'lucide-react-native';
import { FeedItem } from '@/data/mockData';


interface QuickActionsModalProps {
  visible: boolean;
  item: FeedItem | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
}

export function QuickActionsModal({
  visible,
  item,
  isSaved,
  onClose,
  onToggleSave,
}: QuickActionsModalProps) {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/70 justify-end"
        onPress={onClose}
      >
        <View className="bg-white rounded-t-3xl p-6">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

          <Pressable
            className="flex-row items-center py-4 border-b border-gray-100"
            onPress={() => {
              onToggleSave();
              onClose();
            }}
          >
            <Bookmark size={24} color="#111827" />
            <Text className="text-gray-900 text-base font-medium ml-4">
              {isSaved ? 'Unsave' : 'Save'}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center py-4 border-b border-gray-100">
            <Share2 size={24} color="#111827" />
            <Text className="text-gray-900 text-base font-medium ml-4">
              Share
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center py-4">
            <Heart size={24} color="#111827" />
            <Text className="text-gray-900 text-base font-medium ml-4">
              Follow {item.postOwner}
            </Text>
          </Pressable>

          <Pressable
            className="mt-4 bg-gray-100 rounded-full py-3"
            onPress={onClose}
          >
            <Text className="text-gray-900 text-center font-semibold">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
