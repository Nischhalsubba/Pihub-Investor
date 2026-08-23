export const DEMO_PROFILE_DEFAULTS = Object.freeze({
  fname: 'Demo',
  lname: 'Investor',
  company_name: 'PiHub Demo Investor',
  email: 'investor@example.com',
  phone_number: '+49 30 5550100',
  status: 'approved',
  category: 'bank',
  street_address: 'Investorstrasse 10',
  headquarter: 'Berlin',
  zip_code: '10115',
  contact_name_1: 'Demo Relationship Manager',
  contact_role_1: 'Senior Relationship Manager',
  contact_email_1: 'relationship@example.com',
  contact_phone_no_1: '+49 30 5550101',
  contact_name_2: 'Jonas Weber',
  contact_role_2: 'Portfolio Operations Lead',
  contact_email_2: 'jonas.weber@example.com',
  contact_phone_no_2: '+49 30 5550102',
  contact_name_3: 'Mara Klein',
  contact_role_3: 'Compliance & Risk Lead',
  contact_email_3: 'mara.klein@example.com',
  contact_phone_no_3: '+49 30 5550103',
  linked_in_link: 'https://www.linkedin.com/company/pihub-demo-investor',
  facebook_link: 'https://www.facebook.com/pihubdemo',
  twitter_link: 'https://x.com/pihubdemo',
  institution_id: 'PIH-DE-INV-0417',
  legal_entity_id: '529900PIHUBDEMO01',
  registration_number: 'HRB 219847 B',
  compliance_status: 'Verification complete',
  kyc_status: 'approved',
  permissions: ['Investor admin', 'Credit review', 'Portfolio analytics'],
  roles: ['Investor admin', 'Credit reviewer', 'Portfolio manager'],
  active_sessions: 3,
  session_count: 3,
  mfa_enabled: true,
  sso_provider: 'Microsoft Entra ID',
  risk_rating: 'Low risk',
  onboarding_status: 'Complete',
  verified_at: '2026-06-18T11:00:00Z',
  last_security_review: '2026-08-15T09:30:00Z',
  last_login_at: '2026-08-23T18:42:00Z',
  compliance_documents: [
    {
      id: 'DOC-KYC-001',
      name: 'KYC & beneficial ownership verification',
      status: 'Verified',
      reviewed_at: '2026-08-15T09:30:00Z'
    },
    {
      id: 'DOC-AML-002',
      name: 'AML screening confirmation',
      status: 'Verified',
      reviewed_at: '2026-08-14T13:15:00Z'
    },
    {
      id: 'DOC-REG-003',
      name: 'Commercial register extract',
      status: 'Current',
      reviewed_at: '2026-07-29T10:20:00Z'
    },
    {
      id: 'DOC-MANDATE-004',
      name: 'Investment mandate & authority matrix',
      status: 'Approved',
      reviewed_at: '2026-07-22T08:45:00Z'
    }
  ],
  audit_history: [
    {
      id: 'AUD-006',
      action: 'Security review completed',
      actor: 'Mara Klein',
      created_at: '2026-08-15T09:30:00Z'
    },
    {
      id: 'AUD-005',
      action: 'AML screening refreshed',
      actor: 'Compliance automation',
      created_at: '2026-08-14T13:15:00Z'
    },
    {
      id: 'AUD-004',
      action: 'Portfolio analytics role granted',
      actor: 'Demo Relationship Manager',
      created_at: '2026-08-11T15:20:00Z'
    },
    {
      id: 'AUD-003',
      action: 'Investment mandate approved',
      actor: 'Mara Klein',
      created_at: '2026-07-22T08:45:00Z'
    },
    {
      id: 'AUD-002',
      action: 'Institution verification completed',
      actor: 'PiHub Operations',
      created_at: '2026-06-18T11:00:00Z'
    },
    {
      id: 'AUD-001',
      action: 'Investor workspace created',
      actor: 'PiHub Operations',
      created_at: '2026-06-16T14:10:00Z'
    }
  ]
});

const isBlank = value => value === undefined
  || value === null
  || value === ''
  || (Array.isArray(value) && value.length === 0);

export const withCompleteDemoProfile = profile => {
  const source = profile && typeof profile === 'object' ? profile : {};
  return Object.keys(DEMO_PROFILE_DEFAULTS).reduce((result, key) => {
    result[key] = isBlank(source[key]) ? DEMO_PROFILE_DEFAULTS[key] : source[key];
    return result;
  }, { ...source });
};
