import { Component, Input, IterableDiffers, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';
import { EIMRendererComponentRowData } from 'app/shared/components/renderer/renderer.component.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

import { getProperty, setProperty } from 'dot-prop';

export class EIMBooleanSwitchButtonRendererComponentParam {
	/** 編集対象かどうかを返却するファンクション */
	editableFunction?: (dto: any) => boolean;
	/** 値選択時のコールバックファンクション */
	onChangeFunction?: (value: any, rowData: EIMRendererComponentRowData) => void;

}

/**
 * 真偽切り替えボタン入力レンダラーコンポーネント<br/>
 * 数値型属性の0/1にてfalse/trueをボタンで切り替える場合に使用してください.
 * @example
 *
 *      <eim-boolean-switch-button-input-renderer>
 *      </eim-boolean-switch-button-input-renderer>
 */
@Component({
	selector: 'eim-boolean-switch-button-input-renderer',
	template: `
		<div class="toggle-wrapper">
			<div *ngIf="values[0] !== null" class="toggle-container" [ngClass]="{'editable': editable}" 
					(click)="editable && onClick($event)" (keydown)="editable && onKeyDown($event)" tabindex="0">
				<div class="toggle" [class.active]="values[0] === 0">
					<div class="circle"></div>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./boolean-switch-button-input-renderer.component.scss'],
	standalone: false
})
export class EIMBooleanSwitchButtonInputRendererComponent implements AgRendererComponent {

	/** フォームグループ */
	@Input() public form: FormGroup;

	/** レンダラパラメータ */
	private params: any;

	/** 編集可能かどうか */
	public editable;

	/** 表示可否ファンクション */
	public getVisibleFunction: (value: number, dto?: EIMSimpleObjectDTO) => string;

	/** 属性値 */
	public values: number[];

	constructor(
	) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		let field: string = params.colDef.field;
		let cellRendererParams: EIMBooleanSwitchButtonRendererComponentParam = this.params.colDef.cellRendererParams;

		// 表示値を取得
		this.values = getProperty(params.data, field, null);
		if (this.values === null || this.values.length === 0) {
			setProperty(params.data, field, [null]);
			this.values = getProperty(params.data, field, null);
		}

		// editable
		this.editable = this.isEditable(params.data, cellRendererParams ? cellRendererParams.editableFunction : null);

	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * ボタンクリック時のイベントハンドラです.
	 * @param event イベント
	 */
	onClick(event: any) {
		this.switchValue();
	}

	/**
	 * キーダウンの処理です.
	 * @param event イベント
	 */
	onKeyDown(event: any): void {

		// スペースキーで切り替える
		if (event.code === 'Space') {
			this.switchValue();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 編集可能かどうかを返却します.
	 *
	 * @param dto DTO
	 * @param editableFunction 編集可能取得関数
	 * @returns 編集可能かどうか（可能ならtrue）
	 */
	protected isEditable(dto: any, editableFunction: (dto: any) => boolean): boolean {

		if (!editableFunction) {
			return true;
		}
		return editableFunction(dto);
	}

	/**
	 * 値のON(1)/OFF(0)を切り替えます.
	 */
	protected switchValue() {
		this.values[0] = this.values[0] === 0 ? 1 : 0;

		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(this.values[0], { field: this.params.colDef.field, dto: this.params.data });
		}
	}


}
