const Input = ({ className = "", style, ...props }) => {
  return (
    <input className={`input-field ${className}`} style={style} {...props} />
  );
};

export default Input;
