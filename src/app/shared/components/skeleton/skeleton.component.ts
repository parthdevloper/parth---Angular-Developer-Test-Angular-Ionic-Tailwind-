import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  readonly variant = input<'text' | 'title' | 'avatar' | 'card' | 'chart' | 'donut'>('text');
}
