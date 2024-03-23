import type { NextPage } from "next";
import Layout from "~/components/layout/layout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout>
      <p>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</p>
    </Layout>
  );
};

export default Home;
