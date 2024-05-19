import { api } from "~/utils/api";
import Layout from "../layout";
import type { RoomWithUsers } from "~/pages/room/[slug]";
import Button from "../button";
import { useState } from "react";

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
    </Layout>
  );
};

export default WriteFakes;
