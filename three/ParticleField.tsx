import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  color?: string;
}

interface LayerCfg {
  count: number;
  size: number;
  speed: number;
  opacity: number;
  parallax: number;
  boundX: number;
  boundY: number;
  isAccent: boolean;
}

const LAYER_CONFIGS: LayerCfg[] = [
  { count: 70, size: 5,  speed: 0.25, opacity: 0.30, parallax: 0.02, boundX: 24, boundY: 14, isAccent: false },
  { count: 60, size: 9,  speed: 0.5,  opacity: 0.65, parallax: 0.05, boundX: 20, boundY: 12, isAccent: true  },
  { count: 30, size: 14, speed: 0.8,  opacity: 0.90, parallax: 0.10, boundX: 18, boundY: 10, isAccent: true  },
];

const FAR_COLOR = '#94a3b8';
const AMBER_COLOR = '#fbbf24';
const CONNECT_DIST = 0.9;
const MAX_LINES = 120;
const MOUSE_RADIUS = 2.5;
const MOUSE_FORCE = 0.04;
const FRAME_STRIDE = 4;
const MOUSE_INFLUENCE_RADIUS = 3.0;

const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform vec3 uMouseWorld;
  uniform float uMouseActive;
  uniform float uMouseInfluenceRadius;

  varying vec3 vColor;
  varying float vInf;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio;

    vec4 worldPos4 = modelMatrix * vec4(position, 1.0);
    float dist = distance(worldPos4.xy, uMouseWorld.xy);
    float inf = uMouseActive * smoothstep(uMouseInfluenceRadius, 0.0, dist);

    vInf = inf;
    vColor = mix(uColorBase, uColorAccent, inf);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vInf;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.18, d);
    float alpha = (core * 0.85 + halo * 0.35) * uOpacity;

    vec3 col = vColor * (1.0 + vInf * 0.7);

    gl_FragColor = vec4(col, alpha);
  }
`;

interface LayerData {
  positions: Float32Array;
  velocities: Float32Array;
}

function makeLayerData(count: number, boundX: number, boundY: number): LayerData {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * boundX;
    positions[i * 3 + 1] = (Math.random() - 0.5) * boundY;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    velocities[i * 3] = (Math.random() - 0.5) * 0.008;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
  }
  return { positions, velocities };
}

function Scene({ color }: { color: string }) {
  const meshRef0 = useRef<THREE.Points>(null);
  const meshRef1 = useRef<THREE.Points>(null);
  const meshRef2 = useRef<THREE.Points>(null);
  const meshRefs = [meshRef0, meshRef1, meshRef2];
  const linesRef = useRef<THREE.LineSegments>(null);
  const frameCounter = useRef(0);
  const mouseWorldRef = useRef(new THREE.Vector3());
  const mouseActiveRef = useRef(0);

  const [layers] = useState(() =>
    LAYER_CONFIGS.map((cfg) => makeLayerData(cfg.count, cfg.boundX, cfg.boundY))
  );

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const arr = new Float32Array(MAX_LINES * 6);
    geom.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    geom.setDrawRange(0, 0);
    return geom;
  }, []);

  const pixelRatio = useMemo(
    () => Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2),
    []
  );

  const materials = useMemo(
    () =>
      LAYER_CONFIGS.map((cfg) =>
        new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uSize: { value: cfg.size },
            uPixelRatio: { value: pixelRatio },
            uColorBase: { value: new THREE.Color(cfg.isAccent ? color : FAR_COLOR) },
            uColorAccent: { value: new THREE.Color(AMBER_COLOR) },
            uOpacity: { value: cfg.opacity },
            uMouseWorld: { value: new THREE.Vector3() },
            uMouseActive: { value: 0 },
            uMouseInfluenceRadius: { value: MOUSE_INFLUENCE_RADIUS },
          },
        })
      ),
    [color, pixelRatio]
  );

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
    };
  }, [materials]);

  useFrame((state) => {
    const pointer = state.pointer;
    const mouseWorldX = pointer.x * 6.5;
    const mouseWorldY = pointer.y * 4;
    const pointerActive = pointer.length() < 1.5;
    const targetActive = pointerActive ? 1 : 0;
    mouseActiveRef.current = THREE.MathUtils.lerp(
      mouseActiveRef.current,
      targetActive,
      0.08
    );
    mouseWorldRef.current.set(mouseWorldX, mouseWorldY, 0);

    LAYER_CONFIGS.forEach((cfg, idx) => {
      const mesh = meshRefs[idx].current;
      if (!mesh) return;
      const { positions, velocities } = layers[idx];

      for (let i = 0; i < cfg.count; i++) {
        const ix = i * 3;
        positions[ix] += velocities[ix] * cfg.speed;
        positions[ix + 1] += velocities[ix + 1] * cfg.speed;

        if (pointerActive) {
          const dx = mouseWorldX - positions[ix];
          const dy = mouseWorldY - positions[ix + 1];
          const distSq = dx * dx + dy * dy;
          if (distSq < MOUSE_RADIUS * MOUSE_RADIUS && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE * cfg.speed;
            positions[ix] += (dx / dist) * force;
            positions[ix + 1] += (dy / dist) * force;
          }
        }

        if (Math.abs(positions[ix]) > cfg.boundX / 2) velocities[ix] *= -1;
        if (Math.abs(positions[ix + 1]) > cfg.boundY / 2) velocities[ix + 1] *= -1;
      }

      const mat = materials[idx];
      (mat.uniforms.uMouseWorld.value as THREE.Vector3).copy(mouseWorldRef.current);
      mat.uniforms.uMouseActive.value = mouseActiveRef.current;

      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.rotation.y += 0.0003 * cfg.speed;
      mesh.rotation.x = pointer.y * cfg.parallax;
      mesh.rotation.z = pointer.x * cfg.parallax;
    });

    if (linesRef.current && meshRefs[1].current) {
      linesRef.current.rotation.copy(meshRefs[1].current.rotation);
    }

    frameCounter.current++;
    if (frameCounter.current % FRAME_STRIDE !== 0) return;

    const midPositions = layers[1].positions;
    const midCount = LAYER_CONFIGS[1].count;
    const lineArr = lineGeometry.attributes.position.array as Float32Array;
    let lineIdx = 0;
    const maxIdx = MAX_LINES * 6;

    for (let i = 0; i < midCount && lineIdx < maxIdx; i++) {
      const ix1 = i * 3;
      const x1 = midPositions[ix1];
      const y1 = midPositions[ix1 + 1];
      const z1 = midPositions[ix1 + 2];
      for (let j = i + 1; j < midCount && lineIdx < maxIdx; j++) {
        const ix2 = j * 3;
        const dx = midPositions[ix2] - x1;
        const dy = midPositions[ix2 + 1] - y1;
        const dz = midPositions[ix2 + 2] - z1;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < CONNECT_DIST * CONNECT_DIST) {
          lineArr[lineIdx++] = x1;
          lineArr[lineIdx++] = y1;
          lineArr[lineIdx++] = z1;
          lineArr[lineIdx++] = midPositions[ix2];
          lineArr[lineIdx++] = midPositions[ix2 + 1];
          lineArr[lineIdx++] = midPositions[ix2 + 2];
        }
      }
    }

    lineGeometry.setDrawRange(0, lineIdx / 3);
    lineGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {LAYER_CONFIGS.map((cfg, idx) => (
        <points key={idx} ref={meshRefs[idx]} material={materials[idx]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={cfg.count}
              array={layers[idx].positions}
              itemSize={3}
              args={[layers[idx].positions, 3]}
            />
          </bufferGeometry>
        </points>
      ))}

      <lineSegments ref={linesRef}>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ color = '#5eead4' }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <Scene color={color} />
    </Canvas>
  );
};

export default ParticleField;
