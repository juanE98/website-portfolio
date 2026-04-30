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
      'Optimised government API integration achieving 66–75% API call volume reduction, 94% network bandwidth cut, and 99% connection overhead elimination through connection pooling and two-tier caching, reducing monthly operational costs by 66%.',
      'Delivered end-to-end Care Management application (React frontend, Java/Spring Boot backend with Hibernate ORM), automating 2 FTE workload of manual data entry while maintaining 80% unit test coverage.',
      'Built Jetstar API integrations for flight booking with new fare rules, Special Service Request (SSR) handling, and bundle search functionality.',
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
      'Migrated legacy monolith integration layer from SOAP to REST using a Java API client, protecting $1.5M annual revenue with zero service disruption and full government compliance.',
      'Integrated Keycloak SSO with OAuth 2.0 authentication and self-service password reset, modernising enterprise identity and access management.',
      'Authored sequence diagrams for complex legacy integration flows, accelerating team knowledge transfer and surfacing reusable integration patterns.',
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
      'Developed custom Power BI solution for pharmacy inventory management, enabling real-time stock tracking and automated reconciliation.',
      'Maintained and improved internal software systems, owning the full development and deployment lifecycle for feature delivery and bug resolution.',
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
