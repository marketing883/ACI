import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function ZeroTrust({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 260"
      title="Zero trust edges"
      description="Identity, device posture, and policy at every resource boundary."
      className={className}
    >
      <Node x={20} y={40} label="Identity" sub="IdP, MFA" tone="primary" highlighted={highlight === 'identity'} id="identity" />
      <Node x={20} y={130} label="Device" sub="Posture, MDM" tone="primary" highlighted={highlight === 'device'} id="device" />
      <Node x={20} y={220} label="Network" sub="Segmentation" tone="primary" highlighted={highlight === 'network'} id="network" w={140} h={40} />
      <Node x={230} y={90} label="Policy engine" sub="Continuous eval" tone="dark" w={180} h={80} highlighted={highlight === 'policy'} id="policy" />
      <Node x={460} y={40} label="App / API" tone="lime" id="app" />
      <Node x={460} y={130} label="Data store" tone="lime" id="data" />
      <Node x={460} y={220} label="SaaS" tone="lime" w={140} h={40} id="saas" />
      <Edge x1={160} y1={70} x2={230} y2={120} />
      <Edge x1={160} y1={160} x2={230} y2={140} />
      <Edge x1={160} y1={240} x2={230} y2={160} />
      <Edge x1={410} y1={120} x2={460} y2={70} />
      <Edge x1={410} y1={140} x2={460} y2={160} />
      <Edge x1={410} y1={160} x2={460} y2={240} />
    </DiagramSurface>
  );
}
