import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, ViewChild, forwardRef } from '@angular/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMTaskMainComponent } from 'app/tasks/tasks.component';
import { EIMDocumentMainComponent } from 'app/documents/components/document-main/document-main.component';
import { Subscription } from 'rxjs';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMConfigService } from 'app/shared/services/config.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { CommonModule } from '@angular/common';
import { EIMTasksModule } from 'app/tasks/tasks.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMDocumentsModule } from 'app/documents/documents.module';

/**
 * ファイル管理コンポーネント
 * @example
 *
 *      <eim-file-manager
 *      >
 *      </eim-file-manager>
 */
@Component({
	selector: 'eim-file-manager',
	templateUrl: './file-manager.component.html',
	styleUrls: ['./file-manager.component.scss'],
	imports: [
		CommonModule,
		EIMDocumentsModule,
	],
	providers: [
		{provide: EIMComponent, useExisting: forwardRef(() => EIMFileManagerComponent)},
		EIMHttpService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFileManagerComponent implements EIMTaskMainComponent {

	/** ドキュメント管理メイン */
	@ViewChild('documentMain', { static: true }) documentMain: EIMDocumentMainComponent;

	/** 表示対象オブジェクトID（ワークスペース） */
	@Input('workspaceId')
		public workspaceId: number;

	/** 画面識別ID */
	public viewId = 'fileManager'

	@Input() contextRootForSelectObject = null;

	/** オブジェクトを選択する際のルートパス(client/#/以降) */
	@Input() routePathForSelectObject = null;
	
	/** オブジェクトを選択する際の追加クエリパラメータ('param=value'の配列) */
	@Input() paramsForSelectObject: string[] = null;

	/** ファイルダウンロードのコンテキストルート */
	@Input() contextRootForDownloadDocument = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected router: Router,
		protected route: ActivatedRoute,
		protected localStorageService: EIMLocalStorageService,
		protected translateService: TranslateService,
		protected httpService: EIMHttpService,
		protected serverConfigService: EIMServerConfigService,
		protected configService: EIMConfigService
	) {
		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey: string = 'EIM_TASKS.LABEL_01000';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			// メニューアイテムラベルを更新する
			this.refreshMenuItemLabel();
		}
	}

	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	public refreshMenuItemLabel(): void {
		let changeLabel: (menuItems: EIMMenuItem[]) => void = (menuItems: EIMMenuItem[]) => {
			for (let i = 0; i < menuItems.length; i++) {
				let menuItem: EIMMenuItem = menuItems[i];
				if (menuItem.hasOwnProperty('rKey')) {
					menuItem.label = this.translateService.instant(menuItem.rKey);
				}
				if (menuItem.items && menuItem.items.length > 0) {
					changeLabel(menuItem.items);
				}
			}
		};
		// changeLabel(this.treeMenuItems);
		// let newMenuItems: EIMMenuItem[] = Object.assign([], this.treeMenuItems);
		// this.treeMenuItems = newMenuItems;
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		// 更新対象ワークスペースツリー
		const contentsTree = this.documentMain.contentsTree;

		// ダイレクトアクセスの場合
		const directAccessInfo = this.localStorageService.getUserItemByKeys(
			EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO);
		if (directAccessInfo) {
			
			const contentsTreeSelectedData = {
				objId: directAccessInfo.fileManagerComponent.objId,
				isFolder: directAccessInfo.fileManagerComponent.isFolder,
				linkParentObjId: directAccessInfo.fileManagerComponent.linkParentObjId
			};

			// ダイレクトアクセス情報クリア
			this.localStorageService.removeUserItemByKeys(EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO);

			// ワークスペースツリー取得 (選択対象ノードまでツリー展開してアイテムを選択状態にする)
			if (directAccessInfo.fileManagerComponent.isFolder) {
				this.documentMain.contentsTreeComponentService.contentsAccess(contentsTree.info, contentsTreeSelectedData, false, 
					contentsTree.initialized, contentsTree.selected, true, true, this.workspaceId ? [this.workspaceId] : null);
			} else {
				this.documentMain.contentsTreeComponentService.contentsAccess(contentsTree.info, contentsTreeSelectedData, true, 
					contentsTree.initialized, contentsTree.selected, true, true, this.workspaceId ? [this.workspaceId] : null);
			}

			// セッション情報取得 (取得後に承認依頼情報、テーブル情報などの初期化処理を実行)
			this.documentMain.getSessionUser();

			return;
		}
		else if (state) {
			// ステートを保持している(2回目以降の表示)場合、各アコーディオンの表示状態を復元

			// -------------
			// ワークスペース
			// -------------

			// プロジェクトツリー読み込み完了
			const treeInitialized: Subscription = contentsTree.initialized.subscribe(() => {
				treeInitialized.unsubscribe();

				// スクロール
				const offsetTop = state.contentsTree.offsetTop;
				window.setTimeout(() => {
					contentsTree.setScrollTop(offsetTop);
				});
			});

			// ノード選択
			const selectedData = state.contentsTree.selectedData;
			if (selectedData && selectedData.length > 0) {
				// ノード選択有

				// 選択対象ノード
				const selectedNode = {
						objId: selectedData[0].objId,
						isFolder: true
				};
				// ワークスペースツリー取得 (選択対象ノードまでツリー展開してアイテムを選択状態にする)
				this.documentMain.contentsTreeComponentService.contentsAccess(contentsTree.info, selectedNode, false, 
					contentsTree.initialized, contentsTree.selected, true, true, this.workspaceId ? [this.workspaceId] : null);
			} else {
				// ノード選択無

				// ワークスペースツリー初期化
				this.documentMain.contentsTreeComponentService.initRoot(contentsTree.info,
					contentsTree.initialized, contentsTree.selected, this.workspaceId ? [this.workspaceId] : null);
			}

			// -------------
			// 検索
			// -------------

			// 検索条件
			// TODO ドキュメント管理で実装済みか？この設定は不要かもしれない。
			this.documentMain.accordionSearch.info.condition = state.searchCondition;

			// 詳細条件を複製
			const detailConditionList = Object.assign([], state.searchCondition.detailConditionList);

			// テーブル読み込み完了後に詳細条件を設定 (テーブル読み込み完了処理で詳細条件が上書きされるため)
			const tableLoadCompleted: Subscription = this.documentMain.contentsTableService.loadCompleted.subscribe((event: any) => {
				tableLoadCompleted.unsubscribe();

				// 詳細条件
				this.documentMain.accordionSearch.info.condition.detailConditionList = detailConditionList;
			});

			// // -------------
			// // 回付状況確認
			// // -------------

			// // 回付状況確認条件
			// const circurationCheckCondition = state.circurationCheckCondition;
			// this.documentMain.circulation.users = circurationCheckCondition.users;
			// this.documentMain.circulation.isContainOldVersion = circurationCheckCondition.isContainOldVersion;
			// this.documentMain.circulation.objName = circurationCheckCondition.objName;
			// this.documentMain.circulation.pathCondition = circurationCheckCondition.pathCondition;
			// this.documentMain.circulation.searchPath = circurationCheckCondition.searchPath;
			// this.documentMain.circulation.searchRangeStartDate = circurationCheckCondition.searchRangeStartDate;
			// this.documentMain.circulation.searchRangeEndDate = circurationCheckCondition.searchRangeEndDate;

			// セッション情報取得 (取得後に承認依頼情報、テーブル情報などの初期化処理を実行)
			// TODO 初回表示以外、処理待ち表示は不要と思う
			this.documentMain.getSessionUser();

		} else {
			// ステートを保持していない(初回表示)

			// 更新対象ワークスペースツリー
			const contentsTree = this.documentMain.contentsTree;

			// ワークスペースツリー初期化
			this.documentMain.contentsTreeComponentService.initRoot(contentsTree.info, contentsTree.initialized, contentsTree.selected, this.workspaceId ? [this.workspaceId] : null);

			// セッション情報取得 (取得後に承認依頼情報、テーブル情報などの初期化処理を実行)
			this.documentMain.getSessionUser();
		}

		// this.documentMain.dspCirculationSituationView = false;
		// this.documentMain.dspAttributeTreeView = false;
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		const contentsTree = this.documentMain.contentsTree.getState();
		contentsTree.data = null; // データは保持しない
		return {
			// ワークスペース
			contentsTree: contentsTree,
			// 検索
			searchCondition: this.documentMain.accordionSearch.info.condition,
			// // 回付状況確認
			// circurationCheckCondition: {
			// 	users: this.documentMain.circulation.users,
			// 	isContainOldVersion: this.documentMain.circulation.isContainOldVersion,
			// 	objName: this.documentMain.circulation.objName,
			// 	pathCondition: this.documentMain.circulation.pathCondition,
			// 	searchPath: this.documentMain.circulation.searchPath,
			// 	searchRangeStartDate: this.documentMain.circulation.searchRangeStartDate,
			// 	searchRangeEndDate: this.documentMain.circulation.searchRangeEndDate
			// }
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let origin: string = window.location.origin; // http://localhost:4200

		// オブジェクトを選択する際のコンテキストルート(http://localhost:4200/eim)
		this.contextRootForSelectObject = origin + this.serverConfigService.getContextPath();

		// オブジェクトを選択する際のルートパス(client/#/以降)
		const workspaceTreeNodeId = this.route.parent.snapshot.paramMap.get('workspaceTreeNodeId');
		if (workspaceTreeNodeId && EIMTaskConstantService.ROUTE_PATH_FOR_SELECT_OBJECT_FROM_WORKSPACES.indexOf('@workspaceTreeNodeId@') !== -1) {

			this.routePathForSelectObject = EIMTaskConstantService.ROUTE_PATH_FOR_SELECT_OBJECT_FROM_WORKSPACES
					.replace('@workspaceTreeNodeId@', workspaceTreeNodeId);
		} else {
			this.routePathForSelectObject = EIMTaskConstantService.ROUTE_PATH_FOR_SELECT_OBJECT;
		}
		// オブジェクトを選択する際の追加クエリパラメータ('param=value'の配列)
		this.paramsForSelectObject = null;
		// ファイルダウンロードのコンテキストルート
		this.contextRootForDownloadDocument = this.configService.get('tasks.documentsHttpService.contextRoot');

		// URLのパスから選択するワークスペースを決定
		const objId: number = Number(this.route.snapshot.queryParamMap.get('objId'));
		const linkParentObjId: number = Number(this.route.snapshot.queryParamMap.get('linkParentObjId'));
		const isFolder: string = this.route.snapshot.queryParamMap.get('isFolder');

		if (!isNaN(objId) && objId !== 0) { // クエリパラメータ未指定の場合はobjIdが0となる
			this.localStorageService.setUserItemByKeys(
				EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO,
				{
					url: this.router.url.split('?')[0],
					fileManagerComponent: {
						workspaceId: this.workspaceId,
						objId: objId,
						linkParentObjId: linkParentObjId,
						isFolder: isFolder && isFolder.toLowerCase() === 'true' ? true : false
					}
				}
			);
		}
		
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
