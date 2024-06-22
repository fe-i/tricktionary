import { Layout } from "~/components/shared/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { UnderlineHover } from "~/components/ui/underline-hover";
import { Modal } from "~/components/ui/modal";
import autoAnimate from "@formkit/auto-animate";
import { cn } from "~/utils/cn";

const Profile: React.FC = () => {
  // HOOKS
  const sessionData = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  // STATE
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState<string>("");

  // QUERIES & MUTATIONS
  const { data: profile } = api.user.getProfile.useQuery();
  const updateMutation = api.user.update.useMutation();

  // AUTHENTICATION
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }
  if (!profile || !sessionData.data) return <></>;

  return (
    <Layout title="Profile">
      <Modal className="flex flex-col items-center gap-4">
        <Avatar className="h-[4rem] w-[4rem]">
          {sessionData.data.user.image && (
            <AvatarImage src={sessionData.data.user.image} />
          )}
          <AvatarFallback>{sessionData.data.user.name?.at(0)}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "flex w-full flex-col transition-all",
            editing
              ? "items-start justify-start overflow-hidden"
              : "text-center",
          )}
          ref={parent}
        >
          {editing ? (
            <>
              <h3 className="text-lg font-bold">Name</h3>
              <input
                className="text-md w-full rounded border border-text/60 bg-background p-2 outline-none"
                placeholder="Name"
                maxLength={64}
                defaultValue={sessionData.data.user.name!}
                onChange={(e) => {
                  const val = e.currentTarget.value.trim();
                  setName(val);
                }}
                onBlur={(e) => {
                  const val = e.currentTarget.value.trim();
                  if (val.length < 1 || val.length > 64)
                    e.currentTarget.value = sessionData.data.user.name!;
                  setName(val);
                }}
              />
            </>
          ) : (
            <UnderlineHover>
              <h1 className="font-bold">{sessionData.data.user.name}</h1>
            </UnderlineHover>
          )}
        </div>
        <hr className={editing ? "my-2 w-full border-text" : ""} />
        <div className="flex w-full flex-col gap-2">
          <Stat title="Games Played" value={profile.gamesPlayed} />
          <Stat title="High Score" value={profile.highScore} />
        </div>
        <Button
          className="w-full"
          onClick={async () => {
            if (
              editing &&
              name.length > 0 &&
              name !== sessionData.data.user.name
            ) {
              if (name.length === 0) setName(sessionData.data.user.name!);
              await updateMutation
                .mutateAsync({
                  name,
                })
                .then(() =>
                  toast({
                    title: "Profile Updated",
                    description: "Changes saved successfully.",
                  }),
                );
              await sessionData.update();
            }
            setEditing(!editing);
          }}
          variant={editing ? "primary" : "gray"}
        >
          {editing ? "Save Profile" : "Edit Profile"}
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
      <p>{value.toLocaleString()}</p>
    </div>
  );
};
