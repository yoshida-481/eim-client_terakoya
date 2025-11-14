import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
/**
 * チェックボックスレンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMCheckboxRendererComponent
 *
 */
@Component({
    selector: 'eim-checkbox-renderer',
    template: `
		<div *ngIf="!displayCenter" style="width: 100%; height: 100%; display: flex; align-items: center;">
			<eim-checkbox *ngIf="visible" name="check" [(ngModel)]="checked" binary="true" [disabled]="disabled" (onChange)="onChange($event)"></eim-checkbox>
		</div>
		<div *ngIf="displayCenter" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
			<eim-checkbox *ngIf="visible" name="check" [(ngModel)]="checked" binary="true" [disabled]="disabled" (onChange)="onChange($event)"></eim-checkbox>
		</div>
    `,
    standalone: false
})

export class EIMCheckboxRendererComponent implements AgRendererComponent {
	public params: any;
	public field: string;
	public checked = false;
	public disabled = false;
	public visible = true;
	public displayCenter = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected rendererComponentService: EIMCheckboxRendererComponentService,
	) {}


	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.field = params.colDef.field;
		this.checked = this.params.data[this.field];
		this.disabled = this.params.data['disabled'];

		for (let i = 0; i < this.params.context.columns.length; i++) {
			let column: any = this.params.context.columns[i];
			if (params.column.colDef.field !== column.field
					|| params.column.colDef.headerName !== column.headerName) {
				continue;
			}
			if (column.param && column.param.visibleFunction) {
				this.visible = column.param.visibleFunction(this.params.data);
			}

			if (column.param && column.param.displayCenter === true) {
				this.displayCenter = true;
			}
		}
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
	 * 変更イベントハンドラ.
	 * @param event イベント
	 */
	public onChange(event: any): void {
		this.params.data[this.field] = this.checked;
		this.rendererComponentService.checkChanged(this.params.data);
	 }
}
