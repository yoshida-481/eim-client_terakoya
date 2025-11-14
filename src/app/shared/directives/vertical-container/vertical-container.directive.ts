import { Directive, ElementRef, HostListener, Input, AfterViewChecked } from '@angular/core';

/**
 * 垂直方向コンテナディレクティブ
 * 高さ可変の要素を指定できます.
 * ポップアップ画面にてデータグリッドを画面内で最大の高さに自動調整します.
 * eim-vertical-container内の要素は<div>を使用してください.
 *
 * @import
 *    import { EIMVerticalContainerDirective } from 'app/shared/directives/vertical-container/vertical-container.module';
 * @example
 *
 *      <div eim-vertical-container style="height: 100%;">
 *        <div>...<div>
 *        <div>...<div>
 *        <div class="eim-flexible-height">...<div>
 *      </div>
 */
@Directive({
    selector: '[eim-vertical-container]',
    standalone: false
})
export class EIMVerticalContainerDirective implements AfterViewChecked {

	private element: HTMLElement;

	/** 調整値 */
	@Input() public adjustedValue = 0;

  /** 前回設定値 */
  public preFixedHeight = -1;

	/**
   * コンストラクタです.
   */
  constructor(private el: ElementRef) {
		this.element = el.nativeElement;
	}

	public ngAfterViewChecked() {
		let children: HTMLCollection = this.element.children;
		let flexibleElement: any;
		let fixedHeight = 0;
		for (let i = 0; i < children.length; i++) {
			if (children.item(i).className.indexOf('eim-flexible-height', 0) != -1) {
				flexibleElement = children.item(i);
			} else {
				fixedHeight += children.item(i).clientHeight;
			}
// fixedHeight += Number((<any>children.item(i)).style.marginTop);
// fixedHeight += Number((<any>children.item(i)).style.marginBottom);
// fixedHeight += Number((<any>children.item(i)).style.paddingTop);
// fixedHeight += Number((<any>children.item(i)).style.paddingBottom);
		}
		if (flexibleElement) {
      fixedHeight = fixedHeight + (children.length - 1) * 5 - this.adjustedValue;
      if (fixedHeight != this.preFixedHeight) {
        this.preFixedHeight = fixedHeight;
  			flexibleElement.style.height = 'calc(100% - ' + fixedHeight + 'px)';
      }
		}
	}
}
