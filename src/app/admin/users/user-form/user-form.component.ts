import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/interfaces';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: []
})
export class UserFormComponent implements OnInit {
  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    role: ['user', [Validators.required]],
    linkedin: [''],
    instagram: [''],
    github: ['']
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  isEditMode = false;
  userId: string | null = null;
  existingUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode (URL contains an ID)
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUserForEdit();
    }
  }

  loadUserForEdit(): void {
    this.portfolioService.getUserProfileById(this.userId!).subscribe({
      next: (response) => {
        if (response.success && response.data?.user) {
          this.existingUser = response.data.user;
          this.populateForm();
        }
      },
      error: (err) => {
        console.error('Error loading user for edit:', err);
      }
    });
  }

  populateForm(): void {
    if (this.existingUser) {
      this.form.patchValue({
        firstName: this.existingUser.firstName,
        lastName: this.existingUser.lastName,
        role: this.existingUser.role,
        linkedin: this.existingUser.socialLinks?.linkedin || '',
        instagram: this.existingUser.socialLinks?.instagram || '',
        github: this.existingUser.socialLinks?.github || ''
      });

      // Show existing photo if available
      if (this.existingUser.photo) {
        this.imagePreview = `${environment.imageUrl}/${this.existingUser.photo}`;
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;

    // Prepare user data, removing null values
    const userData = {
      firstName: this.form.value.firstName || '',
      lastName: this.form.value.lastName || '',
      role: (this.form.value.role || 'user') as 'user' | 'admin',
      socialLinks: {
        linkedin: this.form.value.linkedin || undefined,
        instagram: this.form.value.instagram || undefined,
        github: this.form.value.github || undefined
      }
    };

    if (this.isEditMode && this.userId) {
      // UPDATE - PUT request
      this.portfolioService.updateUser(this.userId, userData).subscribe({
        next: (response) => {
          if (response.success && this.selectedFile) {
            // Upload new photo
            const uploadEndpoint = `${environment.adminUrl}/users/${this.userId}/upload-photo`;
            this.fileUploadService.uploadImage(uploadEndpoint, this.selectedFile).subscribe({
              next: (uploadResponse) => {
                console.log('User updated and photo uploaded:', response, uploadResponse);
                this.isUploading = false;
                this.uploadProgress = 100;
                this.router.navigate(['/admin']);
              },
              error: (uploadError) => {
                console.error('Error uploading photo:', uploadError);
                this.isUploading = false;
              }
            });
          } else {
            console.log('User updated:', response);
            this.isUploading = false;
            this.uploadProgress = 100;
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.isUploading = false;
        }
      });
    } else {
      // CREATE - POST request
      this.portfolioService.createUser(userData).subscribe({
        next: (response) => {
          if (response.success && response.data?.user?._id && this.selectedFile) {
            // Upload photo for the created user
            const uploadEndpoint = `${environment.adminUrl}/users/${response.data.user._id}/upload-photo`;
            this.fileUploadService.uploadImage(uploadEndpoint, this.selectedFile).subscribe({
              next: (uploadResponse) => {
                console.log('User created and photo uploaded:', response, uploadResponse);
                this.isUploading = false;
                this.uploadProgress = 100;
                this.router.navigate(['/admin']);
              },
              error: (uploadError) => {
                console.error('Error uploading photo:', uploadError);
                this.isUploading = false;
              }
            });
          } else {
            console.log('User created:', response);
            this.isUploading = false;
            this.uploadProgress = 100;
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.isUploading = false;
        }
      });
    }
  }
}
