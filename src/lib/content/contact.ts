import { author } from '@/lib/content/portfolio';
import { ContactSectionType } from '@/lib/types/sections';

export const contactSection: ContactSectionType = {
  title: 'get in touch',
  subtitle: "what's next",
  paragraphs: [
    'As of right now this website is under develop',
    'Contact us for more information and feel free to ask us anything!',
  ],
  link: `mailto:${author.email}`,
};
