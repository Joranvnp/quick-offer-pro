import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { PricingSummary } from "@/components/proposal/PricingSummary";
import { ShareActions } from "@/components/proposal/ShareActions";
import { ProposalData, defaultProposalData } from "@/types/proposal";
import { useToast } from "@/hooks/use-toast";
import { calculatePricing } from "@/lib/pricing";
import { getPackById } from "@/data/packs";
import { getStoredProposal, updateStoredProposal } from "@/lib/qopStorage";
import { isSupabaseConfigured, remoteUpsertProposal } from "@/lib/qopRemote";

const EditProposal = () => {
  const { toast } = useToast();
  const { token = "" } = useParams<{ token: string }>();
  const stored = token ? getStoredProposal(token) : null;

  const [data, setData] = useState<ProposalData>(
    stored?.data ?? defaultProposalData
  );
  const [showPreview, setShowPreview] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const editToken = stored?.editToken ?? "";
  const validUntil = stored?.validUntil ?? "";

  useEffect(() => {
    if (!stored) return;
    setData(stored.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Auto-save local + remote (debounced)
  useEffect(() => {
    if (!token || !stored) return;

    updateStoredProposal(token, { data });

    const pack = getPackById(data.packId);
    const pricing = calculatePricing(
      data.packId,
      data.selectedOptions,
      data.depositPercent
    );
    const shouldSyncRemote =
      Boolean(pack) &&
      Boolean(data.prospectCompany) &&
      Boolean(data.ownerName) &&
      Boolean(data.ownerEmail);

    if (!isSupabaseConfigured() || !shouldSyncRemote) return;

    const t = window.setTimeout(() => {
      remoteUpsertProposal({
        token,
        editToken,
        proposal: data,
        packId: data.packId,
        selectedOptions: data.selectedOptions,
        totalPrice: pricing.totalPrice,
        depositPercent: data.depositPercent,
        depositAmount: pricing.depositAmount,
        validUntil,
      }).catch(() => {});
    }, 650);

    return () => window.clearTimeout(t);
  }, [data, editToken, stored, token, validUntil]);

  const handleDownloadPDF = () => {
    if (documentRef.current) window.print();
    toast({
      title: "Impression lancée",
      description:
        "Sélectionnez 'Enregistrer en PDF' dans les options d'impression.",
    });
  };

  if (!stored) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container flex h-16 items-center justify-between">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Mes propositions
              </Link>
            </Button>
          </div>
        </header>

        <main className="container py-10">
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6">
            <h1 className="text-xl font-semibold">
              Proposition introuvable sur ce navigateur
            </h1>
            <p className="mt-2 text-muted-foreground">
              Pour éditer, ouvre la proposition depuis{" "}
              <strong>Mes propositions</strong> (dashboard) sur le même
              navigateur qui l'a créée.
            </p>
            <div className="mt-6 flex gap-2">
              <Button asChild>
                <Link to="/dashboard">Aller au dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/p/${token}`}>Voir le lien public</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isValid =
    data.prospectName &&
    data.prospectCompany &&
    data.packId &&
    data.ownerName &&
    data.ownerEmail;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              Éditer la proposition
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a href={`/p/${token}`} target="_blank" rel="noreferrer">
                Ouvrir lien public
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Masquer aperçu
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Voir aperçu
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProposalForm data={data} onChange={handleChange} />

            {isValid && (
              <div className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Partager la proposition
                </h3>
                <ShareActions
                  data={data}
                  token={token}
                  editToken={editToken}
                  validUntil={validUntil}
                  onDownloadPDF={handleDownloadPDF}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <PricingSummary
                packId={data.packId}
                selectedOptions={data.selectedOptions}
                depositPercent={data.depositPercent}
              />

              {!isValid && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Remplissez les champs obligatoires pour partager.
                </p>
              )}
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="fixed inset-0 z-50 overflow-auto bg-background/95 p-4 backdrop-blur md:p-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Aperçu de la proposition
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="gap-2"
                >
                  <EyeOff className="h-4 w-4" />
                  Fermer
                </Button>
              </div>
              <div ref={documentRef}>
                <ProposalDocument
                  data={data}
                  token={token}
                  validUntil={new Date(validUntil)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @media print {
          header, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProposal;
