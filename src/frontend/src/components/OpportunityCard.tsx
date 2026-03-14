import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign } from "lucide-react";
import type { NavigateFn } from "../App";
import type { Opportunity } from "../hooks/useQueries";
import { OpportunityCategory } from "../hooks/useQueries";

const categoryLabels: Record<string, string> = {
  [OpportunityCategory.sales]: "Ventas",
  [OpportunityCategory.freelance]: "Freelance",
  [OpportunityCategory.digital]: "Digital",
  [OpportunityCategory.services]: "Servicios",
  [OpportunityCategory.other]: "Otro",
};

const categoryColors: Record<string, string> = {
  [OpportunityCategory.sales]:
    "bg-blue-500/20 text-blue-300 border-blue-500/30",
  [OpportunityCategory.freelance]:
    "bg-purple-500/20 text-purple-300 border-purple-500/30",
  [OpportunityCategory.digital]:
    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  [OpportunityCategory.services]:
    "bg-orange-500/20 text-orange-300 border-orange-500/30",
  [OpportunityCategory.other]:
    "bg-muted/50 text-muted-foreground border-border",
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  navigate: NavigateFn;
  index?: number;
}

export default function OpportunityCard({
  opportunity,
  navigate,
  index = 0,
}: OpportunityCardProps) {
  return (
    <div
      data-ocid={`opportunity.item.${index + 1}`}
      className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-all duration-200 hover:shadow-gold-sm group"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge
          className={`text-xs border ${categoryColors[opportunity.category] ?? categoryColors[OpportunityCategory.other]}`}
        >
          {categoryLabels[opportunity.category] ?? "Otro"}
        </Badge>
        <div className="flex items-center gap-1 text-primary font-semibold text-sm shrink-0">
          <DollarSign className="w-3.5 h-3.5" />
          {opportunity.estimatedAmount}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-foreground text-lg leading-snug line-clamp-2">
          {opportunity.title}
        </h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {opportunity.description}
        </p>
      </div>
      <Button
        data-ocid="opportunity.secondary_button"
        variant="outline"
        size="sm"
        onClick={() => navigate({ path: "/oportunidad", id: opportunity.id })}
        className="mt-auto border-border hover:border-primary/50 hover:text-primary group-hover:border-primary/40 transition-colors"
      >
        Ver detalles
        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  );
}
