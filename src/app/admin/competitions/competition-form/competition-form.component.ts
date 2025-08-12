import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { environment } from '../../../../environments/environment';
import { Competition } from '../../../models/interfaces';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competition-form.component.html',
  styleUrls: []
})
export class CompetitionFormComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    mainPhoto: [''],
    date: ['', Validators.required],
    photos: this.fb.array<string>([])
  });

  selectedMainPhoto: File | null = null;
  selectedGalleryPhotos: File[] = [];
  mainPhotoPreview: string | null = null;
  galleryPhotoPreviews: string[] = [];
  isUploading = false;
  uploadProgress = 0;
  isEditMode = false;
  competitionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.competitionId;
    
    if (this.isEditMode && this.competitionId) {
      this.loadCompetitionForEdit();
    }
  }

  loadCompetitionForEdit(): void {
    // You'll need to add a getCompetitionById method to your service
    console.log('Edit mode for competition:', this.competitionId);
  }

  get photosArray(): FormArray {
    return this.form.get('photos') as FormArray;
  }

  onMainPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedMainPhoto = file;
      this.form.patchValue({ mainPhoto: file.name }); // Set the form control value
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.mainPhotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onGalleryPhotosSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.selectedGalleryPhotos = files.slice(0, 7); // Max 7 photos
      
      // Create previews
      this.galleryPhotoPreviews = [];
      this.selectedGalleryPhotos.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.galleryPhotoPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeMainPhoto(): void {
    this.selectedMainPhoto = null;
    this.mainPhotoPreview = null;
  }

  removeGalleryPhoto(index: number): void {
    this.selectedGalleryPhotos.splice(index, 1);
    this.galleryPhotoPreviews.splice(index, 1);
  }

  addPhoto(value: string): void {
    if (!value || this.photosArray.length >= 7) return;
    this.photosArray.push(this.fb.control(value));
  }

  removePhoto(index: number): void {
    this.photosArray.removeAt(index);
  }

  submit(): void {
    console.log('Competition form submitted');
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Form value:', this.form.value);
    console.log('Selected main photo:', this.selectedMainPhoto);
    console.log('Selected gallery photos:', this.selectedGalleryPhotos);
    
    if (this.form.invalid) {
      console.log('Form is invalid, cannot submit');
      return;
    }
    
    this.isUploading = true;
    this.uploadProgress = 0;
    console.log('Starting competition submission...');

    // Prepare competition data
    const competitionData = {
      title: this.form.value.title || '',
      description: this.form.value.description || '',
      mainPhoto: this.form.value.mainPhoto || '',
      date: new Date(this.form.value.date || ''),
      photos: this.photosArray.value
    };

    console.log('Competition data to send:', competitionData);

    if (this.isEditMode && this.competitionId) {
      // UPDATE - PUT request
      console.log('Updating competition with ID:', this.competitionId);
      this.portfolioService.updateCompetition(this.competitionId, competitionData).subscribe({
        next: (response) => {
          console.log('Competition updated successfully:', response);
          if (response.success && response.data?.competition?._id) {
            let uploadsCompleted = 0;
            const totalUploads = (this.selectedMainPhoto ? 1 : 0) + (this.selectedGalleryPhotos.length > 0 ? 1 : 0);
            
            // Upload main photo if selected
            if (this.selectedMainPhoto) {
              const mainPhotoEndpoint = `${environment.adminUrl}/competitions/${response.data.competition._id}/upload-main-photo`;
              this.fileUploadService.uploadImage(mainPhotoEndpoint, this.selectedMainPhoto).subscribe({
                next: (mainPhotoResponse) => {
                  console.log('Main photo uploaded:', mainPhotoResponse);
                  uploadsCompleted++;
                  this.updateProgress(uploadsCompleted, totalUploads);
                  
                  // Upload gallery photos if selected
                  if (this.selectedGalleryPhotos.length > 0) {
                    const galleryEndpoint = `${environment.adminUrl}/competitions/${response.data.competition._id}/upload-photos`;
                    this.fileUploadService.uploadImages(galleryEndpoint, this.selectedGalleryPhotos).subscribe({
                      next: (galleryResponse) => {
                        console.log('Gallery photos uploaded:', galleryResponse);
                        uploadsCompleted++;
                        this.updateProgress(uploadsCompleted, totalUploads);
                        this.completeUpload();
                      },
                      error: (galleryError) => {
                        console.error('Error uploading gallery photos:', galleryError);
                        this.completeUpload();
                      }
                    });
                  } else {
                    this.completeUpload();
                  }
                },
                error: (mainPhotoError) => {
                  console.error('Error uploading main photo:', mainPhotoError);
                  uploadsCompleted++;
                  this.updateProgress(uploadsCompleted, totalUploads);
                  this.completeUpload();
                }
              });
            } else if (this.selectedGalleryPhotos.length > 0) {
              // Only upload gallery photos
              const galleryEndpoint = `${environment.adminUrl}/competitions/${response.data.competition._id}/upload-photos`;
              this.fileUploadService.uploadImages(galleryEndpoint, this.selectedGalleryPhotos).subscribe({
                next: (galleryResponse) => {
                  console.log('Gallery photos uploaded:', galleryResponse);
                  this.completeUpload();
                },
                error: (galleryError) => {
                  console.error('Error uploading gallery photos:', galleryError);
                  this.completeUpload();
                }
              });
            } else {
              this.completeUpload();
            }
          } else {
            console.log('Competition updated:', response);
            this.completeUpload();
          }
        },
        error: (err) => {
          console.error('Error updating competition:', err);
          this.isUploading = false;
          alert('Error updating competition: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    } else {
      // CREATE - POST request
      console.log('Creating new competition');
      this.portfolioService.createCompetition(competitionData).subscribe({
        next: (response) => {
          console.log('Competition created successfully:', response);
          if (response.success && response.data?.competition?._id) {
            let uploadsCompleted = 0;
            const totalUploads = (this.selectedMainPhoto ? 1 : 0) + (this.selectedGalleryPhotos.length > 0 ? 1 : 0);
            
            // Upload main photo if selected
            if (this.selectedMainPhoto) {
              const mainPhotoEndpoint = `${environment.adminUrl}/competitions/${response.data.competition._id}/upload-main-photo`;
              this.fileUploadService.uploadImage(mainPhotoEndpoint, this.selectedMainPhoto).subscribe({
                next: (mainPhotoResponse) => {
                  console.log('Main photo uploaded:', mainPhotoResponse);
                  uploadsCompleted++;
                  this.updateProgress(uploadsCompleted, totalUploads);
                  
                  // Upload gallery photos if selected
                  if (this.selectedGalleryPhotos.length > 0) {
                    const galleryEndpoint = `${environment.adminUrl}/competitions/${response.data.competition._id}/upload-photos`;
                    this.fileUploadService.uploadImages(galleryEndpoint, this.selectedGalleryPhotos).subscribe({
                      next: (galleryResponse) => {
                        console.log('Gallery photos uploaded:', galleryResponse);
                        uploadsCompleted++;
                        this.updateProgress(uploadsCompleted, totalUploads);
                        this.completeUpload();
                      },
                      error: (galleryError) => {
                        console.error('Error uploading gallery photos:', galleryError);
                        this.completeUpload();
                      }
                    });
                  } else {
                    this.completeUpload();
                  }
                },
                error: (mainPhotoError) => {
                  console.error('Error uploading main photo:', mainPhotoError);
                  uploadsCompleted++;
                  this.updateProgress(uploadsCompleted, totalUploads);
                  this.completeUpload();
                }
              });
            } else if (this.selectedGalleryPhotos.length > 0) {
              // Only upload gallery photos
              const galleryEndpoint = `${environment.adminUrl}/competitions/${response.data.competition._id}/upload-photos`;
              this.fileUploadService.uploadImages(galleryEndpoint, this.selectedGalleryPhotos).subscribe({
                next: (galleryResponse) => {
                  console.log('Gallery photos uploaded:', galleryResponse);
                  this.completeUpload();
                },
                error: (galleryError) => {
                  console.error('Error uploading gallery photos:', galleryError);
                  this.completeUpload();
                }
              });
            } else {
              this.completeUpload();
            }
          } else {
            console.log('Competition created:', response);
            this.completeUpload();
          }
        },
        error: (err) => {
          console.error('Error creating competition:', err);
          this.isUploading = false;
          alert('Error creating competition: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    }
  }

  private updateProgress(completed: number, total: number): void {
    this.uploadProgress = Math.round((completed / total) * 100);
  }

  private completeUpload(): void {
    this.isUploading = false;
    this.uploadProgress = 100;
    this.router.navigate(['/admin']);
  }
}
