import { Component, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * テキストエディターレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMTextEditorRendererComponent
 */
@Component({
    selector: 'eim-text-editor-renderer',
    template: `<div style="height: 100%; display: flex; align-items: center;">
			<input #input class="ag-cell-edit-input" type="text" style="height: 21px; width: 100%;" (click)="onClick($event)" (keydown)="onKeyDown($event)" (focusout)="onFocusOut($event)" [(ngModel)]="inputValue" maxlength="{{maxLength}}" />
		</div>`,
    standalone: false
})
export class EIMTextEditorRendererComponent implements ICellEditorAngularComp, AfterViewInit {

	/** パラメータ */
	private params: any;
	/** 入力値 */
	public inputValue: any;
	/** 最大長 */
	public maxLength: number;

	@ViewChild('input', { read: ViewContainerRef, static: true }) public input;

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {
		window.setTimeout(() => {
			this.input.element.nativeElement.focus();
		});
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.inputValue = params.value;
		this.maxLength = EIMConstantService.STRING_MAX_LENGTH;
	}

	/**
	 * 入力値を取得します.
	 */
	getValue(): any {
		return this.inputValue;
	}

	/**
	 * キーダウンのイベントハンドラです.
	 * @param event イベント
	 */
	onKeyDown(event: any): void {

		let keyCode: number = event.keyCode;
		// Endキー、Homeキー、←↑→↓キーで編集状態を抜けさせなくする
		if (35 <= keyCode && keyCode <= 40) {
			event.stopPropagation();
		}
	}

	/**
	 * フォーカスアウトのイベントハンドラです.
	 * @param event イベント
	 */
	onFocusOut(event: any): void {
		this.params.api.stopEditing();
	}

	/**
	 * クリックのイベントハンドラです.
	 * @param event イベント
	 */
	onClick(event: any): void {
		event.stopPropagation();
	}

}
