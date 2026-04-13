import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function AgenticLoop({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 260"
      title="Agentic AI loop"
      description="Plan, act, observe, reflect. Tools and memory on the side."
      className={className}
    >
      <Node x={240} y={20} label="Plan" tone="primary" highlighted={highlight === 'plan'} id="plan" />
      <Node x={440} y={110} label="Act" sub="Tool call" tone="primary" highlighted={highlight === 'act'} id="act" />
      <Node x={240} y={200} label="Observe" tone="primary" highlighted={highlight === 'observe'} id="observe" />
      <Node x={40} y={110} label="Reflect" sub="Critique, memory" tone="lime" highlighted={highlight === 'reflect'} id="reflect" />
      <Node x={40} y={20} label="Memory" tone="gray" w={120} h={40} id="memory" />
      <Node x={500} y={20} label="Tools" tone="gray" w={120} h={40} id="tools" />
      <Edge x1={380} y1={50} x2={440} y2={120} />
      <Edge x1={510} y1={170} x2={380} y2={220} />
      <Edge x1={240} y1={220} x2={160} y2={140} />
      <Edge x1={110} y1={110} x2={240} y2={50} />
      <Edge x1={100} y1={60} x2={100} y2={110} dashed />
      <Edge x1={560} y1={60} x2={510} y2={120} dashed />
    </DiagramSurface>
  );
}
