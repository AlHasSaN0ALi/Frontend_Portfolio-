import { Routes } from '@angular/router';
import { HomeComponent } from './client/home/home.component';
import { UserFormComponent } from './admin/users/user-form/user-form.component';
import { ObjectiveFormComponent } from './admin/objective/objective-form/objective-form.component';
import { ProjectFormComponent } from './admin/projects/project-form/project-form.component';
import { SkillFormComponent } from './admin/skills/skill-form/skill-form.component';
import { CertificateFormComponent } from './admin/certificates/certificate-form/certificate-form.component';
import { CompetitionFormComponent } from './admin/competitions/competition-form/competition-form.component';
import { ExperienceFormComponent } from './admin/experiences/experience-form/experience-form.component';
import { InternshipFormComponent } from './admin/internships/internship-form/internship-form.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: DashboardComponent },
  
  // User routes
  { path: 'admin/users/new', component: UserFormComponent },
  { path: 'admin/users/edit/:id', component: UserFormComponent },
  
  // Objective routes
  { path: 'admin/objective', component: ObjectiveFormComponent },
  { path: 'admin/objective/edit/:id', component: ObjectiveFormComponent },
  
  // Project routes
  { path: 'admin/projects/new', component: ProjectFormComponent },
  { path: 'admin/projects/edit/:id', component: ProjectFormComponent },
  
  // Skill routes
  { path: 'admin/skills/new', component: SkillFormComponent },
  { path: 'admin/skills/edit/:id', component: SkillFormComponent },
  
  // Certificate routes
  { path: 'admin/certificates/new', component: CertificateFormComponent },
  { path: 'admin/certificates/edit/:id', component: CertificateFormComponent },
  
  // Competition routes
  { path: 'admin/competitions/new', component: CompetitionFormComponent },
  { path: 'admin/competitions/edit/:id', component: CompetitionFormComponent },
  
  // Experience routes
  { path: 'admin/experiences/new', component: ExperienceFormComponent },
  { path: 'admin/experiences/edit/:id', component: ExperienceFormComponent },
  
  // Internship routes
  { path: 'admin/internships/new', component: InternshipFormComponent },
  { path: 'admin/internships/edit/:id', component: InternshipFormComponent },
];
