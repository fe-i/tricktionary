import { api } from "~/utils/api";
import Layout from "../layout";
import type { RoomWithUsers } from "~/pages/room/[slug]";

const WriteFakes: React.FC<{ roomData: RoomWithUsers }> = ({ roomData }) => {
  return (
    <Layout>
      <p>Your word is</p>
      <h2>{roomData?.word}</h2>
    </Layout>
  );
};

export default WriteFakes;
