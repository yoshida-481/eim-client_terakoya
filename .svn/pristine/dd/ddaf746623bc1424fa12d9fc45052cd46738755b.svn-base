import { ViewChild, OnInit, Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService } from 'app/shared/services/message.service';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMEntry, EIMSecurityService } from 'app/documents/shared/services/apis/security.service';

/**
 * セキュリティ管理コンポーネント（adminsから移植）
 */
@Injectable()
export abstract class EIMSecurityComponent implements EIMAdminMainComponent, OnInit {

	/** アクセスエントリーデータグリッド */
	@ViewChild('accessEntryDataGrid')
	accessEntryDataGrid: EIMDataGridComponent;

	/** システム管理アプリケーション種別ID */
	public adminAppId = '';

	/** アクセス権限を表示するかどうか */
	public accessRoleDispFlag = false;

	/** アクセス権限更新ボタン押下可否 */
	public accessRoleUpdatableFlag = false;

	/** 上書チェックボックスを表示するかどうか */
	public overwriteFlag = false;

	// アクセス権限リスト
	public accessRoleList: EIMRoleDTO[];

	/** ビューID */
	public viewId = 'Security';

	/** 初期検索フラグ */
	public initFlag = true;

	/** アクセス権限：許可 */
	public accessAdmit = '1';

	/** アクセス権限：拒否 */
	public accessRefuse = '0';

	/** アクセス権限：無視 */
	public accessPass = '2';


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected securityService: EIMSecurityService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}
		this.initFlag = false;
		// 復元します
		this.accessEntryDataGrid.setState(state.accessEntryDataGrid);
		this.accessRoleList = state.accessRoleList;
		this.accessRoleDispFlag = state.accessRoleDispFlag;
		this.accessRoleUpdatableFlag = state.accessRoleUpdatableFlag;
		this.overwriteFlag = state.overwriteFlag;
	}


	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			accessEntryDataGrid: this.accessEntryDataGrid.getState(),
			accessRoleList: this.accessRoleList,
			accessRoleDispFlag: this.accessRoleDispFlag,
			accessRoleUpdatableFlag: this.accessRoleUpdatableFlag,
			overwriteFlag: this.overwriteFlag,
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 上書きチェックボックス変更時のイベントハンドラです.
	 * @param index 入力インデックス
	 */
	onChangeOverWrite(index: number) {
		// offに変更時
		if (!this.accessRoleList[index].roleChk) {
			// 権限オプションボタンをデフォルト値に戻す
			this.accessRoleList[index].permit = this.accessRoleList[index].defaultPermit;
		}
		this.accessRoleUpdatableFlag = true;
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		let accessEntryColumns: EIMDataGridColumn[] = [];
		accessEntryColumns = [];
		// 優先順位
		accessEntryColumns.push({ field: 'priority', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02002'), width: 65, suppressFilter: true, suppressSorting: true });
		// タイプ
		accessEntryColumns.push({ field: 'entryTypeName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02001'), width: 140, suppressFilter: true, suppressSorting: true });
		// 名前
		accessEntryColumns.push({ field: 'entryName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 390, suppressFilter: true, suppressSorting: true });

		this.accessEntryDataGrid.setColumns(accessEntryColumns);
		this.accessEntryDataGrid.showAllSelectButton = false;
		this.accessEntryDataGrid.multiple = false;
	}

	/**
	 * アクセス権限選択ハンドラ.
	 * @param event イベント
	 * @param value 権限の状態
	 */
	onClickAccessRole(index: number, value: string): void {
		// 変更があった場合更新ボタンを活性化
		if (value !== this.accessRoleList[index].defaultPermit) {
			this.accessRoleUpdatableFlag = true;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * アクセスエントリー一覧を取得します．
	 * @param secId   セキュリティID
	 * @param entryId エントリーID
	 */
	protected getAccessEntryList(secId: number, entryId?: number): void {
		this.securityService.getEntryList(secId).subscribe((accessEntryList: EIMEntry[]) => {
			this.accessEntryDataGrid.setData(accessEntryList);
			if (entryId) {
				let target = { objId: entryId };
				this.accessEntryDataGrid.select([target], false);
				let rowIndex: number = this.accessEntryDataGrid.getRowIndex();
				this.accessEntryDataGrid.ensureIndexVisible(rowIndex);
			}	
		}, (err: any) => {
			// クリア
			this.accessEntryDataGrid.setData([]);
		});
	}

	/**
	 * エントリー選択・削除の完了後処理
	 * @param secId セキュリティID
 	 * @param entryId エントリーID
	 */
	protected entryComplete(secId: number, entryId?: number): void {
		// エントリー一覧を取得します
		this.getAccessEntryList(secId, entryId);
		// アクセス権限をクリア
		this.accessRoleDispFlag = false;
		this.accessRoleUpdatableFlag = false;
		this.accessRoleList = [];
		// グリッドをリフレッシュ
		this.accessEntryDataGrid.redrawRows();
		this.accessEntryDataGrid.info.gridApi.deselectAll();
	}


	/**
	 * エントリーの削除処理を実行します
	 * @param removeData 削除対象リスト
	 * @param secId 対象セキュリティID
	 */
	protected deleteEntry(removeData: any[], secId: number): void {
		// 削除処理実行
		for (let i = 0; i < removeData.length; i++) {
			this.securityService.deleteEntry(secId, removeData[i].objId).subscribe(
				(deletedData: any) => {
					if (i === removeData.length - 1) {
						this.entryComplete(secId);
					}
				}, (err: any) => {
					return;
				}
			);
		}

	}

	/**
	 * アクセスロール一覧を定義命名します.
	 * 本メソッドは抽象メソッドです.継承先で実装してください.
	 * @param roleListDisp アクセスロール一覧
	 * @param role 追加対象アクセスロール
	 */
	abstract convertAccessRoleList(roleListDisp: EIMRoleDTO[], role: EIMRoleDTO): void;

}

