// Simple button component fallback if UI library isn't working
import { cn } from "@/lib/utils"

// Use a simple button if the complex one doesn't work
const SimpleButton = ({ 
  children, 
  onClick, 
  disabled, 
  className = "", 
  variant = "default",
  size = "default",
  ...props 
}: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant as keyof typeof variants] || variants.default,
        sizes[size as keyof typeof sizes] || sizes.default,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { SimpleButton as Button };
