"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import InputComponent from "@/components/FormElements/InputComponent";
import { forgotFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";
import { forgot } from "@/services/forgot";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Notification from "@/components/Notification";

export default function Forgot() {
  const initialFormdata = {
    email: "",
  };
  const { componentLevelLoader, setComponentLevelLoader } =
    useContext(GlobalContext);

  const router = useRouter();

  const [formData, setFormData] = useState(initialFormdata);
  const [foundUser, setFoundUser] = useState(null);

  function isValidForm() {
    return formData && formData.email && formData.email.trim() !== ""
      ? true
      : false;
  }

  async function handleEmail() {
    setComponentLevelLoader({ loading: true, id: "" });
    const res = await forgot(formData);

    console.log(res);

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFoundUser(true);
      setFormData(initialFormdata);
      setComponentLevelLoader({ loading: false, id: "" });
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFoundUser(false);
      setComponentLevelLoader({ loading: false, id: "" });
    }
    console.log(foundUser);
  }
  useEffect(() => {
    if (foundUser) router.push("/reset");
  }, [foundUser]);

  return (
    <div className="flex flex-col items-center my-4 mx-2">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <div className=" flex flex-col items-center mt-6">
        {forgotFormControls.map((controlItem) =>
          controlItem.componentType === "input" ? (
            <InputComponent
              type={controlItem.type}
              placeholder={controlItem.placeholder}
              label={controlItem.label}
              value={formData[controlItem.id]}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  [controlItem.id]: event.target.value,
                });
              }}
            />
          ) : null
        )}
        <button
          className="disabled:opacity-50 my-4 inline-flex w-full items-center justify-center bg-black px-6 py-3 text-lg 
                     text-white transition-all duration-200 ease-in-out focus:shadow font-medium rounded-md tracking-wide
                     "
          disabled={!isValidForm()}
          onClick={handleEmail}
        >
          {componentLevelLoader && componentLevelLoader.loading ? (
            <ComponentLevelLoader
              text={"Logging In"}
              color={"#ffffff"}
              loading={componentLevelLoader && componentLevelLoader.loading}
            />
          ) : (
            "Submit"
          )}
        </button>
        <button
          onClick={() => router.push("/login")}
          className="text-md font-semibold"
        >
          --- Login Here ---
        </button>
      </div>
      <Notification />
    </div>
  );
}
