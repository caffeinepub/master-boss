import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useSaveUserProfile();

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await mutateAsync({ name: name.trim() });
      toast.success("¡Perfil configurado! Bienvenido a Máster Boss.");
    } catch {
      toast.error("Error al guardar el perfil. Intenta de nuevo.");
    }
  };

  return (
    <Dialog open>
      <DialogContent
        data-ocid="profile.dialog"
        className="sm:max-w-md border-border bg-card"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center shadow-gold">
              <Crown className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            ¡Bienvenido a <span className="gold-text">Máster Boss</span>!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Para continuar, dinos cómo te llamas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Tu nombre</Label>
            <Input
              data-ocid="profile.input"
              id="profile-name"
              placeholder="Ej: María García"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className="bg-input border-border"
              autoFocus
            />
          </div>
          <Button
            data-ocid="profile.submit_button"
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="w-full gold-gradient text-primary-foreground font-semibold shadow-gold-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
              </>
            ) : (
              "Empezar a ganar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
