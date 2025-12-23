import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { PricingSummary } from "@/components/proposal/PricingSummary";
import { ShareActions } from "@/components/proposal/ShareActions";
import {
  ProposalData,
  defaultProposalData,
  generateEditToken,
  generateToken,
} from "@/types/proposal";
import { useToast } from "@/hooks/use-toast";
import { addDays, toYmd } from "@/lib/date";
import { calculatePricing } from "@/lib/pricing";
import { getPackById } from "@/data/packs";
import { saveStoredProposal, updateStoredProposal } from "@/lib/qopStorage";
import { isSupabaseConfigured, remoteUpsertProposal } from "@/lib/qopRemote";
import { Banner } from "@/components/layout/Banner";

const NewProposal = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [showPreview, setShowPreview] = useState(false);
  const [token] = useState(() => generateToken());
  const [editToken] = useState(() => generateEditToken());
  const [validUntil] = useState(() => toYmd(addDays(new Date(), 14)));
  const documentRef = useRef<HTMLDivElement>(null);

  const handleChange = (updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Create local draft on first render.
  useEffect(() => {
    saveStoredProposal({
      token,
      editToken,
      data,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validUntil,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save local (and remote if configured) when data changes.
  useEffect(() => {
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
        clientSource: data.clientSource,
        mainAction: data.mainAction,
        prospectGoal: data.prospectGoal,
      }).catch(() => {
        // Keep UX quiet; sharing will surface issues if any.
      });
    }, 650);

    return () => window.clearTimeout(t);
  }, [data, editToken, token, validUntil]);

  const handleDownloadPDF = () => {
    if (documentRef.current) {
      window.print();
    }
    toast({
      title: "Impression lancée",
      description:
        "Sélectionnez 'Enregistrer en PDF' dans les options d'impression.",
    });
  };

  const isValid =
    data.prospectName &&
    data.prospectCompany &&
    data.packId &&
    data.ownerName &&
    data.ownerEmail;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Banner />
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              <span className="hidden sm:inline">Nouvelle proposition</span>
              <span className="sm:hidden">Nouv. prop.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Mes propositions</span>
              </Link>
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
                  <span className="hidden sm:inline">Masquer</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Aperçu</span>
                </>
              )}
            </Button>
          </div>
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
                  editToken={editToken}
                  validUntil={validUntil}
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
                  validUntil={new Date(validUntil)}
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
