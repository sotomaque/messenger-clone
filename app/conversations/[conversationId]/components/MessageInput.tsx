'use client';

import type { FC } from 'react';
import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';

interface MessageInputProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  placeholder?: string;
  type?: string;
}

const MessageInput: FC<MessageInputProps> = ({
  id,
  register,
  errors,
  required,
  placeholder,
  type,
}) => {
  return (
    <div className="relateive w-full">
      <input
        type={type}
        autoComplete={id}
        id={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className={`
          text-black
          font-light
          py-2
          px-4
          bg-neutral-100
          w-full
          rounded-full
          focus:outline-none
        `}
      />
    </div>
  );
};

export default MessageInput;
