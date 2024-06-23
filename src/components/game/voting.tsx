import { Layout } from "~/components/shared/layout";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/cn";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const Voting: React.FC<{ word: string }> = ({ word }) => {
  const [idx, setIdx] = useState(-1);
  const definitionsQuery = api.definitions.getDefinitionsForVoting.useQuery();
  const definitions = definitionsQuery.data;
  const voteMutation = api.definitions.voteForDefinition.useMutation();
  const { data: vote, refetch: refetchHasVoted } =
    api.definitions.voteExists.useQuery();
  useEffect(() => {
    if (definitions && vote?.FakeDefinition?.definition) {
      setIdx(definitions.indexOf(vote.FakeDefinition.definition) ?? -1);
    }
  }, [definitions, vote]);

  if (!definitions) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <div className="mt-6 flex w-full items-center justify-between">
        <h1 className="font-bold">Voting Time!</h1>
        <Button
          variant="primary"
          disabled={idx === -1 || !!vote}
          onClick={async () => {
            if (!definitions[idx]) return;
            await voteMutation.mutateAsync({
              definition: definitions[idx]!,
            });
            await refetchHasVoted();
          }}
        >
          {vote ? "Submitted!" : "Submit"}
        </Button>
      </div>
      <p className="-mt-4 w-full text-left text-lg">
        Find the real definition for <span className="font-bold">{word}</span>{" "}
        hidden among the fake defintions!
      </p>
      <div className="grid w-full grid-rows-1 gap-4 px-4 md:grid-cols-2 md:gap-8 md:px-8 lg:grid-cols-3">
        {definitions.map((def, i) => (
          <WordCard
            definition={def ?? ""}
            active={idx === i}
            onClick={() => {
              if (!vote) setIdx(i);
            }}
            key={i}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Voting;

const WordCard: React.FC<{
  definition: string;
  active: boolean;
  onClick: () => void;
}> = ({ definition, active, onClick }) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded border-text transition-colors hover:bg-text/5",
        active
          ? "border-2 bg-text/10 px-[19px] pb-[19px] pt-[19px]"
          : "border px-5 pb-5 pt-5",
      )}
      onClick={onClick}
    >
      <p className="w-[90%] text-center">{definition.toUpperCase()}</p>
    </div>
  );
};
