import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../services/portfolio.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { environment } from '../../../../environments/environment';
import { Certificate } from '../../../models/interfaces';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certificate-form.component.html',
  styleUrls: []
})
export class CertificateFormComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    photo: ['']
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  isEditMode = false;
  certificateId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.certificateId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.certificateId;
    
    if (this.isEditMode && this.certificateId) {
      this.loadCertificateForEdit();
    }
  }

  loadCertificateForEdit(): void {
    // You'll need to add a getCertificateById method to your service
    console.log('Edit mode for certificate:', this.certificateId);
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

    // Prepare certificate data
    const certificateData = {
      title: this.form.value.title || '',
      description: this.form.value.description || '',
      photo: this.form.value.photo || ''
    };

    if (this.isEditMode && this.certificateId) {
      // UPDATE - PUT request
      this.portfolioService.updateCertificate(this.certificateId, certificateData).subscribe({
        next: (response) => {
          if (response.success && this.selectedFile) {
            const uploadEndpoint = `${environment.adminUrl}/certificates/${this.certificateId}/upload-photo`;
            this.fileUploadService.uploadImage(uploadEndpoint, this.selectedFile).subscribe({
              next: (uploadResponse) => {
                console.log('Certificate updated and photo uploaded:', response, uploadResponse);
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
            console.log('Certificate updated:', response);
            this.isUploading = false;
            this.uploadProgress = 100;
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          console.error('Error updating certificate:', err);
          this.isUploading = false;
        }
      });
    } else {
      // CREATE - POST request
      this.portfolioService.createCertificate(certificateData).subscribe({
        next: (response) => {
          if (response.success && response.data?.certificate?._id && this.selectedFile) {
            // Upload photo for the created certificate
            const uploadEndpoint = `${environment.adminUrl}/certificates/${response.data.certificate._id}/upload-photo`;
            this.fileUploadService.uploadImage(uploadEndpoint, this.selectedFile).subscribe({
              next: (uploadResponse) => {
                console.log('Certificate created and photo uploaded:', response, uploadResponse);
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
            console.log('Certificate created:', response);
            this.isUploading = false;
            this.uploadProgress = 100;
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          console.error('Error creating certificate:', err);
          this.isUploading = false;
        }
      });
    }
  }
}
