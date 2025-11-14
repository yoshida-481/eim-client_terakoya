import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { EIMFunctionTypeRendererComponentService } from './function-type-renderer.component.service';

/**
 * 処理レンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMFunctionTypeRendererComponent
 */
@Component({
    selector: 'eim-function-type-renderer',
    template: `
		<div class='p-grid eim-function-type-renderer eim-form-item'>
			<div class='p-col-12' style='padding: 0em'>
				<p-select name='{{params.data.id}}' required='true' appendTo='body'
								(onChange)="onChange($event)"
								[(ngModel)]='params.data.functionType' [options]='functionTypes'
								[autoWidth]='true' [style]="{'width':'100%'}"></p-select>
			</div>
		</div>
		`,
    styles: [`
			::ng-deep .eim-function-type-renderer {
				display: flex;
				align-items: center;
				height: 100%;
			}
			::ng-deep .eim-function-type-renderer .p-radiobutton-box {
				opacity: 1;
				background-color: #ffffcc;
			}
			::ng-deep .eim-function-type-renderer div.p-radiobutton.p-disabled .p-radiobutton-box {
				opacity: 1;
				background-color: #eeeeee;
			}
			::ng-deep .eim-function-type-renderer .p-radiobutton-icon {
				font-size: 7px;
			}
		`],
    standalone: false
})
export class EIMFunctionTypeRendererComponent implements AgRendererComponent {

	/** パラメータ */
	public params: any;

	/** 処理タイプ */
	public functionTypes: SelectItem[] =
		[
			{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02199'), value: 'approve' },
			{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03056'), value: 'wait' },
			{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03045'), value: 'back' },
		];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected functionTypeRendererComponentService: EIMFunctionTypeRendererComponentService
	) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;

	}


	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 処理変更イベントハンドラ.
	 * @param event イベント
	 */
	onChange(event) {
		this.functionTypeRendererComponentService.change(this.params.data);
	}
}
