import { useState, useRef, useEffect } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IconContext } from "react-icons";
import FormData from "form-data";
import { useFormik } from "formik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { z } from "zod";
import * as Yup from "yup";

const initialValues = {
  first_name: "",
  last_name: "",
  about: "",
  email: "",
  password: "",
  phone_number: "",
  gender: "",
  college_name: "",
  dob: "",
};

// type FormData = {
//   first_name: string;
//   last_name: string;
//   about: string;
//   email: string;
//   password: string;
//   phone_number: string;
//   gender: string;
//   college_name: string;
//   dob: string;
// };

function Portal() {
  // const schema = z.object({
  //   first_name: z
  //     .string()
  //     .min(2)
  //     .max(20)
  //     .refine((i) => i.length <= 25, {
  //       message: "Please enter a First Name",
  //     }),
  //   last_name: z.string().min(2).max(20),
  //   about: z.string().min(2).max(300),
  //   email: z.string().email(),
  //   password: z.string().min(8).max(20),
  //   phone_number: z.string().min(10).max(10),
  //   gender: z.string(),
  //   college_name: z.string().min(2).max(20),
  //   dob: z.string(),
  // });

  // const validateFormData = (inputs: unknown) => {
  //   const isValidData = schema.safeParse(inputs);
  //   return isValidData;
  // };

  const portalSchema = Yup.object({
    first_name: Yup.string()
      .min(2)
      .max(25)
      .required("Please enter a First Name"),
    last_name: Yup.string().min(2).max(25).required("Please enter a Last Name"),
    about: Yup.string().min(2).max(300).required("Please enter a valid About"),
    email: Yup.string().email().required("Please enter a valid Email"),
    password: Yup.string()
      .min(6)
      .max(20)
      .required("Please enter a valid Password"),
    phone_number: Yup.string()
      .min(10)
      .max(10)
      .required("Please enter a valid Phone Number"),
    gender: Yup.string().required("Please pick your Gender"),
    college_name: Yup.string()
      .min(2)
      .max(20)
      .required("Please enter a valid College Name"),
    //dob: Yup.string().required("Please enter a valid Date of Birth"),
  });

  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const uploadedImage = useRef(null);
  let formData = new FormData();
  //console.log(uploadedImage.current);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      //console.log(uploadedImage);
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);

    const file = e.target.files[0];
    formData.append("file", file);
    console.log(file);
    console.log(formData);
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: portalSchema,
      onSubmit: (values, action) => {
        console.log(values);
        action.resetForm();
      },
    });
  console.log(errors);

  // const submitData = (values: FormData) => {
  //   console.log("It worked", values);
  // };

  return (
    <>
      <main>
        <div className="background-color: #242E42 px-[2rem] pt-[4rem] pb-4 md:px-[8rem]">
          <p className="text-4xl">Personal Information</p>
        </div>
        <div className="border-[2px] border-[#37ABBC]" />
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl space-y-8 divide-y divide-gray-200 px-[50px] text-white md:px-[100px]"
        >
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="pt-1">
              <div className="pt-[20px] sm:col-span-6">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center">
                  <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    {!selectedFile ? (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <img src={preview} className="h-full w-full" />
                    )}
                  </span>

                  <input
                    type="file"
                    id="upload"
                    className="ml-5 rounded-md bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onChange={onSelectFile}
                    hidden
                  />
                  <label htmlFor="upload">
                    <IconContext.Provider value={{ color: "#37ABBC" }}>
                      <AiOutlineCloudUpload className="pl-3 text-4xl" />
                    </IconContext.Provider>
                  </label>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.first_name && touched.first_name ? (
                      <span className="form-error">{errors.first_name}</span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.last_name && touched.last_name ? (
                      <span className="form-error">{errors.last_name}</span>
                    ) : null}
                  </div>
                </div>

                {/* About / Bio */}
                <div className="sm:col-span-6">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      value={values.about}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Write a few sentences about yourself.
                  </p>
                  {errors.about && touched.about ? (
                    <span className="form-error">{errors.about}</span>
                  ) : null}
                </div>

                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div> */}

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email && touched.email ? (
                      <span className="form-error">{errors.email}</span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      autoComplete=""
                      value={values.phone_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.phone_number && touched.phone_number ? (
                      <span className="form-error">{errors.phone_number}</span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete=""
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 lg:w-[49%]"
                    />
                    {errors.password && touched.password ? (
                      <span className="form-error">{errors.password}</span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Gender
                  </label>
                  <div className="mt-2">
                    <select
                      id="gender"
                      name="gender"
                      autoComplete="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-[50%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    >
                      <option value="" label="Choose your gender" />
                      <option value="Male" label="Male" />
                      <option value="Female" label="Female" />
                      <option
                        value="Prefer Not to Say"
                        label="Prefer Not to Say"
                      />
                    </select>
                    {errors.gender && touched.gender ? (
                      <span className="form-error">{errors.gender}</span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Education
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="college_name"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    College Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="college_name"
                      id="college_name"
                      autoComplete=""
                      value={values.college_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.college_name && touched.college_name ? (
                      <span className="form-error">{errors.college_name}</span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    DOB
                  </label>
                  <div className="mt-2">
                    <LocalizationProvider
                      name="dob"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      dateAdapter={AdapterDayjs}
                    >
                      <DatePicker format="DD-MM-YYYY" />
                    </LocalizationProvider>
                    {errors.dob && touched.dob ? (
                      <span className="form-error">{errors.dob}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-start">
              <button
                type="button"
                className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md bg-[#37ABBC] py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default Portal;
