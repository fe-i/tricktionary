import Layout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

const ChooseWord: React.FC = () => {
  const router = useRouter();
  const [words, setWords] = useState<{ word: string; definition: string }[]>([
    {
      word: "florgen",
      definition:
        "Ipsum ad do consequat ex do consectetur mollit exercitation excepteur. Sunt adipisicing aute ut ullamco minim velit et quis excepteur eu laboris. Irure aliquip Lorem anim ex nostrud enim culpa officia laboris aute exercitation ullamco est consequat.",
    },
    {
      word: "smashpop",
      definition:
        "Nulla incididunt occaecat aute deserunt fugiat. Cupidatat fugiat minim quis nulla proident ad duis ad quis est aliquip duis cillum ullamco. Do ut nisi cupidatat enim. Nulla Lorem non reprehenderit cillum. Aute ea eiusmod nisi culpa aliquip velit elit est culpa. Consectetur tempor velit ullamco incididunt ea nisi cillum elit adipisicing exercitation officia cupidatat duis ad. Ex cillum elit mollit eiusmod ad dolore adipisicing proident elit ipsum commodo fugiat id.",
    },
    {
      word: "tootsie",
      definition:
        "Aliquip reprehenderit dolore non adipisicing minim elit pariatur deserunt velit. Sit proident elit ea ex pariatur aliqua quis commodo sunt duis consequat occaecat incididunt. Esse magna non qui cillum commodo. Irure magna deserunt magna amet reprehenderit laboris fugiat anim sint magna.",
    },
    {
      word: "florgen",
      definition:
        "Lorem cillum et aute deserunt. Adipisicing incididunt est ut ullamco commodo quis ea. Magna culpa aliquip duis deserunt qui aliquip non adipisicing proident laborum tempor cillum dolore nulla. Et anim culpa occaecat irure esse sunt nulla do deserunt velit occaecat velit.",
    },
    {
      word: "smashpop",
      definition:
        "Nostrud minim pariatur dolor fugiat. Eu mollit incididunt sunt aliqua commodo sunt occaecat amet veniam amet voluptate sint ex. Aliquip do aute fugiat culpa mollit est. Reprehenderit laborum ipsum labore eu aliquip.",
    },
    {
      word: "tootsie",
      definition:
        "In occaecat anim est incididunt veniam dolor irure cillum ea anim. Lorem qui enim proident occaecat reprehenderit. Veniam amet ipsum dolore quis eiusmod ad incididunt ut consectetur velit consectetur. Ex ad in minim ea qui aliquip occaecat ut adipisicing mollit Lorem Lorem. Ex eiusmod minim eu excepteur reprehenderit id irure officia. Nostrud nostrud excepteur sit cillum ullamco amet occaecat ex veniam proident id Lorem.",
    },
  ]);
  const [idx, setIdx] = useState(-1);

  const slug = router.query.slug?.toString() ?? "";
  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });

  useEffect(() => {
    fetch("https://dictionary-game-silk.vercel.app/api/word?quantity=4", {
      mode: "no-cors",
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => console.log(r))
      .catch(() => 0);
  }, []);

  // https://dictionary-game-silk.vercel.app/api/word?quantity=4

  const roomData = roomQuery.data;

  return (
    <Layout>
      <h2 className="text-3xl font-bold underline">Choose a word</h2>
      <div className="grid w-full grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {words.map(({ word, definition }, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center gap-2 rounded border-text transition-colors",
              idx === i
                ? "border-2 bg-text/10 px-[19px] pb-[39px] pt-[19px]"
                : "border px-5 pb-10 pt-5",
            )}
            onClick={() => setIdx(i)}
          >
            <h4 className="text-lg font-bold">{word}</h4>
            <p className="w-[90%] text-center">{definition}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ChooseWord;
