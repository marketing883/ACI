import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function CdpFlow({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 220"
      title="CDP ingest to activation flow"
      description="Ingest, identity resolution, enrichment, and activation."
      className={className}
    >
      <Node x={20} y={80} label="Ingest" sub="Web, mobile, CRM" tone="gray" highlighted={highlight === 'ingest'} id="ingest" />
      <Node x={180} y={80} label="Identity" sub="Resolution, stitching" tone="primary" highlighted={highlight === 'identity'} id="identity" />
      <Node x={340} y={80} label="Enrichment" sub="Attributes, consent" tone="primary" highlighted={highlight === 'enrichment'} id="enrichment" />
      <Node x={500} y={80} label="Activation" sub="Segments, journeys" tone="lime" highlighted={highlight === 'activation'} id="activation" />
      <Edge x1={160} y1={110} x2={180} y2={110} />
      <Edge x1={320} y1={110} x2={340} y2={110} />
      <Edge x1={480} y1={110} x2={500} y2={110} />
    </DiagramSurface>
  );
}
