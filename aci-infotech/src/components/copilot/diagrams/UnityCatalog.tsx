import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function UnityCatalog({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 260"
      title="Unity Catalog governance plane"
      description="Access control, lineage, and audit across Databricks workspaces."
      className={className}
    >
      <Node x={230} y={20} label="Unity Catalog" sub="Central metastore" tone="lime" w={180} h={60} highlighted={highlight === 'catalog'} id="catalog" />
      <Node x={20} y={130} label="Workspace A" tone="primary" highlighted={highlight === 'wa'} id="wa" />
      <Node x={180} y={130} label="Workspace B" tone="primary" highlighted={highlight === 'wb'} id="wb" />
      <Node x={340} y={130} label="Workspace C" tone="primary" highlighted={highlight === 'wc'} id="wc" />
      <Node x={490} y={130} label="External" sub="Delta share" tone="dark" id="external" />
      <Node x={80} y={210} label="Lineage" tone="gray" w={100} h={40} id="lineage" />
      <Node x={240} y={210} label="ACL" tone="gray" w={100} h={40} id="acl" />
      <Node x={400} y={210} label="Audit" tone="gray" w={100} h={40} id="audit" />
      <Edge x1={320} y1={80} x2={90} y2={130} />
      <Edge x1={320} y1={80} x2={250} y2={130} />
      <Edge x1={320} y1={80} x2={410} y2={130} />
      <Edge x1={320} y1={80} x2={560} y2={130} dashed />
      <Edge x1={90} y1={190} x2={130} y2={210} dashed />
      <Edge x1={250} y1={190} x2={290} y2={210} dashed />
      <Edge x1={410} y1={190} x2={450} y2={210} dashed />
    </DiagramSurface>
  );
}
