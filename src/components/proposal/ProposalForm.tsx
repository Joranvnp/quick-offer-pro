import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { problems, goals } from "@/data/problems";
import { ProposalData } from "@/types/proposal";
import { PackSelector } from "./PackSelector";
import { OptionsChecklist } from "./OptionsChecklist";

interface ProposalFormProps {
  data: ProposalData;
  onChange: (data: Partial<ProposalData>) => void;
}

export const ProposalForm = ({ data, onChange }: ProposalFormProps) => {
  const handleToggleOption = (optionId: string) => {
    const newOptions = data.selectedOptions.includes(optionId)
      ? data.selectedOptions.filter((id) => id !== optionId)
      : [...data.selectedOptions, optionId];
    onChange({ selectedOptions: newOptions });
  };

  return (
    <div className="space-y-10">
      {/* Section: Prospect */}
      <section className="animate-fade-in">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Informations prospect
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prospectName">Nom du contact</Label>
            <Input
              id="prospectName"
              placeholder="Jean Dupont"
              value={data.prospectName}
              onChange={(e) => onChange({ prospectName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prospectCompany">Entreprise</Label>
            <Input
              id="prospectCompany"
              placeholder="Dupont & Fils"
              value={data.prospectCompany}
              onChange={(e) => onChange({ prospectCompany: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prospectSector">Secteur d'activité</Label>
            <Input
              id="prospectSector"
              placeholder="Plomberie, Restaurant, etc."
              value={data.prospectSector}
              onChange={(e) => onChange({ prospectSector: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prospectCity">Ville</Label>
            <Input
              id="prospectCity"
              placeholder="Paris"
              value={data.prospectCity}
              onChange={(e) => onChange({ prospectCity: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Section: Problem & Goal */}
      <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Situation & Objectif
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Problème principal</Label>
            <Select
              value={data.prospectProblem}
              onValueChange={(value) => onChange({ prospectProblem: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                {problems.map((problem) => (
                  <SelectItem key={problem.id} value={problem.id}>
                    {problem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Objectif visé</Label>
            <Select
              value={data.prospectGoal}
              onValueChange={(value) => onChange({ prospectGoal: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Section: Pack */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Choisissez un pack
        </h2>
        <PackSelector
          selectedPackId={data.packId}
          onSelect={(packId) => onChange({ packId, selectedOptions: [] })}
        />
      </section>

      {/* Section: Options */}
      <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Options supplémentaires
        </h2>
        <OptionsChecklist
          packId={data.packId}
          selectedOptions={data.selectedOptions}
          onToggle={handleToggleOption}
        />
      </section>

      {/* Section: Deposit */}
      <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Acompte demandé
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pourcentage d'acompte</span>
            <span className="text-lg font-semibold text-foreground">
              {data.depositPercent}%
            </span>
          </div>
          <Slider
            value={[data.depositPercent]}
            onValueChange={([value]) => onChange({ depositPercent: value })}
            min={0}
            max={50}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>
      </section>

      {/* Section: Owner Info */}
      <section className="animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Vos coordonnées
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Votre nom</Label>
            <Input
              id="ownerName"
              placeholder="Marie Martin"
              value={data.ownerName}
              onChange={(e) => onChange({ ownerName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Téléphone</Label>
            <Input
              id="ownerPhone"
              placeholder="06 12 34 56 78"
              value={data.ownerPhone}
              onChange={(e) => onChange({ ownerPhone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Email</Label>
            <Input
              id="ownerEmail"
              type="email"
              placeholder="contact@monsite.fr"
              value={data.ownerEmail}
              onChange={(e) => onChange({ ownerEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerWebsite">Site web (optionnel)</Label>
            <Input
              id="ownerWebsite"
              placeholder="www.monsite.fr"
              value={data.ownerWebsite}
              onChange={(e) => onChange({ ownerWebsite: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ownerSiret">SIRET (optionnel)</Label>
            <Input
              id="ownerSiret"
              placeholder="123 456 789 00012"
              value={data.ownerSiret}
              onChange={(e) => onChange({ ownerSiret: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Section: Tone */}
      <section className="animate-fade-in" style={{ animationDelay: "600ms" }}>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Ton du document
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: "neutral", label: "Neutre", desc: "Professionnel et équilibré" },
            { value: "confident", label: "Confiant", desc: "Affirmé et rassurant" },
            { value: "simple", label: "Simple", desc: "Accessible et direct" },
          ].map((tone) => (
            <button
              key={tone.value}
              onClick={() => onChange({ tone: tone.value as ProposalData["tone"] })}
              className={`rounded-lg border p-4 text-left transition-all ${
                data.tone === tone.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span className="font-medium text-foreground">{tone.label}</span>
              <p className="mt-1 text-sm text-muted-foreground">{tone.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
