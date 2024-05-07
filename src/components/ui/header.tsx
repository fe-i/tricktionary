import { signIn, signOut, useSession } from "next-auth/react";
import UnderlineHover from "../underline-hover";
import Button from "../button";
import Link from "../link";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../dropdown-menu";
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
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="blank"
                className="p-0"
                onClick={() => void signOut()}
              >
                Sign Out
              </Button>
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
