import { getPackById } from "@/data/packs";
import { getOptionById } from "@/data/options";

export interface PricingDetails {
  packPrice: number;
  optionsPrice: number;
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
}

export const calculatePricing = (
  packId: string,
  selectedOptionIds: string[],
  depositPercent: number = 30
): PricingDetails => {
  const pack = getPackById(packId);
  const packPrice = pack?.basePrice || 0;

  const optionsPrice = selectedOptionIds.reduce((total, optionId) => {
    const option = getOptionById(optionId);
    return total + (option?.price || 0);
  }, 0);

  const totalPrice = packPrice + optionsPrice;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);
  const remainingAmount = totalPrice - depositAmount;

  return {
    packPrice,
    optionsPrice,
    totalPrice,
    depositAmount,
    remainingAmount,
  };
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDeliveryDate = (
  packId: string,
  startDate: Date = new Date()
): Date => {
  const pack = getPackById(packId);
  const days = pack?.defaultTimelineDays || 7;
  const deliveryDate = new Date(startDate);
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
