import { Layout } from "~/components/ui/layout";
import { Background } from "~/components/ui/background";
import { Modal } from "~/components/modal";
import { api } from "~/utils/api";

const WriterWaitForWord: React.FC<{ chooserId: string }> = ({ chooserId }) => {
  const { data: chooser } = api.user.findUnique.useQuery({
    userId: chooserId,
  });

  return (
    <Layout>
      <Background />
      <Modal className="w-[22rem]">
        <h1 className="mb-6 text-center font-bold">The word is being chosen</h1>
        <p className="text-center">
          {chooser?.name} is choosing the word for this round.
        </p>
      </Modal>
    </Layout>
  );
};

export default WriterWaitForWord;
