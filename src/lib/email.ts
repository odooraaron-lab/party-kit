// Sends email through Resend's HTTP API. With no RESEND_API_KEY set,
// the email is printed to the server log instead (handy while testing).
export async function sendEmail(opts: { to: string; subject: string; html: string; idempotencyKey?: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    const text = opts.html
      .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, '$2 ($1)') // keep links visible in the log
      .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
    console.log(`\n[email → ${opts.to}] ${opts.subject}\n${text}\n`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(opts.idempotencyKey ? { 'Idempotency-Key': opts.idempotencyKey } : {}),
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: opts.to, subject: opts.subject, html: opts.html, ...(opts.replyTo ? { reply_to: opts.replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Email failed: ${res.status} ${await res.text()}`);
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
