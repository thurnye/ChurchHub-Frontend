
import { GlobalSermonsScreen } from '@/features/sermons/screens/GlobalSermonsScreen';
import { useRouter } from 'expo-router';

export default function GlobalSermonsRoute() {
  const router = useRouter();

  return <GlobalSermonsScreen />;
}
