import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  LayoutDashboard,
  Pencil,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { useToast } from "@/hooks/use-toast";
import { getStoredProposal, updateStoredProposal } from "@/lib/qopStorage";
import {
  isSupabaseConfigured,
  remoteAccept,
  remoteDecline,
  remoteMarkViewed,
  remotePublicGet,
  QopPublicProposalRow,
} from "@/lib/qopRemote";
import { ProposalData } from "@/types/proposal";

const statusLabel = (s: string) => {
  switch (s) {
    case "draft":
      return "Brouillon";
    case "sent":
      return "Envoyée";
    case "viewed":
      return "Vue";
    case "accepted":
      return "Acceptée";
    case "declined":
      return "Refusée";
    default:
      return s;
  }
};

const statusVariant = (s: string): BadgeProps["variant"] => {
  switch (s) {
    case "accepted":
      return "default";
    case "declined":
      return "destructive";
    case "viewed":
      return "secondary";
    case "sent":
      return "outline";
    default:
      return "outline";
  }
};

const ViewProposal = () => {
  const { toast } = useToast();
  const { token = "" } = useParams<{ token: string }>();
  const stored = token ? getStoredProposal(token) : null;
  const documentRef = useRef<HTMLDivElement>(null);

  const [acceptName, setAcceptName] = useState("");
  const [acceptEmail, setAcceptEmail] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [viewMarked, setViewMarked] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["proposal", token],
    enabled: Boolean(token),
    queryFn: async () => {
      if (isSupabaseConfigured()) {
        return await remotePublicGet(token);
      }
      // Local fallback (owner-only)
      if (stored) {
        return {
          token: stored.token,
          proposal: stored.data,
          pack_id: stored.data.packId,
          selected_options: stored.data.selectedOptions,
          total_price: 0,
          deposit_percent: stored.data.depositPercent,
          deposit_amount: 0,
          status: stored.status,
          version: 1,
          valid_until: stored.validUntil,
          sent_at: null,
          accepted_at: null,
          accepted_meta: null,
          created_at: stored.createdAt,
          updated_at: stored.updatedAt,
        } as QopPublicProposalRow;
      }
      return null;
    },
  });

  const proposalData = useMemo(() => {
    return (
      (data?.proposal as ProposalData | undefined) ?? stored?.data ?? undefined
    );
  }, [data, stored]);

  const status =
    (data?.status as string | undefined) ?? stored?.status ?? "draft";
  const validUntil = data?.valid_until ?? stored?.validUntil;
  const expired = validUntil
    ? new Date(validUntil) < new Date(new Date().toDateString())
    : false;

  useEffect(() => {
    if (!token || viewMarked) return;
    if (!isSupabaseConfigured()) return;
    if (!data) return;
    if (data.status === "accepted" || data.status === "declined") return;

    remoteMarkViewed(token)
      .then(() => {
        setViewMarked(true);
        // Keep local badge updated on owner device
        if (stored) updateStoredProposal(token, { status: "viewed" });
      })
      .catch(() => {});
  }, [data, stored, token, viewMarked]);

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

  const accept = async () => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Supabase non configuré",
        description: "Impossible d'enregistrer l'acceptation sans Supabase.",
        variant: "destructive",
      });
      return;
    }
    await remoteAccept({
      token,
      name: acceptName || undefined,
      email: acceptEmail || undefined,
      clientDate: new Date().toISOString(),
    });
    toast({
      title: "Merci !",
      description: "Votre acceptation a été enregistrée.",
    });
    if (stored) updateStoredProposal(token, { status: "accepted" });
    await refetch();
  };

  const decline = async () => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Supabase non configuré",
        description: "Impossible d'enregistrer le refus sans Supabase.",
        variant: "destructive",
      });
      return;
    }
    await remoteDecline({ token, reason: declineReason || undefined });
    toast({
      title: "C'est noté",
      description: "Votre réponse a été enregistrée.",
    });
    if (stored) updateStoredProposal(token, { status: "declined" });
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container flex h-16 items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </div>
        </header>
        <main className="container py-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement de la proposition...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container flex h-16 items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </div>
        </header>
        <main className="container py-10">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-medium">Erreur lors du chargement.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {String((error as Error)?.message ?? error)}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container flex h-16 items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
            {stored && (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Mes propositions
                </Link>
              </Button>
            )}
          </div>
        </header>
        <main className="container py-10">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-medium">Proposition introuvable.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Si tu es le créateur, vérifie que la proposition a bien été
              enregistrée dans Supabase (ou ouvre-la depuis ton dashboard).
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
            {expired && <Badge variant="destructive">Expirée</Badge>}
          </div>

          {stored && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to={`/proposal/${token}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span className="hidden sm:inline">Éditer</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div ref={documentRef}>
              <ProposalDocument
                data={proposalData}
                token={token}
                validUntil={validUntil ? new Date(validUntil) : undefined}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold">Réponse</h2>

              <div className="mt-5 flex flex-col gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="gap-2"
                      disabled={
                        status === "accepted" ||
                        status === "declined" ||
                        expired
                      }
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Accepter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer l'acceptation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Nom (optionnel)
                        </label>
                        <Input
                          value={acceptName}
                          onChange={(e) => setAcceptName(e.target.value)}
                          placeholder="Nom"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Email (optionnel)
                        </label>
                        <Input
                          value={acceptEmail}
                          onChange={(e) => setAcceptEmail(e.target.value)}
                          placeholder="Email"
                        />
                      </div>
                      {proposalData?.paymentLink && (
                        <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                          Lien de paiement (acompte) :{" "}
                          <a
                            className="underline"
                            href={proposalData.paymentLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {proposalData.paymentLink}
                          </a>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={accept} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Valider
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      disabled={
                        status === "accepted" ||
                        status === "declined" ||
                        expired
                      }
                    >
                      <XCircle className="h-4 w-4" />
                      Refuser
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Refuser la proposition</DialogTitle>
                    </DialogHeader>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Raison (optionnel)
                      </label>
                      <Textarea
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="Ex: budget, timing, autre..."
                        className="mt-2"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={decline}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Confirmer le refus
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {!isSupabaseConfigured() && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                    Supabase n'est pas configuré sur ce déploiement : les
                    boutons accept/refuser ne peuvent pas enregistrer la
                    réponse.
                  </div>
                )}

                {expired && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                    Cette proposition est expirée.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

export default ViewProposal;
