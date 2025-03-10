import React, { useEffect, useState } from "react";
import Input from "../components/shared/Input";
import Divider from "../components/shared/Divider";
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { BsInstagram, BsPerson } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md";
import SignupLottie from "../components/lottie/SignupLottie";

const SignupPage = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["user"],
    mutationFn: async ({
      username,
      password,
    }: {
      password: string;
      username: string;
    }) => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        console.log(error);
        throw new Error(String(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(value);
  };

  const handleVisible = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setVisible((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"
  } , [])

  return (
    <div className="w-full flex justify-center items-center">
      <div className="p-5 h-screen w-7xl flex justify-between">
        <div className="w-full justify-center items-center hidden lg:flex">
          <SignupLottie />
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-4xl">Log In</span>
            <span className="font-medium text-xl">
              Continue your journey in our country
            </span>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-4 w-sm">
                <Input
                  type="text"
                  label="Username"
                  icon={<BsPerson size={16} />}
                  placeholder="Enter your username"
                  name="username"
                  onChange={handleChange}
                  value={value.username}
                />
                <Input
                  type={visible ? "text" : "password"}
                  label="Password"
                  icon={<MdPassword size={16} />}
                  placeholder="Enter your password"
                  name="password"
                  onVisible={handleVisible}
                  profixIcon={
                    visible ? (
                      <MdVisibility size={16} />
                    ) : (
                      <MdVisibilityOff size={16} />
                    )
                  }
                  onChange={handleChange}
                  value={value.password}
                />
              </div>
              {isError && <div className="text-red-500">{error.message}</div>}
              <div className="flex gap-2 justify-center mt-2">
                <span>Don't have an account?</span>
                <Link
                  to="/signup"
                  className="text-sky-500 hover:text-sky-500 duration-150 cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
              <button type="submit" className="btn btn-success">
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
            <Divider />

            <ul className="flex justify-evenly">
              <li className="size-12 btn-circle btn">
                <FaGoogle className="size-5" />
              </li>
              <li className="size-12 btn-circle btn">
                <FaFacebookF className="size-5" />
              </li>
              <li className="size-12 btn-circle btn">
                <FaXTwitter className="size-5" />
              </li>
              <li className="size-12 btn-circle btn">
                <FaGithub className="size-5" />
              </li>
              <li className="size-12 btn-circle btn">
                <BsInstagram className="size-5" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
