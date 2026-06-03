const Select = ({ className = "", style, children, ...props }) => {
  return (
    <select className={`input-field ${className}`} style={style} {...props}>
      {children}
    </select>
  );
};

export default Select;
