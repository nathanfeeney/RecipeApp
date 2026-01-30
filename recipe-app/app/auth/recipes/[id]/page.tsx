import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <main>
      <main className="space-y-4">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>

        {recipe.description && (
          <p className="opacity-80">{recipe.description}</p>
        )}

        <section>
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="list-disc ml-6">
            {recipe.ingredients?.map((i: string, idx: number) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Method</h2>
          <ol className="list-decimal ml-6">
            {recipe.method?.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          <p className="opacity-80">{recipe.serve_with}</p>
        </section>
      </main>
    </main>
  );
}
