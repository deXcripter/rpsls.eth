import Image from "next/image";

const elements = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function Elements({
  name,
  setUserChoice,
  userChoice,
  hasPlayed,
}: {
  name: string;
  setUserChoice: (value: number) => void;
  userChoice: number | null;
  hasPlayed: boolean;
}) {
  if (!elements.includes(name)) return null;

  const handelSetUserChoice = (value: number) => {
    if (hasPlayed) return;
    setUserChoice(value);
  };

  return (
    <div>
      <div
        className={`${name.toLocaleLowerCase()} h-32 w-32 flex justify-center items-center rounded-full transition-transform transform hover:scale-110`}
        onClick={() => handelSetUserChoice(elements.indexOf(name) + 1)}
      >
        <div
          className={`bg-white h-24 w-24 flex justify-center items-center rounded-full transition-transform transform hover:scale-105`}
          title={name}
        >
          <Image
            src={`/images/icon-${name.toLocaleLowerCase()}.svg`}
            alt={name}
            width={45}
            height={45}
            className="z-10"
          />
        </div>
      </div>
    </div>
  );
}

export default Elements;
