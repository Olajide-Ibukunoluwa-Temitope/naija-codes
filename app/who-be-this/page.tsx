import type { Metadata } from 'next';
import WhoBeThis from '../../components/whobethis/WhoBeThis';
import './who-be-this.css';

export const metadata: Metadata = {
  title: 'Who Be This',
  description: 'A guessing game for games night. Hold the phone to your forehead and let your friends give the clues.',
};

export default function Page() {
  return <WhoBeThis />;
}
