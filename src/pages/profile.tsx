import { Layout } from "~/components/ui/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useToast } from "~/components/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import { Button } from "~/components/button";
import { useState } from "react";
import { UnderlineHover } from "~/components/underline-hover";
import { Modal } from "~/components/modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select";

const Profile: React.FC = () => {
  // HOOKS
  const sessionData = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // STATE
  const [editing, setEditing] = useState(false);

  // QUERIES & MUTATIONS
  const { data: profile } = api.user.getProfile.useQuery();
  const updateMutation = api.user.update.useMutation();

  // MANAGING TITLES
  const createTitleMutation = api.titles.create.useMutation();
  const obtainTitleMutation = api.titles.obtainTitle.useMutation();

  // AUTHENTICATION
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }
  if (!profile) return <></>;

  // MANAGING TITLES
  const createTitle = (title: string) => {
    void createTitleMutation.mutateAsync({ title });
  };

  const obtainTitle = (titleId: number) => {
    void obtainTitleMutation.mutateAsync({ titleId });
  };

  return (
    <Layout title="Profile">
      <Modal className="flex flex-col items-center gap-4">
        <Avatar className="h-[4rem] w-[4rem]">
          {sessionData.data?.user.image && (
            <AvatarImage src={sessionData.data.user.image} />
          )}
          <AvatarFallback>{sessionData.data?.user.name?.at(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-center">
          {editing ? (
            <>
              <input
                className="text-md w-full rounded border border-text bg-background p-2 outline-none"
                placeholder="Name"
                minLength={1}
                maxLength={64}
                onBlur={async (e) => {
                  const val = e.currentTarget.value;
                  if (val.length < 1) return;
                  await updateMutation
                    .mutateAsync({ name: val })
                    .then(async () => {
                      toast({
                        title: "Changes saved!",
                        description: "Name successfully updated",
                      });
                      await sessionData.update();
                      setEditing(false);
                    });
                }}
              />
              <Select
                onValueChange={async (val) => {
                  await updateMutation
                    .mutateAsync({
                      titleId: Number(
                        (
                          JSON.parse(val) as {
                            id: number;
                            title: string;
                          }
                        ).id,
                      ),
                    })
                    .then(async () => {
                      toast({
                        title: "Changes saved!",
                        description: "Title successfully updated",
                      });
                      await sessionData.update();
                      setEditing(false);
                    });
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      profile.titles.find(
                        (t) => t.id === sessionData.data?.user.titleId,
                      )?.title ?? "No Title"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {profile.titles.map((t, _) => (
                      <SelectItem key={_} value={JSON.stringify(t)}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <UnderlineHover>
                <h1 className="font-bold">{sessionData.data?.user.name}</h1>
              </UnderlineHover>
              <h2 className="mt-3 text-lg">
                {profile.titles.find(
                  (t) => t.id === sessionData.data?.user.titleId,
                )?.title ?? "No Title"}
              </h2>
            </>
          )}
        </div>
        <hr />
        <div className="flex w-full flex-col gap-2">
          <Stat title="Games Won" value={profile.gamesWon} />
          <Stat title="Games Played" value={profile.gamesPlayed} />
          <Stat title="High Score" value={profile.highScore} />
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
      <p>{value.toLocaleString()}</p>
    </div>
  );
};
