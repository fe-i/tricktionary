import type { RoomWithUsers } from "~/pages/room/[slug]";
import Layout from "../layout";

const Voting: React.FC<{ roomData: RoomWithUsers }> = ({ roomData }) => {
  return <Layout>voting time</Layout>;
};

export default Voting;
