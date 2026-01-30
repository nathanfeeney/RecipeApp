import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RecipesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data } = await supabase
    .from("recipes")
    .select("id, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const recipes = data ?? [];

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Recipes</h1>

        <Link
          href="/auth/recipes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Recipe
        </Link>
      </div>
<Link
  href="/api/export/recipes"
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Export Recipes
</Link>

      <Link
        href="/auth/recipes/export"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Export Recipes
      </Link>

      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link
              href={`/auth/recipes/${recipe.id}`}
              className="text-blue-600 underline"
            >
              {recipe.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}