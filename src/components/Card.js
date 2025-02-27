export function Card({ children, className }) {
    return <div className={`p-4 rounded-2xl shadow-lg border border-gray-200 w-full max-w-[250px] ${className}`}>
        {children}
        </div>;
  }