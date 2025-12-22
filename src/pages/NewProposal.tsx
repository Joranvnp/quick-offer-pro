import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { PricingSummary } from "@/components/proposal/PricingSummary";
import { ShareActions } from "@/components/proposal/ShareActions";
import { ProposalData, defaultProposalData, generateToken } from "@/types/proposal";
import { useToast } from "@/hooks/use-toast";

const NewProposal = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [showPreview, setShowPreview] = useState(false);
  const [token] = useState(generateToken);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleChange = (updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleDownloadPDF = () => {
    if (documentRef.current) {
      window.print();
    }
    toast({
      title: "Impression lancée",
      description: "Sélectionnez 'Enregistrer en PDF' dans les options d'impression.",
    });
  };

  const isValid =
    data.prospectName &&
    data.prospectCompany &&
    data.packId &&
    data.ownerName &&
    data.ownerEmail;

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
                <ProposalDocument data={data} token={token} />
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
