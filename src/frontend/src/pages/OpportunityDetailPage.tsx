import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  FileText,
  Loader2,
  Lock,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { NavigateFn } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  OpportunityCategory,
  useApplyToOpportunity,
  useGetCallerUserProfile,
  useGetOpportunityById,
} from "../hooks/useQueries";

const categoryLabels: Record<string, string> = {
  [OpportunityCategory.sales]: "Ventas",
  [OpportunityCategory.freelance]: "Freelance",
  [OpportunityCategory.digital]: "Digital",
  [OpportunityCategory.services]: "Servicios",
  [OpportunityCategory.other]: "Otro",
};

interface OpportunityDetailPageProps {
  id: string;
  navigate: NavigateFn;
}

export default function OpportunityDetailPage({
  id,
  navigate,
}: OpportunityDetailPageProps) {
  const { data: opportunity, isLoading, isError } = useGetOpportunityById(id);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutateAsync: apply, isPending } = useApplyToOpportunity();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.applicantName.trim()) e.applicantName = "El nombre es requerido";
    if (!form.applicantEmail.trim())
      e.applicantEmail = "El correo es requerido";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.applicantEmail))
      e.applicantEmail = "Correo inválido";
    if (!form.message.trim()) e.message = "El mensaje es requerido";
    return e;
  };

  const handleOpenDialog = () => {
    setForm({
      applicantName: userProfile?.name ?? "",
      applicantEmail: "",
      message: "",
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    try {
      await apply({
        opportunityId: id,
        applicantName: form.applicantName.trim(),
        applicantEmail: form.applicantEmail.trim(),
        message: form.message.trim(),
      });
      toast.success("¡Postulación enviada exitosamente!");
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al enviar postulación");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="opportunity.loading_state"
        className="container mx-auto px-4 py-12 max-w-3xl"
      >
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-6 w-5/6 mb-10" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !opportunity) {
    return (
      <div
        data-ocid="opportunity.error_state"
        className="container mx-auto px-4 py-24 text-center"
      >
        <p className="text-muted-foreground text-lg mb-4">
          Oportunidad no encontrada.
        </p>
        <Button
          data-ocid="opportunity.secondary_button"
          variant="outline"
          onClick={() => navigate({ path: "/oportunidades" })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          data-ocid="opportunity.secondary_button"
          variant="ghost"
          onClick={() => navigate({ path: "/oportunidades" })}
          className="mb-8 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a oportunidades
        </Button>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-primary/15 text-primary border-primary/30">
              {categoryLabels[opportunity.category] ?? "Otro"}
            </Badge>
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <DollarSign className="w-4 h-4" />
              {opportunity.estimatedAmount}
            </div>
            {!opportunity.isActive && (
              <Badge
                variant="secondary"
                className="bg-destructive/20 text-destructive border-destructive/30"
              >
                Inactiva
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-700 mb-4">
            {opportunity.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {opportunity.description}
          </p>

          {opportunity.requirements && (
            <div className="bg-secondary/50 rounded-xl p-5 mb-8 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-display font-600 text-sm text-primary uppercase tracking-wider">
                  Requisitos
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {opportunity.requirements}
              </p>
            </div>
          )}

          {/* Apply CTA */}
          {opportunity.isActive && (
            <div className="border-t border-border pt-6">
              {isAuthenticated ? (
                <Button
                  data-ocid="opportunity.primary_button"
                  size="lg"
                  onClick={handleOpenDialog}
                  className="gold-gradient text-primary-foreground font-semibold shadow-gold-sm w-full sm:w-auto"
                >
                  <Send className="w-4 h-4 mr-2" /> Postularme ahora
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">
                      Debes iniciar sesión para postularte
                    </span>
                  </div>
                  <Button
                    data-ocid="opportunity.primary_button"
                    size="lg"
                    className="gold-gradient text-primary-foreground font-semibold"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Iniciar sesión para postular
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Apply Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="application.dialog"
          className="sm:max-w-lg border-border bg-card"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Postularme a:{" "}
              <span className="gold-text">{opportunity.title}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Completa el formulario. El administrador revisará tu postulación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="app-name">Tu nombre</Label>
              <Input
                data-ocid="application.input"
                id="app-name"
                value={form.applicantName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, applicantName: e.target.value }))
                }
                className="bg-input border-border"
                placeholder="María García"
              />
              {errors.applicantName && (
                <p
                  data-ocid="application.error_state"
                  className="text-destructive text-xs"
                >
                  {errors.applicantName}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="app-email">Correo electrónico</Label>
              <Input
                data-ocid="application.input"
                id="app-email"
                type="email"
                value={form.applicantEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, applicantEmail: e.target.value }))
                }
                className="bg-input border-border"
                placeholder="maria@ejemplo.com"
              />
              {errors.applicantEmail && (
                <p
                  data-ocid="application.error_state"
                  className="text-destructive text-xs"
                >
                  {errors.applicantEmail}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="app-msg">Mensaje / Experiencia relevante</Label>
              <Textarea
                data-ocid="application.textarea"
                id="app-msg"
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                className="bg-input border-border resize-none"
                placeholder="Cuéntanos por qué eres el candidato ideal..."
              />
              {errors.message && (
                <p
                  data-ocid="application.error_state"
                  className="text-destructive text-xs"
                >
                  {errors.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="application.cancel_button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              data-ocid="application.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
              className="gold-gradient text-primary-foreground font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Enviar postulación
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
