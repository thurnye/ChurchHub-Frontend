
import { GlobalEventsScreen } from '@/features/events/screens/GlobalEventsScreen';
import { useRouter } from 'expo-router';

export default function GlobalEventsRoute() {
  const router = useRouter();

  return <GlobalEventsScreen />;
}
