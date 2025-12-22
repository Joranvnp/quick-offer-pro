import { Check } from "lucide-react";
import { packs, Pack } from "@/data/packs";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface PackSelectorProps {
  selectedPackId: string;
  onSelect: (packId: string) => void;
}

export const PackSelector = ({ selectedPackId, onSelect }: PackSelectorProps) => {
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

const PackCard = ({ pack, isSelected, onSelect, delay }: PackCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex flex-col rounded-xl border-2 p-6 text-left transition-all duration-200 animate-slide-up",
        "hover:shadow-elevated hover:border-primary/50",
        isSelected
          ? "border-primary bg-primary/5 shadow-card"
          : "border-border bg-card"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {pack.popular && (
        <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Populaire
        </span>
      )}

      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{pack.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>
        </div>
        {isSelected && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Check className="h-4 w-4 text-primary-foreground" />
          </span>
        )}
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-foreground">
          {formatPrice(pack.basePrice)}
        </span>
        <span className="text-sm text-muted-foreground"> HT</span>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Livraison en {pack.defaultTimelineDays} jours
      </div>

      <ul className="space-y-2">
        {pack.features.slice(0, 5).map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
        {pack.features.length > 5 && (
          <li className="text-sm text-muted-foreground">
            + {pack.features.length - 5} autres inclus
          </li>
        )}
      </ul>
    </button>
  );
};
