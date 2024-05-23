import Layout from "../layout";
import { api } from "~/utils/api";
import type { RoomWithUsers } from "~/pages/room/[slug]";

const WriterWaitForWord: React.FC<{ roomData: RoomWithUsers }> = ({
  roomData,
}) => {
  return <Layout>Waiting for the word</Layout>;
};

export default WriterWaitForWord;
