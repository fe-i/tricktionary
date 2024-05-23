import Layout from "../layout";
import Background from "../background";
import Modal from "../modal";

const WriterWaitToVote: React.FC = () => {
  return (
    <Layout>
      <Background />
      <Modal className="w-[22rem]">
        <h1 className="mb-6 text-center font-bold">Definition submitted!</h1>
        <p className="text-center">
          Thanks for writing your definition! Once the rest of the players write
          theirs, voting will begin!
        </p>
      </Modal>
    </Layout>
  );
};

export default WriterWaitToVote;
