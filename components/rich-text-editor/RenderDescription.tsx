"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";

const EXTENSIONS = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

/**
 * Renders a TipTap document.
 *
 * Accepts the stored string as well as a parsed document. Callers used to do
 * JSON.parse() inline, so a single malformed or legacy-HTML description threw
 * during render and returned a 500 for the whole page. Parsing here keeps that
 * failure contained: a bad description renders as nothing.
 */
export function RenderDescription({
  json,
}: {
  json: JSONContent | string | null | undefined;
}) {
  const output = useMemo(() => {
    if (!json) return null;

    try {
      const document = typeof json === "string" ? JSON.parse(json) : json;
      return generateHTML(document, EXTENSIONS);
    } catch (error) {
      console.error("Could not render description:", error);
      return null;
    }
  }, [json]);

  if (!output) return null;

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
