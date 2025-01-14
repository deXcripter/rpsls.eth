"use client";

import { useRouter } from "next/navigation";

interface iButton {
  className: string;
  prompt: string;
  url: string;
}

function Button({ prompt, className, url }: iButton) {
  const router = useRouter();

  const handleOnClock = () => {
    router.push(`/${url}`);
  };

  return (
    <button
      type="button"
      className={`px-4 py-1 ${className}`}
      onClick={handleOnClock}
    >
      {prompt}
    </button>
  );
}

export default Button;
