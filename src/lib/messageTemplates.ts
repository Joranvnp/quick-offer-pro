import { formatPrice, formatDate } from "./pricing";

export interface MessageContext {
  prospectName: string;
  prospectCompany: string;
  packName: string;
  totalPrice: number;
  deliveryDate: Date;
  proposalUrl: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: "whatsapp" | "sms" | "email";
  subject?: string;
  content: string;
}

export const generateMessages = (context: MessageContext): MessageTemplate[] => {
  const { prospectName, prospectCompany, packName, totalPrice, deliveryDate, proposalUrl, ownerName, ownerPhone, ownerEmail } = context;
  const firstName = prospectName.split(" ")[0];
  const priceFormatted = formatPrice(totalPrice);
  const dateFormatted = formatDate(deliveryDate);

  return [
    {
      id: "whatsapp-initial",
      name: "WhatsApp — Premier envoi",
      type: "whatsapp",
      content: `Bonjour ${firstName} 👋

Suite à notre échange, voici votre proposition pour ${prospectCompany} :
👉 ${proposalUrl}

Pack ${packName} à ${priceFormatted} — livraison estimée le ${dateFormatted}.

Dites-moi si vous avez des questions !
${ownerName}`,
    },
    {
      id: "sms-short",
      name: "SMS — Court",
      type: "sms",
      content: `${firstName}, votre proposition est prête : ${proposalUrl} — ${priceFormatted}, livraison ${dateFormatted}. Des questions ? Appelez-moi au ${ownerPhone}`,
    },
    {
      id: "email-formal",
      name: "Email — Formel",
      type: "email",
      subject: `Votre proposition site web — ${prospectCompany}`,
      content: `Bonjour ${firstName},

Merci pour notre échange.

Vous trouverez votre proposition personnalisée ici :
${proposalUrl}

Résumé :
• Pack ${packName} — ${priceFormatted} HT
• Livraison estimée : ${dateFormatted}

N'hésitez pas à me contacter pour toute question.

Cordialement,
${ownerName}
${ownerPhone} | ${ownerEmail}`,
    },
    {
      id: "whatsapp-followup",
      name: "WhatsApp — Relance J+3",
      type: "whatsapp",
      content: `${firstName}, avez-vous pu consulter la proposition ? 👉 ${proposalUrl}

Je reste dispo si vous souhaitez en discuter. Bonne journée !`,
    },
    {
      id: "sms-urgent",
      name: "SMS — Offre limitée",
      type: "sms",
      content: `${firstName}, offre valable 7 jours. Votre site pro à ${priceFormatted} : ${proposalUrl}. On démarre ?`,
    },
  ];
};
