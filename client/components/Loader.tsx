import React from "react";

const Loader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[150px]">
      <div className="animate-spin rounded-full border-t-4 border-b-4 border-blue-500 h-16 w-16 mb-4"></div>
      {message && <p className="text-lg text-gray-700">{message}</p>}
    </div>
  );
};

export default Loader;
