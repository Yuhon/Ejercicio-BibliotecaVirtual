const Spinner = ({ size = "16px", color = "#fff", className = "", style = {}, ...props }) => {
  return (
    <span 
      className={`spinner ${className}`} 
      style={{ 
        display: "inline-block", 
        width: size, 
        height: size, 
        border: "2px solid rgba(255,255,255,0.3)", 
        borderTop: `2px solid ${color}`, 
        borderRadius: "50%", 
        animation: "spin 0.8s linear infinite",
        ...style
      }} 
      {...props} 
    />
  );
};

export default Spinner;
