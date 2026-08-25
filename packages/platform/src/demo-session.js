const keyFor = applicationId => `pihub:${applicationId}:demo-session:v1`;

export const readDemoSession = applicationId => {
  try {
    const raw = localStorage.getItem(keyFor(applicationId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeDemoSession = (applicationId, session) => {
  localStorage.setItem(keyFor(applicationId), JSON.stringify(session));
  return session;
};

export const clearDemoSession = applicationId => localStorage.removeItem(keyFor(applicationId));

export const authenticateDemo = ({ applicationId, email, password, account }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (normalizedEmail !== account.email.toLowerCase() || password !== account.password) {
    return { ok: false, error: 'The demo email or password is incorrect.' };
  }
  const session = {
    applicationId,
    user: { name: account.name, email: account.email, organization: account.organization, role: account.role },
    issuedAt: new Date().toISOString(),
    demo: true
  };
  return { ok: true, session };
};

export const consumeDemoAccessHandoff = ({ applicationId, account }) => {
  if (typeof window === 'undefined' || !account) return null;

  try {
    const url = new URL(window.location.href);
    const requestedApplication = url.searchParams.get('pihub_demo_access');
    const source = url.searchParams.get('source');
    if (requestedApplication !== applicationId || source !== 'investor-access') return null;

    const result = authenticateDemo({
      applicationId,
      email: account.email,
      password: account.password,
      account
    });
    if (!result.ok) return null;

    writeDemoSession(applicationId, result.session);
    url.searchParams.delete('pihub_demo_access');
    url.searchParams.delete('source');
    const cleanHref = `${url.pathname}${url.search}${url.hash}` || '/';
    window.history.replaceState(window.history.state, '', cleanHref);
    return result.session;
  } catch {
    return null;
  }
};
