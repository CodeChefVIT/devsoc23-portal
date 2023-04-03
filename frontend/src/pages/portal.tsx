import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IconContext } from "react-icons";

function Portal() {
  const [year, setYear] = useState(2000);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const uploadedImage = useRef(null);
  console.log(uploadedImage.current);

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
      console.log(uploadedImage);
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
  };

  return (
    <>
      <div className="background-color: #242E42 px-[2rem] pt-[4rem] pb-4 md:px-[8rem]">
        <p className="text-4xl">Personal Information</p>
      </div>
      <div className="border-[2px] border-[#37ABBC]" />
      <form className="max-w-4xl space-y-8 divide-y divide-gray-200 px-[50px] text-white md:px-[100px]">
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
                  {/* {uploadedImage.current === null && (
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {uploadedImage.current !== null && (
                  <img ref={uploadedImage} className="w-full h-full" />
                )} */}
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
                {/* <div
                style={{
                  height: "60px",
                  width: "60px",
                  border: "2px dashed black",
                }}
              >
                <img
                ref={uploadedImage}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                />
              </div>
              <input
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageUpload}
              ></input> */}

                <input
                  type="file"
                  id="upload"
                  className="ml-5 rounded-md bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onChange={onSelectFile}
                  hidden
                />
                <label for="upload">
                  <IconContext.Provider value={{ color: "#37ABBC" }}>
                    <AiOutlineCloudUpload className="pl-3 text-4xl" />
                  </IconContext.Provider>
                </label>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Write a few sentences about yourself.
                </p>
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
                    className="block w-[50%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer Not to Say</option>
                  </select>
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
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  College Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="college-name"
                    id="college-name"
                    autoComplete=""
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="birthMonth"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Birth Month
                </label>
                <div className="mt-2">
                  <select
                    id="birthMonth"
                    name="birthMonth"
                    autoComplete="birthMonth"
                    className="block w-[75%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2 ">
                <label
                  htmlFor="birth-year"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Birth Year
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="birth-year"
                    id="birth-year"
                    autoComplete="birth-year"
                    maxLength={4}
                    pattern="[2][0][0-9][0-9]"
                    title="Please enter a valid year."
                    className="block w-[75%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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

        {/* <div>
        <YearPicker
          defaultValue={"select year"}
          start={2010} // default is 1900
          end={2020} // default is current year
          reverse // default is ASCENDING
          required={true} // default is false
          disabled={true} // default is false
          value={year} // mandatory
          onChange={(e) => {
            setYear(e); // mandatory
          }}
          id={"year"}
          name={"year"}
          classes={"classes"}
          optionClasses={"option classes"}
        />
      </div> */}
      </form>
    </>
  );
}

export default Portal;
