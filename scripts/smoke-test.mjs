import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path, { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temp = await mkdtemp(path.join(tmpdir(), 'homecare-plus-test-'));
const storage = new Map();

try {
  const apiDir = path.join(temp, 'api');
  const blobDir = path.join(temp, 'node_modules', '@vercel', 'blob');
  await mkdir(apiDir, { recursive: true });
  await mkdir(blobDir, { recursive: true });
  await cp(path.join(root, 'api'), apiDir, { recursive: true });

  await writeFile(path.join(blobDir, 'package.json'), JSON.stringify({ name: '@vercel/blob', version: '0.0.0-test', type: 'module', exports: './index.js' }));
  await writeFile(path.join(blobDir, 'index.js'), `
    const storage = globalThis.__homecareTestStorage;
    export async function put(path, body) {
      storage.set(path, typeof body === 'string' ? body : Buffer.from(body).toString('utf8'));
      return { url: path };
    }
    export async function get(path) {
      if (!storage.has(path)) return null;
      const bytes = new TextEncoder().encode(storage.get(path));
      return { stream: new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }) };
    }
    export async function list({ prefix = '' }) {
      return { blobs: [...storage.keys()].filter((key) => key.startsWith(prefix)).map((url) => ({ url, pathname: url })), hasMore: false };
    }
  `);

  globalThis.__homecareTestStorage = storage;
  process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
  process.env.JWT_SECRET = 'local-smoke-test-secret-not-for-production';
  const { default: handler } = await import(pathToFileURL(path.join(apiDir, '[[...path]].js')).href);
  const route = async (relativePath) => (await import(pathToFileURL(path.join(apiDir, relativePath)).href)).default;
  const loginRoute = await route('auth/login.js');
  const checkoutRoute = await route('subscriptions/checkout.js');
  const bookingStatusRoute = await route('bookings/status.js');
  const analyticsRoute = await route('admin/analytics.js');
  const planUpdateRoute = await route('admin/plans/update.js');

  async function call(method, url, options = {}, selectedHandler = handler) {
    const response = {
      statusCode: 200,
      headers: {},
      body: '',
      setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
      status(code) { this.statusCode = code; return this; },
      end(body = '') { this.body = String(body); return this; },
    };
    await selectedHandler({ method, url, headers: options.headers || {}, body: options.body }, response);
    let data = response.body;
    try { data = JSON.parse(response.body); } catch { /* non-JSON response */ }
    return { status: response.statusCode, data };
  }

  const checks = [];
  const check = (name, condition) => { assert.ok(condition, name); checks.push(name); };

  const health = await call('GET', '/api/health');
  check('Health endpoint returns 200', health.status === 200 && health.data.ok === true);

  const plans = await call('GET', '/api/plans');
  check('Plan catalogue returns four plans', plans.status === 200 && plans.data.length === 4);

  const services = await call('GET', '/api/services');
  check('Service catalogue returns six services', services.status === 200 && services.data.length === 6);

  const customerLogin = await call('POST', '/api/auth/login', { body: { email: 'customer@homecareplus.demo', password: 'Customer@12345' } }, loginRoute);
  check('Customer demo login works', customerLogin.status === 200 && !!customerLogin.data.token);
  const customerAuth = { authorization: `Bearer ${customerLogin.data.token}` };

  const customerDashboard = await call('GET', '/api/dashboard', { headers: customerAuth });
  check('Customer dashboard returns seeded subscription', customerDashboard.status === 200 && customerDashboard.data.subscription?.planName === 'Basic Care');

  const checkout = await call('POST', '/api/subscriptions/checkout', { headers: customerAuth, body: { planId: 'standard-monthly', method: 'UPI' } }, checkoutRoute);
  check('Dummy subscription checkout succeeds without charging', checkout.status === 201 && checkout.data.subscription?.isDummyPayment === true);

  const booking = await call('POST', '/api/bookings', { headers: customerAuth, body: { serviceId: 'plumbing', date: '2027-01-15', slot: '10:00 AM – 12:00 PM', address: 'Madhapur, Hyderabad' } });
  check('Customer booking creates a request', booking.status === 201 && booking.data.booking?.status === 'pending');

  const professionalLogin = await call('POST', '/api/auth/login', { body: { email: 'pro@homecareplus.demo', password: 'Pro@12345' } });
  check('Professional demo login works', professionalLogin.status === 200 && professionalLogin.data.user?.role === 'professional');
  const professionalAuth = { authorization: `Bearer ${professionalLogin.data.token}` };

  const accepted = await call('PATCH', '/api/bookings/status', { headers: professionalAuth, body: { id: booking.data.booking.id, status: 'accepted' } }, bookingStatusRoute);
  check('Professional can accept assigned request', accepted.status === 200 && accepted.data.status === 'accepted');
  const completed = await call('PATCH', '/api/bookings/status', { headers: professionalAuth, body: { id: booking.data.booking.id, status: 'completed' } }, bookingStatusRoute);
  check('Professional can complete request', completed.status === 200 && completed.data.status === 'completed');

  const review = await call('POST', '/api/reviews', { headers: customerAuth, body: { bookingId: booking.data.booking.id, rating: 5, feedback: 'On time and professional.' } });
  check('Customer can review completed booking', review.status === 201 && review.data.rating === 5);

  const customerCannotAdmin = await call('GET', '/api/admin/analytics', { headers: customerAuth }, analyticsRoute);
  check('Role-based access blocks customers from admin analytics', customerCannotAdmin.status === 403);

  const adminLogin = await call('POST', '/api/auth/login', { body: { email: 'admin@homecareplus.demo', password: 'Admin@12345' } }, loginRoute);
  check('Admin demo login works', adminLogin.status === 200 && adminLogin.data.user?.role === 'admin');
  const adminAuth = { authorization: `Bearer ${adminLogin.data.token}` };
  const analytics = await call('GET', '/api/admin/analytics', { headers: adminAuth }, analyticsRoute);
  check('Admin analytics endpoint returns KPIs', analytics.status === 200 && typeof analytics.data.customers === 'number');
  const planUpdate = await call('PATCH', '/api/admin/plans/update', { headers: adminAuth, body: { id: 'basic-monthly', price: 1099 } }, planUpdateRoute);
  check('Admin can update plan price', planUpdate.status === 200 && planUpdate.data.price === 1099);

  const paymentHistory = await call('GET', '/api/payments', { headers: customerAuth });
  check('Customer payment history includes demo checkout', paymentHistory.status === 200 && paymentHistory.data.some((item) => item.isDummy));

  console.log(`PASS ${checks.length} HomeCare Plus API smoke checks`);
  for (const item of checks) console.log(`✓ ${item}`);
} finally {
  delete globalThis.__homecareTestStorage;
  await rm(temp, { recursive: true, force: true });
}
