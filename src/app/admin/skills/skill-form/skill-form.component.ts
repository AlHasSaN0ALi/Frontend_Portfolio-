import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { Skill } from '../../../models/interfaces';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill-form.component.html',
  styleUrls: []
})
export class SkillFormComponent implements OnInit {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    type: ['Programming Languages', [Validators.required]]
  });

  types = ['Programming Languages', 'Web Development', 'Data Science & ML', 'Tools'];
  isEditMode = false;
  skillId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skillId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.skillId;
    
    if (this.isEditMode && this.skillId) {
      this.loadSkillForEdit();
    }
  }

  loadSkillForEdit(): void {
    // You'll need to add a getSkillById method to your service
    console.log('Edit mode for skill:', this.skillId);
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;

    const skillData = {
      name: this.form.value.name || '',
      type: (this.form.value.type || 'Programming Languages') as 'Programming Languages' | 'Web Development' | 'Data Science & ML' | 'Tools'
    };

    if (this.isEditMode && this.skillId) {
      // UPDATE - PUT request
      this.portfolioService.updateSkill(this.skillId, skillData).subscribe({
        next: (response) => {
          console.log('Skill updated:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error updating skill:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // CREATE - POST request
      this.portfolioService.createSkill(skillData).subscribe({
        next: (response) => {
          console.log('Skill created:', response);
          this.isSubmitting = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error creating skill:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
