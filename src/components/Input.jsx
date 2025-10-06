export function Input({
  value,
  onChange,
  placeholder,
  size = "md",
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "input-sm",
    md: "",
    lg: "input-lg",
  };

  return (
    <input
      className={`input ${sizeClasses[size]} ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
}