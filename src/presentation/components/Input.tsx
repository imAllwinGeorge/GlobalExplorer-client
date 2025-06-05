import React from "react";
import { classNames } from "../../shared/utils";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      {...props}
      className={classNames(
        "block w-full rounded-xl  outline-[1px] outline-zinc-400 border-0 py-2 px-5 bg-secondary text-black font-light placeholder:text-gray-500/70",
        props.className || ""
      )}
    />
  );
};

export default Input;
