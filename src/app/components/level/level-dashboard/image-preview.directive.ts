import { Directive, ElementRef, Input, Renderer, OnChanges, SimpleChanges } from '@angular/core';

@Directive({ selector: '[mediaPreview]' })

export class ImagePreview implements OnChanges {
  @Input() private media: File;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.media) {
      return;
    }
    const reader = new FileReader();
    const el = this.el;
    if (this.media.type === 'application/pdf') {
      reader.onloadend = () => el.nativeElement.data = reader.result;
    } else if (this.media.type.startsWith('image')) {
      reader.onloadend = () => el.nativeElement.src = reader.result;
    }
    reader.readAsDataURL(this.media);
  }
}