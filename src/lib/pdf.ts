import { ProposalRecord } from "@/types/proposal";
import { getPackById } from "@/data/packs";
import { getOptionById } from "@/data/options";
import { getGoalById, getProblemById } from "@/data/problems";
import { calculateDeliveryDate, calculatePricing, formatDate, formatPrice } from "./pricing";

let _pdfLibPromise: Promise<typeof import("pdf-lib")> | null = null;

async function getPdfLib() {
  if (!_pdfLibPromise) {
    _pdfLibPromise = import("pdf-lib");
  }
  return _pdfLibPromise;
}

type TextOptions = {
  size?: number;
  lineHeight?: number;
  maxWidth?: number;
};

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function buildProposalPdf(record: ProposalRecord): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await getPdfLib();
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 portrait

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  let y = 841.89 - margin;

  const drawHeading = (t: string) => {
    page.drawText(t, { x: margin, y, size: 16, font: fontBold });
    y -= 24;
  };

  const drawSub = (t: string) => {
    page.drawText(t, { x: margin, y, size: 11, font, color: rgb(0.35, 0.35, 0.35) });
    y -= 16;
  };

  const drawTextBlock = (t: string, opts: TextOptions = {}) => {
    const size = opts.size ?? 11;
    const lh = opts.lineHeight ?? 14;
    const max = opts.maxWidth ?? 80;
    const lines = wrapText(t, max);
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size, font });
      y -= lh;
    }
  };

  const drawBulletList = (items: string[]) => {
    for (const item of items) {
      const lines = wrapText(item, 78);
      page.drawText("•", { x: margin, y, size: 11, font });
      page.drawText(lines[0] ?? "", { x: margin + 14, y, size: 11, font });
      y -= 14;
      for (let i = 1; i < lines.length; i++) {
        page.drawText(lines[i], { x: margin + 14, y, size: 11, font });
        y -= 14;
      }
    }
  };

  // Header
  page.drawText(`Proposition commerciale — ${record.data.prospectCompany || "Votre entreprise"}`, {
    x: margin,
    y,
    size: 18,
    font: fontBold,
  });
  y -= 22;
  drawSub(`${formatDate(new Date())}  •  Réf: ${record.token.toUpperCase()}  •  Version ${record.version}`);
  drawSub(`Valable jusqu'au ${record.validUntil.split("-").reverse().join("/")}`);
  y -= 6;

  // Situation
  const problem = getProblemById(record.data.prospectProblem)?.label;
  const goal = getGoalById(record.data.prospectGoal)?.label;
  if (problem || goal) {
    drawHeading("Contexte");
    if (problem) drawTextBlock(`Situation : ${problem}`);
    if (goal) drawTextBlock(`Objectif : ${goal}`);
    y -= 6;
  }

  // Offer
  const pack = getPackById(record.data.packId);
  if (pack) {
    drawHeading("Offre");
    page.drawText(`Pack ${pack.name}`, { x: margin, y, size: 12, font: fontBold });
    y -= 16;
    drawTextBlock(pack.description);
    y -= 4;
    drawBulletList(pack.features);
    y -= 8;

    if (record.data.selectedOptions.length) {
      page.drawText("Options :", { x: margin, y, size: 12, font: fontBold });
      y -= 16;
      const opts = record.data.selectedOptions
        .map((id) => {
          const o = getOptionById(id);
          return o ? `${o.name} (+${formatPrice(o.price)})` : null;
        })
        .filter(Boolean) as string[];
      drawBulletList(opts);
      y -= 8;
    }
  }

  // Planning
  drawHeading("Planning");
  const delivery = calculateDeliveryDate(record.data.packId);
  drawTextBlock("1) Brief (30 min) + récupération contenus");
  drawTextBlock("2) Conception + maquette\n3) Développement + mise en ligne");
  y -= 4;
  drawTextBlock(`Livraison estimée : ${formatDate(delivery)}`);
  y -= 10;

  // Pricing
  drawHeading("Prix");
  // Recompute locally to avoid trusting stored derived values.
  const calc = calculatePricing(record.data.packId, record.data.selectedOptions, record.data.depositPercent);

  page.drawText(`Total HT : ${formatPrice(calc.totalPrice)}`, { x: margin, y, size: 12, font: fontBold });
  y -= 18;
  drawTextBlock(`Acompte (${record.data.depositPercent}%) : ${formatPrice(calc.depositAmount)}`);
  drawTextBlock(`Solde à livraison : ${formatPrice(calc.remainingAmount)}`);
  y -= 10;

  // Next step
  drawHeading("Prochaine étape");
  drawTextBlock("Si la proposition vous convient, vous pouvez la valider en cliquant sur \"Accepter\" dans la page web associée, ou en répondant par message.");
  y -= 8;

  // Footer
  const footerY = 60;
  page.drawText(record.data.ownerName || "", { x: margin, y: footerY, size: 11, font: fontBold });
  page.drawText(
    [record.data.ownerPhone, record.data.ownerEmail].filter(Boolean).join("  •  "),
    { x: margin, y: footerY - 14, size: 10, font, color: rgb(0.35, 0.35, 0.35) }
  );
  if (record.data.ownerSiret) {
    page.drawText(`SIRET : ${record.data.ownerSiret}`, {
      x: margin,
      y: footerY - 28,
      size: 9,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  }
  page.drawText(
    "Ce document est une proposition commerciale simplifiée, non contractuelle. Un devis/facture final(e) sera fourni(e) avant démarrage.",
    {
      x: margin,
      y: 28,
      size: 8,
      font,
      color: rgb(0.35, 0.35, 0.35),
    }
  );

  return doc.save();
}

export async function downloadProposalPdf(record: ProposalRecord): Promise<void> {
  const bytes = await buildProposalPdf(record);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const company = (record.data.prospectCompany || "proposition").replace(/[^a-z0-9_-]+/gi, "-");
  a.download = `proposition-${company}-${record.token}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
