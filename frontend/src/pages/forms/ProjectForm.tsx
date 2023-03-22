import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const IdeaForm = () => {
  return (
    <>
      <Head>
        <title>DEVSOC'23 | Project Submission</title>
        <meta name="description" content="Idea Submission for DEVSOC'23" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#242E42] text-white">
        <div className="px-[2rem] pt-[4rem] pb-4 md:px-[8rem]">
          <p className="text-4xl">Post your Project</p>
        </div>
        <div className="border-[2px] border-[#37ABBC]" />
        <form className="px-[2rem] md:px-[8rem]">
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="col-span-4">
              <label
                htmlFor="projectName"
                className="text-md block pb-1 font-medium leading-6"
              >
                Name of your project*
              </label>
              <div className="mt-2 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  name="projectName"
                  id="projectName"
                  placeholder="Enter your project name"
                  className="block w-full min-w-0 flex-1 rounded-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="projectTagline"
                className="text-md block pb-1 font-medium leading-6"
              >
                Tagline of your project*
              </label>
              <div className="mt-2 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  name="projectTagline"
                  id="projectTagline"
                  placeholder="Give a catchy tagline for your project"
                  className="block w-full min-w-0 flex-1 rounded-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="buitWith"
                className="text-md block pb-1 font-medium leading-6"
              >
                Built with*
              </label>
              <div className="mt-2 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  name="builtWith"
                  id="builtWith"
                  placeholder="Languages, frameworks, platforms, cloudservices, APIs, etc."
                  className="block w-full min-w-0 flex-1 rounded-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="aboutProject"
                className="text-md -mb-1 block font-medium leading-6"
              >
                About your project*
              </label>
              <p className="mt-2 pb-2 text-sm text-gray-300">
                Don't forget to include your inspiration, learnings, project
                construction method, and difficulties you encountered in your
                writing.
              </p>
              <div className="mt-2">
                <textarea
                  id="aboutProject"
                  name="aboutProject"
                  placeholder="Write a brief description of your project"
                  rows={20}
                  className="block w-full min-w-0 flex-1 rounded-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="imageGallery"
                className="text-md -mb-1 block font-medium leading-6"
              >
                Image Gallery*
              </label>
              <p className="mt-2 pb-2 text-sm text-gray-300">
                JPG, PNG or GIF format, 5 MB max file size.
              </p>
              <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-[#37ABBC] px-6 pt-5 pb-6">
                <div className="space-y-1 py-4 text-center">
                  <div className="flex text-sm">
                    <label
                      htmlFor="imageGallery"
                      className="relative mx-auto cursor-pointer rounded-md bg-[#37ABBC] p-2 font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-[#288391]"
                    >
                      <span>Choose files</span>
                      <input
                        id="imageGallery"
                        name="imageGallery"
                        type="file"
                        className="sr-only"
                        multiple
                      />
                    </label>
                  </div>
                  <p className="pl-1 text-gray-300">or drag and drop</p>
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="githublink"
                className="text-md -mb-1 block font-medium leading-6"
              >
                GitHub Link*
              </label>
              <p className="mt-2 pb-1 text-sm text-gray-300">
                Make sure your repository is public.
              </p>
              <div className="mt-2 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  name="githublink"
                  id="githublink"
                  placeholder="Share the link to your GitHub repository"
                  className="block w-full min-w-0 flex-1 rounded-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="figmalink"
                className="text-md -mb-1 block font-medium leading-6"
              >
                Figma Link*
              </label>
              <p className="mt-2 pb-1 text-sm text-gray-300">
                Make sure to give viewing permissions.
              </p>
              <div className="mt-2 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  name="figmalink"
                  id="figmalink"
                  placeholder="Share the link to your Figma file"
                  className="block w-full min-w-0 flex-1 rounded-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="extradocs"
                className="text-md -mb-1 block font-medium leading-6"
              >
                Any Other Documents?
              </label>
              <p className="mt-2 pb-2 text-sm text-gray-300">
                Images, PDFs, Documents, etc. 5 MB max file size.
              </p>
              <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-[#37ABBC] px-6 pt-5 pb-6">
                <div className="space-y-1 py-4 text-center">
                  <div className="flex text-sm">
                    <label
                      htmlFor="extradocs"
                      className="relative mx-auto cursor-pointer rounded-md bg-[#37ABBC] p-2 font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-[#288391]"
                    >
                      <span>Choose files</span>
                      <input
                        id="extradocs"
                        name="extradocs"
                        type="file"
                        className="sr-only"
                        multiple
                      />
                    </label>
                  </div>
                  <p className="pl-1 text-gray-300">or drag and drop</p>
                </div>
              </div>
            </div>
          </div>

          <div className="py-10">
            <div className="flex justify-start">
              <button
                type="submit"
                className="rounded-md bg-[#37ABBC] py-3 px-10 text-md font-semibold text-white shadow-sm hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="ml-3 rounded-md bg-transparent py-3 px-10 text-md font-semibold shadow-sm border border-gray-300 hover:bg-[#288391] hover:border-transparent"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default IdeaForm;
