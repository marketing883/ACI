import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function EngagementModel({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 180"
      title="ACI engagement model"
      description="Discovery, blueprint, build, operate."
      className={className}
    >
      <Node x={20} y={60} label="Discovery" sub="Weeks 1 to 4" tone="gray" highlighted={highlight === 'discovery'} id="discovery" w={140} />
      <Node x={180} y={60} label="Blueprint" sub="Weeks 5 to 12" tone="primary" highlighted={highlight === 'blueprint'} id="blueprint" w={140} />
      <Node x={340} y={60} label="Build" sub="Months 4 to 8" tone="primary" highlighted={highlight === 'build'} id="build" w={120} />
      <Node x={480} y={60} label="Operate" sub="Ongoing SLA" tone="lime" highlighted={highlight === 'operate'} id="operate" w={140} />
      <Edge x1={160} y1={90} x2={180} y2={90} />
      <Edge x1={320} y1={90} x2={340} y2={90} />
      <Edge x1={460} y1={90} x2={480} y2={90} />
    </DiagramSurface>
  );
}
