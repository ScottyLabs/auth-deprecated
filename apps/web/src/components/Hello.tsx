import $api from "@/api/client";

const Hello = () => {
  const {
    data: hello,
    isLoading,
    error,
    isError,
  } = $api.useQuery("get", "/hello");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error: {error}</div>;
  }

  return <div>Message: {hello?.message}</div>;
};

export default Hello;
