import React from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/Logo OTOB.png";
import { useSignIn } from "../hooks/use-auth.service";
import { useNavigate } from "react-router-dom";

interface SigninFormData {
  email: string;
  password: string;
}

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const loginMutation = useSignIn();
  const onSubmit = async (data: SigninFormData) => {
    try {
      console.log("Form data:", data);
      loginMutation.mutate(data, {
        onSuccess: ()=>{
          console.log( 'connected')
          navigate('/')
        }
      })
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-4 lg:mb-8">
        OneToolOneBuild
      </h1>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={logo} className="mx-auto h-50 w-auto" />
        <h2 className="mt-1 text-center text-4xl/9 font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                role="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Mail is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                role="password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must contain at least 6 characters',
                  },
                })}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              data-cy="login"
              disabled={isSubmitting}
              className="flex w-1/2 justify-center rounded-md bg-[#FFCC00] px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:bg-[#FFA500] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA500] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Connexion..." : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
