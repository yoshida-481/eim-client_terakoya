import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMStatusTypeDTO } from 'app/admins/shared/dtos/status-type.dto';

import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * ステータス別セキュリティ更新コンポーネント
 * @example
 *
 *      <eim-status-security-updator
 *          [adminAppId]="adminAppId"
 *          [secId]="secId"
 *          [secLabel]="secLabel"
 *          [workflowId]="workflowId"
 *          [workflowLabel]="workflowLabel"
 *          [stTypeId]="stTypeId"
 *          [stSecId]="stSecId">
 *      </eim-status-security-updator>
 */
@Component({
    selector: 'eim-status-security-updator',
    templateUrl: './status-security-updator.component.html',
    styleUrls: ['./status-security-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMStatusSecurityUpdatorComponent) }
    ],
    standalone: false
})

export class EIMStatusSecurityUpdatorComponent implements OnInit, EIMUpdatable {
	/** ステータス別セキュリティフォーム */
	@ViewChild('statusSecurityUpdatorForm', { static: true }) statusSecurityUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** ステータスタイプ一覧表示項目 */
	public statusTypeItemList: SelectItem[] = [];

	/** システム管理アプリケーション種別ID */
	@Input() adminAppId: string;

	/** セキュリティID */
	@Input() secId: number;

	/** セキュリティ名 */
	@Input() secLabel: string;

	/** ステータスタイプID */
	@Input() stTypeId: number;

	/** ワークフローID */
	@Input() workflowId: number;

	/** ワークフロー名 */
	@Input() workflowLabel: string;

	/** ステータス別セキュリティID */
	@Input() stSecId: number;

	/** 作成完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected securityService: EIMAdminsSecurityService,
			protected translateService: TranslateService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ステータス別セキュリティを更新します.
	 */
	public update(): void {
		// ステータス別セキュリティを更新します．
		this.securityService.updateStatus(this.secId, this.workflowId, this.stSecId, this.stTypeId).subscribe(
			(data: any) => {
				this.updated.emit(data);
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_UPDATOR);
			}, (err: any) => {
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_UPDATOR);
			}
		);
	}

	/**
	 * ステータス別セキュリティ更新可否を返却します.
	 * @return ステータス別セキュリティ更新可否
	 */
	public updatable(): boolean {
		let updateFlag = true;

		if (!this.workflowId) {
			updateFlag = false;
		}

		if (!this.stTypeId) {
			updateFlag = false;
		}
		return updateFlag;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * ワークフロー選択画面表示ボタン押下のイベントハンドラです．
	 * @param event イベント
	 */
	public onClickShowWorkflowSelector(event: any): void {

		// ステータスタイプ一覧を取得します．
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowSelector({
			selected: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);

				this.workflowLabel = data.name;
				this.workflowId = data.id;
				// ステータスタイプ一覧を取得します．
				this.getStatusTypeList(this.workflowId);
			},
		});
	}


	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.getStatusTypeList(this.workflowId);
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ステータスタイプのドロップダウンリストのデータを取得します.
	 * @param workflowId ワークフローID
	 */
	protected getStatusTypeList(workflowId: number): void {

		this.securityService.getStatusTypeList(workflowId).subscribe(
			(statusTypeList: EIMStatusTypeDTO[]) => {
				this.setStatusTypeItemList(statusTypeList);

			}, (err: any) => {
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_UPDATOR);
		});
	}

	/**
	 * ステータスタイプのドロップダウンリスト用のデータを生成します.
	 * @param statusTypeList ステータスタイプ配列
	 */
	protected setStatusTypeItemList(statusTypeList: any[]): void {

		this.statusTypeItemList = [];
		let loopCnt = statusTypeList.length;
		let statusType: any;
		for (let idx = 0; idx < loopCnt; idx++) {
			statusType = statusTypeList[idx];
			this.statusTypeItemList.push({label: statusType.statusTypeName, value: statusType.statusTypeId});

		}
	}
}
