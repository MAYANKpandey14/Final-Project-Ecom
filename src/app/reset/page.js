"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import InputComponent from "@/components/FormElements/InputComponent";
import { resetFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";
import { reset } from "@/services/reset";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Notification from "@/components/Notification";

export default function Reset() {
  const router = useRouter();

  const initialFormdata = {
    newPassword: "",
  };

  const { componentLevelLoader, setComponentLevelLoader } =
    useContext(GlobalContext);

  const [formData, setFormData] = useState(initialFormdata);
  const [isReset, setIsReset] = useState(null);

  function isValidForm() {
    return formData &&
      formData.newPassword &&
      formData.newPassword.trim() !== ""
      ? true
      : false;
  }

  async function handlePasswordReset() {
    setComponentLevelLoader({ loading: true, id: "" });
    const result = await reset(formData);
    console.log(result);

    if (result.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsReset(true);
      setFormData(initialFormdata);
      setComponentLevelLoader({ loading: false, id: "" });
    } else {
      toast.error(result.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsReset(false);
      setComponentLevelLoader({ loading: false, id: "" });
    }
    console.log(isReset);
  }
  useEffect(() => {
    if (isReset) router.push("/login");
  }, [isReset]);

  return (
    <div className="flex flex-col items-center my-4 mx-2">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <div className=" my-6">
        {resetFormControls.map((controlItem) =>
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
          onClick={handlePasswordReset}
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
      </div>
      <Notification />
    </div>
  );
}
