'use client';

import type { OfferActionButtonsArgs } from '@/lib/copilot/tools';

export interface ActionChipsProps {
  buttons: OfferActionButtonsArgs['buttons'];
  onSelect: (value: string, label: string) => void;
}

const INTENT_CLASSES: Record<
  OfferActionButtonsArgs['buttons'][number]['intent'],
  string
> = {
  explore:
    'border border-gray-300 bg-transparent text-[color:var(--aci-secondary,#0A1628)] hover:border-[color:var(--aci-primary,#0052CC)]',
  request:
    'bg-white text-[color:var(--aci-primary,#0052CC)] border border-[color:var(--aci-primary,#0052CC)] hover:bg-[color:var(--aci-primary,#0052CC)] hover:text-white',
  schedule:
    'bg-[color:var(--aci-primary,#0052CC)] text-white border border-[color:var(--aci-primary,#0052CC)] hover:bg-[color:var(--aci-primary-dark,#003D99)]',
  download:
    'bg-[color:var(--aci-lime,#C4FF61)] text-[color:var(--aci-secondary,#0A1628)] border border-[color:var(--aci-lime,#C4FF61)] hover:brightness-95',
};

export default function ActionChips({ buttons, onSelect }: ActionChipsProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {buttons.map((b) => (
        <button
          key={`${b.label}-${b.value}`}
          type="button"
          onClick={() => onSelect(b.value, b.label)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${INTENT_CLASSES[b.intent]}`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
