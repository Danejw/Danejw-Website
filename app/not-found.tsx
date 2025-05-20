import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-4xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">Sorry, we couldn&apos;t find the page you were looking for.</p>
      <Link href="/" className="text-primary hover:underline">
        Return Home
      </Link>
    </div>
  );
}
