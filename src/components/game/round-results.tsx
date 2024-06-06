import { Layout } from "../ui/layout";
import { api } from "~/utils/api";
import { Button } from "../button";

const RoundResults: React.FC<{
  currentRound: number;
  isChooser: boolean;
  isHost: boolean;
}> = ({ currentRound, isChooser, isHost }) => {
  const resultsQuery = api.room.getRoundResults.useQuery();
  const results = resultsQuery.data;

  return (
    <Layout>
      <div className="mt-6 flex w-full items-center justify-between">
        <h1 className="font-bold">Round #{currentRound} Results!</h1>
        {isHost && (
          <Button
            variant="primary"
            onClick={async () => {
              // await voteMutation.mutateAsync({
              //   definition: definitions[idx]!,
              // });
              // await refetchHasVoted();
            }}
          >
            Next Round
          </Button>
        )}
      </div>

      <h3 className="mt-3 text-4xl font-bold capitalize">
        {results?.realWord}
      </h3>
      <div className="flex w-full gap-4">
        <InfoBox>
          <p className="text-xl underline">The definition was:</p>
          <p className="text-xl font-light">{results?.realDefinition}</p>
        </InfoBox>
        <InfoBox>
          <p className="mb-3 text-xl underline">
            The most chosen definition was:
          </p>
          <p className="text-xl font-light">{results?.mostChosenDefinition}</p>
        </InfoBox>
        {!isChooser && results?.currentUserDefinition && (
          <InfoBox>
            <p className="mb-3 text-xl underline">Your fake definition was:</p>
            <p className="text-xl font-light">
              {results?.currentUserDefinition}
            </p>
          </InfoBox>
        )}
      </div>
    </Layout>
  );
};

export default RoundResults;

const InfoBox: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-text px-6 py-8">
      {children}
    </div>
  );
};
