import { Link } from "react-router-dom";
import { FileText, Zap, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            Trois offres, zéro complexité
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Des prix clairs pour des prestations claires.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "490€",
                features: ["Site one-page", "Formulaire contact", "Livraison 5j"],
              },
              {
                name: "Pro",
                price: "890€",
                features: ["5 pages", "SEO local", "Google Business", "Livraison 10j"],
                popular: true,
              },
              {
                name: "Pro+",
                price: "1 290€",
                features: ["Tout Pro", "Blog", "Analytics", "Maintenance 1 mois"],
              },
            ].map((pack, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border-2 p-8 ${
                  pack.popular
                    ? "border-primary bg-primary/5 shadow-elevated"
                    : "border-border bg-card"
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Populaire
                  </span>
                )}
                <h3 className="text-xl font-semibold text-foreground">
                  {pack.name}
                </h3>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {pack.price}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    HT
                  </span>
                </p>
                <ul className="mt-6 space-y-3">
                  {pack.features.map((f, j) => (
                    <li key={j} className="text-muted-foreground">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
              </div>
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
          <p>Mini-Proposition — Créez des propositions commerciales simplement.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
