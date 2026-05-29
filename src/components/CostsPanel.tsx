"use client";

import { CANTONAL_FEES, FEDERAL_FEES, OTHER_COSTS, FEES_NOTE } from "@/content/costs";
import type { CostItem } from "@/lib/types";

function CostTable({ title, items }: { title: string; items: CostItem[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <dl className="mt-3 divide-y divide-ink-300/40">
        {items.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-sm text-ink-700">
              {item.label}
              {item.note && <span className="mt-0.5 block text-xs text-ink-500">{item.note}</span>}
            </dt>
            <dd className="shrink-0 text-sm font-semibold text-ink-900">
              {typeof item.amountChf === "number" ? `CHF ${item.amountChf}` : item.amountChf}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CostsPanel() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-600">
        Aperçu des coûts officiels. Les montants peuvent évoluer — vérifiez sur ge.ch avant le
        dépôt.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <CostTable title="Émolument cantonal (au dépôt)" items={CANTONAL_FEES} />
        <CostTable title="Taxe fédérale" items={FEDERAL_FEES} />
      </div>
      <CostTable title="Autres frais (variables)" items={OTHER_COSTS} />
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{FEES_NOTE}</p>
    </div>
  );
}
