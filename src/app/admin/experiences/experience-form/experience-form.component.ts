import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { Experience } from '../../../models/interfaces';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience-form.component.html',
  styleUrls: []
})
export class ExperienceFormComponent implements OnInit {
  form = this.fb.group({
    title: ['', Validators.required],
    company: ['', Validators.required],
    location: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    isCurrent: [false],
    description: [''],
    responsibilities: this.fb.array<string>([]),
    achievements: this.fb.array<string>([]),
    technologies: this.fb.array<string>([]),
    companyLogo: [''],
    order: [0],
    isActive: [true]
  });

  isEditMode = false;
  experienceId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.experienceId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.experienceId;
    
    if (this.isEditMode && this.experienceId) {
      this.loadExperienceForEdit();
    }
  }

  loadExperienceForEdit(): void {
    // You'll need to add a getExperienceById method to your service
    console.log('Edit mode for experience:', this.experienceId);
  }

  get responsibilitiesArray(): FormArray { return this.form.get('responsibilities') as FormArray; }
  get achievementsArray(): FormArray { return this.form.get('achievements') as FormArray; }
  get technologiesArray(): FormArray { return this.form.get('technologies') as FormArray; }

  addToArray(array: FormArray, value: string): void {
    if (!value) return; 
    array.push(this.fb.control(value));
  }
  
  removeFromArray(array: FormArray, index: number): void { 
    array.removeAt(index); 
  }

  submit(): void {
    console.log('Experience form submitted');
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Form value:', this.form.value);
    
    if (this.form.invalid) {
      console.log('Form is invalid, cannot submit');
      return;
    }
    
    this.isSubmitting = true;
    console.log('Starting experience submission...');

    const experienceData = {
      title: this.form.value.title || '',
      company: this.form.value.company || '',
      location: this.form.value.location || '',
      startDate: new Date(this.form.value.startDate || ''),
      endDate: this.form.value.endDate ? new Date(this.form.value.endDate) : undefined,
      isCurrent: this.form.value.isCurrent || false,
      description: this.form.value.description || '',
      responsibilities: this.responsibilitiesArray.value,
      achievements: this.achievementsArray.value,
      technologies: this.technologiesArray.value,
      companyLogo: this.form.value.companyLogo || undefined,
      order: this.form.value.order || 0,
      isActive: this.form.value.isActive || true
    };

    console.log('Experience data to send:', experienceData);

    if (this.isEditMode && this.experienceId) {
      // UPDATE - PUT request
      console.log('Updating experience with ID:', this.experienceId);
      this.portfolioService.updateExperience(this.experienceId, experienceData).subscribe({
        next: (response) => {
          console.log('Experience updated successfully:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error updating experience:', err);
          this.isSubmitting = false;
          alert('Error updating experience: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    } else {
      // CREATE - POST request
      console.log('Creating new experience');
      this.portfolioService.createExperience(experienceData).subscribe({
        next: (response) => {
          console.log('Experience created successfully:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error creating experience:', err);
          this.isSubmitting = false;
          alert('Error creating experience: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    }
  }
}
