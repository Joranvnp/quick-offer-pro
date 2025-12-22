import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Download, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { acceptProposal, getProposalByToken } from "@/lib/proposalService";
import { downloadProposalPdf } from "@/lib/pdf";
import { useState } from "react";

const ViewProposal = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: record, isLoading, error } = useQuery({
    queryKey: ["proposal", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await getProposalByToken(token!);
      return res;
    },
    retry: 1,
  });

  const [acceptName, setAcceptName] = useState("");
  const [acceptEmail, setAcceptEmail] = useState("");
  const [accepting, setAccepting] = useState(false);

  const handleDownloadPdf = async () => {
    if (!record) return;
    await downloadProposalPdf(record);
  };

  const handleAccept = async () => {
    if (!token) return;
    try {
      setAccepting(true);
      await acceptProposal(token, {
        name: acceptName.trim() || undefined,
        email: acceptEmail.trim() || undefined,
      });
      await qc.invalidateQueries({ queryKey: ["proposal", token] });
      toast({ title: "Merci !", description: "Proposition acceptée." });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Erreur",
        description: e?.message ?? "Impossible de valider la proposition.",
        variant: "destructive",
      });
    } finally {
      setAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Accueil
            </Link>
          </div>
        </header>
        <main className="container py-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-card">
            <p className="text-muted-foreground">Chargement de la proposition…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <main className="container py-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-card">
            <h1 className="text-xl font-semibold text-foreground">Erreur</h1>
            <p className="mt-2 text-muted-foreground">Impossible de charger la proposition.</p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/">Retour accueil</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <main className="container py-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-card">
            <h1 className="text-xl font-semibold text-foreground">Proposition introuvable</h1>
            <p className="mt-2 text-muted-foreground">Le lien est peut-être incorrect ou la proposition a été supprimée.</p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/">Retour accueil</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const validUntil = record.validUntil;
  const isExpired = new Date(validUntil + "T23:59:59") < new Date();

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
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button size="sm" asChild className="gap-2">
              <a href={`mailto:${record.data.ownerEmail}`}>
                <Mail className="h-4 w-4" />
                Contacter
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Document */}
      <main className="container py-8 md:py-12">
        <ProposalDocument
          data={record.data}
          token={record.token}
          meta={{
            status: record.status,
            version: record.version,
            validUntil: record.validUntil,
            acceptedAt: record.acceptedAt,
          }}
        />

        {/* CTA */}
        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-6 text-center shadow-card no-print">
          {isExpired ? (
            <div>
              <h3 className="text-lg font-semibold text-foreground">Proposition expirée</h3>
              <p className="mt-2 text-muted-foreground">
                Cette proposition était valable jusqu'au <strong>{validUntil.split("-").reverse().join("/")}</strong>.
                Si vous souhaitez la renouveler, contactez-moi.
              </p>
            </div>
          ) : record.status === "accepted" ? (
            <div>
              <h3 className="text-lg font-semibold text-foreground">✅ Proposition acceptée</h3>
              <p className="mt-2 text-muted-foreground">
                Merci ! Je vous recontacte pour lancer le brief et confirmer le planning.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-foreground">Valider la proposition</h3>
              <p className="mt-2 text-muted-foreground">Si cela vous convient, cliquez ci-dessous pour l'accepter.</p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Accepter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Confirmer l'acceptation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Optionnel : laissez votre nom et email pour que je puisse vous recontacter plus facilement.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="acceptName">Nom</Label>
                        <Input id="acceptName" value={acceptName} onChange={(e) => setAcceptName(e.target.value)} placeholder="Jean Dupont" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acceptEmail">Email</Label>
                        <Input id="acceptEmail" type="email" value={acceptEmail} onChange={(e) => setAcceptEmail(e.target.value)} placeholder="jean@entreprise.fr" />
                      </div>
                      <Button onClick={handleAccept} disabled={accepting} className="w-full">
                        {accepting ? "Validation…" : "Confirmer"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" asChild className="gap-2">
                  <a href={`mailto:${record.data.ownerEmail}`}>
                    <Mail className="h-4 w-4" />
                    Poser une question
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Contact quick links */}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="gap-2">
              <a href={`mailto:${record.data.ownerEmail}`}>
                <Mail className="h-4 w-4" />
                {record.data.ownerEmail}
              </a>
            </Button>
            {record.data.ownerPhone ? (
              <Button variant="outline" asChild className="gap-2">
                <a href={`tel:${record.data.ownerPhone.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4" />
                  {record.data.ownerPhone}
                </a>
              </Button>
            ) : null}
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
