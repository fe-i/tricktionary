import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { useToast } from "~/components/use-toast";
import Modal from "~/components/modal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import Button from "~/components/button";
import { useState } from "react";
import UnderlineHover from "~/components/underline-hover";

const Profile: React.FC = () => {
  // HOOKS
  const sessionData = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // STATE
  const [editing, setEditing] = useState(false);

  // QUERIES & MUTATIONS
  const { data: profileData } = api.user.currentStats.useQuery();
  const updateMutation = api.user.update.useMutation();

  // AUTHENTICATION
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }
  if (!profileData) return <></>;

  return (
    <Layout title="Profile">
      <Modal className="flex w-[22rem] flex-col items-center gap-4">
        <Avatar className="h-[4rem] w-[4rem]">
          {sessionData.data?.user.image && (
            <AvatarImage src={sessionData.data.user.image} />
          )}
          <AvatarFallback>{sessionData.data?.user.name?.at(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-center">
          {editing ? (
            <input
              className="text-md w-full rounded border border-text bg-background p-2 outline-none"
              placeholder="Name"
              maxLength={64}
              onBlur={async (e) => {
                const val = e.currentTarget.value;
                if (val.length < 3) return;
                await updateMutation.mutateAsync({ name: val }).then(
                  () =>
                    void toast({
                      title: "Changes saved!",
                      description: "Profile successfully updated",
                    }),
                );
              }}
            />
          ) : (
            <UnderlineHover>
              <h1 className="font-bold">{sessionData.data?.user.name}</h1>
            </UnderlineHover>
          )}
          <h2 className="mt-3 text-lg">&quot;Title&quot;</h2>
        </div>
        <hr />
        <div className="flex w-full flex-col gap-2">
          <Stat title="Games Won" value={profileData.gamesWon} />
          <Stat title="Games Played" value={profileData.gamesPlayed} />
          <Stat title="High Score" value={profileData.highScore} />
        </div>
        <Button
          className="w-full"
          variant={editing ? "gray" : "primary"}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Info"}
        </Button>
      </Modal>
    </Layout>
  );
};

export default Profile;

const Stat: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  return (
    <div className="flex justify-between">
      <h3 className="text-lg font-bold">{title}</h3>
      {/* <div className="relative w-4/5 overflow-hidden">
        <h3 className="text-lg font-bold after:absolute after:content-['...................................................................']">
          {title}
        </h3>
      </div> */}

      <h3>{value.toLocaleString()}</h3>
    </div>
  );
};
