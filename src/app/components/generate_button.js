const GenerateButton = (props) => {
  const { onClick } = props;

  return (
    <div
      className="generate-section"
      style={{
        textAlign: "center",
        margin: "2rem 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        className="generate-btn"
        style={{
          backgroundColor: "white",
          color: "#003366",
          border: "2px solid #003366",
          borderRadius: "25px",
          padding: "15px 30px",
          fontSize: "1.25rem",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.1s ease-in-out",
          width: "25%",
        }}
        onClick={onClick}
      >
        Generate
      </button>
    </div>
  );
};

export { GenerateButton };
