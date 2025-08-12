import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { Project } from '../../../models/interfaces';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: []
})
export class ProjectFormComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    skills: this.fb.array<string>([]),
    links: [''],
    github: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    projectType: ['self study', Validators.required]
  });

  projectTypes = ['company project', 'university project', 'freelance project', 'internship project', 'self study'];
  isEditMode = false;
  projectId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;
    
    if (this.isEditMode && this.projectId) {
      this.loadProjectForEdit();
    }
  }

  loadProjectForEdit(): void {
    // You'll need to add a getProjectById method to your service
    // For now, we'll just set edit mode
    console.log('Edit mode for project:', this.projectId);
  }

  get skillsArray(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  addSkill(value: string): void {
    if (!value) return;
    this.skillsArray.push(this.fb.control(value));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;

    const projectData = {
      title: this.form.value.title || '',
      description: this.form.value.description || '',
      skills: this.skillsArray.value,
      links: this.form.value.links || undefined,
      github: this.form.value.github || undefined,
      startDate: new Date(this.form.value.startDate || ''),
      endDate: this.form.value.endDate ? new Date(this.form.value.endDate) : undefined,
      projectType: (this.form.value.projectType || 'self study') as 'self study' | 'company project' | 'university project' | 'freelance project' | 'internship project'
    };

    if (this.isEditMode && this.projectId) {
      // UPDATE - PUT request
      this.portfolioService.updateProject(this.projectId, projectData).subscribe({
        next: (response) => {
          console.log('Project updated:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // CREATE - POST request
      this.portfolioService.createProject(projectData).subscribe({
        next: (response) => {
          console.log('Project created:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error creating project:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
