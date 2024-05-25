import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/dropdown-menu";
import { UnderlineHover } from "~/components/underline-hover";
import { Link } from "~/components/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const { data, status } = useSession();
  const router = useRouter();

  return (
    <header className="container absolute left-auto right-auto top-0 z-50 flex items-center justify-between gap-8 px-6 py-4">
      <Link href="/" variant="getBolder">
        FICTIONARY
      </Link>
      {status === "authenticated" ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              {data.user.image && <AvatarImage src={data.user.image} />}
              <AvatarFallback>{data.user.name?.at(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {data.user.roomCode ? (
              <DropdownMenuItem
                onClick={() => void router.push(`/room/${data.user.roomCode}`)}
              >
                Return to {data.user.roomCode}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => void router.push("/play")}>
                Play
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => void router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <UnderlineHover>
          <Button
            variant="blank"
            className="p-0"
            onClick={() => signIn("google")}
          >
            SIGN IN
          </Button>
        </UnderlineHover>
      )}
    </header>
  );
};

export { Header };
