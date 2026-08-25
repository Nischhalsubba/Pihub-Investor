import { normalizeModuleId } from './moduleIds';

const ACCESS_COPY = Object.freeze({
  investor: Object.freeze({
    en: Object.freeze({
      eyebrow: 'Secure investor access',
      description: 'Enter your email address and password',
      visualEyebrow: 'Capital decisions, structured clearly',
      visualTitle: 'One workspace for credit, opportunities and portfolio decisions.',
      visualDescription: 'Review relevant data, track requests and monitor invested positions without unnecessary visual noise.',
      proofItems: ['Opportunities', 'Credit requests', 'Portfolio']
    }),
    de: Object.freeze({
      eyebrow: 'Sicherer Investorenzugang',
      description: 'Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein',
      visualEyebrow: 'Kapitalentscheidungen, klar strukturiert',
      visualTitle: 'Ein Arbeitsbereich für Kredite, Chancen und Portfolioentscheidungen.',
      visualDescription: 'Prüfen Sie relevante Daten, verfolgen Sie Anfragen und behalten Sie investierte Positionen ohne unnötige visuelle Ablenkung im Blick.',
      proofItems: ['Chancen', 'Kreditanfragen', 'Portfolio']
    })
  }),
  borrower: Object.freeze({
    en: Object.freeze({
      eyebrow: 'Secure borrower access',
      description: 'Access your financing and application workspace',
      visualEyebrow: 'Financing progress, one clear process',
      visualTitle: 'Move financing requests from application to closing with less friction.',
      visualDescription: 'Provide company and project information, upload requested documents and follow PiHub review progress in one place.',
      proofItems: ['Application', 'Documents', 'Progress']
    }),
    de: Object.freeze({
      eyebrow: 'Sicherer Kreditnehmerzugang',
      description: 'Greifen Sie auf Ihren Finanzierungs- und Antragsbereich zu',
      visualEyebrow: 'Finanzierungsfortschritt, klar geführt',
      visualTitle: 'Finanzierungsanfragen vom Antrag bis zum Abschluss klar begleiten.',
      visualDescription: 'Stellen Sie Unternehmens- und Projektinformationen bereit, laden Sie angeforderte Unterlagen hoch und verfolgen Sie den Prüfungsfortschritt.',
      proofItems: ['Antrag', 'Dokumente', 'Fortschritt']
    })
  }),
  advisory: Object.freeze({
    en: Object.freeze({
      eyebrow: 'Secure advisory access',
      description: 'Access PiHub transaction and structuring workflows',
      visualEyebrow: 'Transactions, structured with control',
      visualTitle: 'Coordinate mandates, structuring and execution without losing deal context.',
      visualDescription: 'Keep counterparties, due diligence, transaction structure and execution milestones connected to one governed deal record.',
      proofItems: ['Mandates', 'Structuring', 'Execution']
    }),
    de: Object.freeze({
      eyebrow: 'Sicherer Advisory-Zugang',
      description: 'Greifen Sie auf PiHub-Transaktions- und Strukturierungsprozesse zu',
      visualEyebrow: 'Transaktionen, strukturiert gesteuert',
      visualTitle: 'Mandate, Strukturierung und Umsetzung koordinieren, ohne Deal-Kontext zu verlieren.',
      visualDescription: 'Halten Sie Gegenparteien, Due Diligence, Transaktionsstruktur und Meilensteine an einem kontrollierten Deal-Datensatz zusammen.',
      proofItems: ['Mandate', 'Strukturierung', 'Umsetzung']
    })
  })
});

export const getAccessCopy = (value, locale = 'en') => {
  const id = normalizeModuleId(value) || 'investor';
  const language = locale === 'de' ? 'de' : 'en';
  return ACCESS_COPY[id][language];
};
