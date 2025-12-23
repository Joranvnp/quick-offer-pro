import { Megaphone, X } from "lucide-react";
import { useState } from "react";

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-center text-sm font-medium text-center pr-8">
        <Megaphone className="w-4 h-4 mr-2 inline-block animate-pulse" />
        <span>
          🎉 Offre de lancement : <span className="font-bold">-15%</span> pour
          les 5 premiers projets (places limitées)
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
