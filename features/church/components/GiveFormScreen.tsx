import { Card, CardContent } from '@/shared/components';
import { DollarSign } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, } from 'react-native';

export default function GiveFormScreen() {
      const [donations, setDonations] = useState({
        amount: 50,
        type: '',
      });
    

  return (
    <View className='gap-4'>
      <Card>
        <CardContent>
          <View className='items-center py-4'>
            <View className='w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4'>
              <DollarSign size={32} color='#16a34a' />
            </View>
            <Text className='font-semibold text-gray-900 text-lg mb-2'>
              Support Our Ministry
            </Text>
            <Text className='text-sm text-gray-600 text-center mb-4'>
              Your generous giving helps us continue serving our community,
              supporting missions, and spreading the gospel. Every contribution
              makes a lasting impact.
            </Text>
          </View>
        </CardContent>
      </Card>
      <View className='gap-4'>
        <Card>
          <CardContent>
            <Text className='text-sm font-medium text-gray-900 mb-3'>
              Select Donation Type
            </Text>

            <View className='flex-row flex-wrap mb-4 -mx-1'>
              {[
                'Tithe',
                'Offering',
                'Missions',
                'Building Fund',
                'Stewardship',
                'Pledge',
              ].map((type) => {
                const active = donations.type === type;
                return (
                  <View key={type} className='w-1/2 px-1 mb-2'>
                    <Pressable
                      onPress={() => setDonations({ ...donations, type: type })}
                      className={`flex-1 py-2 rounded-lg border-2 items-center ${
                        active
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <Text className='text-sm text-gray-900 font-medium'>
                        {type}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className='text-sm font-medium text-gray-900 mb-3'>
              Amount
            </Text>

            <View className='flex-row gap-2 mb-3'>
              {[25, 50, 100, 250].map((amt) => {
                const active = donations.amount === amt;
                return (
                  <Pressable
                    key={amt}
                    onPress={() => setDonations({ ...donations, amount: amt })}
                    className={`flex-1 py-2 rounded-lg border-2 items-center ${
                      active
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <Text
                      className={`font-medium ${active ? 'text-indigo-600' : 'text-gray-900'}`}
                    >
                      ${amt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* NOTE: Use your existing Input component if you have one.
                      If not, swap this with TextInput and NativeWind className. */}
            <View className='border border-gray-200 rounded-lg px-3 py-2'>
              <TextInput
                value={`$${String(donations.amount)}`}
                onChangeText={(text) => {
                  const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                  setDonations({
                    ...donations,
                    amount: isNaN(num) ? 0 : num,
                  });
                }}
                keyboardType='numeric'
                className='text-sm text-gray-900'
                placeholder='Custom Amount'
              />
            </View>
          </CardContent>
        </Card>

        <Pressable
          onPress={() => {
            // handle donation submit
          }}
          className='w-full h-12 bg-black rounded-xl items-center justify-center active:opacity-80'
        >
          <View className='flex-row items-center justify-center gap-2'>
            <DollarSign size={18} color='#ffffff' />
            <Text className='text-white font-semibold'>
              Give ${donations.amount}
            </Text>
          </View>
        </Pressable>

        <Pressable className='items-center'>
          <Text className='text-sm text-indigo-600'>
            View Donation Receipt History
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
