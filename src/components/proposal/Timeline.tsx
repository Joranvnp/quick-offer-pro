import { MessageSquare, Palette, Rocket } from "lucide-react";
import { getPackById } from "@/data/packs";

interface TimelineProps {
  packId: string;
}

export const Timeline = ({ packId }: TimelineProps) => {
  const pack = getPackById(packId);
  const days = pack?.defaultTimelineDays || 7;

  const midPoint = Math.floor(days / 2);

  const steps = [
    {
      icon: MessageSquare,
      title: "Brief",
      description: "Échange & validation du projet",
      day: "J+0",
    },
    {
      icon: Palette,
      title: "Création",
      description: "Design & développement",
      day: `J+${midPoint}`,
    },
    {
      icon: Rocket,
      title: "Mise en ligne",
      description: "Livraison & formation",
      day: `J+${days}`,
    },
  ];

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-border md:block" />

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-card">
              <step.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="mt-4">
              <span className="mb-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {step.day}
              </span>
              <h4 className="text-base font-semibold text-foreground">
                {step.title}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
