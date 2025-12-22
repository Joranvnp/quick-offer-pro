import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Pencil, RefreshCw, Search, Trash2, CopyPlus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { listStoredProposals, deleteStoredProposal, saveStoredProposal, updateStoredProposal } from "@/lib/qopStorage";
import { generateEditToken, generateToken } from "@/types/proposal";
import { isSupabaseConfigured, remotePublicGet } from "@/lib/qopRemote";
import { useToast } from "@/hooks/use-toast";

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

const statusVariant = (s: string) => {
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

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const Dashboard = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(() => listStoredProposals());

  useEffect(() => {
    setItems(listStoredProposals());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const company = p.data?.prospectCompany?.toLowerCase() ?? "";
      const name = p.data?.prospectName?.toLowerCase() ?? "";
      const token = p.token.toLowerCase();
      return company.includes(q) || name.includes(q) || token.includes(q);
    });
  }, [items, query]);

  const refreshStatuses = async () => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Supabase non configuré",
        description: "Ajoute VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY dans ton .env.local.",
        variant: "destructive",
      });
      return;
    }

    const tokens = items.map((i) => i.token);
    let updated = 0;

    await Promise.all(
      tokens.map(async (token) => {
        try {
          const row = await remotePublicGet(token);
          if (!row) return;
          updateStoredProposal(token, { status: (row.status as any) || "sent" });
          updated++;
        } catch {
          // ignore (proposal may not exist remotely yet)
        }
      })
    );

    setItems(listStoredProposals());

    toast({
      title: "Statuts actualisés",
      description: `${updated} proposition(s) mises à jour.`,
    });
  };

  const duplicate = (token: string) => {
    const cur = items.find((i) => i.token === token);
    if (!cur) return;

    const nextToken = generateToken();
    const nextEdit = generateEditToken();
    saveStoredProposal({
      ...cur,
      token: nextToken,
      editToken: nextEdit,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setItems(listStoredProposals());
    toast({ title: "Dupliquée", description: "Une nouvelle proposition a été créée." });
  };

  const remove = (token: string) => {
    deleteStoredProposal(token);
    setItems(listStoredProposals());
    toast({ title: "Supprimée", description: "La proposition a été retirée de ce navigateur." });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Accueil
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Mes propositions</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refreshStatuses} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button asChild size="sm">
              <Link to="/proposal/new">Nouvelle</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (entreprise, nom, token)..."
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} / {items.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Prospect</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>MAJ</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.token}>
                  <TableCell className="font-medium">
                    {p.data?.prospectCompany || <span className="text-muted-foreground">—</span>}
                    <div className="text-xs text-muted-foreground">/{p.token}</div>
                  </TableCell>
                  <TableCell>{p.data?.prospectName || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(p.status) as any}>{statusLabel(p.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmt(p.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline" className="gap-2">
                        <a href={`/p/${p.token}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Ouvrir
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="gap-2">
                        <Link to={`/proposal/${p.token}/edit`}>
                          <Pencil className="h-4 w-4" />
                          Éditer
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => duplicate(p.token)}>
                        <CopyPlus className="h-4 w-4" />
                        Dupliquer
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cette proposition ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cela la retire uniquement de ce navigateur. (Le lien public peut encore exister si déjà
                              enregistré dans Supabase.)
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(p.token)}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Aucune proposition. Crée ta première proposition.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            <strong>Note :</strong> Sans Supabase configuré, tu peux créer et partager en local, mais{" "}
            <strong>tu ne verras pas</strong> les statuts “vue/acceptée/refusée”.
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
