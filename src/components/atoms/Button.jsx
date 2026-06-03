const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const sizeClass = size === "sm" ? "btn-sm" : "";
  const variantClass = variant !== "none" ? `btn-${variant}` : "";
  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
