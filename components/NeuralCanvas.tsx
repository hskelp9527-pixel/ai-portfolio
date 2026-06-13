import { Suspense, lazy, useEffect, useState } from 'react';
import { Theme } from '../types';

const ParticleField = lazy(() => import('../three/ParticleField'));

interface NeuralCanvasProps {
  theme: Theme;
  reducedMotion?: boolean;
}

export const NeuralCanvas: React.FC<NeuralCanvasProps> = ({ theme, reducedMotion = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (isMobile || reducedMotion) return null;

  const particleColor = theme === 'dark' ? '#5eead4' : '#0d9488';
  const count = theme === 'dark' ? 220 : 160;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <ParticleField count={count} color={particleColor} />
      </Suspense>
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(circle at 50% 50%, transparent 0%, oklch(0.04 0.01 250 / 0.4) 80%)'
              : 'radial-gradient(circle at 50% 50%, transparent 0%, oklch(0.12 0.02 250 / 0.3) 80%)',
        }}
      />
    </div>
  );
};
