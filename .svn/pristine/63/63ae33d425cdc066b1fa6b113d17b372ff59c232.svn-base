import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { EIMSecurityDTO } from 'app/admins/shared/dtos/security.dto';

/**
 * セキュリティ選択コンポーネント(システム管理側)
 * @example
 *
 *      <eim-admin-security-selector
*           [adminAppId]="adminAppId"
 *          [displaySearch]="true"
 *          [blockFlag]="false"
 *      </eim-admin-security-selector>
 */
@Component({
  selector: 'eim-admin-security-selector',
  templateUrl: './admin-security-selector.component.html',
  styleUrls: ['./admin-security-selector.component.css'],
  providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMAdminSecuritySelectorComponent)}],
  standalone: false,
})
export class EIMAdminSecuritySelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMComponent, EIMSelectable, AfterViewInit {
	/** セキュリティデータグリッド */
	@ViewChild('securityGrid') public securityGrid: EIMDataGridComponent;

	/** アクセスエントリーデータグリッド */
	@ViewChild('accessEntryGrid', { static: true }) public accessEntryGrid: EIMDataGridComponent;

	/** システム管理区分 */
	@Input() public adminAppId: string;

	/** セキュリティ検索ペインを表示するかどうか（デフォルト：表示する） */
	@Input() public displaySearch = true;

	/** ブロック処理を行うかどうか（デフォルト：行わない） */
	@Input() public blockFlag = false;

	/** データグリッド名前欄width値（デフォルトWidth：255） */
	@Input() public entryNameWidth = 255;

	/** セキュリティ選択処理完了のイベントエミッタ */
	@Output() public selected: EventEmitter<EIMSecurityDTO[]> = new EventEmitter<EIMSecurityDTO[]>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 検索条件 */
	private securityName: string = null;

	/** アクセス権限のクラス（画面表示用） */
	public accessEntryClass: string;

	/** アクセス権限一覧 */
	public accessRoleList: any[] = [];

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** 選択対象がエラーかどうか */
	public isSelectedError = false;

	/** 選択セキュリティID */
	private selectedSecurityId = 0;

	/** 選択アクセスエントリーID */
	private selectedAccessEntryId = 0;

	/** アクセス権限一覧初期表示用(システム管理_帳票) */
	private accessRoleListInitForm: any[] = [
	  // 参照
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02040'), name: EIMAdminsConstantService.PROC_DEFNAME_READ, permit: '-1', roleId: '11'},
		// 編集
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02041'), name: EIMAdminsConstantService.PROC_DEFNAME_UPDATE, permit: '-1', roleId: '12'},
		// ステータス変更
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02045'), name: EIMAdminsConstantService.PROC_DEFNAME_APPROVE, permit: '-1', roleId: '13'},
		// 作成
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02042'), name: EIMAdminsConstantService.PROC_DEFNAME_CREATE, permit: '-1', roleId: '14'},
	];

	/** アクセス権限一覧初期表示用(システム管理_ドキュメント) */
	private accessRoleListInitDocument: any[] = [
	  // 作成
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02036'), name: EIMAdminsConstantService.PROC_DEFNAME_CREATE, permit: '-1', roleId: '11'},
		// ステータスアップ
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02045'), name: EIMAdminsConstantService.PROC_DEFNAME_STATUS_UP, permit: '-1', roleId: '12'},
		// 常時読取
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02038'), name: EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ, permit: '-1', roleId: '13'},
		// 読み取り
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02039'), name: EIMAdminsConstantService.PROC_DEFNAME_READ, permit: '-1', roleId: '14'},
	];

	/** アクセス権限一覧初期表示用(システム管理_ドキュメント) */
	private accessRoleListInitGeneral: any[] = [
	  // 作成
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02140'), name: EIMAdminsConstantService.PROC_DEFNAME_CREATE, permit: '-1', roleId: '11'},
		// 読み取り
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02141'), name: EIMAdminsConstantService.PROC_DEFNAME_READ, permit: '-1', roleId: '12'},
		// 変更
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02142'), name: EIMAdminsConstantService.PROC_DEFNAME_UPDATE, permit: '-1', roleId: '13'},
		// 削除
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02143'), name: EIMAdminsConstantService.PROC_DEFNAME_DELETE, permit: '-1', roleId: '14'},
		// 改名
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02144'), name: EIMAdminsConstantService.PROC_DEFNAME_RENAME, permit: '-1', roleId: '15'},
		// ロック
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02145'), name: EIMAdminsConstantService.PROC_DEFNAME_LOCK, permit: '-1', roleId: '16'},
		// ロック解除
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02146'), name: EIMAdminsConstantService.PROC_DEFNAME_UNLOCK, permit: '-1', roleId: '17'},
		// チェックイ
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02147'), name: EIMAdminsConstantService.PROC_DEFNAME_CHECKIN, permit: '-1', roleId: '18'},
		// チェックアウト
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02148'), name: EIMAdminsConstantService.PROC_DEFNAME_CHECKOUT, permit: '-1', roleId: '19'},
		// ステータスUp
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02149'), name: EIMAdminsConstantService.PROC_DEFNAME_STATUS_UP, permit: '-1', roleId: '20'},
		// ステータスDown
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02150'), name: EIMAdminsConstantService.PROC_DEFNAME_STATUS_DOWN, permit: '-1', roleId: '21'},
		// リビジョンアップ
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02151'), name: EIMAdminsConstantService.PROC_DEFNAME_REVISION_UP, permit: '-1', roleId: '22'},
		// リレーション作成
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02152'), name: EIMAdminsConstantService.PROC_DEFNAME_CREATE_RELATION, permit: '-1', roleId: '23'},
		// リレーション変更
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02153'), name: EIMAdminsConstantService.PROC_DEFNAME_UPDATE_RELATION, permit: '-1', roleId: '24'},
		// リレーション削除
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02154'), name: EIMAdminsConstantService.PROC_DEFNAME_DELETE_RELATION, permit: '-1', roleId: '25'},
		// 承認
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02155'), name: EIMAdminsConstantService.PROC_DEFNAME_APPROVE, permit: '-1', roleId: '26'},
		// 常時読取
		{dispName: this.translateService.instant('EIM_ADMINS.LABEL_02156'), name: EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ, permit: '-1', roleId: '27'},
	];


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected adminsSecurityService: EIMAdminsSecurityService,
	) {
		super();
		this.securityName = '';
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 * @param secId セキュリティID
	 * @param adminAppId システム管理区分
	 */
	public show(secId: number, adminAppId?: string): void {
		// アクセス権限一覧を初期表示
		if (adminAppId) {
			this.adminAppId = adminAppId;
		}
		this.initAccessRole();
		// アクセスエントリーリスト取得
		this.getAccessEntryList(secId);

	}


	/**
	 * セキュリティ選択イベントハンドラです.
	 * セキュリティに割り当てられたアクセスエントリ一覧を表示します.
	 */
	public showBySecurityId(secId: number): void {

		// アクセスエントリーリスト取得
		this.getAccessEntryList(secId);

	}


	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {

		// 呼び出し元に選択したセキュリティを返却する
		// 選択したセキュリティ情報を呼び出し元に通知
		this.selected.emit(this.securityGrid.getSelectedData());
	}


	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return (this.securityGrid && this.securityGrid.getSelectedData().length === 1 && !this.isSelectedError);
	}


	/**
	 * セキュリティ一覧のデータを取得します.
	 */
	public getData(): any[] {
		return this.securityGrid.getData();
	}


	/**
	 * セキュリティ一覧にデータを設定します.
	 * @param data セキュリティ
	 */
	public setData(data: any[]): void {
		this.securityGrid.setData(data);
	}


	/**
	 * セキュリティ選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		return this.securityGrid.getSelectedData();
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
		if (this.displaySearch) {
			this.accessEntryClass = 'eim-access-entry';
		} else {
			this.accessEntryClass = 'eim-access-entry-without-security';
		}
		// アクセス権限一覧を初期表示
		this.initAccessRole();
	}


	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {

		let columns: EIMDataGridColumn[] = [];
		if (this.displaySearch) {
			let dgColumns: EIMDataGridColumn[] = [];
			// 名前
			columns.push({field: 'secName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 254, suppressFilter: true, suppressSorting: true});
			this.securityGrid.setColumns(columns);
		}

		columns = [];
		// 優先順位
		columns.push({field: 'priority', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02019'), width: 65, suppressFilter: true, suppressSorting: true});
		// タイプ
		columns.push({field: 'entryTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02020'), width: 100, suppressFilter: true, suppressSorting: true});
		// 名前
		columns.push({field: 'entryName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: this.entryNameWidth, suppressFilter: true, suppressSorting: true});
		this.accessEntryGrid.setColumns(columns);

	}


	/**
	 * セキュリティ検索ボタン押下イベントハンドラです.
	 * 検索条件に合致するセキュリティ一覧を表示します.
	 */
	onSearchSecurity(event: any): void {
		// 初期表示
		this.initAccessEntryAndAccessRole();
		let keyword = this.securityName;
		// セキュリティ検索
		this.adminsSecurityService.getSecurityList(false, keyword, null)
			.subscribe((securityDtoList: EIMSecurityDTO[]) => {
			// セキュリティ一覧データを設定
			this.securityGrid.setData(securityDtoList);
			this.isSelectedError = false;
		}, (err: any) => {
			this.clearSecurity();
			this.isSelectedError = true;
		});

	}


	/**
	 * セキュリティ選択イベントハンドラです.
	 * セキュリティに割り当てられたアクセスエントリ一覧を表示します.
	 * @param event イベント
	 */
	onSelectSecurity(event: any): void {

		// セキュリティを取得
		let selectedData: any[] = this.securityGrid.getSelectedData();
		let secId = 0;
		if (selectedData && selectedData.length > 0) {
			secId = selectedData[0].secId;
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
		this.adminsSecurityService.getRoleList(selectedAccessEntryId)
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
		if (secId === 0) {
			return;
		}

		// アクセスエントリーリスト取得
		this.adminsSecurityService.getEntryList(secId)
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
			// システム管理（帳票）
			if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
				for (let idx = 0; idx < loopCnt; idx++) {
					role = roleDtoList[idx];
					if (EIMAdminsConstantService.PROC_DEFNAME_READ === role.name) {
						role.dispOrder = 1;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02040');
						roleListDisp.push(role);
						continue;
					}
					if (EIMAdminsConstantService.PROC_DEFNAME_UPDATE === role.name) {
						role.dispOrder = 2;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02041');
						roleListDisp.push(role);
						continue;
					}
					if (EIMAdminsConstantService.PROC_DEFNAME_APPROVE === role.name) {
						role.dispOrder = 3;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02045');
						roleListDisp.push(role);
						continue;
					}
					if (EIMAdminsConstantService.PROC_DEFNAME_CREATE === role.name) {
						role.dispOrder = 4;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02042');
						roleListDisp.push(role);
						continue;
					}

				}
			}
			// システム管理（ドキュメント）の場合
			if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
				for (let idx = 0; idx < loopCnt; idx++) {
						role = roleDtoList[idx];
					if (EIMAdminsConstantService.PROC_DEFNAME_CREATE === role.name) {
						role.dispOrder = 1;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02036');
						roleListDisp.push(role);
						continue;
					}
					if (EIMAdminsConstantService.PROC_DEFNAME_STATUS_UP === role.name) {
						role.dispOrder = 2;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02045');
						roleListDisp.push(role);
						continue;
					}
					if (EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ === role.name) {
						role.dispOrder = 3;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02038');
						roleListDisp.push(role);
						continue;
					}
					if (EIMAdminsConstantService.PROC_DEFNAME_READ === role.name) {
						role.dispOrder = 4;
						role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02039');
						roleListDisp.push(role);
						continue;
					}
				}
			}

			// システム管理（汎用）の場合
			if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
				let procDefNameList: any = {};
				// 作成
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_CREATE] = this.translateService.instant('EIM_ADMINS.LABEL_02140'),
				// 読み取り
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_READ] = this.translateService.instant('EIM_ADMINS.LABEL_02141');
				// 変更
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_UPDATE] = this.translateService.instant('EIM_ADMINS.LABEL_02142');
				// 削除
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_DELETE] = this.translateService.instant('EIM_ADMINS.LABEL_02143');
				// 改名
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_RENAME] = this.translateService.instant('EIM_ADMINS.LABEL_02144');
				// ロック
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_LOCK] = this.translateService.instant('EIM_ADMINS.LABEL_02145');
				// ロック解除
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_UNLOCK] = this.translateService.instant('EIM_ADMINS.LABEL_02146');
				// チェックイン
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_CHECKIN] = this.translateService.instant('EIM_ADMINS.LABEL_02147');
				// チェックアウト
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_CHECKOUT] = this.translateService.instant('EIM_ADMINS.LABEL_02148');
				// ステータスUp
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_STATUS_UP] = this.translateService.instant('EIM_ADMINS.LABEL_02149');
				// ステータスDown
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_STATUS_DOWN] = this.translateService.instant('EIM_ADMINS.LABEL_02150');
				// リビジョンアップ
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_REVISION_UP] = this.translateService.instant('EIM_ADMINS.LABEL_02151');
				// リレーション作成
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_CREATE_RELATION] = this.translateService.instant('EIM_ADMINS.LABEL_02152');
				// リレーション変更
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_UPDATE_RELATION] = this.translateService.instant('EIM_ADMINS.LABEL_02153');
				// リレーション削除
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_DELETE_RELATION] = this.translateService.instant('EIM_ADMINS.LABEL_02154');
				// 承認
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_APPROVE] = this.translateService.instant('EIM_ADMINS.LABEL_02155');
				// 常時読取
				procDefNameList[EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ] = this.translateService.instant('EIM_ADMINS.LABEL_02156');

				for (let idx = 0; idx < loopCnt; idx++) {
					role = roleDtoList[idx];
					role.dispName = procDefNameList[role.name];
					roleListDisp.push(role);
				}
			}
		}

		if (this.adminAppId !== EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
				// ソート
				roleListDisp.sort(
					function(role1, role2) {
						if (role1.dispOrder < role2.dispOrder ) {
							return -1;
						}
						if (role1.dispOrder > role2.dispOrder ) {
							return 1;
						}
							return 0;
					}
				);
		}
		return roleListDisp;
	}


	/**
	 * セキュリティ一覧の表示をクリアします.
	 */
	private clearSecurity(): void {
		// セキュリティ一覧グリッドを初期化する
		this.securityGrid.setData([]);
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
		// アクセスエントリーグリッドを初期化する
		this.accessEntryGrid.setData([]);
	}

	/**
	 * アクセス権限一覧を初期化する
	 */
	private initAccessRole(): void {
		// アクセス権限一覧を初期化する
		if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM) {
			// システム管理（帳票）
			this.accessRoleList = this.accessRoleListInitForm;

		} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
			// システム管理（汎用）の場合
			this.accessRoleList = this.accessRoleListInitGeneral;
		} else {
			// システム管理（ドキュメント）:デフォルト値
			this.accessRoleList = this.accessRoleListInitDocument;
		}
	}

}
