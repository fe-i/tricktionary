import { Layout } from "~/components/ui/layout";
import { Background } from "~/components/ui/background";
import { Modal } from "~/components/modal";
import { api } from "~/utils/api";

const WriterWaitForWord: React.FC<{ chooserId: string }> = ({ chooserId }) => {
  const { data: chooser } = api.user.findUnique.useQuery({
    id: chooserId,
  });

  return (
    <Layout>
      <Background />
      <Modal>
        <h1 className="mb-6 text-center font-bold">Choosing Word</h1>
        <p className="text-center">
          Waiting for <span className="font-bold">{chooser?.name}</span> to
          choose a unique word for this round.
        </p>
      </Modal>
    </Layout>
  );
};

export default WriterWaitForWord;
