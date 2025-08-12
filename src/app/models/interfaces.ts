export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  role: 'user' | 'admin';
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Objective {
  _id: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  _id: string;
  name: string;
  type: 'Programming Languages' | 'Web Development' | 'Data Science & ML' | 'Tools';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  links?: string;
  github?: string;
  startDate: Date;
  endDate?: Date;
  projectType: 'company project' | 'university project' | 'freelance project' | 'internship project' | 'self study';
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  _id: string;
  title: string;
  description: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Competition {
  _id: string;
  title: string;
  description: string;
  mainPhoto: string;
  date: Date;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  companyLogo?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  mentor: string;
  companyLogo?: string;
  certificate?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
