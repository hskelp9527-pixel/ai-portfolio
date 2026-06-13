import { useEffect, useState } from 'react';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
  forceX,
  forceY,
} from 'd3-force';
import { GraphNode, GraphEdge } from '../types';

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  strength?: number;
}

export interface NodePosition {
  x: number;
  y: number;
}

const CLUSTER_RADIUS: Record<string, number> = {
  projects: 340,
  skills: 290,
  philosophy: 260,
  timeline: 310,
  center: 0,
};

const CLUSTER_ANGLE: Record<string, number> = {
  projects: -Math.PI / 4,
  skills: Math.PI / 4,
  philosophy: (3 * Math.PI) / 4,
  timeline: -(3 * Math.PI) / 4,
  center: 0,
};

export function useNodeGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number
): Map<string, NodePosition> {
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());

  useEffect(() => {
    if (!width || !height || nodes.length === 0) return;

    const cx = width / 2;
    const cy = height / 2;

    const simNodes: SimNode[] = nodes.map((n, i) => {
      const angle = CLUSTER_ANGLE[n.cluster] ?? 0;
      const radius = n.type === 'center' ? 0 : CLUSTER_RADIUS[n.cluster] ?? 280;
      const jitter = (Math.random() - 0.5) * 80;
      return {
        ...n,
        x: cx + Math.cos(angle) * radius + jitter,
        y: cy + Math.sin(angle) * radius + jitter,
        vx: 0,
        vy: 0,
      };
    });

    const nodeById = new Map(simNodes.map((n) => [n.id, n]));
    const simLinks: SimLink[] = edges
      .filter((e) => nodeById.has(e.source) && nodeById.has(e.target))
      .map((e) => ({ source: e.source, target: e.target, strength: e.strength }));

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'charge',
        forceManyBody().strength((d: any) => (d.type === 'center' ? -1200 : -250))
      )
      .force('center', forceCenter(cx, cy))
      .force(
        'collision',
        forceCollide<SimNode>().radius((d) => 26 + d.importance * 5)
      )
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(110)
          .strength((l: any) => l.strength || 0.3)
      )
      .force(
        'x',
        forceX<SimNode>((d) => {
          const a = CLUSTER_ANGLE[d.cluster] ?? 0;
          const r = d.type === 'center' ? 0 : (CLUSTER_RADIUS[d.cluster] ?? 280);
          return cx + Math.cos(a) * r;
        }).strength(0.18)
      )
      .force(
        'y',
        forceY<SimNode>((d) => {
          const a = CLUSTER_ANGLE[d.cluster] ?? 0;
          const r = d.type === 'center' ? 0 : (CLUSTER_RADIUS[d.cluster] ?? 280);
          return cy + Math.sin(a) * r;
        }).strength(0.18)
      )
      .stop();

    for (let i = 0; i < 500; i++) sim.tick();

    const map = new Map<string, NodePosition>();
    simNodes.forEach((n) => {
      map.set(n.id, { x: n.x, y: n.y });
    });
    setPositions(map);

    return () => {
      sim.stop();
    };
  }, [nodes, edges, width, height]);

  return positions;
}
