import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function Lakehouse({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 280"
      title="Lakehouse architecture"
      description="Bronze, silver, and gold medallion layers feeding analytics and ML."
      className={className}
    >
      <Node x={20} y={40} label="Sources" sub="OLTP, SaaS, IoT" tone="gray" id="sources" />
      <Node x={200} y={20} label="Bronze" sub="Raw / append-only" tone="dark" highlighted={highlight === 'bronze'} id="bronze" />
      <Node x={200} y={100} label="Silver" sub="Cleaned / conformed" tone="primary" highlighted={highlight === 'silver'} id="silver" />
      <Node x={200} y={180} label="Gold" sub="Curated / served" tone="lime" highlighted={highlight === 'gold'} id="gold" />
      <Node x={420} y={40} label="BI + SQL" sub="dbt, Looker" tone="light" id="bi" />
      <Node x={420} y={120} label="ML + Feature Store" sub="MLflow, Feast" tone="light" id="ml" />
      <Node x={420} y={200} label="Reverse ETL" sub="Activation" tone="light" id="reverse-etl" />
      <Edge x1={160} y1={70} x2={200} y2={50} />
      <Edge x1={270} y1={80} x2={270} y2={100} />
      <Edge x1={270} y1={160} x2={270} y2={180} />
      <Edge x1={340} y1={210} x2={420} y2={60} />
      <Edge x1={340} y1={210} x2={420} y2={140} />
      <Edge x1={340} y1={210} x2={420} y2={220} />
    </DiagramSurface>
  );
}
