'use client';

import useConversation from '@/app/hooks/useConversation';
import type { FC } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { MessageValidatorType } from '@/app/libs/validators/message';

interface FormProps {}

const Form: FC<FormProps> = ({}) => {
  // Hook(s)
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  // Handler(s)
  const onSubmit = async (data: FieldValues) => {
    const payload: MessageValidatorType = {
      message: data.message,
      conversationId,
    };
    setValue('message', '', { shouldValidate: true });
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <HiPhoto size={30} className="text-sky-500" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className={`
          rounded-full
          bg-sky-500
          hover:bg-sky-600
          p-2
          transition
        `}
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
