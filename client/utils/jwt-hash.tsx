export const sendHash = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const securehash =
    (array[0] * parseInt(process.env.NEXT_PUBLIC_SECRET as string)) / 2;
  return parseInt(securehash.toString().slice(0, 12));
};
