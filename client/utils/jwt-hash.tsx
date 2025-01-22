import crypto from "crypto";

export const sendToken = () => {
  const hash = crypto.createHash("sha256");
  hash.update(process.env.NEXT_PUBLIC_JWT_SECRET as string);
  return hash.digest("hex");
};
