import supabase from "./Supabase"

export default async function AuthFetch(path: string) {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw error;
    }
    const token = data.session?.access_token;
    const res = await fetch(path, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res;
}