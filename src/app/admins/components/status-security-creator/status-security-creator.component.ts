import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMStatusTypeDTO } from 'app/admins/shared/dtos/status-type.dto';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * ステータス別セキュリティ登録コンポーネント
 * @example
 *      <eim-status-security-creator
 *          [adminAppId]="adminAppId"
 *          [workflowId]="workflowId"
 *          [secId]="secId"
 *          [secLabel]="secLabel">
 *      </eim-status-security-creator>
 */
@Component({
    selector: 'eim-status-security-creator',
    templateUrl: './status-security-creator.component.html',
    styleUrls: ['./status-security-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMStatusSecurityCreatorComponent) }
    ],
    standalone: false
})

export class EIMStatusSecurityCreatorComponent implements OnInit, EIMCreatable {

	/** ステータス別セキュリティフォーム */
	@ViewChild('statusSecurityCreatorForm', { static: true }) statusSecurityCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** ワークフローID */
	@Input() workflowId: number;

	/** ワークフロー名 */
	@Input() workflowLabel: string;

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

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();


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
	 * ステータス別セキュリティを登録します.
	 */
	public create(): void {
		// ステータス別セキュリティを登録します．
		this.securityService.createStatus(this.secId, this.workflowId, this.stTypeId).subscribe(
			(data: any) => {
				this.created.emit(data);
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_CREATOR);
			}, (err: any) => {
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_CREATOR);
			}
		);
	}


	/**
	 * ステータス別セキュリティ登録可否を返却します.
	 * @return ステータス別セキュリティ登録可否
	 */
	public creatable(): boolean {
		return this.statusSecurityCreatorForm.valid;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		if ( this.workflowId ) {
			this.getStatusTypeList(this.workflowId);
		}
	}

	/**
	 * ワークフロー選択画面表示ボタン押下のイベントハンドラです．
	 * @param event イベント
	 */
	public onClickShowWorkflowSelector(event: any): void {
		// ワークフロー選択画面を表示する
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


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ステータスタイプのドロップダウンリストのデータを取得します.
	 * @param statusTypeList ステータスタイプ配列
	 */
	protected getStatusTypeList(workflowId: number): void {

		this.securityService.getStatusTypeList(workflowId).subscribe(
			(statusTypeList: EIMStatusTypeDTO[]) => {
				this.setStatusTypeItemList(statusTypeList);

			}, (err: any) => {
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_CREATOR);
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


