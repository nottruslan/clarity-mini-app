import Lottie from 'lottie-react';
import animationData from '/anim.json';

interface LottieAnimationProps {
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({ 
  className = '', 
  loop = true, 
  autoplay = true 
}: LottieAnimationProps) {
  return (
    <div className={className}>
      <Lottie 
        animationData={animationData} 
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
}

