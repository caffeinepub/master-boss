import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { NavigateFn } from "../App";
import OpportunityCard from "../components/OpportunityCard";
import {
  OpportunityCategory,
  useGetActiveOpportunities,
} from "../hooks/useQueries";

const categories = [
  { value: "all", label: "Todas" },
  { value: OpportunityCategory.sales, label: "Ventas" },
  { value: OpportunityCategory.freelance, label: "Freelance" },
  { value: OpportunityCategory.digital, label: "Digital" },
  { value: OpportunityCategory.services, label: "Servicios" },
  { value: OpportunityCategory.other, label: "Otro" },
];

interface OpportunitiesPageProps {
  navigate: NavigateFn;
}

export default function OpportunitiesPage({
  navigate,
}: OpportunitiesPageProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data: opportunities, isLoading } = useGetActiveOpportunities();

  const filtered = useMemo(() => {
    let list = opportunities ?? [];
    if (category !== "all") list = list.filter((o) => o.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [opportunities, category, search]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="py-16 border-b border-border"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.78 0.18 75 / 0.08), transparent)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-700 mb-3">
              Todas las <span className="gold-text">oportunidades</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Encuentra la oportunidad perfecta para ti y empieza a generar
              ingresos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="opportunities.search_input"
              placeholder="Buscar oportunidades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-secondary flex-wrap h-auto gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  data-ocid="opportunities.tab"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div
            data-ocid="opportunities.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {Array.from({ length: 9 }, (_, i) => i).map((i) => (
              <Skeleton key={`sk-${i}`} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="opportunities.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center gap-4"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-display font-semibold">
              No se encontraron oportunidades
            </p>
            <p className="text-muted-foreground">
              Intenta con otra búsqueda o categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
      </div>
    </div>
  );
}
