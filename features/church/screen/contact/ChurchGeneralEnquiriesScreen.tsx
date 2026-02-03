import React, { useState } from 'react';
import { View, Text, TextInput, Linking } from 'react-native';
import { Phone, Mail as MailIcon } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent, Button } from '@/shared/components/ui';

interface ChurchGeneralEnquiriesScreenProps {
  church: IChurch;
}

const openPhone = (phone: string) => Linking.openURL(`tel:${phone}`);
const openEmail = (email: string) => Linking.openURL(`mailto:${email}`);

export function ChurchGeneralEnquiriesScreen({
  church,
}: ChurchGeneralEnquiriesScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <ChurchScreenTemplate
      church={church}
      title='General Enquiries'
      icon={Phone}
    >
      <Card>
        <CardContent className='p-4'>
          <View className='mb-5'>
            <Text className='font-semibold text-gray-900 mb-2'>Contact Us</Text>

            <View className='gap-3'>
              <View className='flex-row items-center gap-2'>
                <Phone size={16} color='#9ca3af' />
                <Text
                  className='text-indigo-600'
                  onPress={() => openPhone(church.phone)}
                >
                  {church.phone}
                </Text>
              </View>

              <View className='flex-row items-center gap-2'>
                <MailIcon size={16} color='#9ca3af' />
                <Text
                  className='text-indigo-600'
                  onPress={() => openEmail(church.email)}
                >
                  {church.email}
                </Text>
              </View>
            </View>
          </View>

          <View className='mb-5'>
            <Text className='font-semibold text-gray-900 mb-2'>
              Office Hours
            </Text>
            <Text className='text-sm text-gray-600'>{church.officeHours}</Text>
          </View>

          <View>
            <Text className='font-semibold text-gray-900 mb-3'>
              Send a Message
            </Text>

            <View className='gap-3'>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder='Your Name'
                placeholderTextColor='#9ca3af'
                className='w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white'
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='Your Email'
                placeholderTextColor='#9ca3af'
                autoCapitalize='none'
                keyboardType='email-address'
                className='w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white'
              />

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder='Your Message'
                placeholderTextColor='#9ca3af'
                multiline
                textAlignVertical='top'
                className='w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white min-h-[120px]'
              />

              <Button
                className='w-full'
                onPress={() => {
                  const subject = encodeURIComponent(
                    `General Enquiry - ${church.name}`,
                  );
                  const body = encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                  );
                  Linking.openURL(
                    `mailto:${church.email}?subject=${subject}&body=${body}`,
                  );
                }}
              >
                <Text className='text-white font-medium'>Send Message</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
