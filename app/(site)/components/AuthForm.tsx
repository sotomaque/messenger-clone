'use client';

import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { useCallback, useState } from 'react';
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { registerService, signInService } from '@/app/services/authService';
import { signIn } from 'next-auth/react';

type Variant = 'LOGIN' | 'REGISTER';

enum AuthToasts {
  GenericError = 'Something went wrong!',
  InvalidCredentials = 'Invalid credentials!',
  Success = 'Success!',
}

export type SocialLogin = 'google' | 'github';

const AuthForm = () => {
  // State
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  // Function(s)
  const toggleVariants = useCallback(() => {
    if (isLoading) {
      setIsLoading(false);
    }

    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [isLoading, variant]);

  // Hook(s)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      registerService({
        data,
        onError: () => {
          toast.error(AuthToasts.GenericError);
        },
        onComplete: () => {
          setIsLoading(false);
        },
      });
    }

    if (variant === 'LOGIN') {
      signInService({
        data,
        onError: () => {
          toast.error(AuthToasts.InvalidCredentials);
        },
        onSuccess: () => {
          toast.success(AuthToasts.Success);
        },
        onComplete: () => {
          setIsLoading(false);
        },
      });
    }
  };

  const socialAction = async (action: SocialLogin) => {
    setIsLoading(true);

    switch (action) {
      case 'github':
        signIn(action, { redirect: false })
          .then((callback) => {
            if (callback?.error) {
              toast.error(AuthToasts.InvalidCredentials);
            }

            if (callback?.ok && !callback.error) {
              toast.success(AuthToasts.Success);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });

        break;
      case 'google':
        // todo
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
        bg-white
        px-4
        py-8
        shadow
        sm:rounded-lg
        sm:px-10
      "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input id="name" label="Name" register={register} errors={errors} />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div className="">
            {/* submit -> no onclick bc its within a form element */}
            <Button fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to messenger?'
              : 'Already have an account?'}
          </div>
          <div className="underline cursor-pointer" onClick={toggleVariants}>
            {variant === 'LOGIN' ? 'Create an account' : 'Sign in'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
