export function Button({ children, className, ...props }) {
  return (
    <button className={`px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition w-full ${className}`} {...props}>
      {children}
    </button>
  );
}