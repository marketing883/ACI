import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function DataMesh({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 300"
      title="Data mesh topology"
      description="Federated domain data products with a central governance plane."
      className={className}
    >
      <Node x={260} y={20} label="Governance" sub="Catalog, policies, lineage" tone="dark" highlighted={highlight === 'governance'} w={160} id="governance" />
      <Node x={40} y={140} label="Finance domain" sub="Close, FP&amp;A" tone="primary" highlighted={highlight === 'finance'} id="finance" />
      <Node x={240} y={140} label="Retail domain" sub="POS, loyalty" tone="primary" highlighted={highlight === 'retail'} id="retail" />
      <Node x={440} y={140} label="Ops domain" sub="Supply, logistics" tone="primary" highlighted={highlight === 'ops'} id="ops" />
      <Node x={40} y={230} label="Product A" tone="light" w={120} h={50} id="pa" />
      <Node x={240} y={230} label="Product B" tone="light" w={120} h={50} id="pb" />
      <Node x={440} y={230} label="Product C" tone="light" w={120} h={50} id="pc" />
      <Edge x1={340} y1={80} x2={110} y2={140} dashed />
      <Edge x1={340} y1={80} x2={310} y2={140} dashed />
      <Edge x1={340} y1={80} x2={510} y2={140} dashed />
      <Edge x1={100} y1={200} x2={100} y2={230} />
      <Edge x1={310} y1={200} x2={300} y2={230} />
      <Edge x1={510} y1={200} x2={500} y2={230} />
    </DiagramSurface>
  );
}
