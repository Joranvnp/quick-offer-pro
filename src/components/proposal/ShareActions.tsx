import { useState } from "react";
import { Copy, Download, MessageCircle, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalData, ProposalRecord } from "@/types/proposal";
import { getPackById } from "@/data/packs";
import { calculatePricing, calculateDeliveryDate } from "@/lib/pricing";
import { generateMessages, MessageTemplate } from "@/lib/messageTemplates";
import { useToast } from "@/hooks/use-toast";
import { updateStoredProposal } from "@/lib/qopStorage";
import {
  isSupabaseConfigured,
  remoteMarkSent,
  remoteUpsertProposal,
} from "@/lib/qopRemote";
import { toYmd } from "@/lib/date";

interface ShareActionsProps {
  data: ProposalData;
  token: string;
  editToken: string;
  validUntil: string; // YYYY-MM-DD
  onDownloadPDF: () => void;
}

export const ShareActions = ({
  data,
  token,
  editToken,
  validUntil,
  onDownloadPDF,
}: ShareActionsProps) => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pack = getPackById(data.packId);
  const pricing = calculatePricing(
    data.packId,
    data.selectedOptions,
    data.depositPercent
  );
  const deliveryDate = calculateDeliveryDate(data.packId);
  const validUntilDate = new Date(validUntil);

  const proposalUrl = `${window.location.origin}/p/${token}`;

  const canShare = !!record && !saving;

  const messages = generateMessages({
    prospectName: data.prospectName || "Client",
    prospectCompany: data.prospectCompany || "Votre entreprise",
    packName: pack?.name || "Pro",
    totalPrice: pricing.totalPrice,
    depositAmount: pricing.depositAmount,
    deliveryDate,
    validUntil: validUntilDate,
    proposalUrl,
    ownerName: data.ownerName || "Votre conseiller",
    ownerPhone: data.ownerPhone || "",
    ownerEmail: data.ownerEmail || "",
    paymentLink: data.paymentLink || undefined,
  });

  const syncRemoteAndMarkSent = async () => {
    // Always mark locally.
    updateStoredProposal(token, { status: "sent" });

    if (!isSupabaseConfigured()) return;

    // Make sure the latest content is saved remotely before sharing.
    await remoteUpsertProposal({
      token,
      editToken,
      proposal: data,
      packId: data.packId,
      selectedOptions: data.selectedOptions,
      totalPrice: pricing.totalPrice,
      depositPercent: data.depositPercent,
      depositAmount: pricing.depositAmount,
      validUntil: toYmd(new Date(validUntil)),
    });
    await remoteMarkSent(token);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    // Consider the proposal "sent" once we copy a message.
    try {
      await markProposalSent(token);
    } catch (e) {
      // non-blocking
      console.warn(e);
    }
    setCopiedId(id);
    syncRemoteAndMarkSent().catch(() => {
      // ignore; user can still share
    });
    toast({
      title: "Copié !",
      description: "Le message a été copié dans le presse-papier.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(proposalUrl);
    syncRemoteAndMarkSent().catch(() => {
      // ignore; user can still share
    });
    toast({
      title: "Lien copié !",
      description: "Le lien de la proposition a été copié.",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={copyLink}
          variant="outline"
          className="gap-2"
          disabled={!canShare}
        >
          <Copy className="h-4 w-4" />
          Copier le lien
        </Button>

        <Button
          onClick={onDownloadPDF}
          variant="outline"
          className="gap-2"
          disabled={!canShare}
        >
          <Download className="h-4 w-4" />
          Télécharger PDF
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!canShare}>
              <MessageCircle className="h-4 w-4" />
              Messages prêts
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Messages à envoyer au prospect</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="whatsapp" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="whatsapp" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="sms" className="gap-2">
                  SMS
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              {["whatsapp", "sms", "email"].map((type) => (
                <TabsContent key={type} value={type} className="mt-4 space-y-4">
                  {messages
                    .filter((m) => m.type === type)
                    .map((message) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        isCopied={copiedId === message.id}
                        onCopy={() =>
                          copyToClipboard(message.content, message.id)
                        }
                      />
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-xs text-muted-foreground">
        {saving
          ? "Sauvegarde en cours…"
          : record
          ? "Sauvegardé"
          : "Sauvegarde automatique dès que les champs obligatoires sont remplis."}
        {record?.status === "accepted"
          ? " • ✅ Acceptée"
          : record?.status === "sent"
          ? " • Envoyée"
          : ""}
      </div>
    </div>
  );
};

interface MessageCardProps {
  message: MessageTemplate;
  isCopied: boolean;
  onCopy: () => void;
}

const MessageCard = ({ message, isCopied, onCopy }: MessageCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-foreground">{message.name}</h4>
        <Button size="sm" variant="ghost" onClick={onCopy} className="gap-2">
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-accent" />
              Copié
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier
            </>
          )}
        </Button>
      </div>
      {message.subject && (
        <p className="mb-2 text-sm text-muted-foreground">
          <strong>Objet:</strong> {message.subject}
        </p>
      )}
      <pre className="whitespace-pre-wrap rounded-md bg-secondary p-3 text-sm text-foreground">
        {message.content}
      </pre>
    </div>
  );
};
