import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function MlopsLifecycle({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 260"
      title="MLOps lifecycle"
      description="Train, register, deploy, monitor. Drift back into training."
      className={className}
    >
      <Node x={40} y={40} label="Train" sub="MLflow, notebooks" tone="primary" highlighted={highlight === 'train'} id="train" />
      <Node x={240} y={40} label="Register" sub="Model registry" tone="primary" highlighted={highlight === 'register'} id="register" />
      <Node x={440} y={40} label="Deploy" sub="CI/CD, serving" tone="primary" highlighted={highlight === 'deploy'} id="deploy" />
      <Node x={240} y={160} label="Monitor" sub="Drift, SLOs" tone="lime" highlighted={highlight === 'monitor'} id="monitor" />
      <Edge x1={180} y1={70} x2={240} y2={70} />
      <Edge x1={380} y1={70} x2={440} y2={70} />
      <Edge x1={510} y1={100} x2={380} y2={160} dashed />
      <Edge x1={240} y1={190} x2={110} y2={100} dashed label="drift -> retrain" />
    </DiagramSurface>
  );
}
