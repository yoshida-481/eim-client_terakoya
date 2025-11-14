import { Component, ViewChild, Input, Output, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMMenuItem, EIMListComponent } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDialogManagerComponentInfo} from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMObjectEditorsRevisionService } from 'app/object-editors/shared/services/apis/object-editors-revision.service';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMObjectEditorsRelationService } from 'app/object-editors/shared/services/apis/object-editors-relation.service';
import { EIMObjectEditorMainComponent } from 'app/object-editors/components/object-editor-main/object-editor-main.component';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { Subscription } from 'rxjs';
import { EIMRelationCreatorComponent } from 'app/object-editors/components/relation-creator/relation-creator.component';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';



/**
 * オブジェクトリストコンポーネント
 * @example
 *
 *      <eim-object-list [selectedObjTypeId]="selectedObjTypeId" [tagType]="tagType">
 *      </eim-object-list>
 */
@Component({
    selector: 'eim-object-list',
    templateUrl: './object-list.component.html',
    styleUrls: ['./object-list.component.css'],
    providers: [],
    standalone: false
})
export class EIMObjectListComponent implements AfterViewInit, OnDestroy {

	/** オブジェクトリスト表示コンポーネント */
	@ViewChild('objectList')
		objectList: EIMDataGridComponent;

	/** 選択属性タイプID */
	@Input() selectedObjTypeId: number;

	/** タグタイプ */
	@Input() tagType: string;

	/** ツリー表示かどうか */
	@Input() isTreeDataGrid = false;

	/** データ最新化要求イベントエミッタ（データが非最新状態のため、親コンポーネントよりsetData()で最新化する） */
	@Output() invalidated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** メニュー オブジェクト */
	private menuItemCreateObject: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03002'), name: 'CreateObject',
		icon: 'eim-icon-plus', command: (event) => {this.onClickMenuItemCreateObject(); }};

	/** メニュー リレーション */
	private menuItemCreateRelation: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03003'), name: 'CreateRelation',
		icon: 'eim-icon-plus', command: (event) => {this.onClickMenuItemCreateRelation(); }};

	/** メニュー リレーション正展開 */
	private menuItemExpandRelation: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03007'), name: 'ExpandRelation',
		icon: 'fa fa-arrow-down', command: (event) => {
			this.objectListComponentService.showExpandRelation(this.getSelectedData()[0]);
		}};

	/** メニュー リレーション逆展開 */
	private menuItemReverseExpandRelation: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03008'), name: 'ReverseExpandRelation',
		icon: 'fa fa-arrow-up', command: (event) => {
			this.objectListComponentService.showReverseExpandRelation(this.getSelectedData()[0]);
		}};

	/** メニュー オブジェクト削除 */
	private menuItemDeleteObject: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03004'), name: 'DeleteObject',
		icon: 'eim-icon-trash', command: (event) => {this.onClickMenuItemDeleteObject(); }};

	/** メニュー リレーション削除 */
	private menuItemDeleteRelation: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03005'), name: 'DeleteRelation',
		icon: 'eim-icon-trash', command: (event) => {this.onClickMenuItemDeleteRelation(); }};

	/** メニュー リビジョンアップ */
	private menuItemRevisionUp: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03016'), name: 'RevisionUp',
		icon: 'fa fa-upload', command: (event) => {this.onClickRevisionUp(); }};

	/** メニュー 最新版設定 */
	private menuItemLatestVersionSetting: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03006'), name: 'LatestVersionSetting',
		icon: 'eim-icon-pencil', command: (event) => {this.onClickMenuItemLatestVersionSetting(); }};

	/** メニュー ロック */
	private menuItemLock: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03017'), name: 'Lock',
		icon: 'fa fa-lock', command: (event) => {this.onClickLock(); }};

	/** メニュー ロック解除 */
	private menuItemUnLock: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03018'), name: 'UnLock',
		icon: 'fa fa-unlock', command: (event) => {this.onClickUnlock(); }};

	/** メニュー オブジェクト属性 */
	private menuItemUpdateObjectAttribute: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03009'), name: 'UpdateObjectAttribute',
		icon: 'eim-icon-list', command: (event) => {
			this.objectListComponentService.showObjectAttributeUpdator(this.getSelectedData()[0]);
		}};

	/** メニュー リレーション属性 */
	private menuItemUpdateRelationAttribute: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03010'), name: 'UpdateRelationAttribute',
		icon: 'eim-icon-list', command: (event) => {

			let selectedData = this.getSelectedData()[0];
			let parentObjId: number;
			let childObjId: number;

			// 親子オブジェクトのID取得
			if (this.tagType === this.objectEditorMainComponent.TAB_TYPE_EXPAND_RELATION) {
				parentObjId = selectedData.parent.id;
				childObjId = selectedData.id;
			} else {
				parentObjId = selectedData.id;
				childObjId = selectedData.parent.id;
			}
			let dialogId: string = this.objectEditorDialogManagerComponentService.showRelation(selectedData.relId, parentObjId, childObjId, {
				updated: () => {
					this.objectEditorDialogManagerComponentService.close(dialogId);
				},
				errored: () => {
					this.objectEditorDialogManagerComponentService.close(dialogId);
				},
			});
		}};

	/** メニュー リビジョン一覧 */
	private menuItemShowRevisionList: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03011'), name: 'ShowRevisionList',
		icon: 'eim-icon-revision-history', command: (event) => {
			this.objectListComponentService.showRevisionList(this.getSelectedData()[0]);
		}};

	/** メニュー ファイル一覧 */
	private menuItemShowFileList: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03012'), name: 'ShowFileList',
		icon: 'eim-icon-file', command: (event) => {this.onClickFileUploader();
		}};

	/** メニュー イベント履歴 */
	private menuItemShowEventList: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03013'), name: 'ShowEventList',
		icon: 'eim-icon-list', command: (event) => {this.onClickEventHistory(); }};


	/** メニュー アサイン一覧 */
	private menuItemShowAsignList: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03014'), name: 'ShowAsignList',
		icon: 'eim-icon-user', command: (event) => {this.onClickAssignUpdator(); }};

	/** メニュー オブジェクト選択 */
	private menuItemSelectObject: EIMMenuItem = {
		label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03031'), name: 'SelectObject',
		icon: 'fa fa-hand-pointer-o', command: (event) => {this.onClickSelectObject(); }};

	/** セパレータ */
	private menuItemSeparator: EIMMenuItem = { separator: true };

	/** メニュー */
	public menuItems: EIMMenuItem[] = [
		// 新規
		{
			label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03026'),
			icon: 'eim-icon-plus',
			items: [
				this.menuItemCreateObject,
				this.menuItemCreateRelation,
			]
		},
		// 編集
		{
			label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03027'),
			icon: 'eim-icon-pencil',
			items: [
				this.menuItemDeleteObject,
				this.menuItemDeleteRelation,
				this.menuItemSeparator,
				this.menuItemRevisionUp,
				this.menuItemLatestVersionSetting,
				this.menuItemLock,
				this.menuItemUnLock,
			]
		},
		// 展開
		{
			label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03001'),
			icon: 'fa fa-retweet',
			items: [
				this.menuItemExpandRelation,
				this.menuItemReverseExpandRelation,
			]
		},
		// プロパティ
		{
			label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03028'),
			icon: 'eim-icon-list',
			items: [
				this.menuItemUpdateObjectAttribute,
				this.menuItemUpdateRelationAttribute,
				this.menuItemSeparator,
				this.menuItemShowRevisionList,
				this.menuItemSeparator,
				this.menuItemShowFileList,
				this.menuItemSeparator,
				this.menuItemShowEventList,
				this.menuItemShowAsignList,
			]
		}
	];

	/** デフォルトコンテキストメニュー */
	public contextMenuDefault: EIMMenuItem[] = [
		this.menuItemDeleteObject,
		this.menuItemDeleteRelation,
		this.menuItemSeparator,
		this.menuItemRevisionUp,
		this.menuItemLatestVersionSetting,
		this.menuItemLock,
		this.menuItemUnLock,
		this.menuItemSeparator,
		this.menuItemExpandRelation,
		this.menuItemReverseExpandRelation,
		this.menuItemSeparator,
		this.menuItemUpdateObjectAttribute,
		this.menuItemUpdateRelationAttribute,
		this.menuItemSeparator,
		this.menuItemShowRevisionList,
		this.menuItemSeparator,
		this.menuItemShowFileList,
		this.menuItemSeparator,
		this.menuItemShowEventList,
		this.menuItemShowAsignList,
	];

	/** オブジェクト選択コンテキストメニュー */
	public contextMenuSelectObject: EIMMenuItem[] = [
		this.menuItemSelectObject,
	];

	/** コンテキストメニュー */
	public contextMenu: EIMMenuItem[] = this.contextMenuDefault;

	/** リレーション登録画面オープン時 */
	protected openedRelationCreator: Subscription;
	/** リレーション登録画面クローズ時 */
	protected closedRelationCreator: Subscription;
	/** ダイアログオープン時 */
	protected openedDialog: Subscription;
	/** ダイアログクローズ時 */
	protected closedDialog: Subscription;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		public objectListComponentService: EIMObjectListComponentService,
		protected messageService: EIMMessageService,
		protected objectEditorsRevisionService: EIMObjectEditorsRevisionService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		protected objectEditorsRelationService: EIMObjectEditorsRelationService,
		protected objectEditorMainComponent: EIMObjectEditorMainComponent,
	) {
		// ダイアログオープン時
		this.openedDialog = this.objectEditorDialogManagerComponentService.show.subscribe(
			(info: EIMDialogManagerComponentInfo) => {
				// リレーション登録画面を非モーダルでオープンした場合、右クリックメニューを変更
				if (info.name === dialogName.RELATION_CREATOR) {
					this.changeContextMenuSelectObject();
				}
			}
		);

		// ダイアログクローズ時
		this.closedDialog = this.objectEditorDialogManagerComponentService.closed.subscribe(
			(dialogId: string) => {
				if (dialogId === dialogName.RELATION_CREATOR) {
					this.changeContextMenuDefault();
				}
			}
		);

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 一覧コンポーネントを取得します.
	 */
	public getComponent(): EIMListComponent<any> {
		return this.objectList;
	}

	/**
	 * オブジェクトリストの同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一行かどうか
	 */
	public equals(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	/**
	 * 一覧の選択行数によりメニューの活性制御を行います.
	 */
	public refreshMenu(): void {
		switch (this.tagType) {
			// オブジェクト検索
			case this.objectEditorMainComponent.TAB_TYPE_SEARCH_OBJECT:
				this.refreshMenuForObjectSearch();
				break;
			// リビジョン一覧
			case this.objectEditorMainComponent.TAB_TYPE_SHOW_REVISION_LIST:
				this.refreshMenuForRevisionList();
				break;
			// リレーション正展開
			case this.objectEditorMainComponent.TAB_TYPE_EXPAND_RELATION:
				this.refreshMenuForExpandRelation();
				break;
			// リレーション逆展開
			case this.objectEditorMainComponent.TAB_TYPE_REVERSE_EXPAND_RELATION:
				this.refreshMenuForExpandRelation();
				break;
			// オブジェクト登録
			case this.objectEditorMainComponent.TAB_TYPE_NEW_OBJECT:
				this.refreshMenuForNewObject();
				break;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * ビュー初期化イベントハンドラです.
	 */
	ngAfterViewInit(): void {
		window.setTimeout(() => {
			if (this.objectListComponentService.relationCreatorShow) {
				this.changeContextMenuSelectObject();
			} else {
				// メニューの活性制御
				this.refreshMenu();
			}
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.openedDialog.closed) {
			this.openedDialog.unsubscribe();
		}

		if (!this.closedDialog.closed) {
			this.closedDialog.unsubscribe();
		}
	}

	/**
	 * オブジェクト選択時のイベントハンドラです.
	 */
	onSelectObject(): void {
		// メニューの活性制御
		this.refreshMenu();
	}

	/**
	 * オブジェクト押下時の処理です.
	 */
	protected onClickMenuItemCreateObject(): void {
		let dialogId = this.objectEditorDialogManagerComponentService.showObjectCreator(this.selectedObjTypeId, {
			created: (createdData: EIMObjectDomain) => {
				this.objectEditorDialogManagerComponentService.close(dialogId);
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00001', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03002')}));
				// 新規オブジェクト画面を開く
				this.objectListComponentService.showCreatedObject(createdData);
			}
		});
	}

	/**
	 * リレーション押下時の処理です.
	 */
	protected onClickMenuItemCreateRelation(): void {

		let selectedData = this.getSelectedData();

		// 選択行数によりモーダル or 非モーダルで開く
		let modal = selectedData.length === 1 ? false : true;
		this.objectEditorDialogManagerComponentService.showRelationCreator(selectedData, modal, {
			created: (createdData: EIMObjectDTO) => {
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00001', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03003')}));
				// ダイアログクローズ
				this.objectEditorDialogManagerComponentService.close(modal ? dialogName.RELATION_CREATOR_MODAL : dialogName.RELATION_CREATOR);
				// リレーション正展開画面を開く
				this.objectListComponentService.showExpandRelation(createdData);
			},
		});
	}

	/**
	 * オブジェクト削除押下時の処理です.
	 */
	protected onClickMenuItemDeleteObject(): void {
		let selectedData = this.getSelectedData();

		let name = '';
		if (selectedData.length === 1) {
			name = selectedData[0].name;
		} else {
			name = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02012')
		}

		// 削除確認ダイアログ表示
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00010', {value: name}),
			() => {
				// 削除処理実行
				this.objectEditorsObjectService.delete(selectedData).subscribe((result: any) => {
					this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00002', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03002')}));

					// リレーション一覧の場合
					if (this.tagType === this.objectEditorMainComponent.TAB_TYPE_EXPAND_RELATION || this.tagType === this.objectEditorMainComponent.TAB_TYPE_REVERSE_EXPAND_RELATION) {
						// 一覧の基準となっているオブジェクトを削除した場合
						if (!selectedData[0].parent) {
							this.objectList.setData([]);
						} else {
							// データ最新化要求イベント発火
							this.invalidated.emit(this.objectList.getSelectedData());
						}
					} else if (this.tagType === this.objectEditorMainComponent.TAB_TYPE_SHOW_REVISION_LIST) {
						// 全履歴を削除した場合
						if (this.objectList.getData().length === selectedData.length) {
							this.objectList.setData([]);
						} else {
							// データ最新化要求イベント発火
							this.invalidated.emit(this.objectList.getSelectedData());
						}
					} else {
						this.objectList.removeRowData(selectedData);
					}
				});
			}
		);
	}

	/**
	 * リレーション削除押下時の処理です.
	 */
	protected onClickMenuItemDeleteRelation(): void {
		let selectedData = this.getSelectedData();

		let message = '';
		if (selectedData.length === 1) {
			message = this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00013', {value1: selectedData[0].parent.name, value2: selectedData[0].name});
		} else {
			message = this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00010', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02013')});
		}

		// 削除確認ダイアログ表示
		this.messageService.show(EIMMessageType.confirm, message,
			() => {
				// 削除処理実行
				this.objectEditorsRelationService.delete(selectedData).subscribe((result: any) => {
					this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00002', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03003')}));

					// データ最新化要求イベント発火
					this.invalidated.emit(this.objectList.getSelectedData());
				});
			}
		);
	}

	/**
	 * 最新版設定押下時の処理です.
	 */
	protected onClickMenuItemLatestVersionSetting(): void {
		let selectedData = this.getSelectedData()[0];

		// 最新版設定確認ダイアログ表示
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00011', {value: selectedData.name}),
			() => {
				// 最新版設定処理実行
				this.objectEditorsRevisionService.updateLatest(selectedData.id).subscribe((result: any) => {
					this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00003'));

					// データ最新化要求イベント発火
					this.invalidated.emit(this.objectList.getSelectedData());
				});
			}
		);
	}

	/**
	 * ロック押下時の処理です.
	 */
	protected onClickLock(): void {
		let selectedData = this.getSelectedData()[0];
		this.objectEditorDialogManagerComponentService.showLock(selectedData, {
			executed: (executed: any) => {
				// ダイアログを閉じる
				this.objectEditorDialogManagerComponentService.close(dialogName.LOCK);
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00004', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03017')}));

				// データ最新化要求イベント発火
				this.invalidated.emit(this.objectList.getSelectedData());
			},
			errored: () => {
				this.objectEditorDialogManagerComponentService.close(dialogName.LOCK);
			}
		});
	}

	/**
	 * ロック解除押下時の処理です.
	 */
	protected onClickUnlock() {
		let selectedData = this.getSelectedData()[0];

		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00012', {value: selectedData.name}),
			() => {
				// ロック解除処理実行
				this.objectEditorsRevisionService.unlock(selectedData.id).subscribe((result: any) => {
					this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00004', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03018')}));

					// データ最新化要求イベント発火
					this.invalidated.emit(this.objectList.getSelectedData());
				});
			}
		);
	}

	/**
	 * リビジョンアップ押下時の処理です.
	 */
	protected onClickRevisionUp(): void {
		let selectedData = this.getSelectedData()[0];

		// リビジョンアップ確認ダイアログ表示
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_OBJECT_EDITORS.CONFIRM_00003', {value: selectedData.name}),
			() => {
				// リビジョンアップ処理実行
				this.objectEditorsRevisionService.revisionUp(0, selectedData.id).subscribe((result: any) => {
					this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00004', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03016')}));

					// データ最新化要求イベント発火
					this.invalidated.emit(this.objectList.getSelectedData());
				});
			}
		);
	}

	/**
	 * アサイン一覧押下時の処理です.
	 */
	protected onClickAssignUpdator(): void {
		let selectedData =  this.getSelectedData()[0];
		this.objectEditorDialogManagerComponentService.showAssignUpdator(selectedData, this.adjustObjectName(selectedData.name), {
			updated: () => {
				this.objectEditorDialogManagerComponentService.close(dialogName.ASSIGN_UPDATOR);
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00005', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03014')}));
			},
			errored: () => {
				this.objectEditorDialogManagerComponentService.close(dialogName.ASSIGN_UPDATOR);
			}
		});
	}

	/**
	 * イベント履歴押下時の処理です.
	 */
	protected onClickEventHistory(): void {
		let selectedData =  this.getSelectedData()[0];
		this.objectEditorDialogManagerComponentService.showEventHistory(selectedData, this.adjustObjectName(selectedData.name), {
			errored: () => {
				this.objectEditorDialogManagerComponentService.close(dialogName.EVENT_HISTORY);
			}});
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------


	/**
	 * ファイル一覧押下時の処理です.
	 */
	protected onClickFileUploader(): void {
		let selectedData =  this.getSelectedData()[0];
		this.objectEditorDialogManagerComponentService.showFileUploader(selectedData, this.adjustObjectName(selectedData.name), {
			errored: () => {
				this.objectEditorDialogManagerComponentService.close(dialogName.FILE_UPLOADER);
			}
		});
	}

	/**
	 * コンテキストメニューをオブジェクト選択に変更します.
	 */
	protected changeContextMenuSelectObject(): void {
		window.setTimeout(() => {
			this.objectListComponentService.relationCreatorShow = true;
			this.refreshMenu();
			this.contextMenu = this.contextMenuSelectObject;
		});
	}

	/**
	 * コンテキストメニューをデフォルトに変更します.
	 */
	protected changeContextMenuDefault(): void {
		window.setTimeout(() => {
			this.objectListComponentService.relationCreatorShow = false;
			this.refreshMenu();
			this.contextMenu = this.contextMenuDefault;
		});
	}

	/**
	 * オブジェクト選択メニュー押下時のハンドラです.
	 */
	protected onClickSelectObject(): void {
		let selectedData = this.getSelectedData()[0];

		(<EIMRelationCreatorComponent>this.objectEditorDialogManagerComponentService.getView(dialogName.RELATION_CREATOR)).objectSelect(selectedData);
	}

	/**
	 * 一覧の選択行数によりメニューの活性制御（オブジェクト検索）を行います.
	 */
	protected refreshMenuForObjectSearch(): void {
		// 常に非活性
		this.menuItemDeleteRelation.disabled = true; // リレーション削除

		this.menuItemRevisionUp.disabled = true; // リビジョンアップ
		this.menuItemLatestVersionSetting.disabled = true; // 最新版設定
		this.menuItemLock.disabled = true; // ロック
		this.menuItemUnLock.disabled = true; // ロック解除

		this.menuItemUpdateRelationAttribute.disabled  = true; // リレーション属性

		// 一覧の選択行数によって活性制御
		let length = this.getSelectedData().length;
		// 選択行数が1の場合
		if (length === 1) {
			if (this.objectListComponentService.relationCreatorShow) {
				this.menuItemCreateRelation.disabled = true; // リレーション
			} else {
				this.menuItemCreateRelation.disabled = false; // リレーション
			}

			this.menuItemDeleteObject.disabled = false; // オブジェクト削除

			this.menuItemExpandRelation.disabled  = false; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = false; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = false; // オブジェクト属性
			this.menuItemShowRevisionList.disabled  = false; // リビジョン一覧
			this.menuItemShowFileList.disabled  = false; // ファイル一覧
			this.menuItemShowEventList.disabled  = false; // イベント一覧
			this.menuItemShowAsignList.disabled  = false; // アサイン一覧

			this.menuItemSelectObject.disabled = false; // オブジェクト選択
		} else {
			// リレーションは選択行数2であれば活性
			if (length === 2) {
				if (this.objectListComponentService.relationCreatorShow) {
					this.menuItemCreateRelation.disabled = true; // リレーション
				} else {
					this.menuItemCreateRelation.disabled = false; // リレーション
				}
			} else {
				this.menuItemCreateRelation.disabled = true; // リレーション
			}

			// オブジェクト削除は選択行数0以外であれば活性
			if (length !== 0) {
				this.menuItemDeleteObject.disabled = false; // オブジェクト削除
			} else {
				this.menuItemDeleteObject.disabled = true; // オブジェクト削除
			}

			this.menuItemExpandRelation.disabled  = true; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = true; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = true; // オブジェクト属性
			this.menuItemShowRevisionList.disabled  = true; // リビジョン一覧
			this.menuItemShowFileList.disabled  = true; // ファイル一覧
			this.menuItemShowEventList.disabled  = true; // イベント一覧
			this.menuItemShowAsignList.disabled  = true; // アサイン一覧

			this.menuItemSelectObject.disabled = true; // オブジェクト選択
		}
	}

	/**
	 * 一覧の選択行数によりメニューの活性制御（リビジョン一覧）を行います.
	 */
	protected refreshMenuForRevisionList() {
		// 常に非活性
		this.menuItemDeleteRelation.disabled = true; // リレーション削除
		this.menuItemUpdateRelationAttribute.disabled  = true; // リレーション属性

		// 一覧の選択行数によって活性制御
		let length = this.getSelectedData().length;
		// 選択行数が1の場合
		if (length === 1) {
			if (this.objectListComponentService.relationCreatorShow) {
				this.menuItemCreateRelation.disabled = true; // リレーション
			} else {
				this.menuItemCreateRelation.disabled = false; // リレーション
			}

			this.menuItemDeleteObject.disabled = false; // オブジェクト削除

			this.menuItemRevisionUp.disabled = false; // リビジョンアップ
			this.menuItemLatestVersionSetting.disabled = false; // 最新版設定
			this.menuItemLock.disabled = false; // ロック
			this.menuItemUnLock.disabled = false; // ロック解除

			this.menuItemExpandRelation.disabled  = false; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = false; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = false; // オブジェクト属性
			this.menuItemShowRevisionList.disabled  = false; // リビジョン一覧
			this.menuItemShowFileList.disabled  = false; // ファイル一覧
			this.menuItemShowEventList.disabled  = false; // イベント一覧
			this.menuItemShowAsignList.disabled  = false; // アサイン一覧

			this.menuItemSelectObject.disabled = false; // オブジェクト選択
		} else {
			// リレーションは選択行数2であれば活性
			if (length === 2) {
				if (this.objectListComponentService.relationCreatorShow) {
					this.menuItemCreateRelation.disabled = true; // リレーション
				} else {
					this.menuItemCreateRelation.disabled = false; // リレーション
				}
			} else {
				this.menuItemCreateRelation.disabled = true; // リレーション
			}

			// オブジェクト削除は選択行数0以外であれば活性
			if (length !== 0) {
				this.menuItemDeleteObject.disabled = false; // オブジェクト削除
			} else {
				this.menuItemDeleteObject.disabled = true; // オブジェクト削除
			}

			this.menuItemRevisionUp.disabled = true; // リビジョンアップ
			this.menuItemLatestVersionSetting.disabled = true; // 最新版設定
			this.menuItemLock.disabled = true; // ロック
			this.menuItemUnLock.disabled = true; // ロック解除

			this.menuItemExpandRelation.disabled  = true; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = true; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = true; // オブジェクト属性
			this.menuItemShowRevisionList.disabled  = true; // リビジョン一覧
			this.menuItemShowFileList.disabled  = true; // ファイル一覧
			this.menuItemShowEventList.disabled  = true; // イベント一覧
			this.menuItemShowAsignList.disabled  = true; // アサイン一覧

			this.menuItemSelectObject.disabled = true; // オブジェクト選択
		}
	}

	/**
	 * 一覧の選択行数によりメニューの活性制御（リレーション正展開・逆展開）を行います.
	 */
	protected refreshMenuForExpandRelation() {
		// 常に非活性
		this.menuItemRevisionUp.disabled = true; // リビジョンアップ
		this.menuItemLatestVersionSetting.disabled = true; // 最新版設定
		this.menuItemLock.disabled = true; // ロック
		this.menuItemUnLock.disabled = true; // ロック解除

		// 一覧の選択行数によって活性制御
		let selectedData = this.getSelectedData();

		// リレーション以外を選択しているか判定
		let selectNotRelation = false;
		for (let i = 0; i < selectedData.length; i++) {
			// 親がいない場合、リレーションではないと判断
			if (!selectedData[i].parent) {
				selectNotRelation = true;
				break;
			}
		}

		// 選択行数が1の場合
		if (selectedData.length === 1) {
			if (this.objectListComponentService.relationCreatorShow) {
				this.menuItemCreateRelation.disabled = true; // リレーション
			} else {
				this.menuItemCreateRelation.disabled = false; // リレーション
			}

			this.menuItemDeleteObject.disabled = false; // オブジェクト削除
			this.menuItemDeleteRelation.disabled = selectNotRelation; // リレーション削除

			this.menuItemExpandRelation.disabled  = false; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = false; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = false; // オブジェクト属性
			this.menuItemUpdateRelationAttribute.disabled  = selectNotRelation; // リレーション属性
			this.menuItemShowRevisionList.disabled  = false; // リビジョン一覧
			this.menuItemShowFileList.disabled  = false; // ファイル一覧
			this.menuItemShowEventList.disabled  = false; // イベント一覧
			this.menuItemShowAsignList.disabled  = false; // アサイン一覧

			this.menuItemSelectObject.disabled = false; // オブジェクト選択
		} else {
			// リレーションは選択行数2であれば活性
			if (selectedData.length === 2) {
				if (this.objectListComponentService.relationCreatorShow) {
					this.menuItemCreateRelation.disabled = true; // リレーション
				} else {
					this.menuItemCreateRelation.disabled = false; // リレーション
				}
			} else {
				this.menuItemCreateRelation.disabled = true; // リレーション
			}

			// オブジェクト削除、リレーション削除は選択行数0以外であれば活性
			if (selectedData.length !== 0) {
				this.menuItemDeleteObject.disabled = false; // オブジェクト削除
				this.menuItemDeleteRelation.disabled = selectNotRelation; // リレーション削除
			} else {
				this.menuItemDeleteObject.disabled = true; // オブジェクト削除
				this.menuItemDeleteRelation.disabled = true; // リレーション削除
			}

			this.menuItemExpandRelation.disabled  = true; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = true; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = true; // オブジェクト属性
			this.menuItemUpdateRelationAttribute.disabled  = true; // リレーション属性
			this.menuItemShowRevisionList.disabled  = true; // リビジョン一覧
			this.menuItemShowFileList.disabled  = true; // ファイル一覧
			this.menuItemShowEventList.disabled  = true; // イベント一覧
			this.menuItemShowAsignList.disabled  = true; // アサイン一覧

			this.menuItemSelectObject.disabled = true; // オブジェクト選択
		}
	}

	/**
	 * 一覧の選択行数によりメニューの活性制御（オブジェクト登録）を行います.
	 */
	protected refreshMenuForNewObject(): void {
		// 常に非活性
		this.menuItemDeleteRelation.disabled = true; // リレーション削除

		this.menuItemRevisionUp.disabled = true; // リビジョンアップ
		this.menuItemLatestVersionSetting.disabled = true; // 最新版設定
		this.menuItemLock.disabled = true; // ロック
		this.menuItemUnLock.disabled = true; // ロック解除

		this.menuItemUpdateRelationAttribute.disabled  = true; // リレーション属性

		// 一覧の選択行数によって活性制御
		let length = this.getSelectedData().length;
		// 選択行数が1の場合
		if (length === 1) {
			if (this.objectListComponentService.relationCreatorShow) {
				this.menuItemCreateRelation.disabled = true; // リレーション
			} else {
				this.menuItemCreateRelation.disabled = false; // リレーション
			}

			this.menuItemDeleteObject.disabled = false; // オブジェクト削除

			this.menuItemExpandRelation.disabled  = false; // リレーション正展開
			this.menuItemReverseExpandRelation.disabled  = false; // リレーション逆展開

			this.menuItemUpdateObjectAttribute.disabled  = false; // オブジェクト属性
			this.menuItemShowRevisionList.disabled  = false; // リビジョン一覧
			this.menuItemShowFileList.disabled  = false; // ファイル一覧
			this.menuItemShowEventList.disabled  = false; // イベント一覧
			this.menuItemShowAsignList.disabled  = false; // アサイン一覧

			this.menuItemSelectObject.disabled = false; // オブジェクト選択
		} else {
			// リレーションは選択行数2であれば活性
			if (length === 2) {
				if (this.objectListComponentService.relationCreatorShow) {
					this.menuItemCreateRelation.disabled = true; // リレーション
				} else {
					this.menuItemCreateRelation.disabled = false; // リレーション
				}
			} else {
				this.menuItemCreateRelation.disabled = true; // リレーション
				this.menuItemDeleteObject.disabled = true; // オブジェクト削除

				this.menuItemExpandRelation.disabled  = true; // リレーション正展開
				this.menuItemReverseExpandRelation.disabled  = true; // リレーション逆展開

				this.menuItemUpdateObjectAttribute.disabled  = true; // オブジェクト属性
				this.menuItemShowRevisionList.disabled  = true; // リビジョン一覧
				this.menuItemShowFileList.disabled  = true; // ファイル一覧
				this.menuItemShowEventList.disabled  = true; // イベント一覧
				this.menuItemShowAsignList.disabled  = true; // アサイン一覧

				this.menuItemSelectObject.disabled = true; // オブジェクト選択
			}
		}
	}

	/**
	 * 選択行を取得します.
	 * ツリー表示かどうかを考慮します.
	 * @return 選択行
	 */
	private getSelectedData(): any[] {
		let selectedData = this.objectList.getSelectedData();

		if (this.isTreeDataGrid) {
			let result = [];
			for (let i = 0; i < selectedData.length; i++) {
				result.push(selectedData[i].data);
			}
			selectedData = result;
		}

		return selectedData;
	}

	/**
	 * オブジェクト名の長さを調整します.
	 * 20文字以上の場合は途中で切り出し3点リーダーをつける
	 * @param objectName 対象オブジェクト名
	 * @return 調整後オブジェクト名
	 */
	private adjustObjectName(objectName: string): string {
		for (let i = 1; i < objectName.length; i++) {
			if (i >= 20) {
				objectName = objectName.slice(0, i);
				objectName = objectName + EIMConstantService.THREE_DOT_LEADER;
				break;
			}
		}
		return objectName;
	}
}
