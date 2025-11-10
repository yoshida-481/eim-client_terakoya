import { Component, forwardRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem, EIMCreatable } from 'app/shared/shared.interface';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMEntrySelectorComponentService } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMAdminsComplexGroupService } from 'app/admins/shared/services/apis/admins-complex-group.service';

/**
 * 複合グループ作成ツリーコンポーネント
 * @example
 *
 *      <eim-complex-group-creator
 *      </eim-complex-group-creator>
 */
@Component({
    selector: 'eim-complex-group-creator',
    templateUrl: './complex-group-creator.component.html',
    styleUrls: ['./complex-group-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMComplexGroupCreatorComponent) }
    ],
    standalone: false
})
export class EIMComplexGroupCreatorComponent implements OnInit, EIMCreatable {

	/** グループツリーコンポーネント */
	@ViewChild('singleGroupContentsTree', { static: true })
	public singleGroupContentsTree: EIMTreeComponent;

	/** ロールツリーコンポーネント */
	@ViewChild('singleRoleContentsTree', { static: true })
	public singleRoleContentsTree: EIMTreeComponent;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** グループツリー選択ノード */
	private groupSelectedTreeNode: EIMTreeNode;

	/** ロールツリー選択ノード */
	private roleSelectedTreeNode: EIMTreeNode;

	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
			{label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); }},
			{label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); }},
	];

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected adminsEntryService: EIMAdminsEntryService,
		protected adminsRoleService: EIMAdminsRoleService,
		protected translateService: TranslateService,
		public treeComponentService: EIMEntrySelectorComponentService,
		protected adminsGroupService: EIMAdminsGroupService,
		protected adminsComplexGroupService: EIMAdminsComplexGroupService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 複合グループを登録します.
	 */
	public create(): void {
		let groupId = this.groupSelectedTreeNode.data.entryId;
		let roleId = this.roleSelectedTreeNode.data.entryId;

		this.adminsComplexGroupService.createComp(groupId, roleId)
			.subscribe(
			(data: any) => {
				this.created.emit(data);
			},
			(err: any) => {
			}
		);
	}

	/**
	 * 登録ボタン押下可否を返却します.
	 */
	public creatable(): boolean {
		return (this.groupSelectedTreeNode != null && this.roleSelectedTreeNode != null);
	}

	/**
	 * 画面を表示します.
	 */
	public show(): void {

		// グループ一覧取得
		this.adminsGroupService.getGroupList()
			.subscribe((groupObject: any) => {
				// グループツリーに要素を設定
				if (groupObject.groups.group != null) {
					let treeNodes: EIMTreeNode[] = this.treeComponentService.convertGroupsToTreeNodes(groupObject.groups.group);
					this.singleGroupContentsTree.setData(treeNodes);
				}
			});

		// ロール一覧取得
		this.adminsRoleService.getRoleList()
			.subscribe((roleObject: any) => {
				// ロールツリーに要素を設定
				if (roleObject.roles.role != null) {
					let treeNodes: EIMTreeNode[] = this.treeComponentService.convertRolesToTreeNodes(roleObject.roles.role);
					this.singleRoleContentsTree.setData(treeNodes);
				}
			});
	}

	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.singleGroupContentsTree.expandAll();
	}

	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.singleGroupContentsTree.collapseAll();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		this.show();
	}

	/**
	 * グループノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	onSelectGroupTreeNode(event: any): void {
		this.groupSelectedTreeNode = event.selectedData[0];
		if (!this.groupSelectedTreeNode.expanded) {
			this.groupSelectedTreeNode.expanded = true;
		}
	}

	/**
	 * ロールノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	onSelectRoleTreeNode(event: any): void {
		this.roleSelectedTreeNode = event.selectedData[0];
		if (!this.roleSelectedTreeNode.expanded) {
			this.roleSelectedTreeNode.expanded = true;
		}
	}

}
