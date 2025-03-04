import { ChangeEventHandler } from "react";

interface InputType {
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
}

const Input: React.FC<InputType> = ({
  name,
  type,
  placeholder,
  label,
  onChange,
  value,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="input duration-150 w-full"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default Input;
