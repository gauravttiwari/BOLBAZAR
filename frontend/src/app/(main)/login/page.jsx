"use client";
import useAppContext from "@/context/AppContext";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as Yup from "yup";

const Login = () => {

  const { setLoggedIn, setCurrentUser } = useAppContext();

  const router = useRouter();

  const addUserSchema = Yup.object().shape({});

  const addUserForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, action) => {
      console.log(values);

      const res = await fetch("http://localhost:5000/user/authenticate", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.status);

      if (res.status === 200) {
        toast.success("Login Successfull");
        const data = await res.json();
        console.log(data);
        sessionStorage.setItem('user', JSON.stringify(data))
        setLoggedIn(true);
        action.resetForm();
        router.push("/productView");
      } else if (res.status === 401) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Some error occured");
      }
    },
    validationSchema: addUserSchema,
  });

  return (
    <>
      <div
        className="container-fluid flex items-center justify-center bg-purple-50"
        style={{ height: "100vh" }}
      >
        <div className=" w-3/4 --tw-shadow-color: #000;  ">
          <div className="grid grid-cols-2 h-3/4">
            <div className="">
              <img
                src="https://www.pngplay.com/wp-content/uploads/6/E-Commerce-Shopping-PNG-Clipart-Background.png"
                alt=""
                className="px-5 py-4 "
              />
            </div>
            <div>
              <form onSubmit={addUserForm.handleSubmit}>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight  text-black">
                  Login to your account
                </h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6  text-black"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={addUserForm.handleChange}
                        value={addUserForm.values.email}
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#fffff]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6  mt-8 text-black"
                      >
                        Password
                      </label>
                      <div className="text-sm mt-8">
                        <a
                          href="/resetPassword"
                          className="font-semibold  hover:text-[#D4A056]-500 text-[#FC9B3C] "
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={addUserForm.handleChange}
                        value={addUserForm.values.password}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-[#000000] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#ffffff]"
                      />
                    </div>
                  </div>

                  <div className="mt-10">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-[#FC9B3C] mt-6 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-text-[#D4A056] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="text-sm mt-8 text-center">
                    <a
                      href="/signup"
                      className="font-semibold  hover:text-[#D4A056]-500 text-[#FC9B3C] "
                    >
                      Yet not register? Register Here!
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
