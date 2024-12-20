"use client";
import { SocialIcon } from '@/components';
import { socialSection } from '@/lib/content/social';
import { useState, useEffect } from 'react';

const SocialLinks = ({ className = '' }: { className?: string }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [iconToggle, setIconToggle] = useState(false);
  let intervalId: NodeJS.Timeout | null = null;

  const handleVolumeToggle = () => {
    const audio = document.getElementById('background-music') as HTMLAudioElement;

    if (isMuted) {
      audio.play();
      setShowMessage(true);
      intervalId = setInterval(() => {
        setIconToggle((prev) => !prev);
      }, 500);
    } else {
      audio.pause();
      setShowMessage(false);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div className={className}>
      <ul>
        <li onClick={handleVolumeToggle} className="cursor-pointer">
          <SocialIcon
            icon={
              isMuted ? 'tabler:volume-off' : iconToggle ? 'tabler:volume-2' : 'tabler:volume'
            }
          />
        </li>
        {socialSection.socialLinks.slice(2).map(({ icon, url }) => (
          <SocialIcon key={url} icon={icon} url={url} />
        ))}
      </ul>

      {showMessage && (
        <div
          className="fixed bottom-0 text-xs dark:text-pink-50 text-pink-300 left-20 p-2"
        >
          Music provided by 셀바이뮤직
        </div>
      )}

      <audio id="background-music" src="/music.mp3" loop />
    </div>
  );
};

export default SocialLinks;
