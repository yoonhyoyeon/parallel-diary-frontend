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

export default function AnimationBackground() {
  const particles = useMemo<ParticleData[]>(() => {
    const particleCount = 20;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? '#68A1F2' : '#9E89FF',
      //background: `radial-gradient(circle, rgba(189, 179, 255, ${Math.random() * 0.5 + 0.3}), transparent)`,
      duration: Math.random() * 3 + 3,
      delay: i * 0.15,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.45] blur-[100px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, #9E89FF 0%, transparent 70%)',
          top: '5%',
          left: '10%',
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.45] blur-[100px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, #68A1F2 0%, transparent 70%)',
          top: '50%',
          right: '5%',
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 90, 0],
          scale: [1, 0.85, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full opacity-[0.45] blur-[100px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, #9E89FF 0%, transparent 70%)',
          bottom: '10%',
          left: '15%',
        }}
        animate={{
          x: [0, 70, 0],
          y: [0, 110, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[750px] h-[750px] rounded-full opacity-[0.45] blur-[100px] will-change-transform"
        style={{
          background: 'radial-gradient(circle, #68A1F2 0%, transparent 70%)',
          top: '25%',
          right: '20%',
        }}
        animate={{
          x: [0, -110, 0],
          y: [0, -70, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {particles.map((particle) => (
        <Particle key={particle.id} data={particle} />
      ))}
    </div>
  );
}
