import { Component, ViewChild, forwardRef, OnInit, SimpleChanges, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';

import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';
import { EIMRevisionHistoryService, EIMHierarchicalRevisionHistory } from 'app/documents/shared/services/apis/revision-history.service';
import { EIMRevisionHistoryDiagramComponentService } from 'app/documents/components/revision-history-diagram/revision-history-diagram.component.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMPublicFileCompareExecutorComponent } from 'app/documents/components/public-file-compare-executor/public-file-compare-executor.component';
import { EIMPublicFileRendererComponent } from 'app/documents/shared/components/renderer/public-file-renderer.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMSignEncryptionRendererComponent } from 'app/documents/shared/components/renderer/sign-encription-cell-renderer.component';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 改訂履歴コンポーネント
 * @example
 *
 *      <eim-revision-history
 *          [content]="content">
 *      </eim-revision-history>
 */
@Component({
    selector: 'eim-revision-history',
    templateUrl: './revision-history.component.html',
    styleUrls: ['./revision-history.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMRevisionHistoryComponent) }],
    standalone: false
})
export class EIMRevisionHistoryComponent implements OnInit, OnChanges, OnDestroy {

	/** 左ペインのダイアグラム */
	@ViewChild('revisionHistoryDiagram', { static: true })
		revisionHistoryDiagram: EIMDiagramComponent;

	/** 右ペインの一覧表示 */
	@ViewChild('revisionHistoryDataGrid', { static: true })
		revisionHistoryDataGrid: EIMDataGridComponent;

	/** 表示対象のオブジェクト */
	@Input() content: any;

	/** リビジョンコピーイベントエミッタ */
	@Output() copyRevision: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新完了時のイベントエミッタ. */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** ダイアグラム表示タイプ */
	public displayTypes: SelectItem[] = [
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03027'), value: 0},
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03028'), value: 1}
	];
	/** 選択されているダイアグラム表示タイプのID */
	public selectedDisplayTypeId = EIMConstantService.DISPLAY_TEXTEXCERPT;
	/** 前回選択されたダイアグラム表示タイプのID */
	public oldSelectedDisplayTypeId = EIMConstantService.DISPLAY_TEXTEXCERPT;

	/** リンク先表示フラグ */
	public linkDisplayFlag = false;

	/** リンク先更新データ */
	public updatedData = [];

	/** 公開ファイル結合用データグリッドID */
	protected compareDialogId: string;

	// メニュー定義
	// ブランチコピー
	private menuCopyRevision: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03008'), icon: 'eim-icon-branch-copy', disabled: true, command: (event) => { this.onClickCopyRevision(event); }};
	// プロパティ
	private menuProperty: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'), icon: 'eim-icon-list', disabled: true, command: (event) => { this.onClickProperty(event); }};
	// 回付状況/履歴
	private menuStatusProperty: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03048'), icon: 'fa-fw fa fa-history eim-icon-history-color-gray', disabled: true, command: (event) => { this.onClickStatusProperty(event); }};
	// 公開ファイル比較
	private menuPublicFileCompare: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_01038'), icon: 'fa-fw fa eim-icon-public-file ng-star-inserted', disabled: true, command: (event) => { this.onClickPublicFileCompare(event); }};
	// 比較元ドキュメント選択
	private menuItemSourceDocument: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03113'), icon: 'eim-icon-checkout', disabled: false, command: (event) => {this.clickItemSourceDocument(event); }};
	// 比較先ドキュメント選択
	private menuItemDestinationDocument: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03114'), icon: 'eim-icon-checkout', disabled: false, command: (event) => {this.clickItemDestinationDocument(event); }};
	// リンク先更新
	private menuItemLinkUpdate: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03090'), icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', disabled: false, command: (event) => {this.clickItemLinkUpdate(event); }};
	// リンク設定
	private menuItemShowLinkUpdator: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03066'), icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', disabled: false, command: (event) => {this.onClickShowLinkUpdator(event); }};
	// セパレータ
	private menuItemSeparator: EIMMenuItem = { separator: true };

	// メインメニュー 編集
	private menulistEdit: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03026'),
			icon: 'eim-icon-pencil',
			items: [
				this.menuCopyRevision,
				this.menuItemSeparator,
				this.menuItemShowLinkUpdator,
				this.menuItemLinkUpdate,
				this.menuItemSeparator,
				this.menuPublicFileCompare,
			]
		};
	// メインメニュー プロパティ
	private menulistProperty: EIMMenuItem =
		{
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'),
			icon: 'eim-icon-list',
			items: [
				this.menuProperty,
				this.menuStatusProperty,
			]
		};

	// メインメニュー
	public menuItems: MenuItem[] = [
		this.menulistEdit,
		this.menulistProperty,
	];

	// 履歴ビューの右クリックメニュー
	public dialogContextMenuItems: EIMMenuItem[] = [
		this.menuCopyRevision,
		this.menuProperty,
		this.menuStatusProperty,
		this.menuPublicFileCompare
	];
	// グリッドの右クリックメニュー
	public gridContextMenuItems: EIMMenuItem[] = [
		this.menuCopyRevision,
		this.menuItemSeparator,
		this.menuItemShowLinkUpdator,
		this.menuItemLinkUpdate,
		this.menuItemSeparator,
		this.menuPublicFileCompare,
		this.menuItemSeparator,
		this.menuProperty,
		this.menuStatusProperty,
	];

	// 公開ファイルダイアログ表示中のメニュー
	public showPublicFileCompareMenuItems: EIMMenuItem[] = [
		this.menuItemSourceDocument,
		this.menuItemDestinationDocument
	];

	/** 表示対象のオブジェクトまでの改訂履歴ルート */
	private historyListForTargetRoute: EIMHierarchicalRevisionHistory[];
	/** 表示対象のオブジェクトを含む全改訂履歴ルート */
	private historyListForAllRoute: EIMHierarchicalRevisionHistory[];
	// 公開ファイルダイアログ表示中フラグ
	private isShowPublicFileCompareDialog = false;
	/** 場所クリック時のサブスクリプション */
	private placeRendererComponentServicePlaceClicked?: Subscription;
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected dateService: EIMDateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected contentsNameRenameGeneralPipe: EIMContentsNameRenameGeneralPipe,
		protected revisionHistoryService: EIMRevisionHistoryService,
		public revisionHistoryDiagramComponentService: EIMRevisionHistoryDiagramComponentService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected documentFormService: EIMDocumentFormService,
		protected contentsService: EIMContentsService,
		protected serverConfigService: EIMServerConfigService,
	) {
		// 公開ファイル比較オプションがOFFの場合はメニューに表示しない
		if (!this.serverConfigService.pdfCompareFlg) {
			this.menulistEdit.items.splice(4, 2);
			this.dialogContextMenuItems.splice(3, 1);
			this.gridContextMenuItems.splice(5, 2);
		}
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
  /**
	 * 画面を表示します.
	 */
	public show(): void {
		// 改訂履歴取得
		this.revisionHistoryService.getHierarchical(this.content.objId).subscribe(
			(hierarchicalRevisionHistory: EIMHierarchicalRevisionHistory) => {
				let workList: EIMHierarchicalRevisionHistory[] = <EIMHierarchicalRevisionHistory[]>this.hierarchicalDomainService.getList([hierarchicalRevisionHistory]);
				let historyList: EIMHierarchicalRevisionHistory[] = [];
				for (let i = 0; i < workList.length; i++) {
					// ドキュメントリンクは除く
					if (workList[i].isDocumentLink === false) {
						workList[i]['objTypeName'] = this.contentsNameRenameGeneralPipe.transform(workList[i].objTypeName);
						workList[i]['revisionHistory'] = true;
						historyList.push(workList[i]);
					}
				}
				historyList.sort((a: EIMHierarchicalRevisionHistory, b: EIMHierarchicalRevisionHistory): number => {
						// ID逆順にソート
						return -(a.objId - b.objId);
				});
				this.revisionHistoryDataGrid.setData(historyList);
				let diagramData: EIMDiagramElement[] = this.revisionHistoryDiagram.createDiagramElement(historyList);
				this.revisionHistoryDiagram.setData(diagramData);

				this.historyListForTargetRoute = historyList;
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}

	/**
	 * ダイアグラム表示タイプ変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangeDisplayType(event: any): void {
		// PrimeNGのSelectButtonのonChangeイベントは変更がなくてもイベントを生成する
		// そのため自前で変更の有無を判定する
		if (this.oldSelectedDisplayTypeId === this.selectedDisplayTypeId) {
			// 変更がなければ何もしない
			return;
		}
		this.oldSelectedDisplayTypeId = this.selectedDisplayTypeId;

		let diagramList: EIMHierarchicalRevisionHistory[] = [];
		if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_LIST && !this.historyListForAllRoute) {
			// 全表示
			let rootObjId: number =	(<EIMHierarchicalRevisionHistory>this.hierarchicalDomainService.getRoot(this.historyListForTargetRoute[0])).objId;
			this.revisionHistoryService.getAllHierarchical(this.content.objId, rootObjId).subscribe(
				(hierarchicalRevisionHistory: EIMHierarchicalRevisionHistory) => {
					let workList: EIMHierarchicalRevisionHistory[] = <EIMHierarchicalRevisionHistory[]>this.hierarchicalDomainService.getList([hierarchicalRevisionHistory]);
					let historyList: EIMHierarchicalRevisionHistory[] = [];
					for (let i = 0; i < workList.length; i++) {
						// リンク先表示ONの場合ドキュメントリンクを表示する
						if (this.linkDisplayFlag) {
							workList[i]['objTypeName'] = this.contentsNameRenameGeneralPipe.transform(workList[i].objTypeName);
							workList[i]['revisionHistory'] = true;
							historyList.push(workList[i]);
						} else {
							if (workList[i].isDocumentLink === false) {
								workList[i]['objTypeName'] = this.contentsNameRenameGeneralPipe.transform(workList[i].objTypeName);
								workList[i]['revisionHistory'] = true;
								historyList.push(workList[i]);
							}
						}
					}
					historyList.sort((a: EIMHierarchicalRevisionHistory, b: EIMHierarchicalRevisionHistory): number => {
							// ID逆順にソート
							return -(a.objId - b.objId);
						});
					this.addRevisionHistoryToDataGrid(historyList);

					this.filter(historyList);

					for (let i = 0; i < historyList.length; i++) {
						if (!historyList[i].isDocumentLink) {
							diagramList.push(historyList[i]);
						}
					}
					let diagramData: EIMDiagramElement[] = this.revisionHistoryDiagram.createDiagramElement(diagramList);
					this.revisionHistoryDiagram.setData(diagramData);
					this.historyListForAllRoute = historyList;

					// 合計数、選択数を更新
					this.updateRowCountAndSelectedData(this.revisionHistoryDataGrid.info);
				}
			);
		} else {
			let historyList: EIMHierarchicalRevisionHistory[];
			if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				historyList = this.historyListForTargetRoute;
				this.filter(this.getUnvisibleData());
			} else {
				historyList = this.historyListForAllRoute;
				this.filter([]);
			}
			for (let i = 0; i < historyList.length; i++) {
				if (!historyList[i].isDocumentLink) {
					diagramList.push(historyList[i]);
				}
			}
			let diagramData: EIMDiagramElement[] = this.revisionHistoryDiagram.createDiagramElement(diagramList);
			this.revisionHistoryDiagram.setData(diagramData);

			// 合計数、選択数を更新
			this.updateRowCountAndSelectedData(this.revisionHistoryDataGrid.info);
		}
	}

	/**
	 * 左ペインのダイアグラム選択変更時のイベントハンドラです.
	 * 対応する右ペインの一覧表示の行を選択します.
	 * @param event イベント
	 */
	public onChangeDiagram(event: any): void {
		let selectedElement: EIMDiagramNode[] = this.revisionHistoryDiagram.getSelectedData();
		let selectedData: EIMHierarchicalRevisionHistory[] = [];
		for (let i = 0; i < selectedElement.length; i++) {
			selectedData.push(selectedElement[i].domain);
		}
		this.revisionHistoryDataGrid.select(selectedData, false);

		this.enableMenuItem(selectedElement.length);
		this.checkIsDocumentLink();
	}

	/**
	 * 右ペインの一覧表示選択変更時のイベントハンドラです.
	 * 対応する左ペインのダイアグラムの行を選択します.
	 * @param event イベント
	 */
	public onChangeDataGrid(event: any): void {
		let selectedData: EIMHierarchicalRevisionHistory[] = this.revisionHistoryDataGrid.getSelectedData();
		let selectedElement: EIMDiagramNode[] = [];
		for (let i = 0; i < selectedData.length; i++) {
			selectedElement.push({id: selectedData[i].objId});
		}

		this.revisionHistoryDiagram.select(selectedElement, false);

		this.enableMenuItem(selectedData.length);
		this.checkIsDocumentLink();
	}

	/**
	 * ブランチコピークリック時のイベントハンドラです.
	 * ブランチコピー可能かどうかチェックし、copyRevisionをエミットします.
	 * 1件選択時以外はエラーとします.
	 * @param event イベント
	 */
	public onClickCopyRevision(event: any): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		if (selectedData.length !== 1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00002'));
			return;
		}
		this.copyRevision.emit(selectedData[0]);
	}

	/**
	 * グリッド行ダブルクリックイベントハンドラです.
	 * プロパティ画面を表示します.
	 * @param event イベント
	 */
	public onRowDoubleClicked(event: any): void {
		this.showProperty();
	}

	/**
	 * プロパティクリック時のイベントハンドラです.
	 * プロパティ画面を表示します.
	 * 1件選択時以外はエラーとします.
	 * @param event イベント
	 */
	public onClickProperty(event: any): void {
		this.showProperty();
	}

	/**
	 * ステータス属性クリック時のイベントハンドラです.
	 * ステータス属性画面を表示します.
	 * 1件選択時以外はエラーとします.
	 * @param event イベント
	 */
	public onClickStatusProperty(event: any): void {
		this.showStatusProperty();
	}

	/**
	 * 公開ファイル比較クリック時のイベントハンドラです.
	 * 公開ファイル比較画面を表示します.
	 * 1件選択時以外はエラーとします.
	 * @param event イベント
	 */
	public onClickPublicFileCompare(event: any): void {
		this.showPublicFileCompare();
	}

	/**
	 * リンク設定クリック時のイベントハンドラです.
	 * リンク設定画面を表示します.
	 * @param event イベント
	 */
	public onClickShowLinkUpdator(event: any): void {
			this.showLinkUpdator();
	}

	/**
	 * 閉じるボタン押下時の処理を実施します.
	 * @param event イベント
	 * @param close クローズイベント
	 */
	public close(event: any, close: EventEmitter<null>): void {
		close.emit();
		this.updated.emit(this.updatedData);
	}

	/**
	 * 同一ドキュメントか判定します.
	 * @param a 判定対象A
	 * @param b 判定対象B
	 */
	public equalsDocument(a: any, b: any): boolean {
		return (a.date === b.date && a.objId === b.objId && a.isDocumentLink === b.isDocumentLink);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		columns.push({field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), type: EIMDataGridColumnType.number, width: 60, suppressSorting: true, suppressFilter: true});
		// 署名・暗号化がONの場合のみ表示
		if (this.serverConfigService.signatureAndEncryptionFlag) {
			columns.push({field: 'signencr', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02141'), width: 70, cellRendererFramework: EIMSignEncryptionRendererComponent, suppressFilter: true ,
				comparator: EIMSignEncryptionRendererComponent.comparator });
		}
		columns.push({field: 'isDspPdfIcon', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02036'), width: 60, cellRendererFramework: EIMPublicFileRendererComponent, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 300, cellRendererFramework: EIMObjectNameRendererComponent, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'modifyUserName', headerName: this.translateService.instant('EIM.LABEL_02032'), width: 150, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'modifyDateTime', headerName: this.translateService.instant('EIM.LABEL_02033'), width: EIMConstantService.COLUMN_WIDTH_DATETIME, valueFormatter: (params): string => {return this.dateService.getDateTimeString(Number(params.value) * 1000); }, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'updateComment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02015'), width: 150, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 250, cellRendererFramework: EIMPlaceRendererComponent, suppressSorting: true, suppressFilter: true});
		columns.push({field: 'objTypeName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02001'), width: 150, suppressSorting: true, suppressFilter: true});

		// 場所クリックイベントハンドラ
		if (!this.placeRendererComponentServicePlaceClicked) {
			this.placeRendererComponentServicePlaceClicked = this.placeRendererComponentService.placeClicked.subscribe((data: any) => {
				// 改訂履歴画面を閉じる(プロパティ画面にて押下された場合は画面を閉じない)
				if (data.revisionHistory === true) {
					this.dialogManagerComponentService.close('REVISION_HISTORY');
				}
			});
		}

		this.revisionHistoryDataGrid.setColumns(columns);
		this.revisionHistoryDataGrid.showAllSelectButton = false;

		this.enableMenuItem(0);
		this.checkIsDocumentLink();
	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		// 場所クリックサブスクリプションがクローズされていなければクローズ
		if (!this.placeRendererComponentServicePlaceClicked.closed) {
			this.placeRendererComponentServicePlaceClicked.unsubscribe();
		}

		this.dialogManagerComponentService.close(this.compareDialogId);
	}

	/**
	 * リンク先表示チェックボックス選択時イベントです.
	 * @param event イベント
	 */
	onChangeLinkDisplayFlag(event: any): void {
		let selectedData: EIMHierarchicalRevisionHistory[] = this.revisionHistoryDataGrid.getSelectedData();
		let linkList: EIMHierarchicalRevisionHistory[] = this.revisionHistoryDataGrid.getData()
		let historyList: EIMHierarchicalRevisionHistory[] = [];
		for (let i = 0; i < linkList.length; i++) {
			historyList.push(linkList[i]);
			// チェックボックスONの場合
			if (this.linkDisplayFlag) {
				let tempHistoryList: EIMHierarchicalRevisionHistory[] = [];
				// ドキュメントリンクがある場合表示する
				this.convertLink(linkList[i], tempHistoryList);
				// 子階層を第一位パス順、第二位自動/手動順に表示する
				let DocLinkList = this.linkSort(tempHistoryList);
				for (let i = 0; i < DocLinkList.length; i++) {
					historyList.push(DocLinkList[i]);
				}
				if (this.historyListForAllRoute) {
					this.historyListForAllRoute = historyList;
				}
			// チェックボックスがOFFの場合
			} else {
				// ドキュメントリンクを非表示とする。
				if (historyList.length > 0 && linkList[i].isDocumentLink) {
					historyList.pop();
				}
			}
		}
		this.revisionHistoryDataGrid.setData(historyList);
		this.revisionHistoryDataGrid.refreshView();
		if (selectedData.length > 0 && selectedData[0].isDocumentLink) {
			this.onChangeDataGrid(null);
		} else {
			this.revisionHistoryDataGrid.select(selectedData, false);
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 件数を更新します.
	 * @param info データグリッドコンポーネント情報
	 */
	protected updateRowCountAndSelectedData(info: EIMDataGridComponentInfo): void {
		// 合計数から外部フィルタされた行数を除く
		info.rowCount = info.gridApi.getDisplayedRowCount();

		// 選択数からフィルタされた行数を除く
		let selectedData: any[] = [];
		for (let i = 0; i < info.selectedData.length; i++) {
			let node: any = {}; // RowNode
			node['data'] = info.selectedData[i];
			if (info.gridOptions.doesExternalFilterPass(node)) {
				selectedData.push(info.selectedData[i]);
			}
		}
		this.revisionHistoryDataGrid.select(selectedData);

	}

	/**
	 * 右ペインの一覧表示に履歴情報を設定します.
	 * @param historyList 履歴情報
	 */
	private addRevisionHistoryToDataGrid(historyList: EIMHierarchicalRevisionHistory[]): void {
		let gridData: EIMHierarchicalRevisionHistory[] = this.revisionHistoryDataGrid.getData();
		let existsObjIdSet: any = {};
		for (let i = 0; i < gridData.length; i++) {
			existsObjIdSet[gridData[i].objId] = true;
		}

		for (let i = 0; i < historyList.length; i++) {
			let history: EIMHierarchicalRevisionHistory = historyList[i];
			if (existsObjIdSet[history.objId]) {
				continue;
			}

			// 行追加
			this.revisionHistoryDataGrid.addRowDataToIndex([history], i);
		}
	}

	/**
	 * ドキュメントリンクを再帰的に取得し、表示対象に追加します.
	 * @param linkListItem ドキュメントリンク候補
	 * @param historyList 表示対象履歴一覧
	 */
	private convertLink(linkListItem: EIMHierarchicalRevisionHistory, historyList: EIMHierarchicalRevisionHistory[]): void {
		if (!linkListItem.children) {
			return;
		}
		for (let i = 0; i < linkListItem.children.length; i ++) {
			if (linkListItem.children[i].isDocumentLink) {
				// 一般ドキュメント、一般フォルダを表示用に変換
				linkListItem.children[i]['objTypeName'] = this.contentsNameRenameGeneralPipe.transform(linkListItem.children[0].objTypeName);
				// 子階層に対して同様の処理を再帰的に処理を行う
				if (linkListItem.children[i].children) {
					this.convertLink(linkListItem.children[i], historyList);
				}
				historyList.push(linkListItem.children[i]);
			}
		}
	}

	/**
	 * ドキュメントリンクをソートします.
	 * @param linkList ドキュメントリンク一覧
	 * @return ソート後のドキュメントリンク一覧
	 */
	private linkSort(linkList: EIMHierarchicalRevisionHistory[]): EIMHierarchicalRevisionHistory[] {
		let manualList: EIMHierarchicalRevisionHistory[] = [];
		let autoList: EIMHierarchicalRevisionHistory[] = [];
		let DocLinkList: EIMHierarchicalRevisionHistory[] = [];
		// パス順にソート
		linkList = linkList.sort((obj1: any, obj2: any) => {
			if (obj1.path < obj2.path) {return -1; }
			if (obj1.path > obj2.path) {return 1; }
			return 0;
		});

		// 自動リンクと手動リンクに分ける
		for (let i = 0; i < linkList.length; i++) {
			if (linkList[i].documentLinkUpdateTiming === 0) {
				manualList.push(linkList[i]);
			} else if (linkList[i].documentLinkUpdateTiming === 1) {
				autoList.push(linkList[i]);
			}
		}
		return DocLinkList.concat(manualList,autoList);
	}

	/**
	 * 右ペインの一覧表示をフィルタします.
	 * ”選択履歴まで表示”を指定した際の、不要な行をフィルタします.
	 * @param unvisibleData 非表示にする履歴情報
	 */
	private filter(unvisibleData: any[]): void {
		this.revisionHistoryDataGrid.info.gridApi.setGridOption('isExternalFilterPresent', () => {return true});
		this.revisionHistoryDataGrid.info.gridApi.setGridOption('doesExternalFilterPass', (node): boolean => {
			return this.doesExternalFilterPass(node, unvisibleData);
		});

		this.revisionHistoryDataGrid.info.gridApi.onFilterChanged();

	}

	/**
	 * 非表示とする履歴情報を取得します.
	 * ”選択履歴まで表示”を指定した際の、不要な行を返却します.
	 * @return 非表示とする履歴情報
	 */
	private getUnvisibleData(): EIMHierarchicalRevisionHistory[] {
		let unvisibleData: EIMHierarchicalRevisionHistory[] = [];
		let documentlinkObjects = [];
		for (let i = 0; i < this.historyListForAllRoute.length; i++) {
			if (!this.historyListForAllRoute[i].isTargetPath) {
				unvisibleData.push(this.historyListForAllRoute[i]);
			} else {
				let link: EIMHierarchicalRevisionHistory[] = this.historyListForAllRoute[i].children;
				for (let j = 0; j < link.length; j++) {
					if (link[j].isDocumentLink) {
						documentlinkObjects.push(link[j].objId);
					}
				}
			}
		}
		// 表示条件のドキュメントリンクは非表示リストから削除
		if (this.linkDisplayFlag) {
			for (let i = 0; i < documentlinkObjects.length; i++) {
				for (let j = unvisibleData.length - 1; j >= 0; j--) {
					if (documentlinkObjects[i] === unvisibleData[j].objId) {
						unvisibleData.splice(j, 1);
					}
				}
			}
		}
		return unvisibleData;
	}

	/**
	 * 該当行が非表示とする履歴情報かどうかを返却します.
	 * @param node 右ペインの一覧表示の行情報
	 * @param unvisibleData 非表示とする履歴情報
	 * @return 該当行が非表示とする履歴情報かどうか
	 */
	private doesExternalFilterPass(node: any, unvisibleData?: any[]): boolean {
		for (let i = 0; i < unvisibleData.length; i++) {
			if (node.data === unvisibleData[i]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 選択行数によりメニューを活性化します.
	 * @param selectedNum 選択行数
	 */
	private enableMenuItem(selectedNum: number): void {

		if (selectedNum === 1) {
			this.menuCopyRevision.disabled = false;
			this.menuProperty.disabled = false;
			this.menuStatusProperty.disabled = false;
			this.menuPublicFileCompare.disabled = this.publicFileCompareDisableCheck();
			this.menuItemShowLinkUpdator.disabled = false;
			this.menuItemSourceDocument.disabled = false;
			this.menuItemDestinationDocument.disabled = false;
		} else if (selectedNum <= 2) {
			this.menuCopyRevision.disabled = true;
			this.menuProperty.disabled = true;
			this.menuStatusProperty.disabled = true;
			this.menuPublicFileCompare.disabled = this.publicFileCompareDisableCheck();
			this.menuItemShowLinkUpdator.disabled = true;
			this.menuItemSourceDocument.disabled = true;
			this.menuItemDestinationDocument.disabled = true;

		} else {
			this.menuCopyRevision.disabled = true;
			this.menuProperty.disabled = true;
			this.menuStatusProperty.disabled = true;
			this.menuPublicFileCompare.disabled = true;
			this.menuItemShowLinkUpdator.disabled = true;
			this.menuItemSourceDocument.disabled = true;
			this.menuItemDestinationDocument.disabled = true;
		}
	}

	/**
	 * プロパティ画面を表示します.
	 */
	private showProperty(): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		if (selectedData.length !== 1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00002'));
			return;
		}
		let dialogId: string = this.dialogManagerComponentService.showProperty(selectedData[0], true,
			{
				errored: (data: any) => {
					// 画面を閉じる
					this.dialogManagerComponentService.close(dialogId);
				},
			}
		);
	}

	/**
	 * ステータス属性画面を表示します.
	 */
	private showStatusProperty(): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		if (selectedData.length !== 1) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00002'));
			return;
		}
		let dialogId: string = this.dialogManagerComponentService.showContentsStatusProperty(selectedData[0],
			{
				errored: (data: any) => {
					// 画面を閉じる
					this.dialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * リンク設定画面を表示します.
	 */
	private showLinkUpdator(): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		let isDocumentLink: any = String(selectedData[0].isDocumentLink);
		let dialogId: string = this.dialogManagerComponentService.showLinkUpdator(
			selectedData[0].objId, selectedData[0].parentObjId, isDocumentLink, {
					updated: (data) => {
						this.documentFormService.updateObjectLinkSettings(data.objId, data.parentObjId, data.isDocumentLink, data.documentLinkUpdateTiming)
						.subscribe(
							(object: any) => {
								this.dialogManagerComponentService.close(dialogId);
								selectedData[0].documentLinkUpdateTiming = data.documentLinkUpdateTiming;
								this.revisionHistoryDataGrid.refreshView();
							});
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
			});
	}

	/**
	 * 公開ファイル比較画面を表示します.
	 */
	private showPublicFileCompare(): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();

		// 既に開いていたらエラーを表示
		if (this.compareDialogId) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00011'));
			return;
		}

		// 公開ファイル比較画面表示可否チェック
		if (this.checkPublicPdf(selectedData, 2)) {
			return;
		}

		// メニュー退避
		let dialogMenu: EIMMenuItem[] = this.dialogContextMenuItems;
		let gridMenu: EIMMenuItem[] = this.gridContextMenuItems;

		// メニュー更新
		this.showPublicFileCompareChengeMenu();
		this.isShowPublicFileCompareDialog = true;

		this.compareDialogId = this.dialogManagerComponentService.showPublicFileCompareExecutor(selectedData, {
			executed: (data) => {
				// ダイアログクローズ
				this.dialogManagerComponentService.close(this.compareDialogId);
				this.compareDialogId = null;
				// メニューの切り替え
				this.dialogContextMenuItems = dialogMenu;
				this.gridContextMenuItems = gridMenu;
				this.isShowPublicFileCompareDialog = false;
				this.enableMenuItem(this.revisionHistoryDataGrid.getSelectedData().length);
			},
			errored: () => {
				// ダイアログクローズ
				this.dialogManagerComponentService.close(this.compareDialogId);
				this.compareDialogId = null;
				// メニューの切り替え
				this.dialogContextMenuItems = dialogMenu;
				this.gridContextMenuItems = gridMenu;
				this.isShowPublicFileCompareDialog = false;
				this.enableMenuItem(this.revisionHistoryDataGrid.getSelectedData().length);
			},
			closed: () => {
				// メニューの切り替え
				this.compareDialogId = null;
				this.dialogContextMenuItems = dialogMenu;
				this.gridContextMenuItems = gridMenu;
				this.isShowPublicFileCompareDialog = false;
				this.enableMenuItem(this.revisionHistoryDataGrid.getSelectedData().length);
			}
		});
	}

	/**
	 *  公開ファイル比較ダイアログ表示中のメニューの表示設定を切り替えます.
	 */
	private showPublicFileCompareChengeMenu(): void {
		this.dialogContextMenuItems = this.showPublicFileCompareMenuItems;
		this.gridContextMenuItems = this.showPublicFileCompareMenuItems;
	}

	/**
	 * 比較元選択時イベントです.
	 * @param event イベント
	 */
	private clickItemSourceDocument(event: any): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		if (this.checkPublicPdf(selectedData, 1)) {
			return;
		}
		(<EIMPublicFileCompareExecutorComponent>this.dialogManagerComponentService.getView(this.compareDialogId)).sourceDocuments(selectedData);
	}

	/**
	 * 比較先選択時イベントです.
	 * @param event イベント
	 */
	private clickItemDestinationDocument(event: any): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		if (this.checkPublicPdf(selectedData, 1)) {
			return;
		}
		(<EIMPublicFileCompareExecutorComponent>this.dialogManagerComponentService.getView(this.compareDialogId)).destinationDocuments(selectedData);
	}

	/**
	 * 選択ドキュメントが公開中かをチェックします.
	 */
	private checkPublicPdf(selectedData: any[], selectMax: number): boolean {

		// 選択数チェック
		if (selectMax < selectedData.length) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00034'));
			return true;
		}

		// 公開済・ドキュメント種別チェック
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i].statusTypeKind === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC &&
				(selectedData[i].objName.endsWith(EIMDocumentsConstantService.PDF_EXTENSION) || selectedData[i].isDspPdfIcon === 'true')) {
					return false;
			} else if (selectedData[i].objTypeName === '一般ドキュメント' &&
				(selectedData[i].objName.endsWith(EIMDocumentsConstantService.PDF_EXTENSION) || selectedData[i].isDspPdfIcon === 'true')) {
					return false;
			} else {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00033'));
				return true;
			}
		}
	}

	/**
	 * 選択ドキュメントがドキュメントリンクかをチェックします.
	 */
	private checkIsDocumentLink(): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		if (!this.menuItemShowLinkUpdator.disabled && selectedData[0].isDocumentLink && selectedData[0].isDocumentLink === true) {
			this.menuItemShowLinkUpdator.disabled = false;
			this.menuItemLinkUpdate.disabled = false;
		} else {
			this.menuItemShowLinkUpdator.disabled = true;
			this.menuItemLinkUpdate.disabled = true;
		}
	}

	/**
	 * リンク先更新選択時イベントです.
	 * @param event イベント
	 */
	private clickItemLinkUpdate(event: any): void {
		let selectedData: any[] = this.revisionHistoryDataGrid.getSelectedData();
		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00033'),
		() => {
			this.contentsService.actUpdateObjectLink(selectedData, selectedData[0].parentObjId).subscribe((data) => {
				let createdData = data.concat();
				let deletedData = selectedData.concat();
				let spliceCount = 0;

				// オブジェクトIDが変わらない場合、更新なしとする
				for (let i = 0; i < selectedData.length; i++) {
					createdData[i].isDocumentLink = 'true';
					createdData[i].additionalTarget = {objId: createdData[i].objId, isDocumentLink: 'false'};
					deletedData[i].isDocumentLink = 'true';
					for (let j = 0; j < data.length; j++) {
						if (selectedData[i].objId === Number(data[j].objId)) {
							createdData.splice(j - spliceCount, 1);
							deletedData.splice(i - spliceCount, 1);
							spliceCount++;
							break;
						}
					}
				}
				this.updatedData.push({createdData: createdData, deletedData: deletedData});
				// 再描画
				this.revisionHistoryService.getHierarchical(this.content.objId).subscribe(
					(hierarchicalRevisionHistory: EIMHierarchicalRevisionHistory) => {
						let workList: EIMHierarchicalRevisionHistory[] = <EIMHierarchicalRevisionHistory[]>this.hierarchicalDomainService.getList([hierarchicalRevisionHistory]);
						let historyList: EIMHierarchicalRevisionHistory[] = [];
						for (let i = 0; i < workList.length; i++) {
							workList[i]['objTypeName'] = this.contentsNameRenameGeneralPipe.transform(workList[i].objTypeName);
							workList[i]['revisionHistory'] = true;
							historyList.push(workList[i]);
						}
						historyList.sort((a: EIMHierarchicalRevisionHistory, b: EIMHierarchicalRevisionHistory): number => {
							// ID逆順にソート
							return -(a.objId - b.objId);
						});
						this.revisionHistoryDataGrid.setData(historyList);
						// 左ペインはドキュメントリンク表示対象外
						for (let i = historyList.length - 1; i >= 0; i--) {
							if (historyList[i].isDocumentLink) {
								historyList.splice(i, 1);
							}
						}
						let diagramData: EIMDiagramElement[] = this.revisionHistoryDiagram.createDiagramElement(historyList);
						this.revisionHistoryDiagram.setData(diagramData);
						this.historyListForTargetRoute = historyList;
					},
					(err: any) => {
						window.setTimeout(() => {
							this.errored.emit();
						});
					});
			});
		});
	}

	/**
	 * 公開ファイル比較メニューの活性チェックをします.
	 */
	private publicFileCompareDisableCheck(): boolean {
		let revisionData = this.revisionHistoryDataGrid.getData();
		for (let i = 0; i < revisionData.length; i++) {
			// let maxCount = revisionData.length;
			if (revisionData[0].rev !== revisionData[i].rev) {
				return false;
			}
		}
		return true;
	}
}
