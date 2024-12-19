import { socialLinks } from '@/lib/content/portfolio';
import { SocialSectionType } from '@/lib/types/sections';

export const socialSection: SocialSectionType = {
  socialLinks: [
    {
      icon: 'mdi:instagram',
      url: socialLinks.instagram,
    },
    {
      icon: 'tabler:brand-x',
      url: socialLinks.twitter,
    },
    {
      icon: 'tabler:brand-telegram',
      url: socialLinks.telegram,
    },
    {
      icon: 'tabler:brand-github',
      url: socialLinks.github,
    },
  ],
};
