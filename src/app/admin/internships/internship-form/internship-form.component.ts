import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { Internship } from '../../../models/interfaces';

@Component({
  selector: 'app-internship-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './internship-form.component.html',
  styleUrls: []
})
export class InternshipFormComponent implements OnInit {
  form = this.fb.group({
    title: ['', Validators.required],
    company: ['', Validators.required],
    location: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    description: [''],
    responsibilities: this.fb.array<string>([]),
    achievements: this.fb.array<string>([]),
    technologies: this.fb.array<string>([]),
    mentor: [''],
    companyLogo: [''],
    certificate: [''],
    order: [0],
    isActive: [true]
  });

  isEditMode = false;
  internshipId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.internshipId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.internshipId;
    
    if (this.isEditMode && this.internshipId) {
      this.loadInternshipForEdit();
    }
  }

  loadInternshipForEdit(): void {
    // You'll need to add a getInternshipById method to your service
    console.log('Edit mode for internship:', this.internshipId);
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
    console.log('Internship form submitted');
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Form value:', this.form.value);
    
    if (this.form.invalid) {
      console.log('Form is invalid, cannot submit');
      return;
    }
    
    this.isSubmitting = true;
    console.log('Starting internship submission...');

    const internshipData = {
      title: this.form.value.title || '',
      company: this.form.value.company || '',
      location: this.form.value.location || '',
      startDate: new Date(this.form.value.startDate || ''),
      endDate: new Date(this.form.value.endDate || ''),
      description: this.form.value.description || '',
      responsibilities: this.responsibilitiesArray.value,
      achievements: this.achievementsArray.value,
      technologies: this.technologiesArray.value,
      mentor: this.form.value.mentor || '',
      companyLogo: this.form.value.companyLogo || undefined,
      certificate: this.form.value.certificate || undefined,
      order: this.form.value.order || 0,
      isActive: this.form.value.isActive || true
    };

    console.log('Internship data to send:', internshipData);

    if (this.isEditMode && this.internshipId) {
      // UPDATE - PUT request
      console.log('Updating internship with ID:', this.internshipId);
      this.portfolioService.updateInternship(this.internshipId, internshipData).subscribe({
        next: (response) => {
          console.log('Internship updated successfully:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error updating internship:', err);
          this.isSubmitting = false;
          alert('Error updating internship: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    } else {
      // CREATE - POST request
      console.log('Creating new internship');
      this.portfolioService.createInternship(internshipData).subscribe({
        next: (response) => {
          console.log('Internship created successfully:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error creating internship:', err);
          this.isSubmitting = false;
          alert('Error creating internship: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    }
  }
}
