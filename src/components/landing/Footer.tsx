import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary/30" />
            <span className="text-xl font-serif font-bold">ValLink</span>
          </div>
          
          <p className="text-muted-foreground text-sm text-center">
            Made with 💕 for lovers everywhere
          </p>
          
          <p className="text-muted-foreground text-sm">
            © 2024 ValLink. Spread love, not hate.
          </p>
        </div>
      </div>
    </footer>
  );
}
