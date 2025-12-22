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
import { ProposalData } from "@/types/proposal";
import { getPackById } from "@/data/packs";
import { calculatePricing, calculateDeliveryDate } from "@/lib/pricing";
import { generateMessages, MessageTemplate } from "@/lib/messageTemplates";
import { useToast } from "@/hooks/use-toast";

interface ShareActionsProps {
  data: ProposalData;
  token: string;
  onDownloadPDF: () => void;
}

export const ShareActions = ({ data, token, onDownloadPDF }: ShareActionsProps) => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pack = getPackById(data.packId);
  const pricing = calculatePricing(data.packId, data.selectedOptions, data.depositPercent);
  const deliveryDate = calculateDeliveryDate(data.packId);

  const proposalUrl = `${window.location.origin}/p/${token}`;

  const messages = generateMessages({
    prospectName: data.prospectName || "Client",
    prospectCompany: data.prospectCompany || "Votre entreprise",
    packName: pack?.name || "Pro",
    totalPrice: pricing.totalPrice,
    deliveryDate,
    proposalUrl,
    ownerName: data.ownerName || "Votre conseiller",
    ownerPhone: data.ownerPhone || "",
    ownerEmail: data.ownerEmail || "",
  });

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copié !",
      description: "Le message a été copié dans le presse-papier.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(proposalUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien de la proposition a été copié.",
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={copyLink} variant="outline" className="gap-2">
        <Copy className="h-4 w-4" />
        Copier le lien
      </Button>

      <Button onClick={onDownloadPDF} variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Télécharger PDF
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
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
                      onCopy={() => copyToClipboard(message.content, message.id)}
                    />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
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
        <Button
          size="sm"
          variant="ghost"
          onClick={onCopy}
          className="gap-2"
        >
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
