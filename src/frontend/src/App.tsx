import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AdminPanel from "./pages/AdminPanel";
import LandingPage from "./pages/LandingPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import OpportunityDetailPage from "./pages/OpportunityDetailPage";

export type Route =
  | { path: "/" }
  | { path: "/oportunidades" }
  | { path: "/oportunidad"; id: string }
  | { path: "/mis-postulaciones" }
  | { path: "/admin" };

export type NavigateFn = (route: Route) => void;

function App() {
  const [route, setRoute] = useState<Route>({ path: "/" });
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Sync with URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || "/";
    if (hash.startsWith("/oportunidad/")) {
      setRoute({ path: "/oportunidad", id: hash.replace("/oportunidad/", "") });
    } else if (hash === "/oportunidades") {
      setRoute({ path: "/oportunidades" });
    } else if (hash === "/mis-postulaciones") {
      setRoute({ path: "/mis-postulaciones" });
    } else if (hash === "/admin") {
      setRoute({ path: "/admin" });
    } else {
      setRoute({ path: "/" });
    }
  }, []);

  const navigate: NavigateFn = (r: Route) => {
    setRoute(r);
    if (r.path === "/oportunidad") {
      window.location.hash = `/oportunidad/${(r as { path: "/oportunidad"; id: string }).id}`;
    } else {
      window.location.hash = r.path;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (route.path) {
      case "/oportunidades":
        return <OpportunitiesPage navigate={navigate} />;
      case "/oportunidad":
        return (
          <OpportunityDetailPage
            id={(route as { path: "/oportunidad"; id: string }).id}
            navigate={navigate}
          />
        );
      case "/mis-postulaciones":
        return isAuthenticated ? (
          <MyApplicationsPage navigate={navigate} />
        ) : (
          <LandingPage navigate={navigate} />
        );
      case "/admin":
        return isAuthenticated ? (
          <AdminPanel navigate={navigate} />
        ) : (
          <LandingPage navigate={navigate} />
        );
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar navigate={navigate} currentPath={route.path} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
