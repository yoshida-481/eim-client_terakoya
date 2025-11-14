import { Directive, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';
import { EIMDataGridComponent, EIMDataGridTreeNode } from 'app/shared/components/data-grid/data-grid.component';

/**
 * EIMDataGridComponentのレンダラにツリー表示用の開閉ボタンを追加するディレクティブ<br>
 * EIMDataGridComponentのタグに付与することで、タグに開閉ボタンを配置する事ができます.
 *
 * @example <div [eimDataGridTreeToggleButton]="params"></div>
 */
@Directive({
  selector: '[eimDataGridTreeToggleButton]',
  standalone: false,
})
export class EIMDataGridTreeToggleButtonDirective {

	@Input() public eimDataGridTreeToggleButton = null;

	private dataGrid: EIMDataGridComponent;
	private element: HTMLElement = null;

	private treeNode: EIMDataGridTreeNode = null;

	/**
   * コンストラクタです.
   */
	constructor(private elementRef: ElementRef) {
		this.element = elementRef.nativeElement;
	}


	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges) {

		this.dataGrid = this.eimDataGridTreeToggleButton.context;
		this.treeNode = this.eimDataGridTreeToggleButton.data;

		let buttonElement = document.createElement('button');
		this.element.appendChild(buttonElement);
		buttonElement.type = 'button';
		buttonElement.tabIndex = -1;

		let spanElement = document.createElement('span');
		buttonElement.appendChild(spanElement);

		// -------------------------
		// トグルボタン表示の有無を設定

		// 末端の場合
		if (this.treeNode.leaf) {
			buttonElement.classList.add('eim-data-grid-tree-no-toggle');

		// 枝の場合
		} else {
			buttonElement.classList.add('eim-data-grid-tree-toggle');

			// -------------------------
			// トグルボタンの開閉を設定
			if (this.treeNode.expanded) {
				spanElement.classList.add('eim-icon-open');

			} else {
				spanElement.classList.add('eim-icon-close');

			}
		}

		// -------------------------
		// 表示階層を設定
		let level = this.eimDataGridTreeToggleButton.context.getTreeNodeLevel(this.treeNode);
		this.element.classList.add('eim-data-grid-tree-level_' + level + 'x');

	}

	@HostListener('click', ['$event']) onClick(event) {
		// const buttonElement = this.getParentWithClassName(event.srcElement, 'eim-data-grid-tree-toggle');

		// if (buttonElement === null) {
		// 	return;
		// }

		// // open/close書き換え
		// this.treeNode.expanded = !this.treeNode.expanded;
		// const spanElement: HTMLElement = buttonElement.getElementsByTagName('span')[0];
		// spanElement.classList.remove('eim-icon-open', 'eim-icon-close');
		// if (this.treeNode.expanded) {
		// 	spanElement.classList.add('eim-icon-open');

		// } else {
		// 	spanElement.classList.add('eim-icon-close');

		// }
		this.dataGrid.expandTreeNode(this.treeNode, !this.treeNode.expanded);
  }

	/**
	 * エレメントの先祖をたどり、指定したクラス名が設定されたエレメントを返却します.
	 * @param element エレメント
	 * @param className クラス名
	 * @returns 指定したクラス名が設定されたエレメント
	 */
	protected getParentWithClassName(element: HTMLElement, className: string): HTMLElement {
		if (!element) {
			return null;
		}
		if (element.classList.contains('ag-cell')) {
			return null;
		}
		if (element.classList.contains(className)) {
			return element;
		}

		return this.getParentWithClassName(element.parentElement, className);
	}
}