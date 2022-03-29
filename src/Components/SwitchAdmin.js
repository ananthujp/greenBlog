import React, { useState, useEffect } from "react";
import useAuth from "../hooks/userAuth";
function SwitchAdmin() {
  const { userID, switChId } = useAuth();
  const [value, setValue] = useState(
    userID.id !== "HyAS9bQrGoNbH6yekzzK" ? 0 : 1
  );
  useEffect(() => {
    switChId(value);
  }, [value]);

  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        class="w-28 mx-4 text-indigo-400"
        step="1"
      />
      <div class="w-full -mt-1 mb-1 flex justify-between text-xs px-2 font-pop text-blue-600">
        <span>User</span>
        <span>Admin</span>
      </div>
    </div>
  );
}

export default SwitchAdmin;
