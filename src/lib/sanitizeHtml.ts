const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_RE = /\son[a-z]+\s*=\s*(['"]).*?\1/gi;
const JS_URL_RE = /(href|src)\s*=\s*(['"])javascript:.*?\2/gi;

export function sanitizeHtml(html: string): string {
  return html
    .replace(SCRIPT_TAG_RE, "")
    .replace(EVENT_HANDLER_RE, "")
    .replace(JS_URL_RE, '$1="#"');
}
