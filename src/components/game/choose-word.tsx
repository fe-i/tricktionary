import Layout from "../layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";
import Button from "../button";

type WordType = { word: string; definition: string };

const ChooseWord: React.FC = () => {
  const router = useRouter();
  const [words, setWords] = useState<WordType[]>([]);
  const [idx, setIdx] = useState(-1);

  const slug = router.query.slug?.toString() ?? "";
  const roomQuery = api.room.findUnique.useQuery({
    roomCode: slug,
  });

  const getWords = () => {
    fetch("/api/word?quantity=4")
      .then((r) => r.json())
      .then((data) => setWords(data as WordType[]))
      .catch(() => 0);
  };

  useEffect(() => {
    if (words.length) return;
    getWords();
  }, [words]);

  if (!words.length) return <Layout>Loading...</Layout>;

  const roomData = roomQuery.data;

  return (
    <Layout>
      <h2 className="-mb-8 text-3xl font-bold underline">Choose a word</h2>
      <p className="w-4/5 text-center">
        Choose a word you think will blend in with the fakes!
      </p>
      <div className="grid w-full grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {words.map(({ word, definition }, i) => (
          <WordCard
            word={word}
            definition={definition}
            active={idx === i}
            onClick={() => setIdx(i)}
            key={i}
          />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="gray"
          onClick={() => {
            getWords();
          }}
        >
          Shuffle
        </Button>
        <Button>Submit</Button>
      </div>
    </Layout>
  );
};

export default ChooseWord;

const WordCard: React.FC<{
  word: string;
  definition: string;
  active: boolean;
  onClick: () => void;
}> = ({ word, definition, active, onClick }) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded border-text transition-colors hover:bg-text/5",
        active
          ? "border-2 bg-text/10 px-[19px] pb-[39px] pt-[19px]"
          : "border px-5 pb-10 pt-5",
      )}
      onClick={onClick}
    >
      <h4 className="text-2xl font-bold">{word}</h4>
      <p className="w-[90%] text-center">{definition}</p>
    </div>
  );
};
