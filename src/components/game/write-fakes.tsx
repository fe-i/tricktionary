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
      <p>Your word is...</p>
      <h2 className="-mt-8 text-3xl font-bold capitalize underline">
        {roomData?.word}
      </h2>
      <textarea
        className="aspect-[2] w-[70%] rounded border border-text bg-background p-6 text-xl outline-none"
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
      <Modal className="flex w-[22rem] flex-col gap-4 text-center">
        <h2 className="text-3xl font-bold underline">Deceive</h2>
        <p>
          The chosen word is <span className="font-bold">{roomData?.word}</span>
          . Create a fake definition to deceive the other players.
        </p>
        <div>
          <p className="text-left font-bold">Your Definition</p>
          <textarea
            className="max-h-32 w-64 rounded-md border border-text bg-transparent p-2"
            maxLength={100}
          />
          <Button className="w-full">Submit Fake</Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default WriteFakes;
