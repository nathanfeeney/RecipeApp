import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TableOfContents,
  PageBreak,
  TextRun,
} from "docx";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("title", { ascending: true });

  const recipes = data ?? [];

  // Build the Word document
  const doc = new Document({
    sections: [
      {
        children: [
          
          new Paragraph({
            text: "Table of Contents",
            heading: HeadingLevel.HEADING_1,
          }),
          new TableOfContents("Contents", {
            hyperlink: true,
            headingStyleRange: "1-3",
          }),
          new PageBreak(),
        ],
      },
      {
        children: recipes.flatMap((r, index) => {
          const blocks = [
            new Paragraph({
              text: r.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 300 },
            }),

            new Paragraph({
              text: r.description || "",
              spacing: { after: 300 },
            }),

            new Paragraph({
              text: "Ingredients",
              spacing: { after: 200 },
            }),

            ...r.ingredients.map(
              (i: string) =>
                new Paragraph({
                  children: [new TextRun({ text: `• ${i}` })],
                })
            ),

            new Paragraph({
              text: "",
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: "Method",
              spacing: { after: 200 },
            }),

            ...r.method.map(
              (m: string, idx: number) =>
                new Paragraph({
                  children: [new TextRun({ text: `${idx + 1}. ${m}` })],
                })
            ),
          ];

          // Add a page break after each recipe except the last
          if (index < recipes.length - 1) {
            blocks.push(new PageBreak());
          }

          return blocks;
        }),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="recipes.docx"`,
    },
  });
}