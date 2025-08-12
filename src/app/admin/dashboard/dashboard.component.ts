import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { User, Experience, Project, Skill, Certificate, Competition, Internship } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 2rem;">
      <h2>Admin Dashboard</h2>
      
      <!-- Navigation Links -->
      <nav style="margin-bottom: 2rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
        <h3>Quick Actions</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <a routerLink="/admin/users/new" style="padding: 0.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add User</a>
          <a routerLink="/admin/objective" style="padding: 0.5rem; background: #28a745; color: white; text-decoration: none; border-radius: 4px; text-align: center;">📝 Edit Objective</a>
          <a routerLink="/admin/skills/new" style="padding: 0.5rem; background: #ffc107; color: black; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add Skill</a>
          <a routerLink="/admin/projects/new" style="padding: 0.5rem; background: #17a2b8; color: white; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add Project</a>
          <a routerLink="/admin/certificates/new" style="padding: 0.5rem; background: #6f42c1; color: white; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add Certificate</a>
          <a routerLink="/admin/competitions/new" style="padding: 0.5rem; background: #fd7e14; color: white; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add Competition</a>
          <a routerLink="/admin/experiences/new" style="padding: 0.5rem; background: #e83e8c; color: white; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add Experience</a>
          <a routerLink="/admin/internships/new" style="padding: 0.5rem; background: #20c997; color: white; text-decoration: none; border-radius: 4px; text-align: center;">➕ Add Internship</a>
        </div>
      </nav>

      <!-- Statistics -->
      <div *ngIf="counts" style="margin-bottom: 2rem;">
        <h3>📊 Statistics</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #007bff;">{{ counts.users }}</div>
            <div>Users</div>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #28a745;">{{ counts.experiences }}</div>
            <div>Experiences</div>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #ffc107;">{{ counts.internships }}</div>
            <div>Internships</div>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #17a2b8;">{{ counts.projects }}</div>
            <div>Projects</div>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #6f42c1;">{{ counts.skills }}</div>
            <div>Skills</div>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #fd7e14;">{{ counts.certificates }}</div>
            <div>Certificates</div>
          </div>
          <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #e83e8c;">{{ counts.competitions }}</div>
            <div>Competitions</div>
          </div>
        </div>
      </div>

      <!-- Recent Data Sections -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        
        <!-- Recent Users -->
        <div *ngIf="recentUsers.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>👥 Recent Users</h3>
          <div *ngFor="let user of recentUsers" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ user.firstName }} {{ user.lastName }} ({{ user.role }})</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/users/edit', user._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteUser(user._id, user.firstName + ' ' + user.lastName)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div *ngIf="recentProjects.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🚀 Recent Projects</h3>
          <div *ngFor="let project of recentProjects" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ project.title }}</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/projects/edit', project._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteProject(project._id, project.title)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Skills -->
        <div *ngIf="recentSkills.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>💡 Recent Skills</h3>
          <div *ngFor="let skill of recentSkills" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ skill.name }} ({{ skill.type }})</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/skills/edit', skill._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteSkill(skill._id, skill.name)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Certificates -->
        <div *ngIf="recentCertificates.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🏆 Recent Certificates</h3>
          <div *ngFor="let cert of recentCertificates" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ cert.title }}</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/certificates/edit', cert._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteCertificate(cert._id, cert.title)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Competitions -->
        <div *ngIf="recentCompetitions.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🏅 Recent Competitions</h3>
          <div *ngFor="let comp of recentCompetitions" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ comp.title }}</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/competitions/edit', comp._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteCompetition(comp._id, comp.title)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Experiences -->
        <div *ngIf="recentExperiences.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>💼 Recent Experiences</h3>
          <div *ngFor="let exp of recentExperiences" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ exp.title }} at {{ exp.company }}</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/experiences/edit', exp._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteExperience(exp._id, exp.title)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Internships -->
        <div *ngIf="recentInternships.length > 0" style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🎓 Recent Internships</h3>
          <div *ngFor="let intern of recentInternships" style="padding: 0.5rem; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ intern.title }} at {{ intern.company }}</span>
              <div style="display: flex; gap: 0.5rem;">
                <a [routerLink]="['/admin/internships/edit', intern._id]" style="color: #007bff; text-decoration: none;">✏️ Edit</a>
                <button (click)="deleteInternship(intern._id, intern.title)" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button (click)="refresh()" style="margin-top: 2rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Refresh Data</button>
    </div>
  `,
  styles: ``
})
export class DashboardComponent implements OnInit {
  counts: any;
  recentUsers: User[] = [];
  recentProjects: Project[] = [];
  recentSkills: Skill[] = [];
  recentCertificates: Certificate[] = [];
  recentCompetitions: Competition[] = [];
  recentExperiences: Experience[] = [];
  recentInternships: Internship[] = [];

  constructor(private portfolio: PortfolioService) {}

  ngOnInit(): void { 
    this.refresh(); 
  }

  refresh(): void {
    this.portfolio.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.counts = res.data.counts;
          this.recentUsers = res.data.recent?.users || [];
          this.recentProjects = res.data.recent?.projects || [];
          this.recentSkills = res.data.recent?.skills || [];
          this.recentCertificates = res.data.recent?.certificates || [];
          this.recentCompetitions = res.data.recent?.competitions || [];
          this.recentExperiences = res.data.recent?.experiences || [];
          this.recentInternships = res.data.recent?.internships || [];
        }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  // Delete methods with confirmation
  deleteUser(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      this.portfolio.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error deleting user: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  deleteProject(id: string, title: string): void {
    if (confirm(`Are you sure you want to delete project "${title}"?`)) {
      this.portfolio.deleteProject(id).subscribe({
        next: () => {
          alert('Project deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          alert('Error deleting project: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  deleteSkill(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete skill "${name}"?`)) {
      this.portfolio.deleteSkill(id).subscribe({
        next: () => {
          alert('Skill deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting skill:', err);
          alert('Error deleting skill: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  deleteCertificate(id: string, title: string): void {
    if (confirm(`Are you sure you want to delete certificate "${title}"?`)) {
      this.portfolio.deleteCertificate(id).subscribe({
        next: () => {
          alert('Certificate deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting certificate:', err);
          alert('Error deleting certificate: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  deleteCompetition(id: string, title: string): void {
    if (confirm(`Are you sure you want to delete competition "${title}"?`)) {
      this.portfolio.deleteCompetition(id).subscribe({
        next: () => {
          alert('Competition deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting competition:', err);
          alert('Error deleting competition: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  deleteExperience(id: string, title: string): void {
    if (confirm(`Are you sure you want to delete experience "${title}"?`)) {
      this.portfolio.deleteExperience(id).subscribe({
        next: () => {
          alert('Experience deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting experience:', err);
          alert('Error deleting experience: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  deleteInternship(id: string, title: string): void {
    if (confirm(`Are you sure you want to delete internship "${title}"?`)) {
      this.portfolio.deleteInternship(id).subscribe({
        next: () => {
          alert('Internship deleted successfully!');
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting internship:', err);
          alert('Error deleting internship: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }
}
