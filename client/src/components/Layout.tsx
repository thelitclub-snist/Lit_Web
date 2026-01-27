import { Link, useLocation } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/lit-weekly", label: "Lit Weekly" },
    { href: "/borrow", label: "Library" },
    { href: "/about", label: "About" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-serif text-foreground selection:bg-primary/10 selection:text-primary">
      {/* Top Border Accent */}
      <div className="h-1.5 bg-primary w-full" />

      {/* Navigation */}
      <header className="border-b border-border/60 py-8 md:py-12">
        <div className="container flex flex-col items-center gap-8">
          <Link href="/" className="no-underline group">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground m-0 text-center group-hover:text-primary transition-colors duration-300">
              Literary Club
            </h1>
          </Link>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 items-center uppercase tracking-[0.2em] text-[10px] font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition-colors duration-300 ${
                  location === link.href ? "text-primary border-b border-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-16 mt-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold tracking-tight mb-2">Literary Club</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                A sanctuary for readers, writers, and thinkers at the heart of our college campus.
              </p>
            </div>
            
            <div className="flex gap-8 uppercase tracking-widest text-[10px] font-bold text-muted-foreground">
              <Link href="/about" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/lit-weekly" className="hover:text-primary transition-colors">Archive</Link>
              <Link href="/borrow" className="hover:text-primary transition-colors">Library</Link>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border/30 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              &copy; {new Date().getFullYear()} Literary Club &bull; Est. 1924
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
