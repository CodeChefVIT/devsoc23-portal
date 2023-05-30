import { useState, useEffect } from "react";
import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IconContext } from "react-icons";
// import FormData from "form-data";
import { useFormik } from "formik";
// import { type Dayjs } from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Router from "next/router";
import getToken from "~/utils/GetAccessToken";
import axios from "axios";
import Image, { type StaticImageData } from "next/image";
import { type ServerResponse } from "types/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Head from "next/head";
import Loader from "~/components/Loader";

interface Values {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  //password: string;
  phoneNumber: string | undefined;
  gender: string;
  college: string;
  birthDate: string;
  mode: string;
  github: string;
  image: File | undefined;
  otherCollege: string;
}

function Profile() {
  const initialValues: Values = {
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    //password: "",
    phoneNumber: "",
    gender: "Choose",
    college: "Choose",
    birthDate: "",
    mode: "Choose",
    github: "",
    image: undefined,
    otherCollege: "",
  };
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isVITian, setIsVITian] = useState(false);
  const [isOtherCollege, setIsOtherCollege] = useState(false);

  let accessToken: string | undefined = "";
  // const [dob, setValue] = React.useState<Dayjs | null>(null);

  // const portalSchema = Yup.object({
  //   firstName: Yup.string()
  //     .min(2)
  //     .max(25)
  //     .required("Please enter a First Name"),
  //   lastName: Yup.string().min(2).max(25).required("Please enter a Last Name"),
  //   bio: Yup.string().min(2).max(300).required("Please enter a valid bio"),
  //   email: Yup.string().email().required("Please enter a valid Email"),
  //   // password: Yup.string()
  //   //   .min(6)
  //   //   .max(20)
  //   //   .required("Please enter a valid Password"),
  //   phoneNumber: Yup.string()
  //     .min(10)
  //     .max(13)
  //     .required("Please enter a valid Phone Number"),
  //   gender: Yup.string().required("Please pick your Gender"),
  //   college: Yup.string()
  //     .min(2)
  //     .max(50)
  //     .required("Please enter a valid College Name"),
  //   dob: Yup.string().required("Please enter a valid Date of Birth"),
  // });

  const profileSchema = z.object({
    firstName: z
      .string({
        required_error: "Required",
        invalid_type_error: "First name must be a string",
      })
      .min(2, "First name must have min 2 chars")
      .max(20, "First name must have max 20 chars"),
    lastName: z
      .string({
        required_error: "Required",
        invalid_type_error: "Last name must be a string",
      })
      .max(20, "Last name must have max 20 chars"),
    phoneNumber: z
      .string({
        required_error: "Required",
        invalid_type_error: "Phone number must be a string",
      })
      .min(12, "Enter a valid phone number")
      .max(12, "Enter a valid phone number"),
    gender: z
      .literal("Male")
      .or(z.literal("Female"))
      .or(z.literal("Prefer Not to Say")),
    bio: z
      .string({
        required_error: "Required",
        invalid_type_error: "Bio must be a string",
      })
      .min(40, "Bio must have min 40 chars")
      .max(500, "Bio must have max 500 chars"),
    college: z.literal("VIT Vellore").or(z.literal("Others")),
    birthDate: z
      .string({
        required_error: "Required",
        invalid_type_error: "Birth date must be a string",
      })
      .regex(
        /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Enter a valid date"
      ),
    mode: z.literal("online").or(z.literal("offline")),
    github: z
      .string({
        required_error: "Github Account is required",
        invalid_type_error: "Github Account must be a string",
      })
      .url({ message: "Please enter a valid url" })
      .includes("github.com", { message: "Please enter a github link" })
      .or(z.string().regex(/^NA$/)),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: (values, action) => {
      setIsSubmitting(true);
      void submitUser(values);
      // console.log(values);
      action.resetForm();
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;

  // const { values, submitForm } = useFormikContext();

  const getUser = async () => {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/me`;
    try {
      accessToken = await getToken();
      if (!accessToken) return;
      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      const { data } = await axios.get<ServerResponse>(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // console.log(data);
      if (data.status) {
        values.firstName = data.user.firstName;
        values.lastName = data.user.lastName;
        values.bio = data.user.bio;
        values.email = data.user.email;
        values.gender = data.user.gender;
        values.phoneNumber = data.user.phoneNumber;
        values.college = data.user.college;
        values.birthDate = data.user.birthDate;
        values.mode = data.user.mode;
        values.github = data.user.github;
        // console.log(data.user.image);
        setPreview(data.user.image);
        if (values.college === "VIT Vellore") {
          setIsVITian(true);
        } else {
          setIsVITian(false);
          values.college = "Others";
          setIsOtherCollege(true);
          values.mode = "online";
          values.otherCollege = data.user.college;
        }
        void formik.setValues(values);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setIsOpen(true);
      setIsSuccess(false);
      setMessage("Something went wrong. Please try again later");
      setTimeout(() => {
        setIsOpen(false);
        void Router.push("/dashboard");
      }, 2000);
      // console.log("err");
      // void Router.push("../");
    }
  };

  const submitUser = async (values: {
    firstName: string;
    lastName: string;
    bio: string;
    email: string;
    phoneNumber: string | undefined;
    gender: string;
    college: string;
    birthDate: string;
    mode: string;
    github: string;
    image: File | undefined;
  }) => {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
    // const formData = new FormData();
    // const x = `+${values.phoneNumber as string}`;
    // console.log(x);
    // formData.append("firstName", values.firstName);
    // formData.append("lastName", values.lastName);
    // formData.append("bio", values.bio);
    // formData.append("email", values.email);
    // formData.append("phoneNumber", `+${values.phoneNumber as string}`);
    // formData.append("gender", values.gender);
    // formData.append("birthDate", values.birthDate);
    // formData.append("mode", values.mode);
    // formData.append("github", values.github);
    // formData.append("image", values.image);
    if (formik.values.college === "Others") {
      // console.log(values.otherCollege);
      values.college = formik.values.otherCollege;
    } else values.college = formik.values.college;
    // console.log(formData);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/update`;
    try {
      accessToken = await getToken();
      if (!accessToken) return;
      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      //   body: JSON.stringify(values),
      // });
      const { data } = await axios.post<ServerResponse>(url, values, {
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Router.reload();
      // console.log(data);
      // console.log(values);
      if (data.status === "true") {
        setIsSubmitting(false);
        setIsOpen(true);
        setIsSuccess(true);
        setMessage("Changes saved successfully");
        setTimeout(() => {
          setIsOpen(false);
          void Router.push("/dashboard");
        }, 2000);
      } else {
        setIsSubmitting(false);
        setIsOpen(true);
        setIsSuccess(false);
        setMessage("Something went wrong. Please try again later");
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } catch (err) {
      setIsSubmitting(false);
      setIsOpen(true);
      setIsSuccess(false);
      setMessage("Something went wrong. Please try again later");
      setTimeout(() => {
        setIsOpen(false);
        void Router.reload();
      }, 2000);
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<StaticImageData | string | undefined>(
    ""
  );

  // const uploadedImage = useRef<HTMLInputElement>(null);
  // const formData = new FormData();
  //console.log(uploadedImage.current);

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files === null) return;
  //   const file = files.item(0);
  //   if (file) {
  //     const reader = new FileReader();
  //     const { current } = uploadedImage;
  //     if (!current) return;
  //     current.files = file;
  //     reader.onload = (e) => {
  //       current.src = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //     //console.log(uploadedImage);
  //   }
  // };

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

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    const file = e.target.files[0];
    const type = file?.type;
    if (!type?.match(/^image\/[a-zA-Z]*$/)) {
      alert("Please upload an image");
      return;
    }

    setSelectedFile(file);

    void formik.setFieldValue("image", file);
    // console.log(formData);
  };

  // console.log(errors);

  useEffect(() => {
    void getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values.college === "VIT Vellore") {
      setIsVITian(true);
      setIsOtherCollege(false);
    } else if (formik.values.college === "Others") {
      setIsVITian(false);
      setIsOtherCollege(true);
      void formik.setFieldValue("mode", "online");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.college]);

  // const submitData = (values: FormData) => {
  //   console.log("It worked", values);
  // };

  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Profile</title>
        <meta name="description" content="DEVSOC'23 Sign Up Page" />
        <link rel="icon" href="/devsoc.png" />
      </Head>
      {loading && (
        <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
          <Loader />
        </main>
      )}
      {!loading && (
        <main>
          <div className="background-color: #242E42 px-[50px] pb-4 pt-[4rem] md:px-[100px]">
            <p className="text-4xl">Personal Information</p>
          </div>
          <div className="border-[2px] border-[#37ABBC]" />
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl space-y-8 px-[50px] text-white md:px-[100px]"
          >
            <div className="space-y-8 ">
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
                      {!preview && !selectedFile ? (
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <Image
                          alt="preview"
                          src={preview as string}
                          height={40}
                          width={40}
                          className="h-full w-full rounded-full"
                          // className="h-12 w-12"
                        />
                      )}
                    </span>

                    <input
                      type="file"
                      id="upload"
                      accept="image/*"
                      className="ml-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onChange={onSelectFile}
                      hidden
                    />
                    <label htmlFor="upload">
                      <IconContext.Provider value={{ color: "#37ABBC" }}>
                        <div className=" ml-2 flex flex-col justify-start">
                          <label className="text-sm">Max Image Size: 1MB</label>
                          <AiOutlineCloudUpload className="h-7 w-7 cursor-pointer text-4xl" />
                        </div>
                      </IconContext.Provider>
                    </label>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        autoComplete="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="First Name"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 
                      ${
                        touched.firstName && errors.firstName
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                      />
                      <span className="text-sm text-red-500">
                        {touched.firstName && errors.firstName}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        autoComplete="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Last Name"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6
                      ${
                        touched.lastName && errors.lastName
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                      />
                      <span className="text-sm text-red-500">
                        {touched.lastName && errors.lastName}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        disabled
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6
                        ${
                          touched.email && errors.email
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      />
                      <span className="text-sm text-red-500">
                        {touched.email && errors.email}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+91-1234567890"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6"
                      /> */}
                      <PhoneInput
                        country={"in"}
                        preferredCountries={["in"]}
                        value={values.phoneNumber}
                        onChange={(data) => {
                          void formik.setFieldValue("phoneNumber", data);
                        }}
                      />

                      <span className="text-sm text-red-500">
                        {touched.phoneNumber && errors.phoneNumber}
                      </span>
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
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                          touched.gender && errors.gender
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      >
                        <option
                          disabled
                          value="Choose"
                          label="Choose your gender"
                        />
                        <option value="Male" label="Male" />
                        <option value="Female" label="Female" />
                        <option
                          value="Prefer Not to Say"
                          label="Prefer Not to Say"
                        />
                      </select>
                      <span className="text-sm text-red-500">
                        {touched.gender && errors.gender}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Date of Birth
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={values.birthDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                          touched.birthDate && errors.birthDate
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      />
                      <span className="text-sm text-red-500">
                        {touched.birthDate && errors.birthDate}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="github"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      GitHub Profile (Enter NA if not applicable)
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="github"
                        id="github"
                        value={values.github}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="GitHub Profile"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                          touched.github && errors.github
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      />

                      <span className="text-sm text-red-500">
                        {touched.github && errors.github}
                      </span>
                    </div>
                  </div>

                  {/* bio / Bio */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      About
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:py-1.5 sm:text-sm sm:leading-6 ${
                          touched.bio && errors.bio
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    <p className="mt-2 text-sm text-[#37ABBC]">
                      Write a few sentences about yourself.
                    </p>
                    <span className="text-sm text-red-500">
                      {touched.bio && errors.bio}
                    </span>
                  </div>

                  {/* <div className="sm:col-span-6">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Education
                  </label>
                </div> */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="college"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      University Name
                    </label>
                    <div className="mt-2">
                      <select
                        id="college"
                        name="college"
                        value={values.college}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                          touched.college && errors.college
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      >
                        <option
                          disabled
                          value="Choose"
                          label="Choose your university"
                        />
                        <option value="VIT Vellore" label="VIT Vellore" />
                        <option value="Others" label="Other" />
                      </select>
                      <span className="text-sm text-red-500">
                        {touched.college && errors.college}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="mode"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Mode of Participation
                    </label>
                    <div className="mt-2">
                      <select
                        disabled={!isVITian}
                        id="mode"
                        name="mode"
                        value={values.mode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                          touched.mode && errors.mode
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      >
                        <option
                          disabled
                          value="Choose"
                          label="Choose your mode of participation"
                        />
                        <option value="online" label="Online" />
                        <option value="offline" label="Offline" />
                      </select>
                      <span className="text-sm text-red-500">
                        {touched.mode && errors.mode}
                      </span>
                    </div>
                  </div>

                  {isOtherCollege ? (
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="otherCollege"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        College Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="otherCollege"
                          id="otherCollege"
                          value={values.otherCollege}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="College Name"
                          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 
                      ${
                        touched.otherCollege && errors.otherCollege
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                        />

                        <span className="text-sm text-red-500">
                          {touched.otherCollege && errors.otherCollege}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="py-5">
              <div className="flex justify-start">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className={`text-md rounded-md ${
                    isSubmitting
                      ? "bg-[#288391] text-gray-400"
                      : "bg-[#37ABBC] text-white hover:bg-[#288391]"
                  } px-7 py-3 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
                >
                  {isSubmitting ? "Saving... " : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    void Router.push("/dashboard");
                  }}
                  type="button"
                  className="text-md ml-3 rounded-md border border-gray-300 bg-transparent px-10 py-3 font-semibold shadow-sm hover:border-transparent hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
          {isOpen && (
            <div
              className={`rounded-md ${
                isSuccess ? "bg-green-100" : "bg-red-50"
              } fixed bottom-2 right-1/2 mx-auto translate-x-1/2 p-4`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <div
                    className={`text-sm ${
                      isSuccess ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    <p>{message}</p>
                  </div>
                </div>
                <button
                  className="flex-shrink-0"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={`${isSuccess ? "green" : "red"}`}
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}

export default Profile;
