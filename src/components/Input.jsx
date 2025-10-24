import { forwardRef } from 'react';

export const Input = forwardRef(function Input({
  value,
  onChange,
  placeholder,
  size = "md",
  className = "",
  ...props
}, ref) {
  const sizeClasses = {
    sm: "input-sm",
    md: "",
    lg: "input-lg",
  };

  return (
    <input
      ref={ref}
      className={`input ${sizeClasses[size]} ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
});