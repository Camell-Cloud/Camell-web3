import { HeroSectionType } from '@/lib/types/sections';
import { resumeFileName } from '@/lib/utils/config';

export const heroSection: HeroSectionType = {
  subtitle: '',
  title: 'CAMT',
  tagline: 'Join us in this innovative ',
  description:
    "The Camell project is an initiative that combines cloud storage services with a blockchain token economy to create a new business model.",
  specialText: 'Currently Under Developing',
  cta: {
    title: 'see my resume',
    url: `/${resumeFileName}`,
    hideInDesktop: true,
  },
};
