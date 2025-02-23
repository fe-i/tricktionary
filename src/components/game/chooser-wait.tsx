import { Layout } from "~/components/shared/layout";
import { Background } from "~/components/shared/background";
import { Modal } from "~/components/ui/modal";

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
