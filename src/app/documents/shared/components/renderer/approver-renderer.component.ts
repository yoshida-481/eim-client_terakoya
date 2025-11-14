import { Component, OnDestroy, EventEmitter, Output, SimpleChange, DoCheck, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgRendererComponent } from 'ag-grid-angular';

import {  EIMApproverRendererComponentService } from 'app/documents/shared/components/renderer/approver-renderer.component.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * 承認依頼先レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMApproverRendererComponent
 *
 */
@Component({
    selector: 'eim-approver-renderer',
    template: `
		<div style='overflow-y: auto; overflow-x: hidden; height: 100%' (dblclick)='onDoubleClick($event)'>
			<div *ngFor='let approver of params.data.currentApprover; let i = index;'>
				<div style='display: flex; align-items: center;'>
					<div style='height: 100%; width: 100%; overflow: hidden; text-overflow: ellipsis; max-width: 100%;'>
						<div style='float:left;'>
							<i class='fa eim-icon-user'></i>
							<label>{{approver.name}}</label>
						</div>
					</div>
					<div align='right'>
						<i class='fa fa-times' style='padding-right:5px;' (click)='onIconClick($event, params, i)'></i>
					</div>
				</div>
			</div>
			<div *ngIf="this.params.data.noApprover && this.params.data.functionType == 'approve'" >
				<div [ngStyle]="{'display': 'flex', 'width':'auto', 'flex-direction': 'column', 'justify-content': 'center', 'align-items': 'center', 'height': needlessHeight, 'background-color': '#cccccc'}">
					{{ 'EIM_DOCUMENTS.LABEL_02104' | translate }}
				</div>
			</div>
		</div>
		`,
    standalone: false
})
export class EIMApproverRendererComponent implements AgRendererComponent, DoCheck {

	// パラメータ
	public params: any;

	// 不要時背景の高さ
	public needlessHeight: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected rendererComponentService: EIMApproverRendererComponentService
	) {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.needlessHeight = EIMConstantService.APPROVE_ROW_HEIGHT + 'px';
	}

	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck() {
		if (this.params.data.tmpStatusTypeId != this.params.data.forcastStatusTypeId) {
			if (this.params.data.forcastStatusTypeId == this.params.data.statusTypeId) {
				this.params.data.forcastStatusTypeId = Number(this.params.data.statusList[0].statusTypeId);
			}
			this.params.data.tmpStatusTypeId = this.params.data.forcastStatusTypeId;
			this.params.data.currentApprover = this.setApprover(this.params);
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
	 * アイコンクリックのイベントハンドラです.
	 * @param event イベント
	 * @param params パラメータ
	 * @param index 対象の公開通知先のインデックス
	 */
	onIconClick(event: any, params: any, index: number) {
		this.rendererComponentService.deleteItem(params.data.objId, params.data.currentApprover[index].id);
	}

	/**
	 * レンダラーダブルクリックのイベントハンドラです.
	 * @param event イベント
	 */
	onDoubleClick(event: any) {
		if (!this.params.data.noApprover) {
			this.rendererComponentService.doubleClickItem();
		}
	}


	/**
	 * 承認者情報を取得します.
	 * @param params パラメータ
	 * @return 承認者一覧
	 */
	private setApprover(params: any) {
		for (let i = 0; i < params.data.statusList.length; i++) {
			let statusType: any = params.data.statusList[i];
			if (this.params.data.forcastStatusTypeId == statusType.statusTypeId) {
				params.data.noApprover = (statusType.finalApprove);
				this.rendererComponentService.approverChanged(statusType.finalApprove);
				return statusType.approver;
			}
		}
		params.data.noApprover = true;
		this.rendererComponentService.approverChanged(true);
		return [];
	}

}
