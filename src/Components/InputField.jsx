const Inputfield = ({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  name,
  error,
  placeholder,
}) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      {label && (
        <label htmlFor={name} style={{ display: "block", marginBottom: "5px" }}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={type === "password" ? "new-password" : "off"}
        style={{
          padding: "8px",
          width: "100%",
          backgroundColor: "white",
          border: `1px solid ${error ? "red" : "grey"}`,
          borderRadius: "4px",
          outline: "none",
        }}
      />
      {error && (
        <small style={{ color: "red", display: "block", marginTop: "4px" }}>
          {error}
        </small>
      )}
    </div>
  );
};

export default Inputfield;
