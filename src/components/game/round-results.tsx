import { Layout } from "~/components/shared/layout";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { UnderlineHover } from "~/components/ui/underline-hover";
import { Leaderboard, Podium } from "~/components/ui/leaderboard";

const RoundResults: React.FC<{
  currentRound: number;
  numRounds: number;
  isHost: boolean;
  isChooser?: boolean;
}> = ({ currentRound, numRounds, isHost, isChooser = false }) => {
  const resultsQuery = api.room.getRoundResults.useQuery();
  const results = resultsQuery.data;

  const nextRoundMutation = api.room.nextRound.useMutation();
  const endGameMutation = api.room.endGame.useMutation();

  return (
    <Layout>
      <div className="mt-6 flex w-full items-center justify-between">
        <h1 className="font-bold">Round #{currentRound}</h1>
        {isHost && (
          <Button
            variant="primary"
            onClick={async () => {
              if (numRounds === currentRound) {
                await endGameMutation.mutateAsync();
              } else {
                await nextRoundMutation.mutateAsync();
              }
            }}
          >
            {numRounds === currentRound ? "End Game" : "Next Round"}
          </Button>
        )}
      </div>
      <UnderlineHover>
        <h3 className="mt-3 text-4xl font-bold capitalize">
          {results?.realWord}
        </h3>
      </UnderlineHover>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <InfoBox>
          <p className="mb-3 text-xl font-bold">Definition</p>
          <p className="text-xl font-light">{results?.realDefinition}</p>
        </InfoBox>
        <InfoBox>
          <p className="mb-3 text-xl font-bold">Most Chosen Definition</p>
          <p className="text-xl font-light">{results?.mostChosenDefinition}</p>
        </InfoBox>
        {!isChooser && results?.currentUserDefinition && (
          <InfoBox>
            <p className="mb-3 text-xl font-bold">Your Fake Definition</p>
            <p className="text-xl font-light">
              {results?.currentUserDefinition}
            </p>
          </InfoBox>
        )}
      </div>
      {numRounds === currentRound ? (
        <Podium topFive={results?.topFive} />
      ) : (
        <Leaderboard topFive={results?.topFive} />
      )}
    </Layout>
  );
};

export default RoundResults;

const InfoBox: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-text px-6 py-8 text-center">
      {children}
    </div>
  );
};
