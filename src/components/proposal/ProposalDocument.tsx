import { Check, Phone, Mail, Globe, Shield } from "lucide-react";
import { ProposalData } from "@/types/proposal";
import { getPackById } from "@/data/packs";
import { getOptionById } from "@/data/options";
import { getProblemById, getGoalById } from "@/data/problems";
import {
  calculatePricing,
  formatPrice,
  calculateDeliveryDate,
  formatDate,
} from "@/lib/pricing";
import { Timeline } from "./Timeline";

interface ProposalDocumentProps {
  data: ProposalData;
  token?: string;
  validUntil?: Date;
}

export const ProposalDocument = ({
  data,
  token,
  validUntil,
}: ProposalDocumentProps) => {
  const pack = getPackById(data.packId);
  const problem = getProblemById(data.prospectProblem);
  const goal = getGoalById(data.prospectGoal);
  const pricing = calculatePricing(
    data.packId,
    data.selectedOptions,
    data.depositPercent
  );
  const deliveryDate = calculateDeliveryDate(data.packId);

  const toneTexts = {
    neutral: {
      intro: "Nous avons le plaisir de vous présenter notre proposition.",
      guarantee: "Nous nous engageons à votre satisfaction.",
    },
    confident: {
      intro: "Voici la solution parfaite pour développer votre activité.",
      guarantee: "Votre succès est notre priorité absolue.",
    },
    simple: {
      intro: "Voici ce qu'on vous propose, simplement.",
      guarantee: "On est là pour vous, avant et après.",
    },
  };

  const texts = toneTexts[data.tone];

  if (!pack) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-card p-8 shadow-elevated print:border-0 print:shadow-none">
      {/* Header */}
      <header className="flex items-start justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Proposition pour {data.prospectCompany || "votre entreprise"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {formatDate(new Date())}
            {token && (
              <span className="ml-2">• Réf: {token.toUpperCase()}</span>
            )}
            {validUntil && (
              <span className="ml-2">
                • Valable jusqu'au {formatDate(validUntil)}
              </span>
            )}
          </p>
        </div>
        {data.ownerName && (
          <div className="text-right text-sm">
            <p className="font-medium text-foreground">{data.ownerName}</p>
            {data.ownerWebsite && (
              <p className="text-muted-foreground">{data.ownerWebsite}</p>
            )}
          </div>
        )}
      </header>

      {/* Situation */}
      {(problem || goal) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {problem && (
            <div className="rounded-xl bg-secondary p-5">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                📍 Votre situation
              </p>
              <p className="text-foreground">"{problem.label}"</p>
            </div>
          )}
          {goal && (
            <div className="rounded-xl bg-secondary p-5">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                🎯 Votre objectif
              </p>
              <p className="text-foreground">"{goal.label}"</p>
            </div>
          )}
        </section>
      )}

      {/* Intro */}
      <p className="text-center text-lg text-muted-foreground">{texts.intro}</p>

      {/* What you get */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          ✅ Ce que vous obtenez
        </h2>
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Pack {pack.name}
            </h3>
            <span className="text-lg font-bold text-primary">
              {formatPrice(pack.basePrice)}
            </span>
          </div>
          <p className="mb-4 text-muted-foreground">{pack.description}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pack.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          {data.selectedOptions.length > 0 && (
            <>
              <div className="my-4 border-t border-border" />
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Options incluses :
              </p>
              <ul className="space-y-2">
                {data.selectedOptions.map((optionId) => {
                  const option = getOptionById(optionId);
                  if (!option) return null;
                  return (
                    <li
                      key={optionId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {option.name}
                      </span>
                      <span className="text-muted-foreground">
                        +{formatPrice(option.price)}
                        {option.isMonthly && " / mois"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          📅 Planning
        </h2>
        <Timeline packId={data.packId} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Livraison estimée le <strong>{formatDate(deliveryDate)}</strong>
        </p>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          💰 Investissement
        </h2>
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(pricing.totalPrice)}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2 rounded-lg bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Acompte à la commande ({data.depositPercent}%)
              </p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(pricing.depositAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Solde à livraison</p>
              <p className="text-lg font-semibold text-foreground">
                {formatPrice(pricing.remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          🛡️ Garanties
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Shield, text: "Satisfaction garantie" },
            { icon: Phone, text: "Support 30 jours inclus" },
            { icon: Globe, text: "Propriétaire de votre site" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-secondary p-4"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {item.text}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {texts.guarantee}
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-secondary p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          ➡️ Prochaine étape
        </h2>
        <p className="mb-4 text-muted-foreground">
          Validez votre accord directement via le bouton "Accepter", ou
          contactez-moi pour en discuter.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${data.ownerEmail}?subject=Proposition acceptée - ${data.prospectCompany}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            Me contacter
          </a>
          {data.ownerPhone && (
            <a
              href={`tel:${data.ownerPhone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-medium text-foreground transition-all hover:bg-secondary"
            >
              <Phone className="h-4 w-4" />
              {data.ownerPhone}
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{data.ownerName}</p>
        <p>
          {data.ownerPhone && <span>{data.ownerPhone}</span>}
          {data.ownerPhone && data.ownerEmail && <span> • </span>}
          {data.ownerEmail && <span>{data.ownerEmail}</span>}
        </p>
        {data.ownerSiret && <p className="mt-1">SIRET: {data.ownerSiret}</p>}
        <p className="mt-1">TVA non applicable, art. 293 B du CGI</p>
        <p className="mt-3 text-xs">
          Ce document est une proposition commerciale simplifiée, non
          contractuelle.
        </p>
      </footer>
    </div>
  );
};
