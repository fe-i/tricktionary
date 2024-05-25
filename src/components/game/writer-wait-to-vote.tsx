import { Layout } from "~/components/ui/layout";
import { Background } from "~/components/ui/background";
import { Modal } from "~/components/modal";

const WriterWaitToVote: React.FC = () => {
  return (
    <Layout>
      <Background />
      <Modal>
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
