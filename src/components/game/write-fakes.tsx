import { Layout } from "~/components/ui/layout";
import { Button } from "~/components/button";
import { useState } from "react";
import { api } from "~/utils/api";
import { Modal } from "~/components/modal";

const WriteFakes: React.FC<{
  word: string;
  updateRoom: () => Promise<void>;
}> = ({ word, updateRoom }) => {
  const [fakeDefinition, setFakeDefinition] = useState("");
  const submitMutation = api.room.submitDefinition.useMutation();

  return (
    <Layout>
      <Modal className="flex flex-col gap-4 text-center">
        <div className="flex flex-col gap-2">
          <p>The word is...</p>
          <h2 className="text-3xl font-bold">{word.toUpperCase()}</h2>
          <p>Write a fake definition to deceive other players!</p>
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            className="text-md aspect-[2] max-h-32 w-full rounded border border-text bg-background p-2 outline-none"
            placeholder="Your fake definition..."
            maxLength={100}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setFakeDefinition(val);
            }}
            onBlur={(e) => {
              const val = e.currentTarget.value;
              setFakeDefinition(val);
            }}
          />
          <Button
            className="w-full"
            onClick={async () => {
              await submitMutation.mutateAsync({ definition: fakeDefinition });
              await updateRoom();
            }}
            disabled={fakeDefinition.length < 4}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default WriteFakes;
