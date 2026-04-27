export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LP pages handle their own layout via LPLayout component
  // This keeps landing pages clean without site header/navigation
  return <>{children}</>;
}
