import { getPackById } from "@/data/packs";
import { getOptionById } from "@/data/options";
import { calculatePricing, formatPrice } from "@/lib/pricing";

interface PricingSummaryProps {
  packId: string;
  selectedOptions: string[];
  depositPercent: number;
}

export const PricingSummary = ({
  packId,
  selectedOptions,
  depositPercent,
}: PricingSummaryProps) => {
  const pack = getPackById(packId);
  const pricing = calculatePricing(packId, selectedOptions, depositPercent);

  if (!pack) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Récapitulatif
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Pack {pack.name}</span>
          <span className="font-medium text-foreground">
            {formatPrice(pricing.packPrice)}
          </span>
        </div>

        {selectedOptions.map((optionId) => {
          const option = getOptionById(optionId);
          if (!option) return null;
          return (
            <div key={optionId} className="flex items-center justify-between">
              <span className="text-muted-foreground">+ {option.name}</span>
              <span className="text-foreground">
                {formatPrice(option.price)}
              </span>
            </div>
          );
        })}

        <div className="my-4 border-t border-border" />

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total HT</span>
          <span className="text-2xl font-bold text-foreground">
            {formatPrice(pricing.totalPrice)}
          </span>
        </div>

        <div className="mt-4 rounded-lg bg-secondary p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Acompte ({depositPercent}%)
            </span>
            <span className="font-semibold text-primary">
              {formatPrice(pricing.depositAmount)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Solde à livraison
            </span>
            <span className="font-medium text-foreground">
              {formatPrice(pricing.remainingAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
