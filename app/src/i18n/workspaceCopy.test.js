import { beforeEach, describe, expect, it } from 'vitest';
import { setLocale } from '../_utils/locale';
import { workspaceText } from './workspaceCopy';

beforeEach(() => localStorage.clear());

describe('workspace copy', () => {
  it('uses the canonical locale owner for English and German controls', () => {
    setLocale('en');
    expect(workspaceText('view')).toBe('View');
    expect(workspaceText('savedViews')).toBe('Saved views');
    setLocale('de');
    expect(workspaceText('view')).toBe('Ansicht');
    expect(workspaceText('savedViews')).toBe('Gespeicherte Ansichten');
  });
});
