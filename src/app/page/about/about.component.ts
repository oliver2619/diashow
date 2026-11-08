import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { diashowApi } from '../../diashow-api';
import packageJson from '../../../../package.json';

@Component({
  imports: [RouterLink],
  selector: 'ds-about',
  styleUrl: './about.component.scss',
  templateUrl: './about.component.html',
})
export class AboutComponent {

  readonly version = packageJson.version;
  readonly node = diashowApi.versions.node();
  readonly electron = diashowApi.versions.electron();
  readonly chrome = diashowApi.versions.chrome();
}
