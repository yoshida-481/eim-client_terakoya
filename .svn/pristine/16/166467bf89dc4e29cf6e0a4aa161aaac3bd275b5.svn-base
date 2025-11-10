import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentTypeChangeRendererComponentService } from 'app/documents/shared/components/renderer/document-type-change-renderer.component.service';

/**
 * ドキュメントタイプ選択レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMDocumentTypeChangeRendererComponent
 *
 */
@Component({
    selector: 'eim-document-type-change-cell',
    template: `
			<div style="height: 100%; display: flex; align-items: center;">
				<div (dblclick)="onDoubleClick($event)" style="height: 100%; display: flex; align-items: center; width: 100%; overflow: hidden; text-overflow: ellipsis; max-width: 100%;"
					[style.color]="disabledFlag ? '#a9a9a9' : ''"
					[style.fontWeight]="disabledFlag ? 'bold' : ''"
					pTooltip="{{label}}" tooltipPosition="top"
				>{{label}}
				</div>
				<div>
					<button pButton type="button" severity="info" class="icon-only-button" icon="fa fa-fw fa-external-link" (click)="showObjectTypeTreeSelector()"
						pTooltip="{{ 'EIM_DOCUMENTS.LABEL_03013' | translate }}" [disabled]="disabledFlag"></button>
				</div>
			</div>
		`,
    standalone: false
})
export class EIMDocumentTypeChangeRendererComponent implements AgRendererComponent {

	/** パラメータ */
	private params: any;

	/** ラベル */
	public label: string;

	/** 非活性 */
	public disabledFlag: boolean;

	/**
	 * コンストラクタ
	 */
	constructor(
			protected documentTypeChangeRendererComponentService: EIMDocumentTypeChangeRendererComponentService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
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

		this.label = this.documentTypeChangeRendererComponentService.getLabel(params.data);
		// ドキュメントタイプ変更可能フラグ
		let activatedFlag: boolean;

		if (this.params.data.activatedFlag == 'true') {
			activatedFlag = true;
		} else {
			activatedFlag = false;
		}

		if (this.documentTypeChangeRendererComponentService.isActive(params.data) && activatedFlag) {
			this.disabledFlag = false;
		} else {
			this.disabledFlag = true;
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
	 * ダブルクリックイベントハンドラ.
	 * ドキュメントタイプ選択ツリーコンポーネントを表示する
	 * @param event イベント
	 */
	onDoubleClick(event: any) {
		/* ボタンになったので廃止。コメントアウトで残す。
		if (this.disabledFlag) return;
		// ドキュメントタイプツリーを表示する
		this.showObjectTypeTreeSelector();
		*/
	}

	/**
	 * ドキュメントタイプツリーを表示します.
	 */
	public showObjectTypeTreeSelector(): void {
		 // ドキュメントタイプツリーを表示する
		let selectorId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(null, this.params.data.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
				{
					selected: (documentType: any) => {
						this.dialogManagerComponentService.close(selectorId);
						this.params.data.objTypeId = documentType.id;
						this.params.data.objTypeName = documentType.name;
						this.label = this.documentTypeChangeRendererComponentService.getLabel(this.params.data);
					}
				});
	}

}
