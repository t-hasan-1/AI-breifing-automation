const TextBox = (props) => {
    const { onChange, value } = props;

    return <div className="input-section">
        <input
            type="text"
            placeholder="Type 'yes' or 'no' here"
            className="input-box"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
}

export { TextBox }