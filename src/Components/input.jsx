const Input = ({ label, type = "text", value, onChange, name, error,placeholder }) => (
  <div style={{ marginBottom: "10px" }}>
    {label && <label>{label}</label>}
    <br />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: "8px",
        width: "100%",
        backgroundColor: "white",
        border: "1px solid grey",       // ✅ grey border added
        borderRadius: "4px",            // optional: add rounded corners
        outline: "none"                 // optional: remove blue border on focus
      }}
    />
    {error && <small style={{ color: "red" }}>{error}</small>}
  </div>
);
export default Input;
