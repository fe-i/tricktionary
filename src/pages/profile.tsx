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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
  const obtainTitleMutation = api.title.obtainTitle.useMutation();

  // AUTHENTICATION
  if (sessionData.status === "unauthenticated") {
    void router.push("/");
    return <></>;
  } else if (sessionData.status === "loading") {
    return <></>;
  }
  if (!profile || !sessionData.data) return <></>;

  // TITLES
  const codes: Record<string, number> = {
    WINNER: 1,
    THEGOAT: 2,
  };
  const obtainTitle = async (code: string) => {
    const id = Number(codes[code]);
    if (isNaN(id) || id < 1) return alert("Invalid code.");
    await obtainTitleMutation.mutateAsync({ titleId: id });
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
              <Button
                variant="secondary"
                className="my-2 w-full"
                onClick={() => {
                  const code = prompt("Enter a code:");
                  if (code) void obtainTitle(code.toUpperCase());
                }}
              >
                Redeem Title
              </Button>
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
          <Stat title="Games Played" value={profile.gamesPlayed} />
          <Stat title="High Score" value={profile.highScore} />
        </div>
        <Button
          className="w-full"
          onClick={async () => {
            if (
              editing &&
              (name !== sessionData.data.user.name ||
                titleId !== sessionData.data.user.titleId)
            ) {
              if (name.length === 0) setName(sessionData.data.user.name!);
              await updateMutation
                .mutateAsync({
                  name,
                  titleId,
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
