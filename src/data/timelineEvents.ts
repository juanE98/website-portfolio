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
      'Internal aged-care software for healthcare providers.',
      'Integrations with Australian government aged-care systems.',
      'Jetstar API integrations for flight booking system',
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
      '.NET microservices with Angular frontend.',
      'Deployed via Kubernetes on Google Cloud Platform.',
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
      'Monolithic .NET framework apps for pharma & SMB.',
      'Started part-time at uni, transitioned to full-time on graduation.',
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
