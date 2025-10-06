export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  const variantClasses = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    error: "btn-error",
  };

  return (
    <button
      className={`btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}