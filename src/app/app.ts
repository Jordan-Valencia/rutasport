import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core'
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'
import { isPlatformBrowser } from '@angular/common'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router     = inject(Router)
  private platformId = inject(PLATFORM_ID)

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return

    const sid = sessionStorage.getItem('rs_sid') ?? crypto.randomUUID()
    sessionStorage.setItem('rs_sid', sid)

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path:       e.urlAfterRedirects,
            referrer:   document.referrer || null,
            session_id: sid,
          }),
        }).catch(() => {})
      })
  }
}
