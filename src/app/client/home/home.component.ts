import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { User, Objective, Skill, Project, Certificate, Competition, Experience, Internship } from '../../models/interfaces';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User | undefined;
  objective: Objective | undefined;
  skills: Skill[] = [];
  projects: Project[] = [];
  certificates: Certificate[] = [];
  competitions: Competition[] = [];
  experiences: Experience[] = [];
  internships: Internship[] = [];
  error: string | undefined;
  imageUrl = environment.imageUrl;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  getImageUrl(filename: string | undefined): string {
    if (!filename) return '';
    // Remove any leading slashes to avoid double slashes
    const cleanFilename = filename.replace(/^\/+/, '');
    const fullUrl = `${this.imageUrl}/${cleanFilename}`;
    console.log('Image URL:', fullUrl);
    return fullUrl;
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    console.error('Image element:', event.target);
    // Hide the image element and show placeholder
    event.target.style.display = 'none';
    // Show placeholder if it exists
    const placeholder = event.target.nextElementSibling;
    if (placeholder && placeholder.classList.contains('cert-placeholder')) {
      placeholder.style.display = 'flex';
    }
  }

  loadAllData(): void {
    // Load user profile
    this.portfolioService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.user) {
          this.user = response.data.user;
          console.log('User loaded:', this.user);
        }
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
        this.error = 'Failed to load user profile';
      }
    });

    // Load objective
    this.portfolioService.getObjective().subscribe({
      next: (response) => {
        if (response.success && response.data?.objective) {
          this.objective = response.data.objective;
        }
      },
      error: (err) => console.error('Error fetching objective:', err)
    });

    // Load skills
    this.portfolioService.getSkills().subscribe({
      next: (response) => {
        if (response.success && response.data?.skills) {
          this.skills = response.data.skills;
        }
      },
      error: (err) => console.error('Error fetching skills:', err)
    });

    // Load projects
    this.portfolioService.getProjects().subscribe({
      next: (response) => {
        if (response.success && response.data?.projects) {
          this.projects = response.data.projects;
        }
      },
      error: (err) => console.error('Error fetching projects:', err)
    });

    // Load certificates
    this.portfolioService.getCertificates().subscribe({
      next: (response) => {
        if (response.success && response.data?.certificates) {
          this.certificates = response.data.certificates;
          console.log('Certificates loaded:', this.certificates);
        }
      },
      error: (err) => console.error('Error fetching certificates:', err)
    });

    // Load competitions
    this.portfolioService.getCompetitions().subscribe({
      next: (response) => {
        if (response.success && response.data?.competitions) {
          this.competitions = response.data.competitions;
          console.log('Competitions loaded:', this.competitions);
        }
      },
      error: (err) => console.error('Error fetching competitions:', err)
    });

    // Load experiences
    this.portfolioService.getExperiences().subscribe({
      next: (response) => {
        if (response.success && response.data?.experiences) {
          this.experiences = response.data.experiences;
        }
      },
      error: (err) => console.error('Error fetching experiences:', err)
    });

    // Load internships
    this.portfolioService.getInternships().subscribe({
      next: (response) => {
        if (response.success && response.data?.internships) {
          this.internships = response.data.internships;
        }
      },
      error: (err) => console.error('Error fetching internships:', err)
    });
  }
}
