"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 46;
const CONNECT_DISTANCE = 2.6;
const RADIUS = 4.2;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useGraph() {
  return useMemo(() => {
    const rand = mulberry32(7);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const v = new THREE.Vector3(
        (rand() - 0.5) * RADIUS * 2,
        (rand() - 0.5) * RADIUS * 2,
        (rand() - 0.5) * RADIUS * 1.4
      );
      points.push(v);
    }

    const linePositions: number[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < CONNECT_DISTANCE) {
          linePositions.push(points[i].x, points[i].y, points[i].z);
          linePositions.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }

    const pointPositions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      pointPositions[i * 3] = p.x;
      pointPositions[i * 3 + 1] = p.y;
      pointPositions[i * 3 + 2] = p.z;
    });

    return {
      pointPositions,
      linePositions: new Float32Array(linePositions),
    };
  }, []);
}

function GraphGroup({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointPositions, linePositions } = useGraph();
  const { viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;

    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.06;

      const nx = (state.pointer.x * viewport.width) / 40;
      const ny = (state.pointer.y * viewport.height) / 40;
      target.current.x += (ny - target.current.x) * 0.03;
      target.current.y += (nx - target.current.y) * 0.03;
      group.current.rotation.x = -target.current.x * 0.15;
      group.current.rotation.z = target.current.y * 0.05;
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3d7dff" transparent opacity={0.16} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#3d7dff" size={0.055} transparent opacity={0.85} sizeAttenuation />
      </points>
    </group>
  );
}

export function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <GraphGroup reducedMotion={reducedMotion} />
    </Canvas>
  );
}
