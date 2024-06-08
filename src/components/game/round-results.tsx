import { Layout } from "~/components/shared/layout";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

const RoundResults: React.FC<{
  currentRound: number;
  isHost: boolean;
  isChooser?: boolean;
}> = ({ currentRound, isHost, isChooser = false }) => {
  const resultsQuery = api.room.getRoundResults.useQuery();
  const results = resultsQuery.data;

  const nextRoundMutation = api.room.nextRound.useMutation();

  return (
    <Layout>
      <div className="mt-6 flex w-full items-center justify-between">
        <h1 className="font-bold">Round #{currentRound}</h1>
        {isHost && (
          <Button
            variant="primary"
            onClick={async () => {
              await nextRoundMutation.mutateAsync();
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
      <div className="mt-8 flex w-full flex-col gap-2">
        <h1 className="mb-4 font-bold">Leaderboard</h1>
        {results?.topFive.map(({ name, score }, _) => (
          <>
            <div className="flex w-full justify-between transition-transform duration-200 hover:translate-x-1">
              <p className="text-xl font-bold">
                {_ + 1}. {name}
              </p>
              <p className="text-xl font-light">{score.toLocaleString()}</p>
            </div>
            <hr className="border border-text" />
          </>
        ))}
      </div>
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
