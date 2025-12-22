import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { PricingSummary } from "@/components/proposal/PricingSummary";
import { ShareActions } from "@/components/proposal/ShareActions";
import { ProposalData, ProposalRecord, defaultProposalData } from "@/types/proposal";
import { useToast } from "@/hooks/use-toast";
import { generateToken } from "@/lib/tokens";
import { computeValidUntil, upsertProposal } from "@/lib/proposalService";
import { downloadProposalPdf } from "@/lib/pdf";

const NewProposal = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [showPreview, setShowPreview] = useState(false);
  const [{ token, editToken }] = useState(() => {
    const token = generateToken(12);
    const storageKey = `qop_edit_token_${token}`;
    const existing = localStorage.getItem(storageKey);
    const editToken = existing ?? generateToken(24);
    if (!existing) localStorage.setItem(storageKey, editToken);
    return { token, editToken };
  });
  const [validUntil] = useState(() => computeValidUntil(14));
  const [record, setRecord] = useState<ProposalRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleChange = (updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleDownloadPDF = async () => {
    if (!record) {
      toast({
        title: "Sauvegarde en cours",
        description: "Attendez une seconde que la proposition soit enregistrée.",
      });
      return;
    }
    await downloadProposalPdf(record);
  };

  const isValid =
    data.prospectName &&
    data.prospectCompany &&
    data.packId &&
    data.ownerName &&
    data.ownerEmail;

  // Auto-save (debounced) to Supabase so the public link works everywhere.
  useEffect(() => {
    if (!isValid) return;

    const timeout = window.setTimeout(async () => {
      try {
        setSaving(true);
        const saved = await upsertProposal({
          token,
          editToken,
          data,
          validUntil,
        });
        setRecord(saved);
        // local fallback + quick re-open
        localStorage.setItem(`proposal_${token}`, JSON.stringify(data));
      } catch (e: any) {
        console.error(e);
        toast({
          title: "Erreur de sauvegarde",
          description: e?.message ?? "Impossible d'enregistrer la proposition.",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [data, editToken, isValid, toast, token, validUntil]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
            <h1 className="text-lg font-semibold text-foreground">
              Nouvelle proposition
            </h1>
          </div>
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
      </header>

      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <ProposalForm data={data} onChange={handleChange} />

            {/* Actions */}
            {isValid && (
              <div className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Partager la proposition
                </h3>
                <ShareActions
                  data={data}
                  token={token}
                  record={record}
                  saving={saving}
                  onDownloadPDF={handleDownloadPDF}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
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

        {/* Preview Modal/Section */}
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
                  meta={{
                    status: record?.status ?? "draft",
                    version: record?.version ?? 1,
                    validUntil,
                    acceptedAt: record?.acceptedAt ?? null,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Print styles */}
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

export default NewProposal;
