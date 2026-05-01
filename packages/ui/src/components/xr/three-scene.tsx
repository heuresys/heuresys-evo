'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { cn } from '../../lib/cn';

/**
 * ThreeScene — minimal three.js viewer with OrbitControls.
 * Pass children as <mesh>, <group>, etc. (TIER 16)
 */
export function ThreeScene({
  children,
  className,
  height = 400,
  cameraPosition = [3, 3, 3],
  ariaLabel = '3D scene',
}: {
  children?: React.ReactNode;
  className?: string;
  height?: number | string;
  cameraPosition?: [number, number, number];
  ariaLabel?: string;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('rounded-md border border-border bg-background', className)}
      style={{ height }}
    >
      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <OrbitControls makeDefault enableDamping />
        {children ?? <DemoCube />}
      </Canvas>
    </div>
  );
}

function DemoCube() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#a78bfa' : '#60a5fa'} />
    </mesh>
  );
}
