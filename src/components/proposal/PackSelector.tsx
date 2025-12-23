import { Check } from "lucide-react";
import { packs, Pack } from "@/data/packs";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface PackSelectorProps {
  selectedPackId: string;
  onSelect: (packId: string) => void;
}

export const PackSelector = ({
  selectedPackId,
  onSelect,
}: PackSelectorProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {packs.map((pack, index) => (
        <PackCard
          key={pack.id}
          pack={pack}
          isSelected={selectedPackId === pack.id}
          onSelect={() => onSelect(pack.id)}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

interface PackCardProps {
  pack: Pack;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}

import { useState } from "react";

const PackCard = ({ pack, isSelected, onSelect, delay }: PackCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-6 text-left transition-all duration-300 animate-slide-up",
        "hover:shadow-xl hover:border-primary/50 hover:-translate-y-1",
        isSelected
          ? "border-primary bg-primary/5 shadow-card ring-1 ring-primary/20"
          : "border-border/60 bg-card",
        pack.popular &&
          !isSelected &&
          "border-primary/30 bg-gradient-to-b from-card to-primary/5"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {pack.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary/90 px-4 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-md ring-2 ring-background">
          Populaire
        </span>
      )}

      <div className="mb-4 flex items-start justify-between pr-10 relative">
        <div>
          <h3 className="text-xl font-bold text-foreground">{pack.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground min-h-[60px] flex items-center">
            {pack.description}
          </p>
        </div>
        {isSelected && (
          <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-sm">
            <Check className="h-4 w-4 text-primary-foreground" />
          </span>
        )}
      </div>

      <div className="mb-5">
        {pack.customPriceDisplay ? (
          <span className="text-2xl font-bold text-foreground">
            {pack.customPriceDisplay}
          </span>
        ) : (
          <div className="flex items-start gap-1">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              {formatPrice(pack.basePrice).replace("€", "")}
            </span>
            <span className="text-xl font-bold text-muted-foreground mt-1">
              €
            </span>
          </div>
        )}
        <div className="mt-1 text-sm font-medium text-muted-foreground">
          {pack.customTimelineDisplay ||
            `Livraison en ${pack.defaultTimelineDays} jours`}
        </div>
      </div>

      {pack.note && (
        <div className="mb-4 rounded-lg bg-accent/10 p-2 text-xs font-medium text-accent-foreground">
          {pack.note}
        </div>
      )}

      <div className="flex-1">
        <ul className="space-y-2">
          {pack.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm group">
              <div className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Check className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="text-foreground/90 leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {pack.bonuses && pack.bonuses.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-transparent p-3 dark:from-amber-950/30 dark:border-amber-800 min-h-[140px] flex flex-col justify-center">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            <span className="text-base">🎁</span> Offert (lancement)
          </p>
          <ul className="space-y-1.5">
            {pack.bonuses.map((bonus, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs font-medium text-foreground/80"
              >
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="leading-tight">{bonus}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pack.hostingNote && (
        <div className="mt-4 border-t border-border pt-3 text-[10px] text-muted-foreground">
          {pack.hostingNote}
        </div>
      )}

      {pack.limits && (
        <div className="mt-1 text-[10px] text-muted-foreground/70">
          {pack.limits}
        </div>
      )}
    </button>
  );
};
