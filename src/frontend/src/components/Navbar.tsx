import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  ChevronDown,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { NavigateFn } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsAdmin } from "../hooks/useQueries";

interface NavbarProps {
  navigate: NavigateFn;
  currentPath: string;
}

export default function Navbar({ navigate, currentPath }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data: isAdmin } = useIsAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: "Inicio", path: "/" },
    { label: "Oportunidades", path: "/oportunidades" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => {
            navigate({ path: "/" });
            setMobileOpen(false);
          }}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center shadow-gold-sm">
            <Crown className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-700 text-xl tracking-tight">
            <span className="gold-text">Máster</span>
            <span className="text-foreground"> Boss</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.path}
              data-ocid="nav.link"
              onClick={() =>
                navigate({ path: link.path as "/" | "/oportunidades" })
              }
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth Area */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  data-ocid="nav.dropdown_menu"
                  variant="outline"
                  className="border-border gap-2 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">
                    {userProfile?.name ?? "Mi cuenta"}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  data-ocid="nav.link"
                  onClick={() => navigate({ path: "/mis-postulaciones" })}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Mis Postulaciones
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    data-ocid="nav.link"
                    onClick={() => navigate({ path: "/admin" })}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Panel Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-ocid="nav.link"
                  onClick={handleAuth}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              data-ocid="nav.primary_button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="gold-gradient text-primary-foreground font-semibold shadow-gold-sm hover:shadow-gold transition-shadow"
            >
              {isLoggingIn ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          data-ocid="nav.toggle"
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.path}
              data-ocid="nav.link"
              onClick={() => {
                navigate({ path: link.path as "/" | "/oportunidades" });
                setMobileOpen(false);
              }}
              className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPath === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAuthenticated && (
            <>
              <button
                type="button"
                data-ocid="nav.link"
                onClick={() => {
                  navigate({ path: "/mis-postulaciones" });
                  setMobileOpen(false);
                }}
                className="text-left px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                Mis Postulaciones
              </button>
              {isAdmin && (
                <button
                  type="button"
                  data-ocid="nav.link"
                  onClick={() => {
                    navigate({ path: "/admin" });
                    setMobileOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  Panel Admin
                </button>
              )}
            </>
          )}
          <div className="pt-2 border-t border-border">
            <Button
              data-ocid="nav.primary_button"
              onClick={() => {
                handleAuth();
                setMobileOpen(false);
              }}
              disabled={isLoggingIn}
              className="w-full gold-gradient text-primary-foreground font-semibold"
            >
              {isLoggingIn
                ? "Ingresando..."
                : isAuthenticated
                  ? "Cerrar sesión"
                  : "Iniciar sesión"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
