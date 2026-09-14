import React from "react";
import AICodeBlock from "./AICodeBlock";

/**
 * InlineMarkdown parses inline formatting:
 * - `<br>` line breaks
 * - Inline code: `code`
 * - Bold + Italic: ***text***
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Strikethrough: ~~text~~
 * - Links: [text](url)
 */
export function InlineMarkdown({ text }) {
  if (!text) return null;

  // Handle <br> tags first by splitting
  const partsWithBr = String(text).split(/(<br\s*\/?>)/gi);
  if (partsWithBr.length > 1) {
    return (
      <>
        {partsWithBr.map((part, i) =>
          /<br\s*\/?>/i.test(part) ? (
            <br key={i} />
          ) : (
            <InlineMarkdown key={i} text={part} />
          )
        )}
      </>
    );
  }

  // Regex matching inline code, bold, italic, strikethrough, and markdown links
  const inlineRegex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;
  const segments = String(text).split(inlineRegex);

  return (
    <>
      {segments.map((seg, idx) => {
        if (!seg) return null;

        // Inline code: `code`
        if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 1) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[11px] sm:text-xs border border-indigo-100 font-medium"
            >
              {seg.slice(1, -1)}
            </code>
          );
        }

        // Bold + Italic: ***text***
        if (seg.startsWith("***") && seg.endsWith("***") && seg.length > 6) {
          return (
            <strong key={idx} className="font-bold italic text-slate-900">
              {seg.slice(3, -3)}
            </strong>
          );
        }

        // Bold: **text** or __text__
        if (
          (seg.startsWith("**") && seg.endsWith("**") && seg.length > 4) ||
          (seg.startsWith("__") && seg.endsWith("__") && seg.length > 4)
        ) {
          return (
            <strong key={idx} className="font-semibold text-slate-900">
              {seg.slice(2, -2)}
            </strong>
          );
        }

        // Italic: *text* or _text_
        if (
          (seg.startsWith("*") && seg.endsWith("*") && seg.length > 2) ||
          (seg.startsWith("_") && seg.endsWith("_") && seg.length > 2)
        ) {
          return (
            <em key={idx} className="italic text-slate-800">
              {seg.slice(1, -1)}
            </em>
          );
        }

        // Strikethrough: ~~text~~
        if (seg.startsWith("~~") && seg.endsWith("~~") && seg.length > 4) {
          return (
            <span key={idx} className="line-through text-slate-400">
              {seg.slice(2, -2)}
            </span>
          );
        }

        // Link: [text](url)
        const linkMatch = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline font-medium"
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <span key={idx}>{seg}</span>;
      })}
    </>
  );
}

/**
 * Splits raw markdown table row into trimmed cell strings.
 */
function parseTableRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((c) => c.trim());
}

/**
 * Parses raw markdown text into structured semantic blocks:
 * - code blocks
 * - markdown tables
 * - headings (h1, h2, h3, h4)
 * - blockquotes
 * - lists (ordered / unordered)
 * - paragraphs
 */
export function parseMarkdownBlocks(rawText) {
  if (!rawText) return [];

  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced Code Block: ```language
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || "javascript";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n")
      });
      continue;
    }

    // 2. Markdown Table Detection: line with pipes followed by separator line |---|
    const isTableStart =
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      lines[i + 1].includes("|") &&
      /[-:]+/.test(lines[i + 1]);

    if (isTableStart) {
      const headers = parseTableRow(line);
      i += 2; // Skip header and separator rows

      const rows = [];
      while (i < lines.length) {
        const tableLine = lines[i].trim();
        if (!tableLine || !tableLine.includes("|")) {
          break;
        }
        rows.push(parseTableRow(tableLine));
        i++;
      }

      if (rows.length > 0) {
        blocks.push({
          type: "table",
          headers,
          rows
        });
        continue;
      }
    }

    // 3. Headings: #, ##, ###, ####
    if (/^#{1,4}\s+/.test(trimmed)) {
      const level = trimmed.match(/^(#{1,4})\s+/)[1].length;
      const text = trimmed.replace(/^#{1,4}\s+/, "");
      blocks.push({
        type: "heading",
        level,
        text
      });
      i++;
      continue;
    }

    // 4. Blockquotes: > quote
    if (trimmed.startsWith(">")) {
      const quoteLines = [trimmed.replace(/^>\s*/, "")];
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        text: quoteLines.join(" ")
      });
      continue;
    }

    // 5. Unordered List: - item or * item
    if (/^[-*+]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({
        type: "unordered-list",
        items
      });
      continue;
    }

    // 6. Ordered List: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({
        type: "ordered-list",
        items
      });
      continue;
    }

    // 7. Blank lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 8. Regular paragraph (accumulate consecutive text lines)
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      !/^#{1,4}\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith(">") &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    blocks.push({
      type: "paragraph",
      text: paraLines.join(" ")
    });
  }

  return blocks;
}

/**
 * Interactive Markdown Message Renderer
 * Converts Markdown content into rich interactive React components.
 */
export default function AIMarkdownMessage({ content }) {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-3.5 text-slate-800 text-xs sm:text-sm leading-relaxed">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "code":
            return (
              <div key={index} className="my-3">
                <AICodeBlock
                  code={block.code}
                  language={block.language || "javascript"}
                />
              </div>
            );

          case "table":
            return (
              <div
                key={index}
                className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs scrollbar-thin"
              >
                <table className="w-full text-left text-xs border-collapse min-w-[340px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      {block.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className={`py-2.5 px-3.5 font-bold text-slate-900 border-r last:border-r-0 border-slate-200/60 bg-indigo-50/30 text-xs ${
                            hIdx === 0 ? "min-w-[110px]" : "min-w-[160px]"
                          }`}
                        >
                          <InlineMarkdown text={header} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx % 2 === 0
                            ? "bg-white hover:bg-slate-50/60 transition-colors"
                            : "bg-slate-50/40 hover:bg-indigo-50/20 transition-colors"
                        }
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-2.5 px-3.5 text-slate-700 border-r last:border-r-0 border-slate-200/60 align-top leading-relaxed text-xs ${
                              cIdx === 0 ? "font-semibold text-slate-800" : ""
                            }`}
                          >
                            <InlineMarkdown text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "heading": {
            if (block.level === 1) {
              return (
                <h3
                  key={index}
                  className="text-base sm:text-lg font-bold text-slate-900 mt-4 mb-2 flex items-center gap-2 border-b border-slate-100 pb-1.5"
                >
                  <span className="w-2 h-4 bg-indigo-600 rounded-full inline-block"></span>
                  <InlineMarkdown text={block.text} />
                </h3>
              );
            }
            if (block.level === 2) {
              return (
                <h4
                  key={index}
                  className="text-sm sm:text-base font-bold text-slate-900 mt-3.5 mb-2 flex items-center gap-2"
                >
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full inline-block"></span>
                  <InlineMarkdown text={block.text} />
                </h4>
              );
            }
            return (
              <h5
                key={index}
                className="text-xs sm:text-sm font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5 text-indigo-900"
              >
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block"></span>
                <InlineMarkdown text={block.text} />
              </h5>
            );
          }

          case "blockquote":
            return (
              <blockquote
                key={index}
                className="my-2.5 pl-3.5 py-2 border-l-3 border-indigo-500 bg-indigo-50/50 rounded-r-xl text-xs sm:text-sm text-indigo-950 font-normal leading-relaxed"
              >
                <InlineMarkdown text={block.text} />
              </blockquote>
            );

          case "unordered-list":
            return (
              <ul key={index} className="my-2 space-y-1.5 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                    <span className="flex-1">
                      <InlineMarkdown text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "ordered-list":
            return (
              <ol key={index} className="my-2 space-y-1.5 pl-1">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed"
                  >
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] shrink-0 mt-0.5">
                      {itemIdx + 1}
                    </span>
                    <span className="flex-1">
                      <InlineMarkdown text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );

          case "paragraph":
          default:
            return (
              <p
                key={index}
                className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1.5"
              >
                <InlineMarkdown text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
