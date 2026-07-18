import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalContent {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  images?: string[];
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
  @Output() imageClick = new EventEmitter<{images: string[], index: number}>();
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  // Drag scroll state
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private lastMouseDownTarget: EventTarget | null = null;
  
  // Slider state
  currentSlideIndex = 0;

  // Global event listeners bound to 'this'
  private boundOnGlobalMouseUp = this.onGlobalMouseUp.bind(this);
  private boundOnGlobalMouseMove = this.onGlobalMouseMove.bind(this);

  onMouseDown(e: MouseEvent): void {
    e.preventDefault(); // Prevent native drag/selection
    this.isDown = true;
    this.scrollContainer.nativeElement.classList.add('active');
    this.startX = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;

    // Attach global listeners to handle drag even outside container
    document.addEventListener('mouseup', this.boundOnGlobalMouseUp);
    document.addEventListener('mousemove', this.boundOnGlobalMouseMove);
  }

  private onGlobalMouseUp(): void {
    this.isDown = false;
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.classList.remove('active');
    }
    document.removeEventListener('mouseup', this.boundOnGlobalMouseUp);
    document.removeEventListener('mousemove', this.boundOnGlobalMouseMove);
  }

  private onGlobalMouseMove(e: MouseEvent): void {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll speed
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollLeft = target.scrollLeft;
    const clientWidth = target.clientWidth;
    // Calculate which image is currently most visible
    this.currentSlideIndex = Math.round(scrollLeft / clientWidth);
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  nextSlide(): void {
    if (this.content?.images && this.currentSlideIndex < this.content.images.length - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    if (this.scrollContainer?.nativeElement) {
      const clientWidth = this.scrollContainer.nativeElement.clientWidth;
      // scroll-snap behavior will handle the exact alignment, we just push it in the right direction
      // However, we can also scroll to precise position
      this.scrollContainer.nativeElement.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth'
      });
    }
  }

  onBackdropMouseDown(event: MouseEvent): void {
    // Track where the click started to prevent closing when dragging from inside
    this.lastMouseDownTarget = event.target;
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Only close if the click started AND ended on the backdrop
    if (target.classList.contains('modal-backdrop') && target === this.lastMouseDownTarget) {
      this.closeModal();
    }
    this.lastMouseDownTarget = null;
  }

  closeModal(): void {
    this.close.emit();
  }

  onImageClick(index: number): void {
    if (this.isDown) return; // Prevent click while dragging
    if (this.content?.images) {
      this.imageClick.emit({ images: this.content.images, index });
    } else if (this.content?.imageUrl) {
      this.imageClick.emit({ images: [this.content.imageUrl], index: 0 });
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
