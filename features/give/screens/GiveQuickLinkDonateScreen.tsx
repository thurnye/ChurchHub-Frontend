// GiveQuickLinkDonateScreen.tsx (React Native + NativeWind)
// ✅ No Button/Input/Label/RadioGroup/Select/Badge components
// ✅ Uses Pressable + TextInput + simple chips + RN picker-like modal-free selects

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  DollarSign,
  CreditCard,
  Landmark,
  Calendar,
  Info,
  Check,
  ChevronDown,
} from 'lucide-react-native';
import { HiddenScreensTopBar } from '@/shared/components/HiddenScreensTopBar';
import { useLocalSearchParams } from 'expo-router';

interface GiveQuickLinkDonateScreenProps {}

type Frequency = 'once' | 'weekly' | 'monthly';
type PaymentMethod = 'card' | 'bank';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className='text-base font-semibold text-gray-900 mb-2'>
      {children}
    </Text>
  );
}

function Helper({ children }: { children: React.ReactNode }) {
  return <Text className='text-xs text-gray-500'>{children}</Text>;
}

function Chip({ label }: { label: string }) {
  return (
    <View className='self-start px-3 py-1 rounded-full bg-gray-100 border border-gray-200'>
      <Text className='text-xs font-semibold text-gray-700'>{label}</Text>
    </View>
  );
}

function PrimaryBtn({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={[
        'h-12 rounded-xl items-center justify-center',
        disabled ? 'bg-indigo-300' : 'bg-indigo-600',
      ].join(' ')}
    >
      <Text className='text-white font-semibold text-base'>{label}</Text>
    </Pressable>
  );
}

function OutlineBtn({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='h-12 rounded-xl border border-gray-300 bg-white items-center justify-center'
    >
      <Text className='text-gray-900 font-semibold text-base'>{label}</Text>
    </Pressable>
  );
}

function IconBtn({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='h-10 w-10 rounded-xl bg-white items-center justify-center border border-gray-200'
    >
      {children}
    </Pressable>
  );
}

function RadioRow({
  selected,
  title,
  subtitle,
  rightTag,
  onPress,
  leftIcon,
}: {
  selected: boolean;
  title: string;
  subtitle?: string;
  rightTag?: string;
  onPress: () => void;
  leftIcon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'p-3 rounded-xl border-2',
        selected
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-gray-200 bg-white',
      ].join(' ')}
    >
      <View className='flex-row items-center gap-3'>
        <View
          className={[
            'h-5 w-5 rounded-full border-2 items-center justify-center',
            selected ? 'border-indigo-600' : 'border-gray-300',
          ].join(' ')}
        >
          {selected ? (
            <View className='h-2.5 w-2.5 rounded-full bg-indigo-600' />
          ) : null}
        </View>

        <View className='flex-1'>
          <View className='flex-row items-center gap-2'>
            {leftIcon}
            <Text className='font-semibold text-gray-900'>{title}</Text>
          </View>
          {subtitle ? (
            <Text className='text-xs text-gray-500 mt-0.5'>{subtitle}</Text>
          ) : null}
        </View>

        {rightTag ? (
          <View className='px-2 py-1 rounded-full bg-gray-100 border border-gray-200'>
            <Text className='text-xs font-semibold text-gray-700'>
              {rightTag}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function SelectRow({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View className='mb-6'>
      <Text className='text-sm font-semibold text-gray-900 mb-2'>{label}</Text>
      <Pressable
        onPress={onPress}
        className='h-12 rounded-xl bg-white border border-gray-300 px-3 flex-row items-center justify-between'
      >
        <Text className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color='#6b7280' />
      </Pressable>
    </View>
  );
}

function SelectModal({
  visible,
  title,
  options,
  selected,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  options: { value: string; label: string }[];
  selected?: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/40 justify-end'>
        <View className='bg-white rounded-t-3xl p-4 max-h-[70%]'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-lg font-semibold text-gray-900'>{title}</Text>
            <Pressable onPress={onClose} className='px-3 py-2'>
              <Text className='text-indigo-600 font-semibold'>Done</Text>
            </Pressable>
          </View>

          <ScrollView className='max-h-[60%]'>
            <View className='gap-2 pb-6'>
              {options.map((opt) => {
                const isSelected = opt.value === selected;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => onSelect(opt.value)}
                    className={[
                      'p-3 rounded-xl border',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 bg-white',
                    ].join(' ')}
                  >
                    <View className='flex-row items-center justify-between'>
                      <Text className='text-gray-900 font-medium'>
                        {opt.label}
                      </Text>
                      {isSelected ? <Check size={18} color='#4f46e5' /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function GiveQuickLinkDonateScreen({}: GiveQuickLinkDonateScreenProps) {
  const { targetType, title, from } = useLocalSearchParams<{
    title: string;
    from: string;
    targetType: string;
  }>();
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [frequency, setFrequency] = useState<Frequency>('once');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const [selectedChurch, setSelectedChurch] = useState<string>('grace');
  const [selectedEvent, setSelectedEvent] = useState<string>('conference');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');

  const [showChurchModal, setShowChurchModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPurposeModal, setShowPurposeModal] = useState(false);

  const presetAmounts = useMemo(() => ['25', '50', '100', '250', '500'], []);

  const targetTitle = useMemo(() => {
    switch (targetType) {
      case 'church':
        return 'Church Tithe & Offering';
      case 'event':
        return 'Event Contribution';
      case 'program':
        return 'Community Program';
      case 'group':
        return 'Group Contribution';
      default:
        return 'Special Giving';
    }
  }, [targetType]);

  const churchOptions = useMemo(
    () => [
      { value: 'grace', label: 'Grace Community Church' },
      { value: 'stmarys', label: "St. Mary's Anglican Church" },
      { value: 'sacred', label: 'Sacred Heart Catholic Church' },
    ],
    [],
  );

  const eventOptions = useMemo(
    () => [
      { value: 'conference', label: 'Spring Faith Conference 2026' },
      { value: 'retreat', label: 'Youth Summer Retreat' },
    ],
    [],
  );

  const purposeOptions = useMemo(() => {
    if (targetType === 'church') {
      return [
        { value: 'tithe', label: 'Tithe' },
        { value: 'offering', label: 'General Offering' },
        { value: 'building', label: 'Building Fund' },
        { value: 'missions', label: 'Missions' },
      ];
    }
    return [
      { value: 'missions', label: 'Missions' },
      { value: 'building', label: 'Building Fund' },
      { value: 'special', label: 'Special Offering' },
    ];
  }, [targetType]);

  const selectedAmount = customAmount || amount;
  const canSubmit = Boolean(selectedAmount);

  const handleSubmit = () => {
    if (!selectedAmount) {
      Alert.alert('Amount required', 'Please enter an amount to donate.');
      return;
    }
    // TODO: integrate payment provider (Stripe / Paystack / Flutterwave etc.)
    // onComplete?.();
  };

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <HiddenScreensTopBar
        show={true}
        title={`Give / Donations`}
        navigateTo={from}
      />
      <View className='bg-white border-b border-gray-200 px-4 py-3'>
        <View className='flex-row items-center gap-3'>
          {/* <IconBtn onPress={onBack}>
            <ArrowLeft size={20} color="#111827" />
          </IconBtn> */}

          <View className='flex-1'>
            <Text className='font-semibold text-lg text-gray-900'>
              Make a Donation to {title}
            </Text>
            <Text className='text-xs text-gray-500 mt-0.5'>{targetTitle}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerClassName='pb-28'>
        <View className='p-4'>
          {/* Target selection */}
          {targetType === 'church' ? (
            <SelectRow
              label='Select Church'
              value={
                churchOptions.find((x) => x.value === selectedChurch)?.label
              }
              placeholder='Choose a church'
              onPress={() => setShowChurchModal(true)}
            />
          ) : null}

          {targetType === 'event' ? (
            <SelectRow
              label='Select Event'
              value={eventOptions.find((x) => x.value === selectedEvent)?.label}
              placeholder='Choose an event'
              onPress={() => setShowEventModal(true)}
            />
          ) : null}

          {/* Purpose */}
          <SelectRow
            label='Purpose (Optional)'
            value={
              purposeOptions.find((x) => x.value === selectedPurpose)?.label
            }
            placeholder='Select purpose'
            onPress={() => setShowPurposeModal(true)}
          />

          {/* Amount */}
          <View className='mb-6'>
            <Text className='text-sm font-semibold text-gray-900 mb-3'>
              Donation Amount
            </Text>

            <View className='flex-row flex-wrap gap-2'>
              {presetAmounts.map((preset) => {
                const selected = amount === preset && !customAmount;
                return (
                  <Pressable
                    key={preset}
                    onPress={() => {
                      setAmount(preset);
                      setCustomAmount('');
                    }}
                    className={[
                      'flex-1 min-w-[30%] p-3 rounded-xl border-2 items-center',
                      selected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 bg-white',
                    ].join(' ')}
                  >
                    <Text className='text-base font-semibold text-gray-900'>
                      ${preset}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className='mt-3'>
              <Text className='text-xs font-semibold text-gray-700 mb-2'>
                Custom amount
              </Text>
              <View className='flex-row items-center bg-white border border-gray-300 rounded-xl px-3'>
                <DollarSign size={18} color='#9ca3af' />
                <TextInput
                  value={customAmount}
                  onChangeText={(v) => {
                    setCustomAmount(v.replace(/[^\d.]/g, ''));
                    setAmount('');
                  }}
                  placeholder='0.00'
                  placeholderTextColor='#9ca3af'
                  keyboardType='numeric'
                  className='flex-1 py-3 px-2 text-gray-900'
                />
              </View>
              <Helper>Tip: choose a preset or type a custom amount.</Helper>
            </View>

            <View className='mt-3'>
              <Text className='text-xs font-semibold text-gray-700 mb-2'>
                Narrative / Message
              </Text>
              <View className='flex-row items-center bg-white border border-gray-300 rounded-xl px-3'>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder='Add a message (optional)'
                  placeholderTextColor='#9ca3af'
                  multiline
                  numberOfLines={6}
                  className='flex-1 py-3 px-2 text-gray-900 h-40'
                />
              </View>
            </View>
          </View>

          {/* Frequency */}
          <View className='mb-6'>
            <SectionTitle>Frequency</SectionTitle>
            <View className='gap-2'>
              <RadioRow
                selected={frequency === 'once'}
                title='One-time'
                subtitle='Give once'
                onPress={() => setFrequency('once')}
              />
              <RadioRow
                selected={frequency === 'weekly'}
                title='Weekly'
                subtitle='Every week on Sunday'
                rightTag='Recurring'
                onPress={() => setFrequency('weekly')}
              />
              <RadioRow
                selected={frequency === 'monthly'}
                title='Monthly'
                subtitle='1st of every month'
                rightTag='Recurring'
                onPress={() => setFrequency('monthly')}
              />
            </View>
          </View>

          {/* Payment Method */}
          <View className='mb-6'>
            <SectionTitle>Payment Method</SectionTitle>
            <View className='gap-2'>
              <RadioRow
                selected={paymentMethod === 'card'}
                title='Credit / Debit Card'
                onPress={() => setPaymentMethod('card')}
                leftIcon={<CreditCard size={16} color='#4b5563' />}
              />
              <RadioRow
                selected={paymentMethod === 'bank'}
                title='Bank Transfer'
                onPress={() => setPaymentMethod('bank')}
                leftIcon={<Landmark size={16} color='#4b5563' />}
              />
            </View>
          </View>

          {/* Payment Details */}
          {paymentMethod === 'card' ? (
            <View className='mb-6 gap-4'>
              <View>
                <Text className='text-sm font-semibold text-gray-900 mb-2'>
                  Card Number
                </Text>
                <TextInput
                  placeholder='1234 5678 9012 3456'
                  placeholderTextColor='#9ca3af'
                  keyboardType='number-pad'
                  maxLength={19}
                  className='h-12 px-3 rounded-xl bg-white border border-gray-300 text-gray-900'
                />
              </View>

              <View className='flex-row gap-3'>
                <View className='flex-1'>
                  <Text className='text-sm font-semibold text-gray-900 mb-2'>
                    Expiry Date
                  </Text>
                  <TextInput
                    placeholder='MM/YY'
                    placeholderTextColor='#9ca3af'
                    keyboardType='number-pad'
                    maxLength={5}
                    className='h-12 px-3 rounded-xl bg-white border border-gray-300 text-gray-900'
                  />
                </View>

                <View className='flex-1'>
                  <Text className='text-sm font-semibold text-gray-900 mb-2'>
                    CVV
                  </Text>
                  <TextInput
                    placeholder='123'
                    placeholderTextColor='#9ca3af'
                    keyboardType='number-pad'
                    maxLength={4}
                    secureTextEntry
                    className='h-12 px-3 rounded-xl bg-white border border-gray-300 text-gray-900'
                  />
                </View>
              </View>

              <View>
                <Text className='text-sm font-semibold text-gray-900 mb-2'>
                  Name on Card
                </Text>
                <TextInput
                  placeholder='John Doe'
                  placeholderTextColor='#9ca3af'
                  className='h-12 px-3 rounded-xl bg-white border border-gray-300 text-gray-900'
                />
              </View>
            </View>
          ) : (
            <View className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
              <Text className='font-semibold text-gray-900 mb-1'>
                Bank Transfer
              </Text>
              <Text className='text-sm text-gray-600'>
                You’ll see bank details after you tap “Complete Donation”.
              </Text>
            </View>
          )}

          {/* Receipt Notice */}
          <View className='mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100'>
            <View className='flex-row gap-3'>
              <Info size={20} color='#4f46e5' />
              <View className='flex-1'>
                <Text className='font-semibold text-indigo-900'>
                  Tax Receipt
                </Text>
                <Text className='text-sm text-indigo-800 mt-1'>
                  You will receive an email receipt for your donation. Tax
                  receipts are generated automatically at year-end.
                </Text>
              </View>
            </View>
          </View>

          {/* Summary */}
          <View className='p-4 bg-white rounded-xl border border-gray-200'>
            <Text className='font-semibold text-gray-900 mb-3'>
              Donation Summary
            </Text>

            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm text-gray-600'>Amount:</Text>
              <Text className='text-sm font-semibold text-gray-900'>
                ${selectedAmount || '0.00'}
              </Text>
            </View>

            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm text-gray-600'>Frequency:</Text>
              <Text className='text-sm font-semibold text-gray-900'>
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </Text>
            </View>

            <View className='border-t border-gray-200 pt-3 flex-row justify-between'>
              <Text className='text-sm font-semibold text-gray-900'>
                Total:
              </Text>
              <Text className='text-lg font-bold text-gray-900'>
                ${selectedAmount || '0.00'}
              </Text>
            </View>

            <View className='mt-3'>
              <Chip
                label={paymentMethod === 'card' ? 'Card' : 'Bank Transfer'}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <PrimaryBtn
          label='Complete Donation'
          onPress={handleSubmit}
          disabled={!canSubmit}
        />
      </View>

      {/* Modals */}
      <SelectModal
        visible={showChurchModal}
        title='Select Church'
        options={churchOptions}
        selected={selectedChurch}
        onClose={() => setShowChurchModal(false)}
        onSelect={(v) => setSelectedChurch(v)}
      />

      <SelectModal
        visible={showEventModal}
        title='Select Event'
        options={eventOptions}
        selected={selectedEvent}
        onClose={() => setShowEventModal(false)}
        onSelect={(v) => setSelectedEvent(v)}
      />

      <SelectModal
        visible={showPurposeModal}
        title='Purpose (Optional)'
        options={[{ value: '', label: 'None' }, ...purposeOptions]}
        selected={selectedPurpose}
        onClose={() => setShowPurposeModal(false)}
        onSelect={(v) => setSelectedPurpose(v)}
      />
    </View>
  );
}
