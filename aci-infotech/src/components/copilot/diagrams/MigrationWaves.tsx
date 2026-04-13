import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function MigrationWaves({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 220"
      title="Cloud migration waves"
      description="Discover, prioritize, lift, refactor, optimize."
      className={className}
    >
      <Node x={10} y={80} label="Discover" tone="gray" highlighted={highlight === 'discover'} id="discover" w={110} />
      <Node x={140} y={80} label="Prioritize" tone="primary" highlighted={highlight === 'prioritize'} id="prioritize" w={110} />
      <Node x={270} y={80} label="Lift" tone="primary" highlighted={highlight === 'lift'} id="lift" w={90} />
      <Node x={380} y={80} label="Refactor" tone="primary" highlighted={highlight === 'refactor'} id="refactor" w={110} />
      <Node x={510} y={80} label="Optimize" tone="lime" highlighted={highlight === 'optimize'} id="optimize" w={110} />
      <Edge x1={120} y1={110} x2={140} y2={110} />
      <Edge x1={250} y1={110} x2={270} y2={110} />
      <Edge x1={360} y1={110} x2={380} y2={110} />
      <Edge x1={490} y1={110} x2={510} y2={110} />
    </DiagramSurface>
  );
}
