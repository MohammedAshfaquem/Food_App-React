const Button = ({ text, onClick, type = "button", width }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      padding: "10px 20px",
      backgroundColor: "#333",
      color: "white",
      border: "none",
      cursor: "pointer",
      width: { width },
    }}
  >
    {text}
  </button>
);
export default Button;
