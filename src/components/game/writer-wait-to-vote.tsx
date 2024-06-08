import { Layout } from "~/components/shared/layout";
import { Background } from "~/components/shared/background";
import { Modal } from "~/components/ui/modal";

const WriterWaitToVote: React.FC = () => {
  return (
    <Layout>
      <Background />
      <Modal>
        <h1 className="mb-6 text-center font-bold">Definition Submitted!</h1>
        <p className="text-center">
          Thanks for writing your definition! Once the rest of the players write
          theirs, voting will begin!
        </p>
      </Modal>
    </Layout>
  );
};

export default WriterWaitToVote;
