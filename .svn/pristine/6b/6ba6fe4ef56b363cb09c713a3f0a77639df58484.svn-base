import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { getProperty, setProperty } from 'dot-prop';
import { SelectItem } from 'primeng/api';
import { EIMObjectTypeInputRendererComponentService } from './object-type-renderer.component.service';

/**
 * cellRendererParamsに指定するオブジェクトタイプ入力レンダラーのパラメータ
 */
export class EIMObjectTypeInputRendererComponentParam {
	/** ドロップダウンのオプション */
	options?: any;
	/** ドロップダウンのオプション取得関数 */
	optionsFunction?: any;
}


/**
 * オブジェクトタイプ入力レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMObjectTypeInputRendererComponent
 *
 */
@Component({
		selector: 'eim-object-type-input-renderer',
		template: `
		<eim-object-type-input-form-item
			[(ngModel)]="values"
			[options]="options"
			(changed)="onChange($event)"
		>
		</eim-object-type-input-form-item>
		`,
		standalone: false
})
export class EIMObjectTypeInputRendererComponent implements AgRendererComponent {
	private params: any;

	/** 選択値 */
	public values: any[];

	/** オプション */
	public options: SelectItem[] = [];

	/**
	 * コンストラクタ
	 */
	constructor(
		protected rendererComponentService: EIMObjectTypeInputRendererComponentService,
	) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		let field: string = params.colDef.field;
		let cellRendererParams: EIMObjectTypeInputRendererComponentParam = this.params.colDef.cellRendererParams;
		if (!cellRendererParams) {
			return;
		}

		// 表示値を取得
		this.values = getProperty(params.data, field, null);
		if (this.values === null || this.values.length === 0) {
			setProperty(params.data, field, [null])
			this.values = getProperty(params.data, field, null);
		}

		// options
		if (cellRendererParams.optionsFunction) {
			this.options = cellRendererParams.optionsFunction(params.data);
		} else {
			this.options = cellRendererParams.options;
		}

	}

	/**
	 * セルの表示内容を更新します.(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return agGridがセルを更新（ngInitを実行）する必要がある場合false、そうでない場合true
	 */
	 refresh(params: any): boolean {
		// agGridがセルを更新（ngInitを実行）する必要がある場合false、自前でラベル編集を更新する場合true
		return false;
	}

	/**
	 * ラベルを取得します.配列指定は未対応です.
	 * @param data データ
	 * @param field フィールド名
	 * @return ラベル
	 */
	getLabel(data, field: string): string {
		let targetData = data;

		let fields: string[] = field.split('.');
		for (let i = 0; i < fields.length; i++) {
			targetData = targetData[fields[i]];
			if (targetData === undefined) {
				return '';
			}
		}

		return targetData;
	}

	/**
	 * 変更イベントハンドラ.
	 * @param event イベント
	 */
	public onChange(event: any): void {
		this.rendererComponentService.checkChanged(event);
	 }
}
