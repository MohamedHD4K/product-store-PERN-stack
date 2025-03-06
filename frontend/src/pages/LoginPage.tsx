import React, { useState } from "react";
import Input from "../components/shared/Input";
import Divider from "../components/shared/Divider";
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";

const SignupPage = () => {
  const [value, setValue] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const fetchLogIn = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(value),
      });

      if (!response.ok) throw new Error("have some error");

      return response.json();
    } catch (error) {
      console.log(error);
      throw new Error("have some error");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: fetchLogIn,
    onSuccess: () => {
      toast.success("loged in successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="p-5 h-screen-nav w-7xl flex justify-between">
        <div className="w-full">
          <div className="w-xl bg-base-100 h-full border rounded-3xl"></div>
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
                  placeholder="Enter your username"
                  name="username"
                  onChange={handleChange}
                  value={value.username}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  name="password"
                  onChange={handleChange}
                  value={value.password}
                />
              </div>
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
