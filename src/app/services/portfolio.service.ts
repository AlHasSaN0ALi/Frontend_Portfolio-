import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, User, Objective, Skill, Project, Certificate, Competition, Experience, Internship } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = environment.apiUrl;
  private adminUrl = environment.adminUrl;

  constructor(private http: HttpClient) { }

  // Public methods (GET only)
  getUserProfile(): Observable<ApiResponse<{
    user: User;
  }>> {
    return this.http.get<ApiResponse<{
      user: User;
    }>>(`${this.apiUrl}/user/profile`);
  }

  getUserProfileById(id: string): Observable<ApiResponse<{
    user: User;
  }>> {
    return this.http.get<ApiResponse<{
      user: User;
    }>>(`${this.apiUrl}/user/profile/${id}`);
  }

  getUsers(page: number = 1, limit: number = 10, search: string = '', role: string = ''): Observable<ApiResponse<{
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>> {
    return this.http.get<ApiResponse<{
      users: User[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>>(`${this.apiUrl}/user/list?page=${page}&limit=${limit}&search=${search}&role=${role}`);
  }

  getObjective(): Observable<ApiResponse<{
    objective: Objective;
  }>> {
    return this.http.get<ApiResponse<{
      objective: Objective;
    }>>(`${this.apiUrl}/objective`);
  }

  getSkills(): Observable<ApiResponse<{
    skills: Skill[];
  }>> {
    return this.http.get<ApiResponse<{
      skills: Skill[];
    }>>(`${this.apiUrl}/skill`);
  }

  getProjects(): Observable<ApiResponse<{
    projects: Project[];
  }>> {
    return this.http.get<ApiResponse<{
      projects: Project[];
    }>>(`${this.apiUrl}/project`);
  }

  getCertificates(): Observable<ApiResponse<{
    certificates: Certificate[];
  }>> {
    return this.http.get<ApiResponse<{
      certificates: Certificate[];
    }>>(`${this.apiUrl}/certificate`);
  }

  getCompetitions(): Observable<ApiResponse<{
    competitions: Competition[];
  }>> {
    return this.http.get<ApiResponse<{
      competitions: Competition[];
    }>>(`${this.apiUrl}/competition`);
  }

  getExperiences(): Observable<ApiResponse<{
    experiences: Experience[];
  }>> {
    return this.http.get<ApiResponse<{
      experiences: Experience[];
    }>>(`${this.apiUrl}/experience`);
  }

  getInternships(): Observable<ApiResponse<{
    internships: Internship[];
  }>> {
    return this.http.get<ApiResponse<{
      internships: Internship[];
    }>>(`${this.apiUrl}/internship`);
  }

  // Admin methods (Full CRUD)
  getDashboardStats(): Observable<ApiResponse<{
    counts: { users: number; experiences: number; internships: number; objectives: number; projects: number; skills: number; certificates: number; competitions: number; };
    recent: { users: User[]; experiences: Experience[]; projects: Project[]; skills: Skill[]; certificates: Certificate[]; competitions: Competition[]; internships: Internship[]; };
    statistics: { skills: any[]; projectsByType: any[]; };
  }>> {
    return this.http.get<ApiResponse<{
      counts: { users: number; experiences: number; internships: number; objectives: number; projects: number; skills: number; certificates: number; competitions: number; };
      recent: { users: User[]; experiences: Experience[]; projects: Project[]; skills: Skill[]; certificates: Certificate[]; competitions: Competition[]; internships: Internship[]; };
      statistics: { skills: any[]; projectsByType: any[]; };
    }>>(`${this.adminUrl}/dashboard`);
  }

  // User Management
  createUser(user: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(`${this.adminUrl}/users`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(`${this.adminUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/users/${id}`);
  }

  // Objective Management
  createObjective(objective: Partial<Objective>): Observable<ApiResponse<{ objective: Objective }>> {
    return this.http.post<ApiResponse<{ objective: Objective }>>(`${this.adminUrl}/objective`, objective);
  }

  updateObjective(id: string, objective: Partial<Objective>): Observable<ApiResponse<{ objective: Objective }>> {
    return this.http.put<ApiResponse<{ objective: Objective }>>(`${this.adminUrl}/objective/${id}`, objective);
  }

  deleteObjective(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/objective/${id}`);
  }

  // Project Management
  createProject(project: Partial<Project>): Observable<ApiResponse<{ project: Project }>> {
    return this.http.post<ApiResponse<{ project: Project }>>(`${this.adminUrl}/projects`, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<ApiResponse<{ project: Project }>> {
    return this.http.put<ApiResponse<{ project: Project }>>(`${this.adminUrl}/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/projects/${id}`);
  }

  // Skill Management
  createSkill(skill: Partial<Skill>): Observable<ApiResponse<{ skill: Skill }>> {
    return this.http.post<ApiResponse<{ skill: Skill }>>(`${this.adminUrl}/skills`, skill);
  }

  updateSkill(id: string, skill: Partial<Skill>): Observable<ApiResponse<{ skill: Skill }>> {
    return this.http.put<ApiResponse<{ skill: Skill }>>(`${this.adminUrl}/skills/${id}`, skill);
  }

  deleteSkill(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/skills/${id}`);
  }

  // Certificate Management
  createCertificate(certificate: Partial<Certificate>): Observable<ApiResponse<{ certificate: Certificate }>> {
    return this.http.post<ApiResponse<{ certificate: Certificate }>>(`${this.adminUrl}/certificates`, certificate);
  }

  updateCertificate(id: string, certificate: Partial<Certificate>): Observable<ApiResponse<{ certificate: Certificate }>> {
    return this.http.put<ApiResponse<{ certificate: Certificate }>>(`${this.adminUrl}/certificates/${id}`, certificate);
  }

  deleteCertificate(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/certificates/${id}`);
  }

  // Competition Management
  createCompetition(competition: Partial<Competition>): Observable<ApiResponse<{ competition: Competition }>> {
    return this.http.post<ApiResponse<{ competition: Competition }>>(`${this.adminUrl}/competitions`, competition);
  }

  updateCompetition(id: string, competition: Partial<Competition>): Observable<ApiResponse<{ competition: Competition }>> {
    return this.http.put<ApiResponse<{ competition: Competition }>>(`${this.adminUrl}/competitions/${id}`, competition);
  }

  deleteCompetition(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/competitions/${id}`);
  }

  // Experience Management
  createExperience(experience: Partial<Experience>): Observable<ApiResponse<{ experience: Experience }>> {
    return this.http.post<ApiResponse<{ experience: Experience }>>(`${this.adminUrl}/experiences`, experience);
  }

  updateExperience(id: string, experience: Partial<Experience>): Observable<ApiResponse<{ experience: Experience }>> {
    return this.http.put<ApiResponse<{ experience: Experience }>>(`${this.adminUrl}/experiences/${id}`, experience);
  }

  deleteExperience(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/experiences/${id}`);
  }

  // Internship Management
  createInternship(internship: Partial<Internship>): Observable<ApiResponse<{ internship: Internship }>> {
    return this.http.post<ApiResponse<{ internship: Internship }>>(`${this.adminUrl}/internships`, internship);
  }

  updateInternship(id: string, internship: Partial<Internship>): Observable<ApiResponse<{ internship: Internship }>> {
    return this.http.put<ApiResponse<{ internship: Internship }>>(`${this.adminUrl}/internships/${id}`, internship);
  }

  deleteInternship(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.adminUrl}/internships/${id}`);
  }

}
