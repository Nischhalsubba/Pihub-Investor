import { describe, expect, it } from 'vitest';
import { getWorkspaceLinks } from './links';
describe('workspace links',()=>{it('rejects unsafe app origins',()=>{const links=getWorkspaceLinks({VITE_BORROWER_APP_URL:'/borrower',VITE_ADVISORY_APP_URL:'javascript:alert(1)',VITE_ADMIN_APP_URL:'https://admin.example.com'});expect(links.borrower).toBe('');expect(links.advisory).toBe('');expect(links.admin).toBe('https://admin.example.com');});});
