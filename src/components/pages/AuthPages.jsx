import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import FormGroup from "../molecules/FormGroup";

export const LoginPage = () => {
  const { 
    authEmail, setAuthEmail, authPassword, setAuthPassword, 
    authError, handleLogin, navigateTo 
  } = useApp();

  return (
    <div className="fade-in" style={{ display: "flex", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "35px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center" }}>Iniciar Sesión</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center", marginTop: "-10px" }}>Accede a tu cuenta de Bibliotech.</p>
        
        {authError && (
          <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>⚠️ {authError}</div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormGroup label="Correo Electrónico">
            <Input type="email" placeholder="ejemplo@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
          </FormGroup>

          <FormGroup label={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "-6px" }}>
              <span>Contraseña</span>
              <span style={{ fontSize: "0.8rem", color: "var(--secondary-color)", cursor: "pointer", fontWeight: "normal" }} onClick={() => navigateTo("recover")}>¿Olvidaste tu contraseña?</span>
            </div>
          }>
            <Input type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
          </FormGroup>

          <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px" }}>Ingresar al Sistema 🔑</Button>
        </form>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "10px 0" }} />

        <p style={{ fontSize: "0.9rem", textAlign: "center", color: "var(--text-secondary)" }}>
          ¿No tienes una cuenta?{" "}
          <span style={{ color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600" }} onClick={() => navigateTo("register")}>Regístrate aquí</span>
        </p>

        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", fontSize: "0.75rem", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontWeight: "600", marginBottom: "4px" }}>Cuentas de demostración:</p>
          <p>👤 Cliente: <b>user@bibliotech.com</b> / pass: <b>user123</b></p>
          <p>🛡️ Administrador: <b>admin@bibliotech.com</b> / pass: <b>admin123</b></p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const { 
    authEmail, setAuthEmail, authPassword, setAuthPassword, 
    authConfirmPassword, setAuthConfirmPassword, authName, setAuthName,
    authRole, setAuthRole, authError, authSuccess, handleRegister, navigateTo 
  } = useApp();

  return (
    <div className="fade-in" style={{ display: "flex", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "450px", width: "100%", padding: "35px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center" }}>Crear Cuenta</h2>
        
        {authError && <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>⚠️ {authError}</div>}
        {authSuccess && <div style={{ color: "#a7f3d0", background: "rgba(16, 185, 129, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "left" }}>✅ {authSuccess}</div>}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <FormGroup label="Nombre Completo">
            <Input type="text" placeholder="Juan Pérez" value={authName} onChange={(e) => setAuthName(e.target.value)} required />
          </FormGroup>
          <FormGroup label="Correo Electrónico">
            <Input type="email" placeholder="juan.perez@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
          </FormGroup>
          <FormGroup label="Rol de Cuenta (Para Pruebas)">
            <Select value={authRole} onChange={(e) => setAuthRole(e.target.value)}>
              <option value="user">👤 Cliente / Lector</option>
              <option value="admin">🛡️ Administrador del Sistema</option>
            </Select>
          </FormGroup>
          <div style={{ display: "flex", gap: "12px" }}>
            <FormGroup label="Contraseña" style={{ flex: "1" }}>
              <Input type="password" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
            </FormGroup>
            <FormGroup label="Confirmar" style={{ flex: "1" }}>
              <Input type="password" placeholder="••••••••" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} required />
            </FormGroup>
          </div>
          <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "8px" }}>Crear Cuenta y Registrarse 🚀</Button>
        </form>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "8px 0" }} />
        <p style={{ fontSize: "0.9rem", textAlign: "center", color: "var(--text-secondary)" }}>
          ¿Ya tienes una cuenta?{" "}
          <span style={{ color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600" }} onClick={() => navigateTo("login")}>Inicia sesión aquí</span>
        </p>
      </div>
    </div>
  );
};

export const RecoverPage = () => {
  const { 
    authEmail, setAuthEmail, authPassword, setAuthPassword, 
    authConfirmPassword, setAuthConfirmPassword, authError, authSuccess, 
    recoverStep, setRecoverStep, recoveredEmail, handleRecoverPassword, navigateTo 
  } = useApp();

  return (
    <div className="fade-in" style={{ display: "flex", justifyContent: "center" }}>
      <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "35px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center" }}>Recuperar Contraseña</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center", marginTop: "-10px" }}>
          {recoverStep === 1 ? "Ingresa tu correo para buscar tu cuenta en el sistema." : "Ingresa tu nueva contraseña para actualizar tu cuenta."}
        </p>

        {authError && <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>⚠️ {authError}</div>}
        {authSuccess && <div style={{ color: "#a7f3d0", background: "rgba(16, 185, 129, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "left" }}>✅ {authSuccess}</div>}

        <form onSubmit={handleRecoverPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {recoverStep === 1 ? (
            <FormGroup label="Correo Registrado">
              <Input type="email" placeholder="ejemplo@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
            </FormGroup>
          ) : (
            <>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "6px", textAlign: "left", margin: "0" }}>
                Cuenta encontrada: <b>{recoveredEmail}</b>
              </p>
              <FormGroup label="Nueva Contraseña">
                <Input type="password" placeholder="Nueva contraseña" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
              </FormGroup>
              <FormGroup label="Confirmar Contraseña">
                <Input type="password" placeholder="Confirmar contraseña" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} required />
              </FormGroup>
            </>
          )}
          <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px" }}>
            {recoverStep === 1 ? "Buscar Cuenta 🔍" : "Actualizar Contraseña 💾"}
          </Button>
        </form>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "10px 0" }} />
        <span style={{ color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem", textAlign: "center" }} onClick={() => { setRecoverStep(1); navigateTo("login"); }}>
          Volver al Inicio de Sesión
        </span>
      </div>
    </div>
  );
};
