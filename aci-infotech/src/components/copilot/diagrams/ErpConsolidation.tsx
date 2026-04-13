import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function ErpConsolidation({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 240"
      title="ERP consolidation"
      description="N disparate ERPs collapse into one governed target."
      className={className}
    >
      <Node x={20} y={20} label="ERP A" tone="gray" w={90} h={40} id="a" highlighted={highlight === 'a'} />
      <Node x={20} y={80} label="ERP B" tone="gray" w={90} h={40} id="b" highlighted={highlight === 'b'} />
      <Node x={20} y={140} label="ERP C" tone="gray" w={90} h={40} id="c" highlighted={highlight === 'c'} />
      <Node x={20} y={200} label="ERP ..." tone="gray" w={90} h={40} id="d" highlighted={highlight === 'd'} />
      <Node x={230} y={90} label="Harmonize" sub="Master data, rules" tone="primary" w={180} h={60} highlighted={highlight === 'harmonize'} id="harmonize" />
      <Node x={470} y={90} label="Target ERP" sub="S/4, Dynamics, NetSuite" tone="lime" w={160} h={60} highlighted={highlight === 'target'} id="target" />
      <Edge x1={110} y1={40} x2={230} y2={110} />
      <Edge x1={110} y1={100} x2={230} y2={120} />
      <Edge x1={110} y1={160} x2={230} y2={130} />
      <Edge x1={110} y1={220} x2={230} y2={140} />
      <Edge x1={410} y1={120} x2={470} y2={120} />
    </DiagramSurface>
  );
}
