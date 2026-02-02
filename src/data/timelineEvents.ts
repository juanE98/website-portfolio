export interface TimelineEvent {
  title: string;
  subtitle: string;
  description: string;
}

// Events are in reverse chronological order (most recent first)
export const timelineEvents: TimelineEvent[] = [
  {
    title: 'Contal Services',
    subtitle: 'Backend Software Engineer - Current',
    description: 'Java backend with Spring Boot'
  },
  {
    title: 'Dye and Durham',
    subtitle: 'Junior Software Engineer | 2023 - 2026',
    description: 'Primarily .NET microservices with Angular frontend deployed through kubernetes in GCP.'
  },
  {
    title: 'Scriptsoft',
    subtitle: 'Software Developer | 2022 - 2023',
    description: 'Monolithic .NET framework applications for pharmaceutical and small business software. Worked part time during my uni days before transitioning to full time upon graduation.'
  },
  {
    title: 'Bachelor of Computer Science',
    subtitle: 'University of Queensland | 2019 - 2022',
    description: ''
  },
  {
    title: 'Pharmacy Assistant',
    subtitle: 'Chemist Warehouse | 2017 - 2019',
    description: 'Worked in a fast paced environment where time management and communication / customer support skills were vital.'
  },
  {
    title: 'Bachelor of Pharmaceutics and Therapeutic Science',
    subtitle: 'University of Queensland | 2016 - 2018',
    description: ''
  },
  {
    title: 'Pharmacy Student',
    subtitle: 'Calanna Terrywhite | 2018',
    description: 'rural pharmacy student placement'
  }
];
