import { Layout } from "~/components/ui/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useToast } from "~/components/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import { Button } from "~/components/button";
import { useEffect, useRef, useState } from "react";
import { UnderlineHover } from "~/components/underline-hover";
import { Modal } from "~/components/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select";
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
  const [titleId, setTitleId] = useState<number | undefined>(undefined);

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
  if (!profile || !sessionData.data) return <></>;

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
              <h3 className="mt-4 text-lg font-bold">Title</h3>
              <Select
                onValueChange={(val) => {
                  setTitleId(
                    Number(
                      (
                        JSON.parse(val) as {
                          id: number;
                          title: string;
                        }
                      ).id,
                    ),
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      profile.titles.find(
                        (t) => t.id === sessionData.data.user.titleId,
                      )?.title ?? "No Title"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {profile.titles.map((t, _) => (
                    <SelectItem key={_} value={JSON.stringify(t)}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <UnderlineHover>
                <h1 className="font-bold">{sessionData.data.user.name}</h1>
              </UnderlineHover>
              <h2 className="mt-3 text-lg">
                {profile.titles.find(
                  (t) => t.id === sessionData.data.user.titleId,
                )?.title ?? "No Title"}
              </h2>
            </>
          )}
        </div>
        <hr className={editing ? "my-2 w-full border-text" : ""} />
        <div className="flex w-full flex-col gap-2">
          <Stat title="Games Won" value={profile.gamesWon} />
          <Stat title="Games Played" value={profile.gamesPlayed} />
          <Stat title="High Score" value={profile.highScore} />
        </div>
        <Button
          className="w-full"
          onClick={async () => {
            if (
              editing &&
              name !== sessionData.data.user.name &&
              name.length > 0 &&
              titleId !== sessionData.data.user.titleId
            ) {
              await updateMutation
                .mutateAsync({
                  name,
                  titleId,
                })
                .then(() =>
                  toast({
                    title: "Profile updated!",
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
