import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectEditorsSecurityService, EIMSecurity } from 'app/object-editors/shared/services/apis/object-editors-security.service';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMSecurityDTO } from 'app/object-editors/shared/dtos/security.dto';
import { EIMRoleDTO } from 'app/object-editors/shared/dtos/role.dto';
import { EIMObjectEditorsEntryService } from 'app/object-editors/shared/services/apis/object-editors-entry.service';

/**
 * セキュリティ選択コンポーネント(オブジェクトエディタ)
 * @example
 *
 *      <eim-object-editors-security-selector
 *        [secId]="secId">
 *      </eim-object-editors-security-selector>
 */
@Component({
    selector: 'eim-object-editors-security-selector',
    templateUrl: './object-editors-security-selector.component.html',
    styleUrls: ['./object-editors-security-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMObjectEditorsSecuritySelectorComponent) }],
    standalone: false
})
export class EIMObjectEditorsSecuritySelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMComponent, EIMSelectable, AfterViewInit {
	/** セキュリティデータグリッド */
	@ViewChild('securityTree', { static: true }) public securityTree: EIMTreeComponent;

	/** アクセスエントリーデータグリッド */
	@ViewChild('accessEntryGrid', { static: true }) public accessEntryGrid: EIMDataGridComponent;

	/** セキュリティID */
	@Input() secId: number;

	/** セキュリティ選択処理完了のイベントエミッタ */
	@Output() public selected: EventEmitter<EIMSecurity[]> = new EventEmitter<EIMSecurity[]>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** アクセス権限一覧 */
	public accessRoleList: any[] = [];

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** 選択対象がエラーかどうか */
	public isSelectedError = false;

	/** 上書チェックボックスを表示するかどうか */
	public overwriteFlag = false;

	/** 選択セキュリティID */
	private selectedSecurityId = 0;

	/** 選択アクセスエントリーID */
	private selectedAccessEntryId = 0;

	/** アクセス権限一覧初期表示用 */
	private accessRoleInitList: any[] = [
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02042'), name: EIMConstantService.PROC_DEFNAME_CREATE, permit: '-1', roleId: '11'}, // 作成
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02043'), name: EIMConstantService.PROC_DEFNAME_READ, permit: '-1', roleId: '12'}, // 読み取り
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02044'), name: EIMConstantService.PROC_DEFNAME_UPDATE, permit: '-1', roleId: '13'}, // 変更
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02045'), name: EIMConstantService.PROC_DEFNAME_DELETE, permit: '-1', roleId: '14'}, // 削除
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02046'), name: EIMConstantService.PROC_DEFNAME_RENAME, permit: '-1', roleId: '15'}, // 改名
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02047'), name: EIMConstantService.PROC_DEFNAME_LOCK, permit: '-1', roleId: '16'}, // ロック
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02048'), name: EIMConstantService.PROC_DEFNAME_UNLOCK, permit: '-1', roleId: '17'}, // ロック解除
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02049'), name: EIMConstantService.PROC_DEFNAME_CHECKIN, permit: '-1', roleId: '18'}, // チェックイン
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02050'), name: EIMConstantService.PROC_DEFNAME_CHECKOUT, permit: '-1', roleId: '19'}, // チェックアウト
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02051'), name: EIMConstantService.PROC_DEFNAME_STATUS_UP, permit: '-1', roleId: '20'}, // ステータスUp
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02052'), name: EIMConstantService.PROC_DEFNAME_STATUS_DOWN, permit: '-1', roleId: '21'}, // ステータスDown
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02053'), name: EIMConstantService.PROC_DEFNAME_REVISION_UP, permit: '-1', roleId: '22'}, // リビジョンアップ
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02054'), name: EIMConstantService.PROC_DEFNAME_CREATE_RELATION, permit: '-1', roleId: '23'}, // リレーション作成
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02055'), name: EIMConstantService.PROC_DEFNAME_UPDATE_RELATION, permit: '-1', roleId: '24'}, // リレーション変更
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02056'), name: EIMConstantService.PROC_DEFNAME_DELETE_RELATION, permit: '-1', roleId: '25'}, // リレーション削除
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02057'), name: EIMConstantService.PROC_DEFNAME_APPROVE, permit: '-1', roleId: '26'}, // 承認
		{dispName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02058'), name: EIMConstantService.PROC_DEFNAME_OPEN_READ, permit: '-1', roleId: '27'}, // 常時読取
	];


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorsSecurityService: EIMObjectEditorsSecurityService,
		protected objectEditorsEntryService: EIMObjectEditorsEntryService,
		public treeComponentService: EIMTreeComponentService,
	) {
		super();
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {

		// 呼び出し元に選択したセキュリティを返却する
		// 選択したセキュリティ情報を呼び出し元に通知
		let selectedData = this.securityTree.getSelectedData();
		this.selected.emit([{
			secId: selectedData[0].data.secId,
			secName: selectedData[0].data.secName,
		}]);
	}


	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return (this.securityTree
			&& this.securityTree.info
			&& this.securityTree.getSelectedData().length
			&& this.securityTree.getSelectedData()[0].data.secId > 0
			&& !this.isSelectedError);
	}


	/**
	 * セキュリティ一覧のデータを取得します.
	 */
	public getData(): any[] {
		return this.securityTree.getData();
	}


	/**
	 * セキュリティ一覧にデータを設定します.
	 * @param data セキュリティ
	 */
	public setData(data: any[]): void {
		this.securityTree.setData(data);
	}


	/**
	 * セキュリティ選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		return this.securityTree.getSelectedData();
	}


	/**
	 * 同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsAccessEntry(obj1: any, obj2: any): boolean {
		return (obj1.entryId === obj2.entryId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// アクセス権限一覧を初期表示
		this.initAccessRole();

		let nodes = [];
		// セキュリティ検索
		this.objectEditorsSecurityService.getSecurityList()
		.subscribe((secList: any[]) => {
			this.securityTree.setData(secList);
			this.isSelectedError = false;

			// デフォルト選択指定がある場合は選択
			if (this.secId) {
				let target = {data: {id: this.secId}};
				this.securityTree.select([target]);
			}

		}, (err: any) => {
			this.clearSecurity();
			this.isSelectedError = true;
		});

	}


	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {

		let columns: EIMDataGridColumn[] = [];

		columns = [];
		// 優先順位
		columns.push({field: 'priority', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02059'), width: 65, suppressFilter: true, suppressSorting: true});
		// タイプ
		columns.push({field: 'entryTypeName', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02060'), width: 100, suppressFilter: true, suppressSorting: true});
		// 名前
		columns.push({field: 'entryObjName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 255, suppressFilter: true, suppressSorting: true});
		this.accessEntryGrid.setColumns(columns);

	}

	/**
	 * セキュリティ選択イベントハンドラです.
	 * セキュリティに割り当てられたアクセスエントリ一覧を表示します.
	 * @param event イベント
	 */
	onSelectSecurity(event: any): void {

		// セキュリティを取得
		let selectedData: any[] = this.securityTree.getSelectedData();
		let secId = 0;
		if (selectedData && selectedData.length > 0) {
			secId = selectedData[0].data.secId;
		}
		if (selectedData[0].data.stSecId) {
			this.overwriteFlag = true;
		} else {
			this.overwriteFlag = false;
		}

		// アクセスエントリーリスト取得
		this.getAccessEntryList(secId);
	}


	/**
	 * アクセスエントリー選択イベントハンドラです.
	 * アクセスエントリーに割り当てられたアクセス権限一覧を表示します.
	 * @param event イベント
	 */
	onSelectAccessEntry(event: any): void {
		// 選択されたアクセスエントリー取得
		let selectedData: any[] = this.accessEntryGrid.getSelectedData();
		if (selectedData.length === 0) {
			this.selectedAccessEntryId = 0;
			// アクセス権限一覧を初期表示
			this.initAccessRole();
			return
		}

		// アクセス権限リスト取得
		let selectedAccessEntryId = selectedData[0].entryId;
		this.selectedAccessEntryId = selectedAccessEntryId;

		let stSecId = 0;
		let secSelectedData: any[] = this.securityTree.getSelectedData();
		if (secSelectedData[0].data.stSecId) {
			stSecId = secSelectedData[0].data.stSecId;
		}

		this.objectEditorsEntryService.getRoleListForStatusSec(selectedAccessEntryId, stSecId)
			.subscribe((roleDtoList: EIMRoleDTO[]) => {
				if (selectedAccessEntryId !== this.selectedAccessEntryId) {
					return;
				}
				this.accessRoleList = this.getAccessRoleList(roleDtoList);

			}, (err: any) => {
				// アクセス権限一覧を初期表示
				this.initAccessRole();
				this.isSelectedError = true;
			});

	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * セキュリティのアクセスエントリ一覧を表示します.
	 * @param secId セキュリティID
	 */
	private getAccessEntryList(secId: number): void {
		// アクセス権限一覧を初期表示
		this.initAccessEntryAndAccessRole();
		this.selectedSecurityId = secId;
		if (!secId) {
			return;
		}

		// アクセスエントリーリスト取得
		this.objectEditorsSecurityService.getEntryList(secId)
			.subscribe((data: any[]) => {
				if (this.selectedSecurityId !== secId) {
					return;
				}
				this.isSelectedError = false;
				this.accessEntryGrid.setData(data);
			}, (err: any) => {
				this.isSelectedError = true;
			});
	}


	/**
	 * アクセス権限一覧を取得します.
	 * @param roleDtoList アクセス権限リスト
	 */
	private getAccessRoleList(roleDtoList: EIMRoleDTO[]): any[] {
		let roleListDisp: EIMRoleDTO[] = [];

		if (roleDtoList && roleDtoList.length > 0) {
			let loopCnt = roleDtoList.length;
			let role: EIMRoleDTO;
			let procDefNameList: any = {};

			procDefNameList[EIMConstantService.PROC_DEFNAME_CREATE] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02042'), // 作成
			procDefNameList[EIMConstantService.PROC_DEFNAME_READ] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02043'); // 読み取り
			procDefNameList[EIMConstantService.PROC_DEFNAME_UPDATE] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02044'); // 変更
			procDefNameList[EIMConstantService.PROC_DEFNAME_DELETE] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02045'); // 削除
			procDefNameList[EIMConstantService.PROC_DEFNAME_RENAME] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02046'); // 改名
			procDefNameList[EIMConstantService.PROC_DEFNAME_LOCK] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02047'); // ロック
			procDefNameList[EIMConstantService.PROC_DEFNAME_UNLOCK] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02048'); // ロック解除
			procDefNameList[EIMConstantService.PROC_DEFNAME_CHECKIN] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02049'); // チェックイン
			procDefNameList[EIMConstantService.PROC_DEFNAME_CHECKOUT] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02050'); // チェックアウト
			procDefNameList[EIMConstantService.PROC_DEFNAME_STATUS_UP] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02051'); // ステータスUp
			procDefNameList[EIMConstantService.PROC_DEFNAME_STATUS_DOWN] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02052'); // ステータスDown
			procDefNameList[EIMConstantService.PROC_DEFNAME_REVISION_UP] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02053'); // リビジョンアップ
			procDefNameList[EIMConstantService.PROC_DEFNAME_CREATE_RELATION] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02054'); // リレーション作成
			procDefNameList[EIMConstantService.PROC_DEFNAME_UPDATE_RELATION] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02055'); // リレーション変更
			procDefNameList[EIMConstantService.PROC_DEFNAME_DELETE_RELATION] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02056'); // リレーション削除
			procDefNameList[EIMConstantService.PROC_DEFNAME_APPROVE] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02057'); // 承認
			procDefNameList[EIMConstantService.PROC_DEFNAME_OPEN_READ] = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02058'); // 常時読取

			for (let idx = 0; idx < loopCnt; idx++) {
				role = roleDtoList[idx];
				role.dispName = procDefNameList[role.name];
				roleListDisp.push(role);
			}
		}
		return roleListDisp;
	}


	/**
	 * セキュリティ一覧の表示をクリアします.
	 */
	private clearSecurity(): void {
		this.securityTree.setData([]);
	}


	/**
	 * アクセスエントリーとアクセス権限一覧を初期表示する
	 */
	private initAccessEntryAndAccessRole(): void {
		// クリア
		this.clearAccessEntry();
		// アクセス権限一覧を初期表示
		this.initAccessRole();
	}

	/**
	 * アクセスエントリーの表示をクリアします.
	 */
	private clearAccessEntry(): void {
		this.accessEntryGrid.setData([]);
	}

	/**
	 * アクセス権限一覧を初期化する
	 */
	private initAccessRole(): void {
		this.accessRoleList = this.accessRoleInitList;
	}

}
