import DOMPurify from "dompurify";

interface SafeHtmlProps {
  html: string;
}

function SafeHtml({ html }: SafeHtmlProps) {
  return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}

function SafeHtmlInline({ html }: SafeHtmlProps) {
  return (
    <span
      className="inline [&_*]:inline truncate whitespace-nowrap"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html, {FORBID_TAGS: ['img']}),
      }}
    />
  );
}

export { SafeHtml, SafeHtmlInline };
