import { NavbarSectionType } from '@/lib/types/sections';
import { resumeFileName } from '@/lib/utils/config';

export const navbarSection: NavbarSectionType = {
  navLinks: [
    { name: 'about', url: '/#about' },
    { name: 'roadmap', url: '/#roadmap' },
    { name: 'how to buy', url: '/#htb' },
    { name: 'staking', url: '/#staking' },
    { name: 'whitepaper', url: 'https://camell-cloud.gitbook.io/camell-project' },
  ],
  cta: {
    title: 'Connect Wallet',
    url: `https://camt.cloud`,
  },
};
