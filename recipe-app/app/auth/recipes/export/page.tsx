import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExportRecipesClient from "./ExportRecipesClient";

export default async function ExportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recipes = data ?? [];

  return <ExportRecipesClient recipes={recipes} />;
}