import type { Metadata } from 'next';
import Forehead from '../../../components/whobethis/Forehead';
import '../who-be-this.css';

export const metadata: Metadata = {
  title: 'Who Am I',
  description: 'Everyone plays at once. A different famous name on every forehead. Ask yes or no questions to guess yours.',
};

export default function Page() {
  return <Forehead />;
}
