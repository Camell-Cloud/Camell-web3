'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components';
import { slideUp } from '@/styles/animations';

const HeroLeftSection = ({
  title,
  tagline,
  description,
  specialText,
  cta,
  getAnimationDelay,
}: {
  title: string;
  tagline: string;
  description?: string;
  specialText?: string;
  cta?: { url?: string; title: string; sameTab?: boolean; hideInDesktop?: boolean };
  getAnimationDelay: (i: number, increment?: number) => number;
}) => {
  return (
    <div className="flex-1 flex flex-col justify-center gap-6 sm:px-6">
      <div className="max-w-5xl text-4xl font-bold tracking-tighter md:text-7xl sm:pt-10">
        <motion.h1
          variants={slideUp({ delay: getAnimationDelay(1) })}
          initial="hidden"
          animate="show"
          className="text-pink-500 dark:text-slate-200 capitalize mb-2 leading-[1.1]"
        >
          {title}
        </motion.h1>
        <motion.h1
          variants={slideUp({ delay: getAnimationDelay(2) })}
          initial="hidden"
          animate="show"
          className="leading-[1.2]"
        >
          {tagline}
        </motion.h1>
      </div>

      <motion.p
        variants={slideUp({ delay: getAnimationDelay(3) })}
        initial="hidden"
        animate="show"
        className="max-w-xl text-base md:text-lg"
      >
        {description}
      </motion.p>

      <motion.p
        variants={slideUp({ delay: getAnimationDelay(4) })}
        initial="hidden"
        animate="show"
        className="font-mono text-xs md:text-sm text-accent sm:pb-6"
      >
        {specialText}
      </motion.p>
    </div>
  );
};

export default HeroLeftSection;
