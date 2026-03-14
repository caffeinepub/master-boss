import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ChevronRight,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { NavigateFn } from "../App";
import OpportunityCard from "../components/OpportunityCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetActiveOpportunities } from "../hooks/useQueries";

const features = [
  {
    icon: TrendingUp,
    title: "Ingresos Reales",
    desc: "Accede a oportunidades verificadas con estimados de ganancia claros y transparentes.",
  },
  {
    icon: Zap,
    title: "Proceso Rápido",
    desc: "Postúlate en minutos. Sin burocracia, sin papeleo innecesario.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    desc: "Plataforma descentralizada sobre Internet Computer. Tus datos son tuyos.",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    desc: "Únete a cientos de personas que ya generan ingresos extras con Máster Boss.",
  },
];

const stats = [
  { value: "$500+", label: "Ingreso promedio mensual" },
  { value: "120+", label: "Oportunidades activas" },
  { value: "2,400+", label: "Miembros activos" },
  { value: "98%", label: "Satisfacción" },
];

interface LandingPageProps {
  navigate: NavigateFn;
}

export default function LandingPage({ navigate }: LandingPageProps) {
  const { data: opportunities, isLoading } = useGetActiveOpportunities();
  const { login, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const featured = (opportunities ?? []).slice(0, 6);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section
        data-ocid="landing.section"
        className="relative min-h-[85vh] flex items-center noise-bg"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.78 0.18 75 / 0.12), transparent), oklch(0.08 0.008 265)",
        }}
      >
        {/* Decorative diagonal */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute -right-32 top-0 w-[600px] h-[600px] opacity-5"
            style={{
              background:
                "conic-gradient(from 45deg, oklch(0.78 0.18 75), oklch(0.65 0.15 60), transparent)",
              clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 60% 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <Badge className="mb-6 bg-primary/15 text-primary border-primary/30 font-medium px-3 py-1">
              <Zap className="w-3 h-3 mr-1" /> La plataforma #1 de ingresos
              extras
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-800 leading-tight mb-6">
              <span className="gold-text">Máster Boss</span>
              <br />
              <span className="text-foreground">Tu dinero,</span>
              <br />
              <span className="text-muted-foreground font-400 text-4xl md:text-5xl">
                tus reglas.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Descubre oportunidades reales para generar ingresos extras desde
              donde estés. Sin experiencia previa. Sin horarios fijos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                data-ocid="landing.primary_button"
                size="lg"
                onClick={() => navigate({ path: "/oportunidades" })}
                className="gold-gradient text-primary-foreground font-semibold shadow-gold text-base px-8"
              >
                Ver oportunidades <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {!isAuthenticated && (
                <Button
                  data-ocid="landing.secondary_button"
                  size="lg"
                  variant="outline"
                  onClick={() => login()}
                  disabled={loginStatus === "logging-in"}
                  className="border-border hover:border-primary/50 hover:text-primary text-base px-8"
                >
                  {loginStatus === "logging-in"
                    ? "Ingresando..."
                    : "Registrarme"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-display text-3xl font-bold gold-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-700 mb-2">
                Oportunidades <span className="gold-text">destacadas</span>
              </h2>
              <p className="text-muted-foreground">
                Seleccionadas para maximizar tu potencial.
              </p>
            </div>
            <Button
              data-ocid="landing.link"
              variant="ghost"
              onClick={() => navigate({ path: "/oportunidades" })}
              className="hidden md:flex text-primary hover:text-primary hover:bg-primary/10"
            >
              Ver todas <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {isLoading ? (
            <div
              data-ocid="opportunities.loading_state"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {Array.from({ length: 6 }, (_, i) => i).map((i) => (
                <Skeleton key={`sk-${i}`} className="h-52 rounded-xl" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div
              data-ocid="opportunities.empty_state"
              className="text-center py-20 text-muted-foreground"
            >
              <p className="text-lg">Próximamente nuevas oportunidades</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <OpportunityCard
                    opportunity={opp}
                    navigate={navigate}
                    index={i}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10 md:hidden">
            <Button
              data-ocid="landing.secondary_button"
              variant="outline"
              onClick={() => navigate({ path: "/oportunidades" })}
              className="border-border hover:border-primary/50 hover:text-primary"
            >
              Ver todas las oportunidades{" "}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-700 mb-4">
              ¿Por qué <span className="gold-text">Máster Boss</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Una plataforma diseñada para que cualquier persona pueda generar
              ingresos reales.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl p-6 flex flex-col gap-3"
              >
                <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center">
                  <feat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-600 text-lg">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.78 0.18 75 / 0.08), transparent)",
            }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-700 mb-6">
                Empieza a ganar <span className="gold-text">hoy mismo</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                Regístrate gratis y accede a todas las oportunidades en menos de
                2 minutos.
              </p>
              <Button
                data-ocid="landing.primary_button"
                size="lg"
                onClick={() => login()}
                disabled={loginStatus === "logging-in"}
                className="gold-gradient text-primary-foreground font-semibold shadow-gold text-base px-10 py-6 text-lg"
              >
                {loginStatus === "logging-in"
                  ? "Ingresando..."
                  : "Crear cuenta gratis"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
