import Image from "next/image";

const elements = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function Elements({ name }: { name: string }) {
  //
  if (!elements.includes(name)) return null;

  return (
    <div>
      <div
        className={`${name.toLocaleLowerCase()} h-32 w-32 flex justify-center items-center rounded-full transition-transform transform hover:scale-110`}
      >
        <div
          className="bg-white h-24 w-24 flex justify-center items-center rounded-full transition-transform transform hover:scale-105"
          title={name}
        >
          <Image
            src={`/images/icon-${name.toLocaleLowerCase()}.svg`}
            alt={name}
            width={50}
            height={50}
            className="z-10"
          />
        </div>
      </div>
    </div>
  );
}

export default Elements;
