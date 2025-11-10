import { Directive, ViewContainerRef } from '@angular/core';

/**
 * ホスティングディレクティブ<br>
 * 動的コンポーネントの配置場所を提供します.<br>
 * 対象のタグに付与することで、タグに動的にコンポーネントを配置する事ができます.
 */
@Directive({
  selector: '[eim-hosting-template]',
  standalone: false,
})
export class EIMHostingTemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}