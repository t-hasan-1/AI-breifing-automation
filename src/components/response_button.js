const ResponseButton = (props) => {
  const { text, onClick } = props;
  return (
    <button className="response-btn" onClick={onClick}>
      {text}
    </button>
  );
};

export { ResponseButton };
