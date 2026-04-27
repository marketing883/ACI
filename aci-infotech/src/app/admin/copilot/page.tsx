import { redirect } from 'next/navigation';

/** Atheros section landing — go straight to the live conversations feed. */
export default function AtherosSectionLanding() {
  redirect('/admin/copilot/live');
}
