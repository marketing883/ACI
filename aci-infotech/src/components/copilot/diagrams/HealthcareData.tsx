import { DiagramSurface, Node, Edge } from './primitives';
import type { DiagramProps } from './registry';

export default function HealthcareData({ highlight, className }: DiagramProps) {
  return (
    <DiagramSurface
      viewBox="0 0 640 260"
      title="Healthcare data platform"
      description="HL7/FHIR ingest, de-identification, unified schema, analytics."
      className={className}
    >
      <Node x={20} y={40} label="HL7 / FHIR" tone="gray" highlighted={highlight === 'hl7'} id="hl7" />
      <Node x={20} y={130} label="Claims" tone="gray" highlighted={highlight === 'claims'} id="claims" />
      <Node x={20} y={220} label="Device telemetry" tone="gray" highlighted={highlight === 'device'} id="device" w={160} h={40} />
      <Node x={220} y={90} label="De-identification" tone="primary" w={160} highlighted={highlight === 'deid'} id="deid" />
      <Node x={410} y={90} label="Unified schema" tone="primary" w={150} highlighted={highlight === 'schema'} id="schema" />
      <Node x={220} y={200} label="Audit + consent" tone="dark" w={160} highlighted={highlight === 'audit'} id="audit" />
      <Node x={410} y={200} label="Analytics + ML" tone="lime" w={150} highlighted={highlight === 'ml'} id="ml" />
      <Edge x1={160} y1={70} x2={220} y2={120} />
      <Edge x1={160} y1={160} x2={220} y2={130} />
      <Edge x1={180} y1={240} x2={220} y2={220} />
      <Edge x1={380} y1={120} x2={410} y2={120} />
      <Edge x1={485} y1={150} x2={485} y2={200} />
      <Edge x1={300} y1={150} x2={300} y2={200} dashed />
    </DiagramSurface>
  );
}
