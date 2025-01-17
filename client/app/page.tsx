import Button from "@/components/Button";

const defaultStyle =
  "px-24 w-[30%] py-5 mx-auto rounded-md text-xl font-semibold";

function Page() {
  return (
    <div className="max-h-screen h-screen flex flex-col gap-5 justify-center align-middle">
      <Button
        prompt="Create Game"
        className={`bg-green-400 ${defaultStyle}`}
        url="create-game"
      />
      <Button
        prompt="Join Game"
        className={`bg-blue-400 ${defaultStyle}`}
        url="join-game"
      />
    </div>
  );
}

export default Page;
