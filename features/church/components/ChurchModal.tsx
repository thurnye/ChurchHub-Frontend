import React, { ReactNode } from 'react';
import { View, Pressable, Modal, Dimensions } from 'react-native';
import { Share2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_H } = Dimensions.get('window');

interface ChurchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

export function ChurchModal({ open, setOpen, children }: ChurchModalProps) {
  const insets = useSafeAreaInsets();

  const onShare = () => {
    // don’t close automatically unless you want to
    // setOpen(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      {/* Backdrop */}
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
        onPress={() => setOpen(false)}
      />

      {/* Sheet */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: SCREEN_H * 0.9, // ✅ gives ScrollView room to scroll
          backgroundColor: '#111827',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 16,
          paddingBottom: 16 + insets.bottom,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Pressable
            onPress={() => setOpen(false)}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={10}
          >
            <X size={20} color="#d1d5db" />
          </Pressable>

          <Pressable
            onPress={onShare}
            style={{ padding: 12, borderRadius: 16 }}
            hitSlop={10}
          >
            <Share2 size={18} color="#fff" />
          </Pressable>
        </View>

        {/* Content area MUST be flex:1 so it can scroll inside the sheet */}
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>
    </Modal>
  );
}
