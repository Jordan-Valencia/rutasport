import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core'

@Directive({ selector: 'img[appVirtualImg]', standalone: true })
export class VirtualImgDirective implements OnInit, OnDestroy {
  @Input('appVirtualImg') src = ''
  private observer?: IntersectionObserver

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit() {
    const img = this.el.nativeElement
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = this.src
        } else if (img.complete && img.src) {
          img.src = ''
        }
      },
      { rootMargin: '800px 0px' }
    )
    this.observer.observe(img)
  }

  ngOnDestroy() {
    this.observer?.disconnect()
  }
}
