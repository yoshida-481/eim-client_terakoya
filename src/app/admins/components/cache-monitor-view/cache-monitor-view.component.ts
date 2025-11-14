import { Component, forwardRef, ViewChild, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';

import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMCacheMonitorViewService } from 'app/admins/shared/services/apis/cache-monitor-view.service';
import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMCacheSpaceDTO } from 'app/admins/shared/dtos/cache-space.dto';
import { EIMCacheMonistorViewCacheEntryObjectService } from './cache-monitor-view-cache-entry-object.service';
import { EIMCacheMonistorViewCacheEntryService } from './cache-monitor-view-cache-entry.service';
import { EIMCacheEntrySearchDTO } from 'app/admins/shared/dtos/cache-entry-search.dto';
import { EIMCacheMonistorViewCacheEntryAttributeTypeService } from './cache-monitor-view-cache-entry-attribute-type.service';
import { EIMCacheMonistorViewCacheEntryDirectoryService } from './cache-monitor-view-cache-entry-directory.service';
import { EIMCacheMonistorViewCacheEntryFileService } from './cache-monitor-view-cache-entry-file.service';
import { EIMCacheMonistorViewCacheEntryFormatService } from './cache-monitor-view-cache-entry-format.service';
import { EIMCacheMonistorViewCacheEntryGroupService } from './cache-monitor-view-cache-entry-group.service';
import { EIMCacheMonistorViewCacheEntryLogService } from './cache-monitor-view-cache-entry-log.service';
import { EIMCacheMonistorViewCacheEntryObjectTypeService } from './cache-monitor-view-cache-entry-object-type.service';
import { EIMCacheMonistorViewCacheEntryUserService } from './cache-monitor-view-cache-entry-user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';

// TreeNodeの不足分を追加
export interface EIMTreeNodeForEIMCacheMonitorViewComponent extends EIMTreeNode {
	id: string;
}

/**
 * キャッシュ管理コンポーネント
 * @example
 *
 *      <eim-cache-monitor-view>
 *      </eim-cache-monitor-view>
 */
@Component({
	selector: 'eim-cache-monitor-view',
	templateUrl: './cache-monitor-view.component.html',
	styleUrls: ['./cache-monitor-view.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMCacheMonitorViewComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMCacheMonitorViewComponent implements EIMAdminMainComponent, OnInit {

	/** 更新ログのキャッシュ領域接頭辞 */
	public static UPDATE_LOG_CACHE_SPACE_PREFIX = 'UpdateLog';

	/** 不足ログのキャッシュ領域接頭辞 */
	public static INSUFFICIENT_LOG_CACHE_SPACE_PREFIX = 'InsufficientLog';

	/** キャッシュツリー */
	@ViewChild('cacheTree')
		cacheTree: EIMTreeComponent;

	/** キャッシュエントリーデータグリッド */
	@ViewChild('cacheEntryDataGrid')
		cacheEntryDataGrid: EIMDataGridComponent;

	/** スプリットエリア左部サイズ */
	public splitAreaLeftSize = 25;

	/** システム管理アプリケーション種別ID */
	public adminAppId = '';

	/** 検索条件 */
	public cacheEntryIds = '';

	/** 入力最大数 */
	public inputMaxLength = EIMConstantService.INPUT_MAX_LENGTH;

	/** ビューID */
	public viewId = 'Cache';

	/** 初期検索フラグ */
	public initFlag = true;

	/** ツリーでキャッシュが選択されているかどうか */
	public isSelectedChache = false;

	/** キャッシュエントリ取得サイズのラベル文言 */
	public cacheEntrySearchResultSizeLabel = '';

	/** 選択さ得れているキャッシュエントリの件数 */
	public selectedCacheEntryCount = 0;

	/** キャッシュエントリーメニュー */
	public entryReloadMenu = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03050'), icon: 'fa fa-retweet',
		disabled: true, command: ($event) => {
			this.onClickReload();
		}
	};

	/** キャッシュエントリー一覧のコンテキストメニュー */
	public entryMenuItems: EIMMenuItem[] = [
		this.entryReloadMenu,
	];

	/** 選択されているキャッシュツリーのノード */
	private selectedTreeNode: EIMTreeNodeForEIMCacheMonitorViewComponent = null;

	/** ツリーのルートノード */
	private rootTreeNode: EIMTreeNodeForEIMCacheMonitorViewComponent = {
		type: 'Cluster', id: '-1', label: 'Cluster', children: null, icon: 'fa fa-share-alt'
	};

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
			protected translateService: TranslateService,
			protected cacheMonitorViewService: EIMCacheMonitorViewService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
			protected attributeTypeService: EIMAttributeTypeService,
			protected cacheMonistorViewCacheEntryAttributeTypeService: EIMCacheMonistorViewCacheEntryAttributeTypeService,
			protected cacheMonistorViewCacheEntryDirectoryService: EIMCacheMonistorViewCacheEntryDirectoryService,
			protected cacheMonistorViewCacheEntryFileService: EIMCacheMonistorViewCacheEntryFileService,
			protected cacheMonistorViewCacheEntryFormatService: EIMCacheMonistorViewCacheEntryFormatService,
			protected cacheMonistorViewCacheEntryGroupService: EIMCacheMonistorViewCacheEntryGroupService,
			protected cacheMonistorViewCacheEntryLogService: EIMCacheMonistorViewCacheEntryLogService,
			protected cacheMonistorViewCacheEntryObjectTypeService: EIMCacheMonistorViewCacheEntryObjectTypeService,
			protected cacheMonistorViewCacheEntryObjectService: EIMCacheMonistorViewCacheEntryObjectService,
			protected cacheMonistorViewCacheEntryUserService: EIMCacheMonistorViewCacheEntryUserService,
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
			this.selectedTreeNode = null;
			this.cacheEntryIds = '';
			this.cacheEntrySearchResultSizeLabel = '';
			this.initNodes();

			this.cacheEntryDataGrid.setColumns([]);
			this.cacheEntryDataGrid.showAllSelectButton = true;

			window.setTimeout(() => {
				this.cacheTree.select([]);
				this.cacheTree.setData([this.rootTreeNode]);
			});
			return;
		}

		// 復元します
		this.selectedTreeNode = state.selectedTreeNode;
		this.cacheEntryIds = state.cacheEntryIds;
		this.cacheEntrySearchResultSizeLabel = state.cacheEntrySearchResultSizeLabel;
		this.selectedCacheEntryCount = state.selectedCacheEntryCount;
		window.setTimeout(() => {
			this.cacheTree.setState(state.cacheTree);
			this.cacheEntryDataGrid.setState(state.cacheEntryDataGrid);
			this.splitAreaLeftSize = state.splitAreaLeftSize;
			// ボタンの活性制御処理
			this.setButtonEnable();
		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			cacheTree: this.cacheTree.getState(),
			cacheEntryDataGrid: this.cacheEntryDataGrid.getState(),
			selectedTreeNode: this.selectedTreeNode,
			cacheEntryIds: this.cacheEntryIds,
			cacheEntrySearchResultSizeLabel: this.cacheEntrySearchResultSizeLabel,
			selectedCacheEntryCount: this.selectedCacheEntryCount,
			splitAreaLeftSize: this.splitAreaLeftSize,
		};
	}

	/**
	 * ツリー同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsForTree(obj1: any, obj2: any): boolean {
		return obj1.id === obj2.id;
	}

	/**
	 * データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsForDataGrid(obj1: any, obj2: any): boolean {
		return obj1.pk === obj2.pk;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
	}

	/**
	 * キャッシュツリーノード選択ハンドラ.
	 * ノード選択時は、配下のキャッシュを更新します.
	 * @param event イベント
	 */
	onSelectedCacheTreeNode(event: any): void {

		this.selectedTreeNode = null;
		this.cacheEntryIds = '';
		this.cacheEntrySearchResultSizeLabel = '';
		this.cacheEntryDataGrid.setData([]);
		this.cacheEntryDataGrid.select([]);
		this.selectedCacheEntryCount = 0;
		this.cacheEntryDataGrid.setColumns([]);

		// 選択データがない場合は活性制御をして抜ける
		if (event.selectedData.length === 0) {
			// ボタンの活性制御処理
			this.setButtonEnable();
			return;
		}

		this.selectedTreeNode = event.selectedData[0];
		this.setButtonEnable();

		switch (event.selectedData[0].type) {
			case 'Cluster':
				return;
			case 'Node':
				// 配下のキャッシュを初期化
				if (event.selectedData[0].children === null) {
					this.initCaches(event.selectedData[0]);
				} else {
					event.selectedData[0].expanded = true;
				}
				return;
			case 'Cache':
				this.initCacheEntries(event.selectedData[0], false);
				return;
			default:
				return;
		}
	}

	/**
	 * キャッシュツリーノード展開ハンドラ.
	 * ノード展開かつ配下が空の時は、配下のキャッシュを更新します.
	 * @param treeNodes 選択されているツリーノード
	 */
	onExpandedCacheTreeNode(treeNodes: EIMTreeNodeForEIMCacheMonitorViewComponent[]): void {
		if (treeNodes[0].type !== 'Node') {
			return;
		}

		if (treeNodes[0].children !== null) {
			return;
		}
		this.initCaches(treeNodes[0]);
	}

	/**
	 * 検索ボタンクリック時のイベントハンドラ
	 * 検索条件に合致するエントリ一覧を表示します.
	 */
	onClickSearch(): void {

		this.initCacheEntries(this.selectedTreeNode);
	}

	/**
	 * リロードメニューボタンクリック時のイベントハンドラ
	 */
	onClickReload(): void {
		const cacheSpaceKey = this.selectedTreeNode.data.key;
		const cacheEntries: any[] = this.cacheEntryDataGrid.getSelectedData();
		let pks: string[] = [];
		for (let i = 0; i < cacheEntries.length; i++) {
			if (this.selectedTreeNode.data.name === 'File') {
				pks.push(cacheEntries[i]['entry_object_id'] + ':' + cacheEntries[i]['entry_format_id']);
			} else {
				pks.push(String(cacheEntries[i]['entry_id']));
			}
		}

		this.cacheMonitorViewService.reload(cacheSpaceKey, pks).subscribe(
			() => {
				for (let i = 0; i < cacheEntries.length; i++) {
					cacheEntries[i].reloading = true;
				}
				this.cacheEntryDataGrid.refreshView();
			}
		);
	}

	/**
	 * キャッシュエントリ選択時のイベントハンドラです.
	 */
	onSelectCacheEntry(): void {
		this.selectedCacheEntryCount = this.cacheEntryDataGrid.getSelectedData().length;
		this.setButtonEnable();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ボタンの活性制御処理
	 */
	protected setButtonEnable(): void {
		if (!this.selectedTreeNode || this.selectedTreeNode.type !== 'Cache') {
			this.isSelectedChache = false;
			this.entryReloadMenu.disabled = true;
			return;
		}

		// キャッシュ選択時
		this.isSelectedChache = true;
		if (this.isCacheLog(this.selectedTreeNode.data.name) || this.selectedCacheEntryCount === 0) {
			this.entryReloadMenu.disabled = true;
		} else {
			this.entryReloadMenu.disabled = false;
		}
	}

	/**
	 * キャッシュ名がログ（更新ログ/不足ログ）かどうかを返却します。
	 * @param cacheSpaceName キャッシュ領域名
	 * @return ログの場合true
	 */
	protected isCacheLog(cacheSpaceName: string): boolean {
		if (cacheSpaceName.startsWith(EIMCacheMonitorViewComponent.UPDATE_LOG_CACHE_SPACE_PREFIX) ||
			cacheSpaceName.startsWith(EIMCacheMonitorViewComponent.INSUFFICIENT_LOG_CACHE_SPACE_PREFIX)) {
				return true;
		}
		return false;
	}

	/**
	 * キャッシュノード情報の表示を初期化します.
	 */
	protected initNodes(): void {
		this.cacheMonitorViewService.getNodes().subscribe((nodes: any) => {
			// ルートノード更新
			this.rootTreeNode.leaf = nodes.length === 0;
			this.rootTreeNode.expanded = nodes.length !== 0;
			this.rootTreeNode.children = [];

			// ノードを追加
			for (let i = 0; i < nodes.length; i++) {
				let node: EIMTreeNodeForEIMCacheMonitorViewComponent = {
					type: 'Node', id: nodes[i].id, label: nodes[i].name,
					leaf: false, expanded: false, parent: this.rootTreeNode, children: null,
					icon: 'fa fa-desktop', data: nodes[i]
				};
				this.rootTreeNode.children.push(node);
			}
		});
	}

	/**
	 * キャッシュノード配下のキャッシュ情報の表示を初期化します.
	 * @param node キャッシュノード情報
	 */
	protected initCaches(node: EIMTreeNodeForEIMCacheMonitorViewComponent): void {
		this.cacheMonitorViewService.getCaches(node.data.id).subscribe((caches: EIMCacheSpaceDTO[]) => {
			// ノード更新
			node.leaf = caches.length === 0;
			node.expanded = caches.length !== 0;
			node.children = [];

			// ノードにキャッシュを追加
			for (let i = 0; i < caches.length; i++) {
				let icon;
				if (this.isCacheLog(caches[i].name)) {
					icon = 'fa fa-file-text-o';
				} else {
					icon = 'fa fa-th';
				}

				let cache: EIMTreeNodeForEIMCacheMonitorViewComponent = {
					type: 'Cache', id: node.id + '_' + caches[i].name, label: caches[i].name,
					leaf: true, expanded: false, parent: node, icon: icon, data: caches[i]
				};
				node.children.push(cache);
			}
		});
	}

	/**
	 * 検索ボタンクリック時のイベントハンドラ
	 * 検索条件に合致するエントリ一覧を表示します.
	 * @param cache キャッシュノード情報
	 * @param isShowNoResultInfo エントリが0件の場合、情報ダイアログを表示するか否か
	 */
	protected initCacheEntries(cache: EIMTreeNodeForEIMCacheMonitorViewComponent, isShowNoResultInfo = true): void {

		// キャッシュエントリー一覧クリア
		this.cacheEntryDataGrid.setData([]);
		this.cacheEntryDataGrid.select([]);
		this.selectedCacheEntryCount = 0;

		const nodeId = (cache.parent as EIMTreeNodeForEIMCacheMonitorViewComponent).data.id;
		const cacheSpaceKey = cache.data.key;
		const idStrs = this.cacheEntryIds.split(',');
		let ids = [];
		for (let i = 0; i < idStrs.length; i++) {
			const id = parseInt(idStrs[i], 10);
			if (isNaN(id)) {
				continue;
			}

			ids.push(id);
		}
		this.cacheMonitorViewService.search(nodeId, cacheSpaceKey, ids).subscribe(
			(searchResult: EIMCacheEntrySearchDTO) => {
				const service: EIMCacheMonistorViewCacheEntryService = this.getCacheEntryService(cache.data);
				this.cacheEntryDataGrid.setColumns(service.getColumns(searchResult.attributeTypeList));

				const entries = [];
				for (let i = 0; i < searchResult.entryList.length; i++) {
					entries.push(service.convertToObject(searchResult.entryList[i], searchResult.attributeTypeList));
				}

				this.cacheEntryDataGrid.setData(entries);

				// 0件のチェック
				if (entries.length === 0 && isShowNoResultInfo) {
					this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_ADMINS.INFO_00009'));
				}

				// 取得件数初期化
				this.cacheEntrySearchResultSizeLabel = this.translateService.instant('EIM_ADMINS.LABEL_02357',
						{value1: entries.length, value2: searchResult.allCounts});
			}
		);
	}

	/**
	 * キャッシュスペースに対応するキャッシュエントリサービスを返却します.
	 * @param cacheSpace キャッシュスペース情報
	 * @return キャッシュエントリサービス
	 */
	protected getCacheEntryService(cacheSpace: EIMCacheSpaceDTO): EIMCacheMonistorViewCacheEntryService {
		let service: EIMCacheMonistorViewCacheEntryService = null;

		const cacheSpaceKey = cacheSpace.key.split('_')[0];

		switch (cacheSpaceKey) {
			case 'File':
				service = this.cacheMonistorViewCacheEntryFileService;
				break;
			case 'ObjectType':
				service = this.cacheMonistorViewCacheEntryObjectTypeService;
				break;
			case 'AttributeType':
				service = this.cacheMonistorViewCacheEntryAttributeTypeService;
				break;
			case 'Format':
				service = this.cacheMonistorViewCacheEntryFormatService;
				break;
			case 'Directory':
				service = this.cacheMonistorViewCacheEntryDirectoryService;
				break;
			case 'User':
				service = this.cacheMonistorViewCacheEntryUserService;
				break;
			case 'Group':
				service = this.cacheMonistorViewCacheEntryGroupService;
				break;
			case EIMCacheMonitorViewComponent.UPDATE_LOG_CACHE_SPACE_PREFIX:
			case EIMCacheMonitorViewComponent.INSUFFICIENT_LOG_CACHE_SPACE_PREFIX:
				service = this.cacheMonistorViewCacheEntryLogService;
				break;
			default:
				// オブジェクトの場合
				service = this.cacheMonistorViewCacheEntryObjectService;
				break;
		}
		return service;
	}
}
