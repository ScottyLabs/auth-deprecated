import { createFileRoute } from "@tanstack/react-router";
import AuthHello from "@/components/AuthHello";
import Hello from "@/components/Hello";
import { signIn, signOut, useSession } from "@/lib/authClient";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: auth } = useSession();

  if (!auth?.user) {
    return (
      <div>
        Unauthenticated.{" "}
        <button type="button" onClick={() => signIn()}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <Hello />
      <AuthHello />
      <div>Groups: {auth?.user.groups?.join(", ")}</div>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
    </>
  );
}
