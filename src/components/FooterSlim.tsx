import { Link } from 'react-router-dom';

export function FooterSlim() {
  return (
    <footer className="bg-background border-t border-border py-3">
      <div className="container mx-auto px-4">
        <div className="text-center text-xs text-muted-foreground">
          © ClaimEase 2025 |{' '}
          <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
            Privacy
          </Link>{' '}
          |{' '}
          <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}