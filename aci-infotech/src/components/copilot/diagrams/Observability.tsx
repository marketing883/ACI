import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function Observability({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 240"
      title="Observability pipeline"
      description="Logs, metrics, and traces flow to SLOs and alerting."
      className={className}
    >
      <Node x={20} y={20} label="Logs" tone="gray" highlighted={highlight === 'logs'} id="logs" />
      <Node x={20} y={110} label="Metrics" tone="gray" highlighted={highlight === 'metrics'} id="metrics" />
      <Node x={20} y={200} label="Traces" tone="gray" w={140} h={40} highlighted={highlight === 'traces'} id="traces" />
      <Node x={220} y={90} label="Pipeline" sub="OTEL, Dynatrace" tone="primary" w={180} h={80} highlighted={highlight === 'pipeline'} id="pipeline" />
      <Node x={460} y={40} label="SLOs" tone="lime" highlighted={highlight === 'slos'} id="slos" />
      <Node x={460} y={130} label="Alerting" tone="primary" highlighted={highlight === 'alert'} id="alert" />
      <Node x={460} y={200} label="Dashboards" tone="primary" w={140} h={40} highlighted={highlight === 'dash'} id="dash" />
      <Edge x1={160} y1={50} x2={220} y2={120} />
      <Edge x1={160} y1={140} x2={220} y2={130} />
      <Edge x1={160} y1={220} x2={220} y2={160} />
      <Edge x1={400} y1={120} x2={460} y2={70} />
      <Edge x1={400} y1={130} x2={460} y2={160} />
      <Edge x1={400} y1={150} x2={460} y2={220} />
    </DiagramSurface>
  );
}
