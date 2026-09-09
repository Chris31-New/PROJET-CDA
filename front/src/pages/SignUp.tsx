import React from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/Logo OTOB.png";
import { useSignUp } from "../hooks/use-auth.service";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ mode: "onChange" });

  const password = watch("password");
  const signupMutation = useSignUp();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData) => {
    try {
      signupMutation.mutate(data, {
        onSuccess: () => {
          //pop up success message
          const toast = () => {
            setTimeout(() => {
              alert("Inscription successful! Please log in.");
            }, 500);
          };
          toast();
          navigate("/signin");
        },
      });
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-4 lg:mb-8">
        OneToolOneBuild
      </h1>

      <div className="w-full sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-40 w-auto sm:h-50"
        />
        <h2 className="mt-1 text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Sign Up
        </h2>
      </div>

      <div className="mt-6 sm:mt-10 w-full sm:mx-auto sm:w-full sm:max-w-sm px-4 sm:px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email
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
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                role="password"
                type="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must contain at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                role="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Role
            </label>
            <div className="mt-2">
              <select
                id="role"
                {...register("role", { required: "Role is required" })}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="">-- Select a role --</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="SITE_MANAGER">Site Manager</option>
                <option value="COMPANY">Company</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center m-auto max-w-md gap-4">
            <button
              type="submit"
              data-cy="signup"
              disabled={isSubmitting}
              className="signup flex w-full sm:w-1/2 justify-center rounded-md bg-[#FFCC00] px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:bg-[#FFA500] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFA500] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Inscription..." : "Sign up"}
            </button>
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-indigo-500"
            >
              Already an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
