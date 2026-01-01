// Hackathon data types and mock data generator

export interface Agenda {
  summary: string;
  name: string;
  type: 'workshop' | 'presentation' | 'coding' | 'break' | 'ceremony';
  startedAt: Date;
  endedAt: Date;
}

export interface Person {
  name: string;
  avatar: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  address: string;
  organizations: string[];
  skills: string[];
  githubLink: string;
  githubAccount: string;
  createdBy: string;
}

export interface Organization {
  name: string;
  logo: string;
  link: string;
  members: string[];
  prizes: string[];
}

export interface Prize {
  name: string;
  image: string;
  price: number;
  amount: number;
  level: 'gold' | 'silver' | 'bronze' | 'special';
  sponsor: string;
}

export interface Template {
  name: string;
  summary: string;
  sourceLink: string;
  previewLink: string;
}

export interface Project {
  name: string;
  summary: string;
  createdBy: string;
  group: string[];
  members: string[];
  products: string[];
  score: number;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  agenda: Agenda[];
  people: Person[];
  organizations: Organization[];
  prizes: Prize[];
  templates: Template[];
  projects: Project[];
}

// Mock data generator
export function generateMockHackathon(id: string): Hackathon {
  return {
    id,
    title: 'Open Source Innovation Hackathon 2026',
    description:
      'A 48-hour coding marathon bringing together developers, designers, and innovators to build the future of open source software.',
    startDate: new Date('2026-03-15T09:00:00'),
    endDate: new Date('2026-03-17T18:00:00'),
    location: 'Virtual & On-site (Beijing)',
    agenda: [
      {
        summary: 'Welcome participants and introduce the hackathon theme',
        name: 'Opening Ceremony',
        type: 'ceremony',
        startedAt: new Date('2026-03-15T09:00:00'),
        endedAt: new Date('2026-03-15T10:00:00'),
      },
      {
        summary: 'Introduction to modern web development frameworks',
        name: 'Web Development Workshop',
        type: 'workshop',
        startedAt: new Date('2026-03-15T10:30:00'),
        endedAt: new Date('2026-03-15T12:00:00'),
      },
      {
        summary: 'Lunch break and networking',
        name: 'Lunch & Networking',
        type: 'break',
        startedAt: new Date('2026-03-15T12:00:00'),
        endedAt: new Date('2026-03-15T13:30:00'),
      },
      {
        summary: 'Teams start working on their projects',
        name: 'Coding Session - Day 1',
        type: 'coding',
        startedAt: new Date('2026-03-15T13:30:00'),
        endedAt: new Date('2026-03-15T22:00:00'),
      },
      {
        summary: 'Continue development and team collaboration',
        name: 'Coding Session - Day 2',
        type: 'coding',
        startedAt: new Date('2026-03-16T09:00:00'),
        endedAt: new Date('2026-03-16T22:00:00'),
      },
      {
        summary: 'Final sprint for project completion',
        name: 'Coding Session - Day 3',
        type: 'coding',
        startedAt: new Date('2026-03-17T09:00:00'),
        endedAt: new Date('2026-03-17T14:00:00'),
      },
      {
        summary: 'Teams present their projects to judges',
        name: 'Project Presentations',
        type: 'presentation',
        startedAt: new Date('2026-03-17T14:30:00'),
        endedAt: new Date('2026-03-17T17:00:00'),
      },
      {
        summary: 'Announce winners and distribute prizes',
        name: 'Awards Ceremony',
        type: 'ceremony',
        startedAt: new Date('2026-03-17T17:00:00'),
        endedAt: new Date('2026-03-17T18:00:00'),
      },
    ],
    people: [
      {
        name: 'Li Wei',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liwei',
        gender: 'male',
        age: 28,
        address: 'Beijing, China',
        organizations: ['Tech Innovators', 'Open Source Alliance'],
        skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
        githubLink: 'https://github.com/liwei-dev',
        githubAccount: 'liwei-dev',
        createdBy: 'admin',
      },
      {
        name: 'Zhang Mei',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangmei',
        gender: 'female',
        age: 26,
        address: 'Shanghai, China',
        organizations: ['Cloud Computing Society'],
        skills: ['Python', 'Django', 'Machine Learning', 'Docker'],
        githubLink: 'https://github.com/zhangmei-ml',
        githubAccount: 'zhangmei-ml',
        createdBy: 'admin',
      },
      {
        name: 'Wang Jun',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjun',
        gender: 'male',
        age: 30,
        address: 'Shenzhen, China',
        organizations: ['DevOps Guild', 'Open Source Alliance'],
        skills: ['Kubernetes', 'Go', 'AWS', 'CI/CD'],
        githubLink: 'https://github.com/wangjun-ops',
        githubAccount: 'wangjun-ops',
        createdBy: 'admin',
      },
      {
        name: 'Chen Xiao',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenxiao',
        gender: 'female',
        age: 24,
        address: 'Hangzhou, China',
        organizations: ['UI/UX Designers Hub'],
        skills: ['Figma', 'React', 'CSS', 'Design Systems'],
        githubLink: 'https://github.com/chenxiao-design',
        githubAccount: 'chenxiao-design',
        createdBy: 'admin',
      },
    ],
    organizations: [
      {
        name: 'Tech Innovators',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=techinnovators',
        link: 'https://techinnovators.example.com',
        members: ['Li Wei', 'Wang Jun'],
        prizes: ['Best Innovation Award'],
      },
      {
        name: 'Cloud Computing Society',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=cloudcomputing',
        link: 'https://cloudcomputing.example.com',
        members: ['Zhang Mei'],
        prizes: ['Best Cloud Solution'],
      },
      {
        name: 'Open Source Alliance',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=opensource',
        link: 'https://opensource.example.com',
        members: ['Li Wei', 'Wang Jun'],
        prizes: ['Community Choice Award', 'Best Open Source Project'],
      },
      {
        name: 'UI/UX Designers Hub',
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=uiuxhub',
        link: 'https://uiuxhub.example.com',
        members: ['Chen Xiao'],
        prizes: ['Best Design Award'],
      },
    ],
    prizes: [
      {
        name: 'Best Innovation Award',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=gold',
        price: 10000,
        amount: 1,
        level: 'gold',
        sponsor: 'Tech Innovators',
      },
      {
        name: 'Best Cloud Solution',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=silver',
        price: 7000,
        amount: 1,
        level: 'silver',
        sponsor: 'Cloud Computing Society',
      },
      {
        name: 'Best Design Award',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=bronze',
        price: 5000,
        amount: 1,
        level: 'bronze',
        sponsor: 'UI/UX Designers Hub',
      },
      {
        name: 'Community Choice Award',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=special1',
        price: 3000,
        amount: 2,
        level: 'special',
        sponsor: 'Open Source Alliance',
      },
      {
        name: 'Best Open Source Project',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=special2',
        price: 5000,
        amount: 1,
        level: 'special',
        sponsor: 'Open Source Alliance',
      },
    ],
    templates: [
      {
        name: 'React TypeScript Starter',
        summary: 'A modern React template with TypeScript, ESLint, and Prettier pre-configured',
        sourceLink: 'https://github.com/templates/react-typescript-starter',
        previewLink: 'https://react-ts-starter.demo.com',
      },
      {
        name: 'Next.js Full-stack Template',
        summary: 'Complete Next.js setup with API routes, authentication, and database integration',
        sourceLink: 'https://github.com/templates/nextjs-fullstack',
        previewLink: 'https://nextjs-fullstack.demo.com',
      },
      {
        name: 'Python FastAPI Starter',
        summary: 'FastAPI template with PostgreSQL, Docker, and comprehensive testing setup',
        sourceLink: 'https://github.com/templates/fastapi-starter',
        previewLink: 'https://fastapi-starter.demo.com',
      },
      {
        name: 'Kubernetes Microservices',
        summary: 'Production-ready microservices architecture with Kubernetes manifests',
        sourceLink: 'https://github.com/templates/k8s-microservices',
        previewLink: 'https://k8s-microservices.demo.com',
      },
    ],
    projects: [
      {
        name: 'EcoTracker',
        summary:
          'A mobile app for tracking personal carbon footprint and suggesting eco-friendly alternatives',
        createdBy: 'Li Wei',
        group: ['Team Green'],
        members: ['Li Wei', 'Chen Xiao'],
        products: ['Mobile App', 'API Backend'],
        score: 95,
      },
      {
        name: 'CodeMentor AI',
        summary:
          'AI-powered code review assistant that provides real-time suggestions and best practices',
        createdBy: 'Zhang Mei',
        group: ['AI Innovators'],
        members: ['Zhang Mei'],
        products: ['VS Code Extension', 'Web Dashboard'],
        score: 92,
      },
      {
        name: 'CloudOps Dashboard',
        summary: 'Unified monitoring dashboard for multi-cloud infrastructure management',
        createdBy: 'Wang Jun',
        group: ['DevOps Masters'],
        members: ['Wang Jun'],
        products: ['Web Application', 'CLI Tool'],
        score: 88,
      },
      {
        name: 'DesignSync',
        summary: 'Collaborative design tool that syncs Figma designs with development code',
        createdBy: 'Chen Xiao',
        group: ['Design Tech'],
        members: ['Chen Xiao', 'Li Wei'],
        products: ['Figma Plugin', 'React Component Library'],
        score: 90,
      },
    ],
  };
}
