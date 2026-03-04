interface AppBrandingProps {
  staffName?: string;
}

export function AppBranding({ staffName }: AppBrandingProps) {
  return (
    <div className="rep-portal-header">
      <span className="rep-portal-header__logo">LALOOP Portal</span>
      {staffName && (
        <span className="rep-portal-header__welcome">
          Welcome, {staffName}
        </span>
      )}
    </div>
  );
}
