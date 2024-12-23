'use client';
import { heroSection } from '@/lib/content/hero';
import useWindowWidth from '@/lib/hooks/use-window-width';
import { getBreakpointsWidth } from '@/lib/utils/helper';

import { Wrapper } from '@/components';
import HeroLeftSection from './HeroLeft';
import HeroRightSection from './HeroRight';

const Hero = () => {
  const { cta, subtitle, title, tagline, description, specialText } = heroSection;

  const windowWidth = useWindowWidth();
  const md = getBreakpointsWidth('md');
  const DEFAULT_ANIMATION_DELAY = windowWidth <= md ? 0.9 : 1.7;

  const getAnimationDelay = (i: number, increment = 0.15) =>
    DEFAULT_ANIMATION_DELAY + increment * i;

  return (
    <Wrapper
      id="hero"
      className="flex flex-col md:flex-row justify-between items-center h-full min-h-screen gap-6 mt-12 xs:gap-7 xs:mt-0"
    >
      <HeroLeftSection
        title={title}
        tagline={tagline}
        description={description}
        specialText={specialText}
        cta={cta}
        getAnimationDelay={getAnimationDelay}
      />
      <HeroRightSection getAnimationDelay={getAnimationDelay} />
    </Wrapper>
  );
};

export default Hero;
