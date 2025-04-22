import { useState } from "react";


function CampoPassword({ label, name, value, onChange }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="mb-3 position-relative">
      <label className="form-label">{label}</label>
      <input
        type={mostrar ? "text" : "password"}
        name={name}
        className="form-control outline-secondary"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setMostrar(!mostrar)}
        className="btn btn-sm btn-light position-absolute"
        style={{ top: "34px", right: "10px", padding: "0.25rem 0.5rem" }}
      >
       <i className={`bi ${mostrar ? "bi-eye-slash" : "bi-eye"}`}></i>
      </button>
    </div>
  );
}

export default CampoPassword;
