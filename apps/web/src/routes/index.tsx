import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import Hello from "@/components/Hello";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <div>
        <button type="button" onClick={() => auth.signinRedirect()}>
          Sign In
        </button>
      </div>
    );
  }

  return <Hello />;
}
