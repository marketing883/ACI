import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function RetailRealtime({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 240"
      title="Real-time retail pipeline"
      description="Edge capture through streaming store to activation."
      className={className}
    >
      <Node x={20} y={100} label="Stores / edge" sub="POS, IoT" tone="gray" highlighted={highlight === 'edge'} id="edge" w={140} />
      <Node x={190} y={100} label="Stream" sub="Kafka, Kinesis" tone="primary" highlighted={highlight === 'stream'} id="stream" w={130} />
      <Node x={350} y={20} label="Lakehouse" tone="primary" highlighted={highlight === 'lake'} id="lake" w={120} />
      <Node x={350} y={180} label="Feature store" tone="primary" highlighted={highlight === 'features'} id="features" w={140} />
      <Node x={510} y={100} label="Activation" sub="Loyalty, promos" tone="lime" highlighted={highlight === 'activate'} id="activate" />
      <Edge x1={160} y1={130} x2={190} y2={130} />
      <Edge x1={320} y1={110} x2={350} y2={50} />
      <Edge x1={320} y1={150} x2={350} y2={210} />
      <Edge x1={470} y1={50} x2={510} y2={110} />
      <Edge x1={490} y1={210} x2={510} y2={150} />
    </DiagramSurface>
  );
}
