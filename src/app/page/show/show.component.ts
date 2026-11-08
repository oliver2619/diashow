import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { showSelector } from '../../selector/show.selector';
import { diashowApi, DiashowImageInfo } from '../../diashow-api';
import { ShowMode } from '../../state/show.state';

interface Item {
  readonly url: string;
  cssClass: string;
  animation: number;
}

const numberOfAnimations = 9;
const menuTimeoutSeconds = 4;

const allowedExtensions = Object.freeze(['.jpg', '.jpeg', '.png'])

@Component({
  imports: [],
  selector: 'ds-show',
  styleUrl: './show.component.scss',
  templateUrl: './show.component.html',
  host: {
    '(document:keydown.Esc)': 'onExit()',
    '(document:keydown.ArrowUp)': 'onPrev()',
    '(document:keydown.ArrowLeft)': 'onPrev()',
    '(document:keydown.ArrowRight)': 'onNext()',
    '(document:keydown.ArrowDown)': 'onNext()',
    '(document:keydown.Space)': 'onTogglePause()',
    '(document:keydown.Enter)': 'onToggleFullscreen()',
    '(document:fullscreenchange)': 'onFullscreenChange()',
    '(mousemove)': 'onShowMenu()',
    '(click)': 'onShowMenu()',
  },
})
export class ShowComponent {

  private readonly store = inject(Store);
  private readonly show = this.store.selectSignal(showSelector)();
  private images: DiashowImageInfo[] = [];
  private current = signal(0);
  private timer: number | undefined;
  private menuTimer: number | undefined;
  private readonly router = inject(Router);

  readonly items = signal<Item[]>([]);
  readonly pause = signal(false);
  readonly menuVisible = signal(false);
  readonly fullscreen = signal(false);
  readonly canPrev = computed(() => this.current() > 0);

  constructor() {
    
    inject(DestroyRef).onDestroy(() => {
      this.items().forEach(it => URL.revokeObjectURL(it.url));
      this.items.set([]);
      this.endTimer();
      this.endMenuTimer();
      document.exitFullscreen();
    });
    diashowApi.readImageInfos(this.show.folder).then(images => {
      this.images = images.filter(it => allowedExtensions.some(ext => it.filename.endsWith(ext)));
      switch (this.show.mode) {
        case ShowMode.SORT_BY_FILENAME:
          this.images.sort((i1, i2) => i1.filename.localeCompare(i2.filename));
          break;
        case ShowMode.SORT_BY_LAST_MODIFIED:
          this.images.sort((i1, i2) => i1.lastModified - i2.lastModified);
      }
      this.nextRound();
    });
  }

  onExit() {
    this.router.navigateByUrl('/');
  }

  onPrev() {
    if(this.current() > 0) {
      this.endTimer();
      this.readPrev();
    }
  }

  onNext() {
    this.endTimer();
    this.readNext();
  }

  onTogglePause() {
    if (this.pause()) {
      this.startTimer();
      this.pause.set(false);
    } else {
      this.endTimer();
      this.pause.set(true);
    }
  }

  onShowMenu() {
    this.menuVisible.set(true);
    this.startMenuTimer();
  }

  onAnimationEnd(url: string) {
    this.items.update(it => {
      const ret = [...it];
      const i = ret.findIndex(it => it.url === url);
      if (i >= 0) {
        const item = ret[i];
        if (item.cssClass === 'in') {
          item.cssClass = 'show';
          this.startTimer();
        } else if (item.cssClass === 'out') {
          URL.revokeObjectURL(item.url);
          ret.splice(i, 1);
        }
      }
      return ret;
    });
  }

  onToggleFullscreen() {
    if (document.fullscreenElement == null) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onFullscreenChange() {
    this.fullscreen.set(document.fullscreenElement != null);
  }

  private readCurrentImage() {
    const i = this.images[this.current()];
    diashowApi.readImage(i.folder, i.filename).then(buffer => {
      const blob = new Blob([buffer as BlobPart]);
      const url = URL.createObjectURL(blob);
      const animation = Math.floor(Math.random() * numberOfAnimations);
      this.items.update(v => [
        ...v.map(it => ({ ...it, cssClass: 'out', animation })),
        { animation, cssClass: 'in', url }
      ]);
    });
  }

  private readNext() {
    this.current.update(v => v + 1);
    if (this.current() < this.images.length) {
      this.readCurrentImage();
    } else {
      this.nextRound();
    }
  }

  private readPrev() {
    this.current.update(v => Math.max(v - 1, 0));
    this.readCurrentImage();
  }

  private nextRound() {
    this.current.set(0);
    if (this.show.mode === ShowMode.RANDOM) {
      this.images.sort(() => Math.random() * 2 - 1);
    }
    if (this.current() < this.images.length) {
      this.readCurrentImage();
    }
  }

  private endTimer() {
    if (this.timer != undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private startTimer() {
    if (this.timer == undefined) {
      this.timer = window.setTimeout(() => {
        this.timer = undefined;
        this.readNext();
      }, this.show.duration * 1000);
    }
  }

  private endMenuTimer() {
    if (this.menuTimer != undefined) {
      window.clearTimeout(this.menuTimer);
      this.menuTimer = undefined;
    }
  }

  private startMenuTimer() {
    if (this.menuTimer != undefined) {
      window.clearTimeout(this.menuTimer);
    }
    this.menuTimer = window.setTimeout(() => {
      this.menuTimer = undefined;
      this.menuVisible.set(false);
    }, menuTimeoutSeconds * 1_000);
  }
}
