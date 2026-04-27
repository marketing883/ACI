import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function ApiTopology({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 260"
      title="API integration topology"
      description="Systems of record and engagement behind a managed API gateway."
      className={className}
    >
      <Node x={230} y={20} label="API gateway" sub="AuthN, rate limits" tone="dark" w={180} h={60} highlighted={highlight === 'gateway'} id="gateway" />
      <Node x={20} y={130} label="ERP" tone="primary" highlighted={highlight === 'erp'} id="erp" />
      <Node x={180} y={130} label="CRM" tone="primary" highlighted={highlight === 'crm'} id="crm" />
      <Node x={340} y={130} label="HRIS" tone="primary" highlighted={highlight === 'hris'} id="hris" />
      <Node x={500} y={130} label="DWH" tone="primary" highlighted={highlight === 'dwh'} id="dwh" />
      <Node x={80} y={210} label="Web app" tone="lime" w={140} h={40} id="web" />
      <Node x={260} y={210} label="Mobile" tone="lime" w={140} h={40} id="mobile" />
      <Node x={440} y={210} label="Partner" tone="lime" w={140} h={40} id="partner" />
      <Edge x1={320} y1={80} x2={90} y2={130} />
      <Edge x1={320} y1={80} x2={250} y2={130} />
      <Edge x1={320} y1={80} x2={410} y2={130} />
      <Edge x1={320} y1={80} x2={560} y2={130} />
      <Edge x1={150} y1={230} x2={320} y2={80} dashed />
      <Edge x1={330} y1={230} x2={320} y2={80} dashed />
      <Edge x1={510} y1={230} x2={320} y2={80} dashed />
    </DiagramSurface>
  );
}
