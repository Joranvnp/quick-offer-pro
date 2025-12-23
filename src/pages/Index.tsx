import { Link } from "react-router-dom";
import {
  FileText,
  Zap,
  Share2,
  ArrowRight,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { packs, Pack } from "@/data/packs";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Créez des propositions
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {" "}
                en 2 minutes
              </span>
            </h1>
            <p
              className="mt-6 animate-fade-in text-lg text-muted-foreground md:text-xl"
              style={{ animationDelay: "100ms" }}
            >
              Vendez vos sites vitrines avec des offres packagées, claires et
              professionnelles. Sans prise de tête.
            </p>
            <div
              className="mt-10 flex animate-fade-in flex-col justify-center gap-4 sm:flex-row"
              style={{ animationDelay: "200ms" }}
            >
              <Button asChild size="lg" className="gap-2 text-lg">
                <Link to="/proposal/new">
                  Créer une proposition
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 text-lg"
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  Mes propositions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Simple, rapide, efficace
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Packs prédéfinis",
                description:
                  "Starter, Pro, Pro+ — Choisissez un pack et ajoutez des options. Le prix se calcule automatiquement.",
              },
              {
                icon: Zap,
                title: "Proposition en 2 min",
                description:
                  "Remplissez les infos prospect, sélectionnez votre offre, c'est prêt. Pas de devis complexe.",
              },
              {
                icon: Share2,
                title: "Partagez partout",
                description:
                  "Lien unique, PDF téléchargeable, messages pré-rédigés pour WhatsApp, SMS et email.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="animate-slide-up rounded-2xl border border-border bg-card p-8 shadow-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            Nos offres packagées
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Des solutions claires, sans surprise et rentables.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack, i) => (
              <HomePackCard key={pack.id} pack={pack} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Prêt à convaincre vos prospects ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Créez votre première proposition gratuitement.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2 text-lg">
            <Link to="/proposal/new">
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Mini-Proposition — Créez des propositions commerciales simplement.
          </p>
        </div>
      </footer>
    </div>
  );
};

const HomePackCard = ({ pack, delay }: { pack: Pack; delay: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border-2 p-6 text-left transition-all duration-200 animate-slide-up",
        "border-border bg-card hover:shadow-elevated hover:border-primary/30"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {pack.popular && (
        <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Populaire
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{pack.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>
      </div>

      <div className="mb-4">
        {pack.customPriceDisplay ? (
          <span className="text-xl font-bold text-foreground">
            {pack.customPriceDisplay}
          </span>
        ) : (
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(pack.basePrice)}
          </span>
        )}
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {pack.customTimelineDisplay ||
          `Livraison en ${pack.defaultTimelineDays} jours`}
      </div>

      {pack.note && (
        <div className="mb-4 rounded bg-accent/10 p-2 text-xs font-medium text-accent-foreground">
          {pack.note}
        </div>
      )}

      <ul className="space-y-2 flex-1">
        {pack.features.slice(0, 5).map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
        {pack.features.length > 5 && (
          <>
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                {pack.features.slice(5).map((feature, i) => (
                  <li
                    key={i + 5}
                    className="flex items-start gap-2 text-sm mb-2"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {isExpanded ? "Voir moins" : "Voir tout"}
            </button>
          </>
        )}
      </ul>

      {pack.limits && (
        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          {pack.limits}
        </div>
      )}
    </div>
  );
};

export default Index;
