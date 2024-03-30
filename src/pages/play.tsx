import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";

const Play: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
  }

  return <Layout>Hello</Layout>;
};

export default Play;
