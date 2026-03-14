import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { NavigateFn } from "../App";
import {
  ApplicationStatus,
  type Opportunity,
  OpportunityCategory,
  useCreateOpportunity,
  useDeleteOpportunity,
  useGetAllApplications,
  useGetAllOpportunities,
  useIsAdmin,
  useToggleOpportunityStatus,
  useUpdateApplicationStatus,
  useUpdateOpportunity,
} from "../hooks/useQueries";

const categoryLabels: Record<string, string> = {
  [OpportunityCategory.sales]: "Ventas",
  [OpportunityCategory.freelance]: "Freelance",
  [OpportunityCategory.digital]: "Digital",
  [OpportunityCategory.services]: "Servicios",
  [OpportunityCategory.other]: "Otro",
};

const statusConfig = {
  [ApplicationStatus.pending]: {
    label: "Pendiente",
    icon: Clock,
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  [ApplicationStatus.approved]: {
    label: "Aprobada",
    icon: CheckCircle,
    className: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  [ApplicationStatus.rejected]: {
    label: "Rechazada",
    icon: XCircle,
    className: "bg-red-500/20 text-red-300 border-red-500/30",
  },
};

const emptyForm = {
  title: "",
  description: "",
  category: OpportunityCategory.digital as OpportunityCategory,
  estimatedAmount: "",
  requirements: "",
};

export default function AdminPanel(_props: { navigate?: NavigateFn }) {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: opportunities, isLoading: oppsLoading } =
    useGetAllOpportunities();
  const { data: applications, isLoading: appsLoading } =
    useGetAllApplications();

  const createMutation = useCreateOpportunity();
  const updateMutation = useUpdateOpportunity();
  const deleteMutation = useDeleteOpportunity();
  const toggleMutation = useToggleOpportunityStatus();
  const updateStatusMutation = useUpdateApplicationStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "El título es requerido";
    if (!form.description.trim()) e.description = "La descripción es requerida";
    if (!form.estimatedAmount.trim())
      e.estimatedAmount = "El monto estimado es requerido";
    return e;
  };

  const openCreate = () => {
    setEditingOpp(null);
    setForm(emptyForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setForm({
      title: opp.title,
      description: opp.description,
      category: opp.category,
      estimatedAmount: opp.estimatedAmount,
      requirements: opp.requirements,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const e = validateForm();
    if (Object.keys(e).length > 0) {
      setFormErrors(e);
      return;
    }
    try {
      if (editingOpp) {
        await updateMutation.mutateAsync({ id: editingOpp.id, ...form });
        toast.success("Oportunidad actualizada");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Oportunidad creada exitosamente");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Oportunidad eliminada");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar");
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleMutation.mutateAsync({ id, isActive: !current });
      toast.success(`Oportunidad ${!current ? "activada" : "desactivada"}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al cambiar estado");
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ applicationId, status });
      toast.success("Estado actualizado");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al actualizar estado");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (adminLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="container mx-auto px-4 py-20 text-center"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.error_state"
        className="container mx-auto px-4 py-24 text-center"
      >
        <p className="text-2xl font-display font-semibold mb-3">
          Acceso denegado
        </p>
        <p className="text-muted-foreground">
          No tienes permisos de administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="py-12 border-b border-border"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.78 0.18 75 / 0.07), transparent)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="font-display text-3xl font-700">
              Panel <span className="gold-text">Administrador</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gestiona oportunidades y postulaciones.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="oportunidades">
          <TabsList className="bg-secondary mb-8">
            <TabsTrigger
              data-ocid="admin.tab"
              value="oportunidades"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Oportunidades ({opportunities?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.tab"
              value="postulaciones"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Postulaciones ({applications?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value="oportunidades">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display font-600 text-xl">
                Lista de oportunidades
              </h2>
              <Button
                data-ocid="admin.primary_button"
                onClick={openCreate}
                className="gold-gradient text-primary-foreground font-semibold shadow-gold-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Nueva oportunidad
              </Button>
            </div>

            {oppsLoading ? (
              <div data-ocid="admin.loading_state" className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                  <Skeleton key={`sk-${i}`} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : !opportunities || opportunities.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <p>Aún no hay oportunidades. ¡Crea la primera!</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/50 border-border">
                      <TableHead className="text-muted-foreground font-medium">
                        Título
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
                        Categoría
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">
                        Monto
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium">
                        Estado
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp, i) => (
                      <TableRow
                        key={opp.id}
                        data-ocid={`admin.row.${i + 1}`}
                        className="border-border hover:bg-secondary/30"
                      >
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {opp.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="text-xs border-border"
                          >
                            {categoryLabels[opp.category] ?? "Otro"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-primary font-semibold hidden sm:table-cell">
                          {opp.estimatedAmount}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              data-ocid={`admin.switch.${i + 1}`}
                              checked={opp.isActive}
                              onCheckedChange={() =>
                                handleToggle(opp.id, opp.isActive)
                              }
                              disabled={toggleMutation.isPending}
                            />
                            <span
                              className={`text-xs ${opp.isActive ? "text-accent" : "text-muted-foreground"}`}
                            >
                              {opp.isActive ? "Activa" : "Inactiva"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`admin.edit_button.${i + 1}`}
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(opp)}
                              className="h-8 w-8 hover:text-primary"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.delete_button.${i + 1}`}
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(opp.id)}
                              className="h-8 w-8 hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="postulaciones">
            <h2 className="font-display font-600 text-xl mb-5">
              Todas las postulaciones
            </h2>
            {appsLoading ? (
              <div data-ocid="admin.loading_state" className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => i).map((i) => (
                  <Skeleton key={`sk-${i}`} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : !applications || applications.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <p>No hay postulaciones aún.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/50 border-border">
                      <TableHead className="text-muted-foreground font-medium">
                        Nombre
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
                        Correo
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
                        Oportunidad
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium hidden xl:table-cell">
                        Mensaje
                      </TableHead>
                      <TableHead className="text-muted-foreground font-medium">
                        Estado
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app, i) => {
                      const status =
                        statusConfig[app.status] ??
                        statusConfig[ApplicationStatus.pending];
                      return (
                        <TableRow
                          key={app.id}
                          data-ocid={`admin.row.${i + 1}`}
                          className="border-border hover:bg-secondary/30"
                        >
                          <TableCell className="font-medium">
                            {app.applicantName}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden md:table-cell">
                            {app.applicantEmail}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-xs text-muted-foreground font-mono truncate block max-w-[120px]">
                              {app.opportunityId}
                            </span>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                              {app.message}
                            </p>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <Select
                                value={app.status}
                                onValueChange={(val) =>
                                  handleStatusChange(
                                    app.id,
                                    val as ApplicationStatus,
                                  )
                                }
                                disabled={updateStatusMutation.isPending}
                              >
                                <SelectTrigger
                                  data-ocid={`admin.select.${i + 1}`}
                                  className={`w-36 border ${status.className} bg-transparent h-8 text-xs`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                  <SelectItem value={ApplicationStatus.pending}>
                                    Pendiente
                                  </SelectItem>
                                  <SelectItem
                                    value={ApplicationStatus.approved}
                                  >
                                    Aprobada
                                  </SelectItem>
                                  <SelectItem
                                    value={ApplicationStatus.rejected}
                                  >
                                    Rechazada
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="admin.dialog"
          className="sm:max-w-lg border-border bg-card max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingOpp ? "Editar" : "Nueva"}{" "}
              <span className="gold-text">oportunidad</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingOpp
                ? "Modifica los datos de la oportunidad."
                : "Completa los campos para crear una nueva oportunidad."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="opp-title">Título</Label>
              <Input
                data-ocid="admin.input"
                id="opp-title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                className="bg-input border-border"
                placeholder="Ej: Representante de ventas digital"
              />
              {formErrors.title && (
                <p
                  data-ocid="admin.error_state"
                  className="text-destructive text-xs"
                >
                  {formErrors.title}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) =>
                    setForm((p) => ({
                      ...p,
                      category: val as OpportunityCategory,
                    }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.select"
                    className="bg-input border-border"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(categoryLabels).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="opp-amount">Monto estimado</Label>
                <Input
                  data-ocid="admin.input"
                  id="opp-amount"
                  value={form.estimatedAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, estimatedAmount: e.target.value }))
                  }
                  className="bg-input border-border"
                  placeholder="Ej: $300-$800/mes"
                />
                {formErrors.estimatedAmount && (
                  <p
                    data-ocid="admin.error_state"
                    className="text-destructive text-xs"
                  >
                    {formErrors.estimatedAmount}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opp-desc">Descripción</Label>
              <Textarea
                data-ocid="admin.textarea"
                id="opp-desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-input border-border resize-none"
                placeholder="Describe la oportunidad en detalle..."
              />
              {formErrors.description && (
                <p
                  data-ocid="admin.error_state"
                  className="text-destructive text-xs"
                >
                  {formErrors.description}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opp-req">
                Requisitos{" "}
                <span className="text-muted-foreground text-xs">
                  (opcional)
                </span>
              </Label>
              <Textarea
                data-ocid="admin.textarea"
                id="opp-req"
                rows={3}
                value={form.requirements}
                onChange={(e) =>
                  setForm((p) => ({ ...p, requirements: e.target.value }))
                }
                className="bg-input border-border resize-none"
                placeholder="Experiencia mínima, habilidades, disponibilidad..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.cancel_button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              data-ocid="admin.save_button"
              onClick={handleSave}
              disabled={isSaving}
              className="gold-gradient text-primary-foreground font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                </>
              ) : editingOpp ? (
                "Guardar cambios"
              ) : (
                "Crear oportunidad"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent
          data-ocid="admin.dialog"
          className="border-border bg-card"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              ¿Eliminar oportunidad?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción no se puede deshacer. La oportunidad y todas sus
              postulaciones serán eliminadas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.cancel_button"
              className="border-border"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.confirm_button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Eliminando...
                </>
              ) : (
                "Sí, eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
