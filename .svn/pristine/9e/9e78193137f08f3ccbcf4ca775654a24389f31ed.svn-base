import { Component, OnDestroy, EventEmitter, Output, DoCheck } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';
import { SelectItem } from 'primeng/api';
import { EIMTransitionDestinationRendererComponentService } from 'app/documents/shared/components/renderer/transition-destination-renderer.component.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * 遷移先ステータスレンダラーコンポーネント
 * @example
 * 	cellRendererFramework: EIMTransitionDestinationRendererComponent
 */
@Component({
    selector: 'eim-transition-destination-renderer',
    template: `
		<div class='p-grid eim-transition-destination-renderer eim-form-item'>
			<div *ngIf="functionTypeEquals('approve')" class='p-col-12' style='padding: 0em'>
				<p-select name='{{params.data.id}}' required='true' appendTo='body'
								[(ngModel)]='params.data.selectedEditStatus' [options]='approveStatus' (onChange)='onSelectChange()'
								[autoWidth]='true' [style]="{'width':'100%'}"></p-select>
			</div>
			<div *ngIf="functionTypeEquals('wait')" class='p-col-12' style='padding: 0em'>
				<p-select name='{{params.data.id}}' required='true' appendTo='body'
								[(ngModel)]='waitValue' [options]='waitStatus' [disabled]="true"
								[autoWidth]='true' [style]="{'width':'100%'}"></p-select>
			</div>
			<div *ngIf="functionTypeEquals('back')" class='p-col-12' style='padding: 0em'>
				<p-select name='{{params.data.id}}' required='true' appendTo='body'
								[(ngModel)]='backValue' [options]='backStatus'
								[autoWidth]='true' [style]="{'width':'100%'}"></p-select>
			</div>
		</div>
		`,
    styles: [`
			::ng-deep .eim-transition-destination-renderer {
				display: flex;
				align-items: center;
				height: 100%;
				margin: 0px;
			}
			::ng-deep .eim-transition-destination-renderer .p-radiobutton-box {
				opacity: 1;
				background-color: #ffffcc;
			}
			::ng-deep .eim-transition-destination-renderer div.p-radiobutton.p-disabled .p-radiobutton-box {
				opacity: 1;
				background-color: #eeeeee;
			}
			::ng-deep .eim-transition-destination-renderer .p-radiobutton-icon {
				font-size: 7px;
			}
		`],
    standalone: false
})
export class EIMTransitionDestinationRendererComponent implements AgRendererComponent, DoCheck {

	/** パラメータ */
	public params: any;

	/** 編集中ステータスID */
	public editingValue: any = '0';

	/** 保留中ステータスID(非実在) */
	public waitValue: any = '-1';

	/** 承認時遷移先ステータス */
	public approveStatus: SelectItem[] =
		[
		];

	/** 保留時遷移先ステータス */
	public waitStatus: SelectItem[] =
		[
		];

	/** 差戻し時遷移先ステータス */
	public backStatus: SelectItem[] =
		[
			{ label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02105'), value: '0' },
		];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected rendererComponentService: EIMTransitionDestinationRendererComponentService,
		protected translateService: TranslateService,
	) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.setTypeItems(params);
		this.params = params;
		if (this.params.data.selectedEditStatus == null || this.params.data.selectedEditStatus == '') {
			this.params.data.selectedEditStatus = this.approveStatus[0].value;
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
	 * 選択変更時の処理です.
	 */
	onSelectChange(): void {
		if (this.params.data.functionType == 'approve') {
			this.params.data.forcastStatusTypeId = this.params.data.selectedEditStatus;
		} else if (this.params.data.functionType == 'back') {
			this.params.data.forcastStatusTypeId = this.editingValue;
		} else {
			this.params.data.forcastStatusTypeId = this.waitValue;
		}
		this.rendererComponentService.changed();
	}

	/**
	 * 処理に応じて表示内容を変更します.
	 */
	public functionTypeEquals(functionType: string): boolean {
		return functionType == this.params.data.functionType;
	}

	/**
	 * 選択候補をセットします.
	 */
	setTypeItems(params: any) {
		for (let i = 0; i < params.data.statusList.length; i++) {
			let statusType: any = params.data.statusList[i];
			this.approveStatus.push({ label: statusType.statusTypeName, value: statusType.statusTypeId });
		}
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck() {
		if (this.params.data.tmpFunctionType != null) {
			if (this.params.data.tmpFunctionType != this.params.data.functionType) {
				this.params.data.tmpFunctionType = this.params.data.functionType;
				this.onSelectChange();
			}
		} else {
			this.params.data.tmpFunctionType = this.params.data.functionType;
		}
	}
}
