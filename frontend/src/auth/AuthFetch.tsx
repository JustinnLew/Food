import supabase from "./Supabase";

export default async function AuthFetch({
  path,
  method,
  body,
}: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}) {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  const token = data.session?.access_token;
  const res = await fetch(path, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
}
