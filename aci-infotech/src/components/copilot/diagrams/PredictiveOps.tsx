import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function PredictiveOps({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 220"
      title="Predictive ops loop"
      description="Signals feed forecasts that trigger interventions and feed back."
      className={className}
    >
      <Node x={40} y={80} label="Signals" sub="Ops, quality, demand" tone="gray" highlighted={highlight === 'signals'} id="signals" />
      <Node x={240} y={80} label="Forecast" sub="Models, rules" tone="primary" highlighted={highlight === 'forecast'} id="forecast" />
      <Node x={440} y={80} label="Intervene" sub="Workflow, alert" tone="lime" highlighted={highlight === 'intervene'} id="intervene" />
      <Edge x1={180} y1={110} x2={240} y2={110} />
      <Edge x1={380} y1={110} x2={440} y2={110} />
      <Edge x1={510} y1={140} x2={110} y2={140} dashed label="outcome feedback" />
    </DiagramSurface>
  );
}
