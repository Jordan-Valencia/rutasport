import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-terminos',
  imports: [RouterModule],
  templateUrl: './terminos.component.html',
})
export class TerminosComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    })
  }
}
