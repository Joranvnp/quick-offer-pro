import { Checkbox } from "@/components/ui/checkbox";
import { getOptionsForPack, Option } from "@/data/options";
import { formatPrice } from "@/lib/pricing";

interface OptionsChecklistProps {
  packId: string;
  selectedOptions: string[];
  onToggle: (optionId: string) => void;
}

export const OptionsChecklist = ({
  packId,
  selectedOptions,
  onToggle,
}: OptionsChecklistProps) => {
  const availableOptions = getOptionsForPack(packId);

  if (availableOptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        Options disponibles
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {availableOptions.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={selectedOptions.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  onToggle: () => void;
}

const OptionItem = ({ option, isSelected, onToggle }: OptionItemProps) => {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">{option.name}</span>
          <span className="text-sm font-semibold text-primary">
            +{formatPrice(option.price)}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
      </div>
    </label>
  );
};
