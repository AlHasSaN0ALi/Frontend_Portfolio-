import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { Objective } from '../../../models/interfaces';

@Component({
  selector: 'app-objective-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './objective-form.component.html',
  styleUrls: []
})
export class ObjectiveFormComponent implements OnInit {
  form = this.fb.group({
    bio: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  isEditMode = false;
  objectiveId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.objectiveId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.objectiveId;
    
    if (this.isEditMode && this.objectiveId) {
      this.loadObjectiveForEdit();
    } else {
      // Load existing objective if any
      this.loadExistingObjective();
    }
  }

  loadObjectiveForEdit(): void {
    // You'll need to add a getObjectiveById method to your service
    console.log('Edit mode for objective:', this.objectiveId);
  }

  loadExistingObjective(): void {
    this.portfolioService.getObjective().subscribe({
      next: (response) => {
        if (response.success && response.data?.objective) {
          this.form.patchValue({
            bio: response.data.objective.bio
          });
        }
      },
      error: (err) => {
        console.error('Error loading objective:', err);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;

    const objectiveData = {
      bio: this.form.value.bio || ''
    };

    if (this.isEditMode && this.objectiveId) {
      // UPDATE - PUT request
      this.portfolioService.updateObjective(this.objectiveId, objectiveData).subscribe({
        next: (response) => {
          console.log('Objective updated:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error updating objective:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // CREATE - POST request
      this.portfolioService.createObjective(objectiveData).subscribe({
        next: (response) => {
          console.log('Objective created:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error creating objective:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
