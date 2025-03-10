import { ChangeEventHandler, MouseEventHandler } from "react";

interface InputType {
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onVisible?: MouseEventHandler<HTMLButtonElement>;
  value?: string;
  required?: boolean;
  icon?: React.ReactElement;
  profixIcon?: React.ReactElement;
}

const Input: React.FC<InputType> = ({
  name,
  type,
  placeholder,
  label,
  onChange,
  value,
  required,
  icon,
  profixIcon,
  onVisible
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex gap-2 items-center input duration-150 w-full rounded">
        {icon && <span className="pb-1">{icon}</span>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          required={required}
        />
        {profixIcon && <button className="hover:bg-black/40 cursor-pointer active:bg-black/50 rounded-full duration-150 p-2" onClick={onVisible}>{profixIcon}</button>}
      </div>
    </div>
  );
};

export default Input;
