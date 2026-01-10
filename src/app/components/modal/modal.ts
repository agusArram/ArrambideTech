import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalContent {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalComponent {
  @Input() content: ModalContent | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen) {
      this.closeModal();
    }
  }

  openWhatsApp(): void {
    if (this.content?.ctaLink) {
      window.open(this.content.ctaLink, '_blank');
    }
  }
}
