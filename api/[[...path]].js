import { put, get, list } from '@vercel/blob';
import crypto from 'node:crypto';
import { gunzipSync } from 'node:zlib';

const APP_HTML_GZIP = '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';

const PREFIX = 'homecare-plus/v1/';
const TOKEN_SECRET = process.env.JWT_SECRET;
const DEMO_USERS = [
  { id: 'demo-customer', name: 'Aarav Mehta', email: 'customer@homecareplus.demo', phone: '+91 98765 43210', password: 'Customer@12345', role: 'customer', city: 'Hyderabad', address: 'Madhapur, Hyderabad', createdAt: '2026-11-01T09:00:00.000Z' },
  { id: 'demo-professional', name: 'Ravi Kumar', email: 'pro@homecareplus.demo', phone: '+91 98765 10010', password: 'Pro@12345', role: 'professional', categories: ['Cleaning', 'Plumbing', 'Electrical', 'AC & Appliance'], approved: true, available: true, city: 'Hyderabad', createdAt: '2026-11-01T09:00:00.000Z' },
  { id: 'demo-admin', name: 'HomeCare Admin', email: 'admin@homecareplus.demo', phone: '+91 90000 00000', password: 'Admin@12345', role: 'admin', createdAt: '2026-11-01T09:00:00.000Z' }
];
const PLANS = [
  { id: 'basic-monthly', name: 'Basic Care', cadence: 'Monthly', price: 999, periodDays: 30, description: 'Reliable essentials for a well-maintained home.', features: ['1 general home cleaning', '1 plumbing inspection', '1 electrical safety check', '10% off emergency visits'], recommended: false },
  { id: 'standard-monthly', name: 'Standard Care', cadence: 'Monthly', price: 1999, periodDays: 30, description: 'More visits and proactive care for busy households.', features: ['2 home cleanings', '2 electrical visits', 'Minor plumbing fixes included', 'Quarterly AC servicing', 'Priority booking'], recommended: true },
  { id: 'standard-quarterly', name: 'Standard Care', cadence: 'Quarterly', price: 5499, periodDays: 90, description: 'Three months of scheduled maintenance at one price.', features: ['6 home cleanings', '6 electrical visits', 'Minor plumbing fixes included', '1 AC service per quarter', 'Priority booking'], recommended: false },
  { id: 'premium-yearly', name: 'Premium Care', cadence: 'Yearly', price: 14999, periodDays: 365, description: 'Comprehensive annual care with priority support.', features: ['Regular cleaning (fair-use policy)', 'Priority emergency support', 'Dedicated service manager', '2 appliance servicing visits', 'Annual home safety inspection'], recommended: false }
];
const SERVICES = [
  { id: 'cleaning', name: 'Home cleaning', category: 'Cleaning', price: 699, duration: '2–3 hours', icon: '✦', detail: 'Kitchen, bathrooms and living areas' },
  { id: 'plumbing', name: 'Plumbing visit', category: 'Plumbing', price: 399, duration: '45–60 min', icon: '⌁', detail: 'Leak checks, taps and minor repairs' },
  { id: 'electrical', name: 'Electrical safety check', category: 'Electrical', price: 449, duration: '45–60 min', icon: 'ϟ', detail: 'Switches, sockets and safety checks' },
  { id: 'ac', name: 'AC servicing', category: 'AC & Appliance', price: 899, duration: '60–90 min', icon: '❄', detail: 'Filter cleaning and performance check' },
  { id: 'appliance', name: 'Appliance check', category: 'AC & Appliance', price: 599, duration: '45–60 min', icon: '▣', detail: 'Basic inspection of a home appliance' },
  { id: 'deep-clean', name: 'Deep cleaning', category: 'Cleaning', price: 1499, duration: '4–5 hours', icon: '✧', detail: 'Detailed room-by-room deep clean' }
];

const json = (res, status, data) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(data)); };
const fail = (res, status, message) => json(res, status, { error: message });
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const cleanUser = ({ passwordHash, ...u }) => u;

async function all(collection) {
  const prefix = `${PREFIX}${collection}/`;
  let cursor;
  const blobs = [];
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    blobs.push(...(page.blobs || []));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const rows = [];
  for (const blob of blobs) {
    const object = await get(blob.url, { access: 'private' });
    if (!object) continue;
    try { rows.push(JSON.parse(await new Response(object.stream).text())); } catch { /* ignore malformed record */ }
  }
  return rows;
}
async function one(collection, key) {
  const object = await get(`${PREFIX}${collection}/${key}.json`, { access: 'private' });
  if (!object) return null;
  try { return JSON.parse(await new Response(object.stream).text()); } catch { return null; }
}
async function save(collection, record) {
  await put(`${PREFIX}${collection}/${record.id}.json`, JSON.stringify(record), {
    access: 'private', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json; charset=utf-8'
  });
  return record;
}
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, expected] = stored.split(':');
  const actual = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
}
function b64(value) { return Buffer.from(value).toString('base64url'); }
function tokenFor(user) {
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({ sub: user.id, role: user.role, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }));
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}
async function auth(req) {
  const header = req.headers.authorization || '';
  const raw = header.startsWith('Bearer ') ? header.slice(7) : '';
  const parts = raw.split('.');
  if (parts.length !== 3 || !TOKEN_SECRET) return null;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(`${parts[0]}.${parts[1]}`).digest();
  const received = Buffer.from(parts[2], 'base64url');
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()); } catch { return null; }
  if (!payload.exp || payload.exp < Date.now() / 1000) return null;
  const user = await one('users', payload.sub);
  return user ? cleanUser(user) : null;
}
async function seed() {
  const marker = await one('meta', 'seeded');
  if (marker) return;
  for (const plan of PLANS) await save('plans', { ...plan, active: true, updatedAt: now() });
  for (const demo of DEMO_USERS) {
    const existing = (await all('users')).find(x => x.email === demo.email);
    if (!existing) {
      const { password, ...profile } = demo;
      await save('users', { ...profile, passwordHash: hashPassword(password), active: true });
    }
  }
  const customer = await one('users', 'demo-customer');
  const pro = await one('users', 'demo-professional');
  const sub = await one('subscriptions', 'demo-subscription');
  if (customer && !sub) {
    const started = new Date();
    const end = new Date(started.getTime() + 30 * 86400000);
    await save('subscriptions', { id: 'demo-subscription', userId: customer.id, planId: 'basic-monthly', planName: 'Basic Care', cadence: 'Monthly', amount: 999, status: 'active', startDate: started.toISOString(), renewalDate: end.toISOString(), paymentId: 'demo-payment', createdAt: now() });
    await save('payments', { id: 'demo-payment', userId: customer.id, subscriptionId: 'demo-subscription', amount: 999, method: 'UPI (Demo)', status: 'success', reference: 'HCP-DEMO-001', description: 'Basic Care · Monthly', createdAt: now() });
    await save('bookings', { id: 'demo-booking', customerId: customer.id, customerName: customer.name, serviceId: 'plumbing', serviceName: 'Plumbing visit', category: 'Plumbing', date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), slot: '10:00 AM – 12:00 PM', address: 'Madhapur, Hyderabad', notes: 'Please inspect a slow kitchen sink leak.', price: 399, status: 'pending', professionalId: pro?.id || null, professionalName: pro?.name || null, createdAt: now() });
  }
  await save('meta', { id: 'seeded', value: true, createdAt: now() });
}
function requireRole(user, roles) { return !!user && roles.includes(user.role); }
async function body(req) { if (req.body && typeof req.body === 'object') return req.body; if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } } return {}; }

export default async function handler(req, res) {
  const requestUrl = new URL(req.url, 'https://homecare.plus');
  const requestPath = requestUrl.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
  if (req.method === 'GET' && requestPath === '') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(gunzipSync(Buffer.from(APP_HTML_GZIP, 'base64')));
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!TOKEN_SECRET || !process.env.BLOB_READ_WRITE_TOKEN) return fail(res, 503, 'App storage is not configured.');
  try {
    await seed();
    const url = new URL(req.url, 'https://homecare.plus');
    const path = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    const input = await body(req);
    const user = await auth(req);

    if (path === 'health' && req.method === 'GET') return json(res, 200, { ok: true, app: 'HomeCare Plus', storage: 'private-persistent', time: now() });
    if (path === 'plans' && req.method === 'GET') return json(res, 200, (await all('plans')).filter(p => p.active !== false));
    if (path === 'services' && req.method === 'GET') return json(res, 200, SERVICES);

    if (path === 'auth/register' && req.method === 'POST') {
      const name = String(input.name || '').trim();
      const email = String(input.email || '').trim().toLowerCase();
      const password = String(input.password || '');
      const phone = String(input.phone || '').trim();
      const role = input.role === 'professional' ? 'professional' : 'customer';
      if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || phone.length < 7) return fail(res, 400, 'Enter a valid name, email, phone and password (8+ characters).');
      if ((await all('users')).some(x => x.email === email)) return fail(res, 409, 'An account with this email already exists.');
      const u = { id: id(), name, email, phone, role, city: String(input.city || 'Hyderabad').trim(), address: String(input.address || '').trim(), active: true, approved: role !== 'professional', categories: role === 'professional' ? (Array.isArray(input.categories) ? input.categories : ['Cleaning']) : undefined, documentRef: role === 'professional' ? String(input.documentRef || '').trim().slice(0,80) : undefined, available: true, createdAt: now(), passwordHash: hashPassword(password) };
      await save('users', u);
      return json(res, 201, { token: tokenFor(u), user: cleanUser(u), message: role === 'professional' ? 'Application received. An admin must approve your profile before you can accept jobs.' : 'Account created.' });
    }
    if (path === 'auth/login' && req.method === 'POST') {
      const email = String(input.email || '').trim().toLowerCase();
      const u = (await all('users')).find(x => x.email === email);
      if (!u || !verifyPassword(String(input.password || ''), u.passwordHash) || u.active === false) return fail(res, 401, 'Email or password is incorrect.');
      return json(res, 200, { token: tokenFor(u), user: cleanUser(u) });
    }
    if (path === 'me' && req.method === 'GET') return user ? json(res, 200, user) : fail(res, 401, 'Please sign in.');
    if (!user) return fail(res, 401, 'Please sign in to continue.');

    if (path === 'dashboard' && req.method === 'GET') {
      if (user.role === 'customer') {
        const [subs, bookings, payments, reviews] = await Promise.all([all('subscriptions'), all('bookings'), all('payments'), all('reviews')]);
        return json(res, 200, { subscription: subs.filter(x => x.userId === user.id && x.status === 'active').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0] || null, bookings: bookings.filter(x => x.customerId === user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)), payments: payments.filter(x => x.userId === user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)), reviews: reviews.filter(x => x.userId === user.id) });
      }
      if (user.role === 'professional') {
        const bookings = (await all('bookings')).filter(x => x.professionalId === user.id || (!x.professionalId && x.status === 'pending'));
        const reviews = (await all('reviews')).filter(x => x.professionalId === user.id);
        return json(res, 200, { bookings: bookings.sort((a,b)=>new Date(a.date)-new Date(b.date)), reviews, profile: user });
      }
      const [users, bookings, subscriptions, payments, plans, professionals] = await Promise.all([all('users'), all('bookings'), all('subscriptions'), all('payments'), all('plans'), all('users')]);
      const completed = bookings.filter(x => x.status === 'completed').length;
      const ratingRows = await all('reviews');
      const activeSubs = subscriptions.filter(x=>x.status==='active');
      const mrr = activeSubs.reduce((s,x)=>s + (x.cadence==='Yearly' ? x.amount/12 : x.cadence==='Quarterly' ? x.amount/3 : x.amount), 0);
      return json(res, 200, { stats: { customers: users.filter(x=>x.role==='customer').length, professionals: professionals.filter(x=>x.role==='professional').length, pendingProfessionals: professionals.filter(x=>x.role==='professional'&&!x.approved).length, bookings: bookings.length, completed, pending: bookings.filter(x=>x.status==='pending').length, activeSubscriptions: activeSubs.length, mrr: Math.round(mrr), revenue: payments.filter(x=>x.status==='success').reduce((s,x)=>s+x.amount,0), averageRating: ratingRows.length ? (ratingRows.reduce((s,x)=>s+x.rating,0)/ratingRows.length).toFixed(1) : '—', commission: Math.round(bookings.filter(x=>['completed','accepted'].includes(x.status)).reduce((s,x)=>s+x.price*0.15,0)) }, bookings: bookings.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,100), users: users.filter(x=>x.role!=='admin').map(cleanUser), plans, payments: payments.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,100) });
    }
    if (path === 'subscriptions/checkout' && req.method === 'POST') {
      if (!requireRole(user, ['customer'])) return fail(res, 403, 'Only customers can subscribe.');
      const plan = await one('plans', input.planId);
      if (!plan || plan.active === false) return fail(res, 404, 'That plan is not available.');
      const subs = await all('subscriptions');
      for (const old of subs.filter(x=>x.userId===user.id && x.status==='active')) await save('subscriptions', { ...old, status:'superseded', updatedAt:now() });
      const start = new Date(); const renewal = new Date(start.getTime() + plan.periodDays*86400000);
      const subscriptionId = id(); const paymentId = id();
      const method = ['UPI','Card','Net Banking'].includes(input.method) ? input.method : 'UPI';
      await save('payments', { id: paymentId, userId:user.id, subscriptionId, amount:plan.price, method:`${method} (Demo)`, status:'success', reference:`HCP-${Date.now().toString().slice(-8)}`, description:`${plan.name} · ${plan.cadence}`, createdAt:now(), isDummy:true });
      const subscription = { id:subscriptionId, userId:user.id, planId:plan.id, planName:plan.name, cadence:plan.cadence, amount:plan.price, status:'active', startDate:start.toISOString(), renewalDate:renewal.toISOString(), paymentId, createdAt:now(), isDummyPayment:true };
      await save('subscriptions', subscription);
      return json(res, 201, { subscription, message:'Demo payment successful. No money was charged.' });
    }
    if (path === 'subscriptions/cancel' && req.method === 'POST') {
      if (user.role !== 'customer') return fail(res,403,'Only customers can manage subscriptions.');
      const subs = (await all('subscriptions')).filter(x=>x.userId===user.id && x.status==='active');
      if (!subs.length) return fail(res,404,'No active subscription found.');
      const current = subs.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0];
      const updated = { ...current, status:'cancelled', cancelledAt:now(), updatedAt:now() };
      await save('subscriptions',updated);
      return json(res,200,{subscription:updated,message:'Subscription cancelled. Access remains active until its original renewal date.'});
    }
    if (path === 'bookings' && req.method === 'GET') {
      const rows = await all('bookings');
      return json(res, 200, user.role==='admin' ? rows : user.role==='professional' ? rows.filter(x=>x.professionalId===user.id || (!x.professionalId&&x.status==='pending')) : rows.filter(x=>x.customerId===user.id));
    }
    if (path === 'bookings' && req.method === 'POST') {
      if (!requireRole(user,['customer'])) return fail(res,403,'Only customers can create bookings.');
      const service = SERVICES.find(x=>x.id===input.serviceId);
      if (!service || !input.date || new Date(`${input.date}T00:00:00`).toString()==='Invalid Date' || !input.slot || String(input.address||'').trim().length<5) return fail(res,400,'Choose a service, date, time slot and complete address.');
      const pros = (await all('users')).filter(x=>x.role==='professional'&&x.approved&&x.available!==false && (x.categories||[]).includes(service.category));
      const chosen = pros[0] || null;
      const booking = { id:id(), customerId:user.id, customerName:user.name, serviceId:service.id, serviceName:service.name, category:service.category, date:input.date, slot:input.slot, address:String(input.address).trim(), notes:String(input.notes||'').trim().slice(0,500), price:service.price, status:'pending', professionalId:chosen?.id||null, professionalName:chosen?.name||null, createdAt:now() };
      await save('bookings',booking);
      return json(res,201,{booking,message:chosen?'Request sent to an approved professional.':'Request saved. A professional will be assigned after approval.'});
    }
    const bookingStatus = path.match(/^bookings\/([^/]+)\/status$/);
    if (bookingStatus && req.method === 'PATCH') {
      const booking = await one('bookings', bookingStatus[1]);
      if (!booking) return fail(res,404,'Booking not found.');
      if (!(user.role==='admin' || (user.role==='professional' && (booking.professionalId===user.id || (!booking.professionalId&&booking.status==='pending'))))) return fail(res,403,'You cannot update this booking.');
      const status = input.status;
      const valid = user.role==='professional' ? ['accepted','rejected','completed'] : ['pending','accepted','rejected','completed','cancelled','disputed','refunded'];
      if (!valid.includes(status)) return fail(res,400,'Invalid booking status.');
      const updated = { ...booking, status, professionalId:user.role==='professional'?user.id:booking.professionalId, professionalName:user.role==='professional'?user.name:booking.professionalName, updatedAt:now() };
      await save('bookings',updated);
      if (status==='refunded') {
        const payment = (await all('payments')).find(x=>x.userId===booking.customerId && x.description.includes(booking.serviceName) && x.status==='success');
        if (payment) await save('payments',{...payment,status:'refunded',updatedAt:now()});
        const priorRefund=(await all('payments')).find(x=>x.bookingId===booking.id&&x.status==='refunded');
        if(!priorRefund) await save('payments',{id:id(),userId:booking.customerId,bookingId:booking.id,amount:booking.price,method:'Demo refund',status:'refunded',reference:`HCP-REF-${Date.now().toString().slice(-7)}`,description:`Refund simulation · ${booking.serviceName}`,createdAt:now(),isDummy:true});
      }
      return json(res,200,updated);
    }
    if (path === 'professional/availability' && req.method === 'PATCH') {
      if (user.role!=='professional') return fail(res,403,'Professional access required.');
      const record=await one('users',user.id);
      const updated={...record,available:!!input.available,updatedAt:now()}; await save('users',updated);
      return json(res,200,{available:updated.available});
    }
    if (path === 'payments' && req.method === 'GET') {
      const rows=await all('payments'); return json(res,200, rows.filter(x=>user.role==='admin'||x.userId===user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
    }
    if (path === 'reviews' && req.method === 'POST') {
      if(user.role!=='customer') return fail(res,403,'Only customers can leave a review.');
      const booking=await one('bookings',input.bookingId);
      const rating=Number(input.rating);
      if(!booking||booking.customerId!==user.id||booking.status!=='completed') return fail(res,400,'Only completed bookings can be reviewed.');
      if(!Number.isInteger(rating)||rating<1||rating>5) return fail(res,400,'Choose a rating from 1 to 5.');
      if((await all('reviews')).some(x=>x.bookingId===booking.id)) return fail(res,409,'This booking has already been reviewed.');
      const review={id:id(),bookingId:booking.id,userId:user.id,customerName:user.name,professionalId:booking.professionalId,serviceName:booking.serviceName,rating,feedback:String(input.feedback||'').trim().slice(0,500),createdAt:now()};
      await save('reviews',review); return json(res,201,review);
    }
    if (path === 'admin/professionals' && req.method === 'GET') {
      if(user.role!=='admin') return fail(res,403,'Admin access required.');
      return json(res,200,(await all('users')).filter(x=>x.role==='professional').map(cleanUser));
    }
    const approveMatch=path.match(/^admin\/professionals\/([^/]+)$/);
    if(approveMatch&&req.method==='PATCH'){
      if(user.role!=='admin') return fail(res,403,'Admin access required.');
      const pro=await one('users',approveMatch[1]); if(!pro||pro.role!=='professional') return fail(res,404,'Professional not found.');
      const updated={...pro,approved:!!input.approved,adminNote:String(input.note||'').slice(0,300),updatedAt:now()}; await save('users',updated); return json(res,200,cleanUser(updated));
    }
    const planMatch=path.match(/^admin\/plans\/([^/]+)$/);
    if(planMatch&&req.method==='PATCH'){
      if(user.role!=='admin') return fail(res,403,'Admin access required.');
      const plan=await one('plans',planMatch[1]); if(!plan) return fail(res,404,'Plan not found.');
      const updated={...plan,name:String(input.name||plan.name).slice(0,60),price:Math.max(99,Math.min(100000,Number(input.price)||plan.price)),active:input.active===undefined?plan.active:!!input.active,description:String(input.description||plan.description).slice(0,200),updatedAt:now()}; await save('plans',updated); return json(res,200,updated);
    }
    if(path==='admin/analytics'&&req.method==='GET'){
      if(user.role!=='admin') return fail(res,403,'Admin access required.');
      const [users,bookings,subscriptions,payments,reviews]=await Promise.all([all('users'),all('bookings'),all('subscriptions'),all('payments'),all('reviews')]);
      const active=subscriptions.filter(x=>x.status==='active');
      const mrr=active.reduce((s,x)=>s+(x.cadence==='Yearly'?x.amount/12:x.cadence==='Quarterly'?x.amount/3:x.amount),0);
      return json(res,200,{customers:users.filter(x=>x.role==='customer').length,professionals:users.filter(x=>x.role==='professional').length,pendingProfessionals:users.filter(x=>x.role==='professional'&&!x.approved).length,bookings:bookings.length,completed:bookings.filter(x=>x.status==='completed').length,pending:bookings.filter(x=>x.status==='pending').length,activeSubscriptions:active.length,mrr:Math.round(mrr),revenue:payments.filter(x=>x.status==='success').reduce((s,x)=>s+x.amount,0),commission:Math.round(bookings.filter(x=>['completed','accepted'].includes(x.status)).reduce((s,x)=>s+x.price*0.15,0)),averageRating:reviews.length?(reviews.reduce((s,x)=>s+x.rating,0)/reviews.length).toFixed(1):'—'});
    }
    if(path==='auth/logout'&&req.method==='POST') return json(res,200,{ok:true});
    return fail(res,404,'Route not found.');
  } catch (error) {
    console.error('HomeCare API error:', error?.stack || error);
    return fail(res,500,'Something went wrong. Please try again.');
  }
}
