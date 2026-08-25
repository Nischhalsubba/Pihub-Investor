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
