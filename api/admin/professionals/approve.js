import handler from '../../[[...path]].js';

function bodyOf(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

export default function approveProfessional(req, res) {
  const id = String(bodyOf(req).id || '').trim();
  if (!id || id.includes('/') || id.includes('\\')) return res.status(400).json({ error: 'A valid professional ID is required.' });
  const url = new URL(req.url, 'https://homecare.plus');
  req.url = `/api/admin/professionals/${encodeURIComponent(id)}${url.search}`;
  return handler(req, res);
}
