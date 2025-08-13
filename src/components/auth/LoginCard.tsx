interface LoginCardProps {
  children: React.ReactNode;
}

export function LoginCard({ children }: LoginCardProps) {
  return <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>;
}
