import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { useToast } from "~/components/use-toast";
import Modal from "~/components/modal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import UnderlineHover from "~/components/underline-hover";
import Button from "~/components/button";

const Play: React.FC = () => {
  // HOOKS
  const sessionData = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { data: profileData } = api.user.findUnique.useQuery();

  // AUTHENTICATION
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }

  return (
    <Layout title="Profile">
      <Modal className="flex w-[22rem] flex-col items-center gap-4">
        <Avatar className="h-[4rem] w-[4rem]">
          {sessionData.data?.user.image && (
            <AvatarImage src={sessionData.data.user.image} />
          )}
          <AvatarFallback>{sessionData.data?.user.name?.at(0)}</AvatarFallback>
        </Avatar>
        <UnderlineHover>
          <h1 className="font-bold">{sessionData.data?.user.name}</h1>
        </UnderlineHover>
        <p>&quot;Title&quot;</p>
        <p>Games Played: {profileData?.gamesPlayed}</p>
        <p>Games Won: {profileData?.gamesWon}</p>
        <p>High Score: {profileData?.highScore}</p>
        {/**todo: display stats better */}
        <Button className="w-full">Edit Info</Button>
      </Modal>
    </Layout>
  );
};

export default Play;
