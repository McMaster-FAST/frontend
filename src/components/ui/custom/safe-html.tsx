import { cleanHtmlForInline } from "@/lib/utils";
import DOMPurify from "dompurify";

interface SafeHtmlProps {
  html: string;
}
function SafeHtml({ html }: SafeHtmlProps) {
  return (
    <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
  );
}

function SafeHtmlInline({ html }: SafeHtmlProps) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: cleanHtmlForInline(html),
      }}
    />
  );
}

export { SafeHtml, SafeHtmlInline };
