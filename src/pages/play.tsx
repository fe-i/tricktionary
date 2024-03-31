import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "~/components/button";
import Layout from "~/components/layout";
import Link from "~/components/link";
import Modal from "~/components/modal";

const Play: React.FC = () => {
  const sessionData = useSession();
  const router = useRouter();

  const [code, setCode] = useState("");

  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  return (
    <Layout>
      <Modal className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">JOIN A GAME</h2>
        <input
          type="text"
          placeholder="#ABCD"
          value={code}
          onChange={(e) => {
            let val = e.currentTarget.value;
            if (!val.startsWith("#")) {
              val = "#" + val;
              if (val.length === 6) {
                val = val.slice(0, 5);
              }
            }
            setCode(val.toUpperCase());
          }}
          maxLength={5}
          className="border-text w-64 rounded-lg border bg-transparent p-3 text-center text-3xl font-bold"
        />
        <Link href="/how-to" variant="underlined">
          Learn to play →
        </Link>
      </Modal>
    </Layout>
  );
};

export default Play;
