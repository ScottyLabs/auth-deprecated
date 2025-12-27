import { createFileRoute } from "@tanstack/react-router";
import $api from "@/api/client";
import AuthHello from "@/components/AuthHello";
import Hello from "@/components/Hello";
import env from "@/env";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: user } = $api.useQuery("get", "/auth/me");

  if (!user?.loggedIn) {
    return (
      <div>
        Unauthenticated.{" "}
        <button
          type="button"
          onClick={() => {
            window.location.href = `${env.VITE_SERVER_URL}/login?redirect_uri=${window.location.href}`;
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <Hello />
      <AuthHello />
      <button
        type="button"
        onClick={() => {
          window.location.href = `${env.VITE_SERVER_URL}/logout?redirect_uri=${window.location.href}`;
        }}
      >
        Sign Out
      </button>
    </>
  );
}
