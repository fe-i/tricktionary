import { api } from "~/utils/api";
import Layout from "../layout";
import type { RoomWithUsers } from "~/pages/room/[slug]";
import Modal from "../modal";
import UnderlineHover from "../underline-hover";
import Button from "../button";

const WriteFakes: React.FC<{ roomData: RoomWithUsers }> = ({ roomData }) => {
  return (
    <Layout>
      <Modal className="flex w-[22rem] flex-col gap-4 text-center">
        <UnderlineHover>
          <h2 className="text-3xl font-bold underline">Deceive</h2>
        </UnderlineHover>
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
        </div>
        <Button>Submit Fake</Button>
      </Modal>
    </Layout>
  );
};

export default WriteFakes;
