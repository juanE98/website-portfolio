export type TimelineEventType = 'work' | 'edu';

export interface TimelineEvent {
  title: string;
  subtitle: string;
  description: string;
  type: TimelineEventType;
  period: string;
  role: string;
  company: string;
  bullets: string[];
}

// Events are in reverse chronological order (most recent first)
export const timelineEvents: TimelineEvent[] = [
  {
    title: 'Contal Services',
    subtitle: 'Backend Software Engineer | 2024 - Current',
    description: 'Aged-care software for healthcare providers, including integrations with Australian government aged-care systems.',
    type: 'work',
    period: '2024 — Current',
    role: 'Backend Software Engineer',
    company: 'Contal Services',
    bullets: [
      'Optimised government API integration with connection pooling and two-tier caching — cut API calls 66–75%, bandwidth 94%, and monthly costs 66%.',
      'Delivered end-to-end Care Management app (React, Java/Spring Boot), automating 2 FTE of manual data entry at 80% test coverage.',
      'Built Jetstar API integrations for flight booking, fare rules, SSR handling, and bundle search.',
    ],
  },
  {
    title: 'Dye and Durham',
    subtitle: 'Junior Software Engineer | 2023 - 2024',
    description: 'Primarily .NET microservices with Angular frontend deployed through kubernetes in GCP.',
    type: 'work',
    period: '2023 — 2024',
    role: 'Junior Software Engineer',
    company: 'Dye and Durham',
    bullets: [
      'Migrated legacy SOAP integration layer to REST via a Java API client, protecting $1.5M annual revenue with zero downtime.',
      'Integrated Keycloak SSO with OAuth 2.0 and self-service password reset, modernising enterprise IAM.',
      'Authored sequence diagrams for legacy integration flows, accelerating team knowledge transfer.',
    ],
  },
  {
    title: 'Scriptsoft',
    subtitle: 'Software Developer | 2022 - 2023',
    description: 'Monolithic .NET framework applications for pharmaceutical and small business software. Worked part time during my uni days before transitioning to full time upon graduation.',
    type: 'work',
    period: '2022 — 2023',
    role: 'Software Developer',
    company: 'Scriptsoft',
    bullets: [
      'Built a custom Power BI solution for pharmacy inventory — real-time stock tracking and automated reconciliation.',
      'Maintained internal systems end-to-end, owning the full dev and deployment lifecycle.',
    ],
  },
  {
    title: 'Bachelor of Computer Science',
    subtitle: 'University of Queensland | 2019 - 2022',
    description: '',
    type: 'edu',
    period: '2019 — 2022',
    role: 'Bachelor of Computer Science',
    company: 'University of Queensland',
    bullets: ['Pivoted from pharmaceutics. Specialised in software engineering.'],
  },
  {
    title: 'Pharmacy Assistant',
    subtitle: 'Chemist Warehouse | 2017 - 2019',
    description: 'Worked in a fast paced environment where time management and communication / customer support skills were vital.',
    type: 'work',
    period: '2017 — 2019',
    role: 'Pharmacy Assistant',
    company: 'Chemist Warehouse',
    bullets: ['Fast-paced retail. Time management and customer comms muscles.'],
  },
  {
    title: 'Bachelor of Pharmaceutics and Therapeutic Science',
    subtitle: 'University of Queensland | 2016 - 2018',
    description: '',
    type: 'edu',
    period: '2016 — 2018',
    role: 'Bachelor of Pharmaceutics and Therapeutic Science',
    company: 'University of Queensland',
    bullets: ['Early grad exit from UQ Pharmacy before switching to CS'],
  },
  {
    title: 'Pharmacy Student',
    subtitle: 'Calanna Terrywhite | 2018',
    description: 'rural pharmacy student placement',
    type: 'edu',
    period: '2018',
    role: 'Pharmacy Student',
    company: 'Calanna Terrywhite',
    bullets: ['medication dispensing'],
  },
];
