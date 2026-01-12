import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="KAMER CASH PME" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              KAMER CASH <span className="text-primary">PME</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Tarifs
            </Link>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Fonctionnalités
            </a>
            {user && (
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Tableau de bord
              </Link>
            )}
            {user && !adminLoading && isAdmin && (
              <Link 
                to="/admin" 
                className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
              >
                <Shield className="w-4 h-4" />
                Administration
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Tableau de bord</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/register">Commencer</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/pricing" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </Link>
              <a 
                href="#features" 
                className="text-foreground font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-foreground font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
              )}
              {user && !adminLoading && isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-primary font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  Administration
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <Button variant="outline" asChild>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Tableau de bord</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                    </Button>
                    <Button variant="hero" asChild>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>Commencer</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
