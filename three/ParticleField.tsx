import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
}

function Particles({ count = 200, color = '#5eead4', speed = 0.5 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.008;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const geom = meshRef.current.geometry;
    const pos = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * speed;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * speed;

      if (Math.abs(pos[i * 3]) > 15) velocities[i * 3] *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
    }
    geom.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += 0.0003;
    meshRef.current.rotation.x = mouseRef.current.y * 0.05;
    meshRef.current.rotation.z = mouseRef.current.x * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 200,
  color = '#5eead4',
  speed = 0.5,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <Particles count={count} color={color} speed={speed} />
    </Canvas>
  );
};

export default ParticleField;
