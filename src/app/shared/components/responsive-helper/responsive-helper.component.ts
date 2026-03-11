
import { Component, OnInit } from '@angular/core';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-responsive-helper',
  templateUrl: './responsive-helper.component.html',
  imports: [],
})
export class ResponsiveHelperComponent implements OnInit {
  public env: any = env;

  constructor() {}

  ngOnInit(): void {}
}
