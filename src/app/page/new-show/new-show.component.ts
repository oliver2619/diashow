import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, max, min, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { diashowApi } from '../../diashow-api';
import { Store } from '@ngrx/store';
import { showSelector } from '../../selector/show.selector';
import { ShowMode } from '../../state/show.state';
import { showActions } from '../../action/show.action';

interface NewShowModel {
  folder: string;
  mode: keyof typeof ShowMode;
  duration: number;
}

@Component({
  imports: [RouterLink, FormField],
  selector: 'ds-new-show',
  styleUrl: './new-show.component.scss',
  templateUrl: './new-show.component.html',
})
export class NewShowComponent {

  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly initialSettings = this.store.selectSignal(showSelector)();
  private readonly model = signal<NewShowModel>({
    folder: this.initialSettings.folder,
    mode: ShowMode[this.initialSettings.mode] as keyof typeof ShowMode,
    duration: this.initialSettings.duration,
  });

  readonly form = form(
    this.model,
    tree => {
      required(tree.duration);
      min(tree.duration, 1);
      max(tree.duration, 1000);
      required(tree.folder);
    },
  );
  readonly folder = computed(() => this.model().folder);
  readonly canStart = computed(() => this.form().valid());

  onSelectFolder() {
    diashowApi.openFolder().then(folder => {
      if (folder != undefined) {
        this.model.update(v => ({ ...v, folder }));
      }
    });
  }

  onStart() {
    const value = this.model();
    this.store.dispatch(showActions.set({
      duration: value.duration,
      folder: value.folder,
      mode: ShowMode[value.mode],
    }));
    this.router.navigateByUrl('/show');
  }
}
