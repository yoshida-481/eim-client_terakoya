import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMEntrySelectorComponentService } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';

/**
 * ロール選択ツリーコンポーネント
 * @example
 *
 *      <eim-role-single-selector>
 *      </eim-role-single-selector>
 */
@Component({
    selector: 'eim-role-single-selector',
    templateUrl: './role-single-selector.component.html',
    styleUrls: ['./role-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMRoleSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMRoleSingleSelectorComponent) }],
    standalone: false
})
export class EIMRoleSingleSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** ロールツリーコンポーネント */
	@ViewChild('singleRoleContentsTree', { static: true })
	public singleRoleContentsTree: EIMTreeComponent;

	/** ロールグリッド行選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeNode;

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected adminsEntryService: EIMAdminsEntryService,
		protected adminsRoleService: EIMAdminsRoleService,
		public treeComponentService: EIMEntrySelectorComponentService,
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
		// 呼び出し元に選択したクラスを返却する
		// 選択したクラス情報を呼び出し元に通知
		this.selected.emit(this.singleRoleContentsTree.getSelectedData()[0].data);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 * @return ボタン押下可否
	 */
	public selectable(): boolean {
		return (this.selectedTreeNode != null);
	}

	/**
	 * 画面を表示します.
	 */
	public show(): void {
		// ロール一覧取得
		this.adminsRoleService.getRoleList().subscribe(
			(roleObject: any) => {
				// ロールツリーに要素を設定
				if (roleObject.roles.role != null) {
					let treeNodes: EIMTreeNode[] = this.treeComponentService.convertRolesToTreeNodes(roleObject.roles.role);
					this.singleRoleContentsTree.setData(treeNodes);
				}
			}
		);
	}

	/**
	 * 選択情報を取得します.
	 * @return 選択情報
	 */
	public getSelectedData(): any[] {
		return this.singleRoleContentsTree.getSelectedData()[0].data;
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
	 * ノード選択イベントハンドラ.
	 * @param event ツリーノード選択データ
	 */
	public onSelectRoleTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0];
		if (!this.selectedTreeNode.expanded) {
			this.selectedTreeNode.expanded = true;
		}
	}
}
