import { api } from "~/utils/api";
import Layout from "../layout";
import type { RoomWithUsers } from "~/pages/room/[slug]";
import Button from "../button";
import { useState } from "react";
import Modal from "../modal";

const WriteFakes: React.FC<{ roomData: RoomWithUsers }> = ({ roomData }) => {
  const [fakeDefinition, setFakeDefinition] = useState("");
  const submitMutation = api.room.submitDefinition.useMutation();

  return (
    <Layout>
      <Modal className="flex w-[22rem] flex-col gap-4 text-center">
        <p>Your word is</p>
        <h2 className="text-3xl font-bold capitalize underline">
          {roomData?.word}
        </h2>
        <p>Create a fake definition to deceive other players!</p>
        <div>
          <textarea
            className="aspect-[2] w-full rounded border border-text bg-background p-4 text-lg outline-none"
            placeholder="Your fake definition..."
            onBlur={(e) => {
              const val = e.currentTarget.value;
              setFakeDefinition(val);
            }}
          ></textarea>
          <Button
            onClick={async () => {
              await submitMutation.mutateAsync({ definition: fakeDefinition });
              //   await updateRoom();
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
