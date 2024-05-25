import { Layout } from "~/components/ui/layout";
import { Background } from "~/components/ui/background";
import { Modal } from "~/components/modal";

const ChooserWait: React.FC = () => {
  return (
    <Layout>
      <Background />
      <Modal>
        <h1 className="mb-6 text-center font-bold">Word Chosen!</h1>
        <p className="text-center">
          Thanks for choosing the word! Wait until the rest of the players write
          their fake definitions!
        </p>
      </Modal>
    </Layout>
  );
};

export default ChooserWait;
