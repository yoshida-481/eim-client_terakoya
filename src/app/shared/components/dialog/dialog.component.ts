import { EIMHttpService } from 'app/shared/services/http.service';
import { Component, Directive, ContentChild, HostBinding, ViewChild, ElementRef, EventEmitter, Input, Output, OnInit, AfterContentInit, AfterViewInit, OnChanges, SimpleChanges, ViewChildren, HostListener } from '@angular/core';
import { of, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { Footer } from 'primeng/api';

import { EIMSelectorComponent, EIMComponent, EIMCreatable, EIMUpdatable, EIMDeletable, EIMExecutable, EIMApplicable, EIMSelectable } from 'app/shared/shared.interface';

/**
 * ダイアログコンポーネント
 * <div class="dialog-area"></div>を配置すること。
 */
@Component({
    selector: 'eim-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    standalone: false
})
export class EIMDialogComponent implements OnInit, AfterViewInit {
	@ContentChild(EIMComponent)
		content: EIMComponent;

	@ViewChild('dialog', { static: true })
		dialog: Dialog;

	@ViewChild('footer')
		footer: Footer;

	@ViewChild('dialogContext', { static: true }) dialogContext: ElementRef;

	/** フォーカス対象 */
	@ViewChild('headerClose', { static: true }) headerClose: ElementRef;

	/** フォーカス対象 */
	@ViewChild('footerClose', { static: true }) footerClose: ElementRef;

	/** 名前 */
	@Input() name: string;

	/** ヘッダラベル */
	@Input() header: string;

	/** 上の位置 */
	// @Input() positionTop: number;	// PrimeNG対応待ち https://github.com/primefaces/primeng/issues/9089

	/** 左の位置 */
	// @Input() positionLeft: number;	// PrimeNG対応待ち https://github.com/primefaces/primeng/issues/9089

	/** 可視どうか */
	@Input() visible: boolean;

	/** 幅(px) */
	@Input() width: number;

	/** 高さ(px)（未指定の場合は、高さ最大と解釈する） */
	@Input() height: number;

	/** モーダルかどうか */
	@Input() modal: string;

	/** 最大化可能かどうか */
	@Input() enableMaximize = true;

	/** 
	 * ダイアログ内コンポーネントの高さにあわせて高さ可変とするかどうか（可変とする場合heightは無視します） 
	 * contentMaxHeightと合わせて使用してください。
	 * contentMaxHeightを指定しない場合、コンテンツをすべて表示する高さとなるため、ブラウザをはみ出す可能性があります。
	 */
	@Input() fitHeight = false;

	/** コンテンツの最大高さ(px) */
	@Input() contentMaxHeight: number = null;

	/** 初期表示時の最大幅 */
	@Input() initMaxWidth: number;

	/** 閉じるボタンを除去するかどうか */
	@Input() trimcloseBottonFlg: boolean;

	public isMaximizeMode = false;

	public minWidth: number;
	public minHeight: number;
	public containerHeight = '';

	/** ダイアログのCSSクラス */
	public styleClass = null;

	// 最大化前の状態
	private restoreTop: string;
	private restoreLeft: string;
	private restoreWidth: number;
	private restoreHeight: number;
	private element: Element;

	// リサイズ可能
	public enableResizable = true;

	@Output() close: EventEmitter<null> = new EventEmitter<null>();

	constructor(
			el: ElementRef,
			protected translate: TranslateService,
			protected httpService: EIMHttpService,
			) {
// this.element = el.nativeElement;
		this.styleClass = el.nativeElement.className;
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	public show(): void {
		this.visible = true;
	}

	public hide(): void {
		this.visible = false;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		if (!this.width) {
			this.width = window.innerWidth - 15;
			if (this.initMaxWidth && this.initMaxWidth < this.width) {
				this.width = this.initMaxWidth;
			}
			this.minWidth = 150;
		} else {
			this.minWidth = this.width;
		}
		if (this.fitHeight) {
			// ダイアログ内コンポーネントにあわせて高さ可変の場合
			this.height = undefined;
		} else if (!this.height) {
			this.height = window.innerHeight - 15;
			this.minHeight = 150;
		} else {
			this.minHeight = this.height;
		}

		// 最大化可の場合はリサイズ可とする
		this.enableResizable = this.enableMaximize;
	}

	/**
	 * ビュー初期化イベントハンドラ
	 * ヘッダを除いた高さを設定します.
	 */
	public ngAfterViewInit() {
		window.setTimeout(() => {
			if (this.dialog.headerViewChild) {
				let titleBar: any = this.dialog.headerViewChild.nativeElement; // this.dialog.container.children.item(0);
				this.containerHeight = 'calc(100%)';
				this.focusFirstElement(<HTMLElement>this.dialog.contentViewChild.nativeElement);
			}
		});
	}

	/**
	 * 登録可能かどうか.
	 * ボタンの表示/非表示の切り替えに使用します.
	 * @return 登録可能かどうか
	 */
	public canCreate(): boolean {
		if (!this.content) {
			return false;
		}
		if ((<EIMCreatable>this.content).create
				&& ((<EIMCreatable>this.content).visibleCreate === undefined || (<EIMCreatable>this.content).visibleCreate)) {
			return true;
		}
	}

	/**
	 * 更新可能かどうか.
	 * ボタンの表示/非表示の切り替えに使用します.
	 * @return 更新可能かどうか
	 */
	public canUpdate(): boolean {
		if (!this.content) {
			return false;
		}
		if ((<EIMUpdatable>this.content).update
				&& ((<EIMUpdatable>this.content).visibleUpdate === undefined || (<EIMUpdatable>this.content).visibleUpdate)) {
			return true;
		}
	}

	/**
	 * 削除可能かどうか.
	 * ボタンの表示/非表示の切り替えに使用します.
	 * @return 削除可能かどうか
	 */
	public canDelete(): boolean {
		if (!this.content) {
			return false;
		}
		if ((<EIMDeletable>this.content).delete
				&& ((<EIMDeletable>this.content).visibleDelete === undefined || (<EIMDeletable>this.content).visibleDelete)) {
			return true;
		}
	}

	/**
	 * 実行可能かどうか.
	 * ボタンの表示/非表示の切り替えに使用します.
	 * @return 実行可能かどうか
	 */
	public canExecute(): boolean {
		if (!this.content) {
			return false;
		}
		if ((<EIMExecutable>this.content).execute
				&& ((<EIMExecutable>this.content).visibleExecute === undefined || (<EIMExecutable>this.content).visibleExecute)) {
			return true;
		}
	}

	/**
	 * 適用可能かどうか.
	 * ボタンの表示/非表示の切り替えに使用します.
	 * @return 適用可能かどうか
	 */
	public canApply(): boolean {
		if (!this.content) {
			return false;
		}
		if ((<EIMApplicable>this.content).apply
				&& ((<EIMApplicable>this.content).visibleApply === undefined || (<EIMApplicable>this.content).visibleApply)) {
			return true;
		}
	}

	/**
	 * 選択可能かどうか.
	 * ボタンの表示/非表示の切り替えに使用します.
	 * @return 選択可能かどうか
	 */
	public canSelect(): boolean {
		if (!this.content) {
			return false;
		}
		if ((<EIMSelectable>this.content).select
				&& ((<EIMSelectable>this.content).visibleSelect === undefined || (<EIMSelectable>this.content).visibleSelect)) {
			return true;
		}
	}

	/**
	 * 画面非表示イベントハンドラ
	 */
	public onClickClose(event: Event): void {
		if (this.content && this.content['close']) {
			this.content['close'](event, this.close);
		} else {
			this.close.emit();
		}
	}

	/**
	 * 画面最大化ボタンクリックイベントハンドラ
	 */
	public onClickMaximize(event: Event): void {

		this.restoreTop = this.dialog.container.style.left
		this.restoreLeft = this.dialog.container.style.top
		this.restoreWidth = this.width;
		this.restoreHeight = this.height;
		this.dialog.container.style.left =  '0px';
		this.dialog.container.style.top = '0px';

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.isMaximizeMode = true;
	}

	/**
	 * 画面サイズ復元ボタンクリックハンドラ
	 */
	public onClickRestore(event: Event): void {

		this.dialog.container.style.left = this.restoreTop;
		this.dialog.container.style.top = this.restoreLeft;
		this.width = this.restoreWidth;
		this.height = this.restoreHeight;

		this.isMaximizeMode = false;
	}

	/**
	 * ダブルクリックハンドラ
	 */
	public onDblClick(event: MouseEvent): void {

		if (!this.enableMaximize) {
			return
		};

		if (this.isMaximizeMode) {
			this.onClickRestore(null);
		} else {
			this.onClickMaximize(null);
		}
	}

	/**
	 * キーダウンイベントハンドラ.
	 * @param event イベント
	 */
	@HostListener('document:keydown', ['$event'])
	public handleKeyboardEvent(event: KeyboardEvent): void {
		if (event.key === 'Tab') {
			// 現在のフォーカスが存在せず、画面非活性化レイヤーが存在する状態でTab押下された場合はモーダルポップアップ中と見なす
			if (((<HTMLElement>event.target).id === 'eim-body' || (<HTMLElement>event.target).id === 'firstFocusMenu') && window.document.getElementsByClassName('p-dialog-mask').length > 0) {
				let dialogList = window.document.getElementsByClassName('p-dialog');
				let message = dialogList[0];
				// メッセージが存在する場合はメッセージコンポーネントのロジックに処理を委譲するため何もしない
				if ((<HTMLElement>message).style.display !== 'none') {
					event.preventDefault();
					return;
				}
				window.setTimeout(() => {
					// 最前面のダイアログにフォーカスを当てる
					this.focusFirstElement(<HTMLElement>dialogList[dialogList.length - 1]);
				});
				event.preventDefault();
			} else if (event.shiftKey && (<HTMLElement>event.target).classList.contains('headerClose')) {
				// ヘッダの閉じるボタンが選択されている状態でShift+Tab押下された場合、最後尾の要素にフォーカスを当てる
				window.setTimeout(() => {
					(<HTMLElement>(this.getDialogElement((<HTMLElement>event.target))).getElementsByClassName('footerClose')[0]).focus();
				});
				event.preventDefault();
			} else if (!event.shiftKey && (<HTMLElement>event.target).classList.contains('footerClose')) {
				// フッタの閉じるボタンが選択されている状態でTab押下された場合、先頭の要素にフォーカスを当てる
				window.setTimeout(() => {
					(<HTMLElement>(this.getDialogElement((<HTMLElement>event.target))).getElementsByClassName('headerClose')[0]).focus();
				});
				event.preventDefault();
			}
		}

		window.setTimeout(() => {
			// マウスカーソルにダイアログが追従する現象を回避します.
			this.dialog.dragging = false;
		});
	}

	/**
	 * ボタンをドラッグした際、ダイアログのドラッグではないものとしてドラッグ処理を中断します.
	 * @param event イベント
	 */
	public suppressDragging(event: any): void {
		window.setTimeout(() => {
			// マウスカーソルにダイアログが追従する現象を回避します.
			this.dialog.dragging = false;
		});
	}

	/**
	 * ダイアログ内の最初のエレメントにフォーカスを当てます.
	 * @param element エレメント
	 */
	private focusFirstElement(element: HTMLElement): void {
		let elementList: HTMLCollectionOf<HTMLElement> = element.getElementsByTagName('input');
		let firstElement: HTMLElement;
		for (let i = 0; i < elementList.length; i++) {
			if (!(<HTMLInputElement>elementList[i]).disabled) {
				firstElement = elementList[i];
				break;
			}
		}
		elementList = element.getElementsByTagName('textarea');
		for (let i = 0; i < elementList.length; i++) {
			if (!(<HTMLInputElement>elementList[i]).disabled &&
				(!firstElement || elementList[i].getBoundingClientRect().top < firstElement.getBoundingClientRect().top)) {
				firstElement = elementList[i];
				break;
			}
		}
		if (!firstElement) {
			elementList = element.getElementsByClassName('eim-dialog-contents')[0].getElementsByTagName('button');
			for (let i = 0; i < elementList.length; i++) {
				if (!(<HTMLButtonElement>elementList[i]).disabled) {
					firstElement = elementList[i];
					break;
				}
			}
		}
		if (!firstElement) {
			elementList = element.getElementsByTagName('button');
			for (let i = 0; i < elementList.length; i++) {
				if (!(<HTMLButtonElement>elementList[i]).disabled) {
					firstElement = elementList[i];
					break;
				}
			}
		}
		if (firstElement) {
			window.setTimeout(() => {
				firstElement.focus();
				this.httpService.setFocusElement(firstElement);
			});
		}
	}

	/**
	 * 再帰的に親エレメントを調べ、ダイアログのエレメントを取得します.
	 * @param element エレメント
	 */
	private getDialogElement(ele: Element): Element {
		if (ele.classList.contains('p-dialog') || !ele.parentElement) {
			return ele;
		} else {
			return this.getDialogElement(ele.parentElement);
		}
	}

}
