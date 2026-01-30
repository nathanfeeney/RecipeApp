"use client";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  method: string[];
  serve_with: string;
}

export default function ExportRecipesClient({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="print:p-10 p-4">
      <button
        onClick={() => window.print()}
        className="no-print bg-blue-600 text-white px-4 py-2 rounded"
      >
        Print / Save as PDF
      </button>

      {recipes.map((r) => (
        <section key={r.id} className="my-8">
          <h1 className="text-2xl font-bold">{r.title}</h1>
          <p>{r.description}</p>

          <h2 className="font-semibold mt-4">Ingredients</h2>
          <ul className="list-disc ml-6">
            {r.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>

          <h2 className="font-semibold mt-4">Method</h2>
          <ol className="list-decimal ml-6">
            {r.method.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}