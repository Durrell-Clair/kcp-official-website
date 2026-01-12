import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="KAMER CASH PME" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-xl">
                KAMER CASH <span className="text-primary">PME</span>
              </span>
            </div>
            <p className="text-secondary-foreground/70 max-w-sm leading-relaxed">
              Le logiciel de gestion financière conçu pour les PME et commerçants camerounais. 
              Simple, offline, efficace.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">Tarifs</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Connexion</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">Inscription</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li>support@kamercash.cm</li>
              <li>+237 6XX XXX XXX</li>
              <li>Douala, Cameroun</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            © 2025 KAMER CASH PME. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
