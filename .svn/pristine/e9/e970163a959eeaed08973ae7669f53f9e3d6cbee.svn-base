import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMSecurityService, EIMSecurity, EIMEntry } from 'app/documents/shared/services/apis/security.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { map } from 'rxjs';
import { BlockUI } from 'primeng/blockui';

/**
 * セキュリティ選択コンポーネント
 * @example
 *
 *      <eim-security-selector
 *          [content]="content"
 *          [displaySearch]="true"
 *          [blockFlag]="false"
 *      </eim-security-selector>
 */
@Component({
    selector: 'eim-security-selector',
    templateUrl: './security-selector.component.html',
    styleUrls: ['./security-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMSecuritySelectorComponent) }],
    standalone: false
})
export class EIMSecuritySelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMComponent, EIMSelectable, AfterViewInit {

	@ViewChild('securityGrid')
		securityGrid: EIMDataGridComponent;

	@ViewChild('accessEntryGrid', { static: true })
		accessEntryGrid: EIMDataGridComponent;

	/** BlockUIアクセスエントリー */
	@ViewChild('entryPnlBlock', {static: true}) entryPnlBlock: BlockUI;

	/** BlockUIアクセス権限 */
	@ViewChild('authPnlBlock', {static: true}) authPnlBlock: BlockUI;

	/** セキュリティ適用対象のワークスペース情報、またはフォルダ情報 */
	@Input() content: any;

	/** セキュリティ検索ペインを表示するかどうか（デフォルト：表示する） */
	@Input() displaySearch = true;

	/** ブロック処理を行うかどうか（デフォルト：行わない） */
	@Input() blockFlag = false;

	/** データグリッド名前欄width値（デフォルトWidth：275） */
	@Input() entryNameWidth = 275;

	/** セキュリティ選択処理完了のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 検索条件 */
	private securityName: string = null;

	/** アクセス権限初期表示用 */
	private INIT_ACCESS_ROLE_LIST: any[] = [
	  // 作成
		{dispName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02009'), name: 'CREATE', permit: '-1', roleId: '11'},
		// ステータスアップ
		{dispName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02011'), name: 'STATUS_UP', permit: '-1', roleId: '41'},
		// 常時読取
		{dispName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02012'), name: 'ROLE_500', permit: '-1', roleId: '500'},
		// 読み取り
		{dispName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02010'), name: 'READ', permit: '-1', roleId: '12'},
	];
	/** アクセス権限のクラス（画面表示用） */
	public accessEntryClass: string;

	/** アクセス権限 */
	public accessRoleList: any[] = this.INIT_ACCESS_ROLE_LIST;

	public disabled = false;

	/** 選択対象がエラーかどうか */
	private isSelectedError = false;

	/** 選択セキュリティID */
	private selectedSecurityId = 0;

	/** 選択アクセスエントリーID */
	private selectedAccessEntryId = 0;

	/** 初期検索フラグ */
	private initFlag = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected securityService: EIMSecurityService,
	) {
		super();
		this.securityName = '';

		window.setTimeout(() => {
			this.entryPnlBlock.blocked = this.entryPnlBlock.blocked;
			this.authPnlBlock.blocked = this.authPnlBlock.blocked;
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 * @param secId セキュリティID
	 */
	public show(secId: number): Observable<any> {
		// アクセスロールリストを初期化する
		this.accessRoleList = this.INIT_ACCESS_ROLE_LIST;
		// アクセスエントリーグリッドを初期化する
		this.accessEntryGrid.setData([]);

		// アクセスエントリーリスト取得
		return this.securityService.getEntryList(secId)
			.pipe(map((data: EIMEntry[]) => {
				this.accessEntryGrid.setData(data);
				return data;
			}));
	}

	public showInit(): void {
				// アクセスロールリストを初期化する
				this.accessRoleList = this.INIT_ACCESS_ROLE_LIST;
				// アクセスエントリーグリッドを初期化する
				this.accessEntryGrid.setData([]);
	}

	/**
	 * セキュリティ選択イベントハンドラです.
	 * セキュリティに割り当てられたアクセスエントリ一覧を表示します.
	 */
	public showBySecurityId(secId: number) {
		// クリア
		this.clearAccessEntryAndAccessRole();

		// アクセスエントリーリスト取得
		this.securityService.getEntryList(secId)
			.subscribe((data: EIMEntry[]) => {
				this.isSelectedError = false;
				this.accessEntryGrid.setData(data);
			}, (err: any) => {
				this.isSelectedError = true;
			});
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
	public getData(): EIMSecurity[] {
		return this.securityGrid.getData();
	}

	/**
	 * セキュリティ一覧にデータを設定します.
	 * @param data セキュリティ
	 */
	public setData(data: EIMSecurity[]): void {
		this.securityGrid.setData(data);
	}

	/**
	 * セキュリティ選択情報を取得します.
	 */
	public getSelectedData(): EIMSecurity[] {
		return this.securityGrid.getSelectedData();
	}

	/**
	 * アクセスエントリーグリッドの行比較関数です.
	 */
	public equalsAccessEntry(checkTargetData: any, selectData: any) {
		return (checkTargetData.entryId === selectData.entryId);
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

			let keyword = '';
			let objId: number = null;
			if (typeof this.content !== 'undefined' && this.content.objId > 0) {
				objId = this.content.objId;
			}
			this.securityService.getSecurityList(true, keyword, objId)
			.subscribe((data: EIMSecurity[]) => {
				this.initFlag = false;
				this.securityGrid.setData(data);
			});
		} else {
			this.accessEntryClass = 'eim-access-entry-without-security';
		}

	}

	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit() {

		let columns: EIMDataGridColumn[] = [];
		if (this.displaySearch) {
			let dgColumns: EIMDataGridColumn[] = [];
			// 名前
			columns.push({field: 'secName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 256, suppressFilter: true});
			this.securityGrid.setColumns(columns);
		}

		columns = [];
		// 優先順位
		columns.push({field: 'priority', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02002'), width: 65, suppressFilter: true, suppressSorting: true});
		// タイプ
		columns.push({field: 'entryTypeName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02001'), width: 130, suppressFilter: true, suppressSorting: true});
		// 名前
		columns.push({field: 'entryObjName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: this.entryNameWidth, suppressFilter: true, suppressSorting: true});
		this.accessEntryGrid.setColumns(columns);

	}

	/**
	 * セキュリティ検索ボタン押下イベントハンドラです.
	 * 検索条件に合致するセキュリティ一覧を表示します.
	 */
	onSearchSecurity(): void {

		let keyword: string = '';
		if (this.securityName && this.securityName.length > 0) {
			keyword = this.securityName;
		}

		// クリア
		this.clearAccessEntryAndAccessRole();
		// セキュリティ検索
		let objId = 0;
			// objIdに値ありの場合
		if (typeof this.content !== 'undefined' && this.content.objId > 0) {
			objId = this.content.objId;
		}
		this.securityService.getSecurityList(this.initFlag, keyword, objId)
		.subscribe((data: EIMSecurity[]) => {
			this.initFlag = false;
			this.securityGrid.setData(data);
		});
	}

	/**
	 * セキュリティ選択イベントハンドラです.
	 * セキュリティに割り当てられたアクセスエントリ一覧を表示します.
	 */
	onSelectSecurity(event: any[]) {

		let selectedData: EIMSecurity[] = this.securityGrid.getSelectedData();
		// クリア
		this.clearAccessEntryAndAccessRole();
		if (selectedData.length === 0) {
			this.selectedSecurityId = 0;
			return
		}

		let selectedSecurityId = selectedData[0].secId;
		this.selectedSecurityId = selectedSecurityId;
		// アクセスエントリーリスト取得
		this.securityService.getEntryList(selectedData[0].secId)
			.subscribe((data: EIMEntry[]) => {
				if (this.selectedSecurityId !== selectedSecurityId) {
					return;
				}
				this.isSelectedError = false;
				this.accessEntryGrid.setData(data);
			}, (err: any) => {
				this.isSelectedError = true;
			});
	}

	/**
	 * アクセスエントリー選択イベントハンドラです.
	 * アクセスエントリーに割り当てられたアクセス権限一覧を表示します.
	 */
	onSelectAccessEntry(event: any[]) {

		let selectedData: EIMEntry[] = this.accessEntryGrid.getSelectedData();

		if (selectedData.length === 0) {
			this.selectedAccessEntryId = 0;
			this.clearAccessRole();
			return
		}

		// アクセスロールリスト取得
		let selectedAccessEntryId = selectedData[0].entryId;
		this.selectedAccessEntryId = selectedAccessEntryId;
		this.securityService.getRoleList(selectedAccessEntryId)
			.subscribe((object: any) => {
				if (selectedAccessEntryId !== this.selectedAccessEntryId) {
					return;
				}
				this.accessRoleList = object;
				// 並び順を設定する(上から、作成、ステータスup、常時読取、読み取り)
				this.accessRoleList.forEach( (item: any) => {
					switch (Number(item.roleId)) {
						case EIMDocumentsConstantService.ACCESS_ROLE_ID_CREATE:
							item._pos = 1;
							item.dispName = this.translateService.instant('EIM_DOCUMENTS.LABEL_02009');
							break;
						case EIMDocumentsConstantService.ACCESS_ROLE_ID_STATUS_UP:
							item._pos = 2;
							item.dispName = this.translateService.instant('EIM_DOCUMENTS.LABEL_02011');
							break;
						case EIMDocumentsConstantService.ACCESS_ROLE_ID_ALWAYS_READ:
							item._pos = 3;
							item.dispName = this.translateService.instant('EIM_DOCUMENTS.LABEL_02012');
							break;
						case EIMDocumentsConstantService.ACCESS_ROLE_ID_READ:
							item._pos = 4;
							item.dispName = this.translateService.instant('EIM_DOCUMENTS.LABEL_02010');
							break;
						default:
							item._pos = 9;
					}
				});
				// 並び順の昇順でソートする
				this.accessRoleList = this.accessRoleList.sort( (item1: any, item2: any) => {
					if (item1._pos < item2._pos) {
						return -1;
					} else if (item1._pos > item2._pos) {
						return 1;
					} else {
						return 0;
					}
				});

			}, (err: any) => {
				// アクセスロールの表示をクリアする.
				this.clearAccessRole();
			});

	}

	/**
	 * キーダウンの処理です.
	 * @param event
	 */
	onKeyDown(event: any): void {

		let keyCode: number = event.keyCode;
		// Endキー、Homeキー、←↑→↓キーでのラジオボタン間選択移動を禁止する
		if (35 <= keyCode && keyCode <= 40) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 * アクセスエントリーとアクセスロールの表示をクリアします.
	 */
	public clearAccessEntryAndAccessRole(): void {
		this.clearAccessEntry();
		this.clearAccessRole();
	}

	/**
	 * アクセスエントリーの表示をクリアします.
	 */
	private clearAccessEntry(): void {
		// アクセスエントリーグリッドを初期化する
		this.accessEntryGrid.setData([]);
	}

	/**
	 * アクセスロールの表示をクリアします.
	 */
	private clearAccessRole(): void {
		// アクセスロールリストを初期化する
		this.accessRoleList = this.INIT_ACCESS_ROLE_LIST;

	}

}
