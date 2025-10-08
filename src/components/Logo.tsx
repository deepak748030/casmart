export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`font-bold text-2xl ${className}`}>
      <span className="text-primary">Cas</span>
      <span className="text-foreground">mart</span>
    </div>
  );
};
