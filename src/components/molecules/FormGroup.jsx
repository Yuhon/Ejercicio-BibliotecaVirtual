const FormGroup = ({ label, children, className = "", style = {} }) => {
  return (
    <div className={`form-group ${className}`} style={style}>
      {label && <label className="input-label">{label}</label>}
      {children}
    </div>
  );
};

export default FormGroup;
