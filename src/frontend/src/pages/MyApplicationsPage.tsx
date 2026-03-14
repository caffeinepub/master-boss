import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { NavigateFn } from "../App";
import { ApplicationStatus, useGetMyApplications } from "../hooks/useQueries";

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

interface MyApplicationsPageProps {
  navigate: NavigateFn;
}

export default function MyApplicationsPage({
  navigate,
}: MyApplicationsPageProps) {
  const { data: applications, isLoading } = useGetMyApplications();

  return (
    <div className="min-h-screen">
      <section
        className="py-14 border-b border-border"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.78 0.18 75 / 0.07), transparent)",
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-700 mb-2">
            Mis <span className="gold-text">Postulaciones</span>
          </h1>
          <p className="text-muted-foreground">
            Seguimiento de todas tus postulaciones enviadas.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {isLoading ? (
          <div data-ocid="applications.loading_state" className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => i).map((i) => (
              <Skeleton key={`sk-${i}`} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : !applications || applications.length === 0 ? (
          <div
            data-ocid="applications.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center gap-5"
          >
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-display font-semibold mb-2">
                Aún no tienes postulaciones
              </p>
              <p className="text-muted-foreground">
                Explora las oportunidades y empieza a postularte.
              </p>
            </div>
            <Button
              data-ocid="applications.primary_button"
              onClick={() => navigate({ path: "/oportunidades" })}
              className="gold-gradient text-primary-foreground font-semibold shadow-gold-sm"
            >
              Ver oportunidades <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, i) => {
              const status =
                statusConfig[app.status] ??
                statusConfig[ApplicationStatus.pending];
              const StatusIcon = status.icon;
              const date = new Date(Number(app.createdAt) / 1_000_000);
              return (
                <motion.div
                  key={app.id}
                  data-ocid={`applications.item.${i + 1}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-lg truncate">
                      {app.opportunityId}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {date.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {app.message && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic">
                        "{app.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`border ${status.className} flex items-center gap-1.5 px-3 py-1`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </Badge>
                    <Button
                      data-ocid={`applications.secondary_button.${i + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({
                          path: "/oportunidad",
                          id: app.opportunityId,
                        })
                      }
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
