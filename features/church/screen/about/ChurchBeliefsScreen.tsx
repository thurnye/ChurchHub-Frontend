import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react-native';

import { IChurch } from '@/data/mockData';
import { ChurchScreenTemplate } from '../../components/ChurchScreenTemplate';
import { Card, CardContent } from '@/shared/components/ui';
import { Accordion } from '../../components/Accordion';

interface ChurchBeliefsScreenProps {
  church: IChurch;
  onBack: () => void;
}

export function ChurchBeliefsScreen({ church }: ChurchBeliefsScreenProps) {
  const items = useMemo(
    () => [
      {
        key: 'bible',
        title: 'The Bible',
        content:
          'We believe the Bible is the inspired word of God and our final authority for faith and practice.',
      },
      {
        key: 'salvation',
        title: 'Salvation',
        content: 'We believe in salvation through faith in Jesus Christ alone.',
      },
      {
        key: 'trinity',
        title: 'The Trinity',
        content:
          'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.',
      },
      {
        key: 'church',
        title: 'The Church',
        content:
          'We believe the church is the body of Christ, called to worship, fellowship, and service.',
      },
    ],
    [],
  );

  return (
    <ChurchScreenTemplate
      church={church}
      title='Beliefs / Doctrine'
      icon={BookOpen}
    >
      <Card>
        <CardContent className='p-4'>
          <Accordion items={items} />
        </CardContent>
      </Card>
    </ChurchScreenTemplate>
  );
}
