// TODO: Implement reusable Input component
const Input = ({ id, label, type = 'text', value, onChange, placeholder, error }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${error ? 'input--error' : ''}`}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
