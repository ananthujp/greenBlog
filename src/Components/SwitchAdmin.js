import React, { useState, useEffect } from "react";
import useAuth from "../hooks/userAuth";
function SwitchAdmin() {
  const { userID, switChId } = useAuth();
  const [value, setValue] = useState(
    userID?.id !== "HyAS9bQrGoNbH6yekzzK" ? false : true
  );
  useEffect(() => {
    switChId(value ? 1 : 0);
  }, [value]);
  useEffect(() => {
    userID?.id !== "HyAS9bQrGoNbH6yekzzK" ? setValue(false) : setValue(true);
  }, [userID]);
  return (
    <label class="relative w-24 flex justify-between items-center group p-2 font-poplg text-xs">
      <input
        checked={value}
        onChange={(e) => setValue(e.target.checked)}
        type="checkbox"
        class="absolute peer appearance-none rounded-md"
      />
      <span class="w-8 h-5 flex items-center flex-shrink-0 ml-1 p-0.5 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-0.5"></span>
      Admin
    </label>
  );
}

export default SwitchAdmin;
