import { motion } from 'framer-motion';
import { useMemo, memo } from 'react';

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const Particle = memo(({ data }: { data: ParticleData }) => {
  return (
    <motion.div
      className="absolute rounded-full will-change-transform"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        width: data.size,
        height: data.size,
        background: data.color,
        boxShadow: '0 0 10px rgba(189, 179, 255, 0.5)',
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: data.duration,
        repeat: Infinity,
        delay: data.delay,
        ease: "easeInOut",
      }}
    />
  );
});

Particle.displayName = 'Particle';

export default function ParticleBackground({ white = false }: { white?: boolean }) {
  const particles = useMemo<ParticleData[]>(() => {
    const particleCount = 20;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: white ? '#FFFFFF' : Math.random() > 0.5 ? '#68A1F2' : '#9E89FF',
      //background: `radial-gradient(circle, rgba(189, 179, 255, ${Math.random() * 0.5 + 0.3}), transparent)`,
      duration: Math.random() * 3 + 3,
      delay: i * 0.15,
    }));
  }, [white]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <Particle key={particle.id} data={particle} />
      ))}
    </div>
  );
}
