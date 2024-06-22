import { Layout } from "~/components/shared/layout";
import { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

type WordType = { word: string; definition: string };

const ChooseWord: React.FC<{
  updateRoom: () => Promise<void>;
}> = ({ updateRoom }) => {
  const { toast } = useToast();

  const [words, setWords] = useState<WordType[]>([]);
  const [idx, setIdx] = useState(-1);
  const [shuffling, setShuffling] = useState(false);

  const chooseWordMutation = api.room.chooseWord.useMutation();

  const getWords = useCallback(() => {
    setShuffling(true);
    fetch("/api/word?quantity=4")
      .then((res) => res.json())
      .then((data) => {
        setWords(data as WordType[]);
        setTimeout(() => setShuffling(false), 5000);
      })
      .catch(() => {
        toast({
          title: "Words Not Found",
          description: "Something went wrong, try again in a few seconds!",
        });
        setTimeout(() => setShuffling(false), 3000);
      });
  }, [toast]);

  useEffect(() => {
    if (words.length) return;
    getWords();
  }, [words, getWords]);

  if (!words.length) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h2 className="-mb-4 text-3xl font-bold underline">Choose</h2>
      <p className="w-4/5 text-center">
        Select a word that you think will blend in with the fakes!
      </p>
      <div className="grid w-full grid-rows-1 gap-4 px-4 md:grid-cols-2 md:gap-8 md:px-8 lg:grid-cols-3">
        {words.map(({ word, definition }, i) => {
          console.log(word, "----", definition);
          return (
            <WordCard
              word={word}
              definition={definition}
              active={idx === i}
              onClick={() => setIdx(i)}
              key={i}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={getWords} disabled={shuffling}>
          Regenerate
        </Button>
        <Button
          onClick={async () => {
            if (!words[idx]) return;
            await chooseWordMutation.mutateAsync({ ...words[idx]! });
            await updateRoom();
          }}
        >
          Submit
        </Button>
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
