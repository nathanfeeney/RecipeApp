import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewRecipePage() {
  return (
   <form action={createRecipe} className="flex flex-col gap-4 max-w-md">
  <input name="title" placeholder="Title" required className="border p-2 rounded" />

  <textarea
    name="description"
    placeholder="Short description"
    className="border p-2 rounded"
  />

  <textarea
    name="ingredients"
    placeholder="One ingredient per line"
    className="border p-2 rounded"
  />

  <textarea
    name="method"
    placeholder="One step per line"
    className="border p-2 rounded"
  />
    <input name="serveWith" placeholder="Serve with" required className="border p-2 rounded" />


  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
    Save Recipe
  </button>
</form>
  );
}

async function createRecipe(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const title = formData.get("title") as string;
const serveWith = formData.get("serveWith") as string;

  const description = formData.get("description") as string;

  // Ingredients and method come in as textareas, so we convert to arrays
  const ingredients = (formData.get("ingredients") as string)
    .split("\n")
    .filter(Boolean);

  const method = (formData.get("method") as string)
    .split("\n")
    .filter(Boolean);

  await supabase.from("recipes").insert({
    user_id: user.id,
    title,
    description,
    ingredients,
    serve_with: serveWith,
    method,
  });

  redirect("/auth/recipes");
}