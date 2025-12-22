import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { ProposalData, defaultProposalData } from "@/types/proposal";
import { useToast } from "@/hooks/use-toast";

// For demo purposes, we'll use localStorage to store proposals
// In production, this would come from Supabase
const getProposalFromStorage = (token: string): ProposalData | null => {
  try {
    const stored = localStorage.getItem(`proposal_${token}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading proposal:", e);
  }
  return null;
};

const ViewProposal = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();

  // Try to get stored proposal, otherwise use demo data
  const storedProposal = token ? getProposalFromStorage(token) : null;

  const demoData: ProposalData = storedProposal || {
    ...defaultProposalData,
    prospectName: "Jean Dupont",
    prospectCompany: "Dupont Plomberie",
    prospectSector: "Plomberie",
    prospectCity: "Lyon",
    prospectProblem: "no-site",
    prospectGoal: "more-calls",
    packId: "pro",
    selectedOptions: ["logo", "copywriting"],
    depositPercent: 30,
    ownerName: "Marie Martin",
    ownerPhone: "06 12 34 56 78",
    ownerEmail: "marie@webdesign.fr",
    ownerWebsite: "www.webdesign.fr",
    ownerSiret: "123 456 789 00012",
    tone: "neutral",
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Impression lancée",
      description: "Sélectionnez 'Enregistrer en PDF' pour télécharger.",
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur no-print">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button size="sm" asChild className="gap-2">
              <a href={`mailto:${demoData.ownerEmail}`}>
                <Mail className="h-4 w-4" />
                Contacter
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Document */}
      <main className="container py-8 md:py-12">
        <ProposalDocument data={demoData} token={token} />

        {/* Contact Card */}
        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-6 text-center shadow-card no-print">
          <h3 className="text-lg font-semibold text-foreground">
            Des questions ?
          </h3>
          <p className="mt-2 text-muted-foreground">
            N'hésitez pas à me contacter pour en discuter.
          </p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="gap-2">
              <a href={`mailto:${demoData.ownerEmail}`}>
                <Mail className="h-4 w-4" />
                {demoData.ownerEmail}
              </a>
            </Button>
            {demoData.ownerPhone && (
              <Button variant="outline" asChild className="gap-2">
                <a href={`tel:${demoData.ownerPhone.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4" />
                  {demoData.ownerPhone}
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewProposal;
