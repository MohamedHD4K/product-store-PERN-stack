import { ChangeEventHandler } from "react";

interface InputType {
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  required?: boolean;
}

const Input: React.FC<InputType> = ({
  name,
  type,
  placeholder,
  label,
  onChange,
  value,
  required,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="input duration-150 w-full rounded"
        onChange={onChange}
        value={value}
        required={required}
      />
    </div>
  );
};

export default Input;
