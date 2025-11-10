import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMWorkspaceTypeSingleSelectorComponentService, EIMFormTypeTreeNode } from 'app/admins/components/workspace-type-selector/workspace-type-single-selector.component.service';
import { EIMWorkspaceFormTypeDTO } from 'app/admins/shared/dtos/workspace-form-type.dto';


/**
 * 帳票タイプツリー選択コンポーネント
 * @example
 *
 *      <eim-workspace-type-single-selector
 *          [data]="data"
 *          [selectedData]="selectedData"
 *          [selectableParent]="selectableParent"
 *      >
 *      </eim-workspace-type-single-selector>
 */
@Component({
    selector: 'eim-workspace-type-single-selector',
    templateUrl: './workspace-type-single-selector.component.html',
    styleUrls: ['./workspace-type-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceTypeSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMWorkspaceTypeSingleSelectorComponent) }],
    standalone: false
})
export class EIMWorkspaceTypeSingleSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** 帳票タイプツリーコンポーネント */
	@ViewChild('formTypeTree', { static: true }) public formTypeTree: EIMTreeComponent;

	/** 親タイプ選択可能フラグ */
	@Input() public selectableParent = false;

	/** グリッド行選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeNode;

	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		{ label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); } },
		{ label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); } },
	];


	/**
	 * コンストラクタ.
	 */
	constructor(
		protected adminsFormWorkspaceService: EIMAdminsFormWorkspaceService,
		protected workspaceTypeComponentService: EIMWorkspaceTypeSingleSelectorComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected translateService: TranslateService,
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
		// 呼び出し元に選択した帳票タイプタイプを返却する
		// 選択した帳票タイプタイプ情報を呼び出し元に通知
		this.selected.emit(this.formTypeTree.getSelectedData()[0].data);
	}


	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return (this.selectedTreeNode != null);
	}


	/**
	 * 画面を表示します.
	 */
	public show(): void {

		// 帳票タイプ選択時、帳票タイプツリー取得
		this.adminsFormWorkspaceService.getFormTypeListByDefName().subscribe(
			(formType: EIMWorkspaceFormTypeDTO) => {
				// 帳票タイプツリーに要素を設定
				if (formType) {
					let treeNode: EIMFormTypeTreeNode = this.workspaceTypeComponentService.convertFormTypeToTreeNodes(formType);
					treeNode.expanded = true;
					treeNode.objectType = EIMAdminsConstantService.OBJECT_TYPE_NAME;
					this.formTypeTree.setData([treeNode]);
					// 画面表示完了通知
					window.setTimeout(() => {
						this.fetched.emit();
					});
				}

			}, (err: any) => {
				// 検索エラーの場合、画面を閉じる
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}


	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.formTypeTree.expandAll();
	}


	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.formTypeTree.collapseAll();
	}


	/**
	 * @return 選択帳票タイプノッド
	 */
	public getSelectedData(): EIMWorkspaceFormTypeDTO[] {
		if (this.selectedTreeNode) {
			return [this.selectedTreeNode.data];
		} else {
			return [];
		}
	}


	/**
	 * フィルタを実行します.
	 * 何もしません.
	 * @param unvisibleData 非表示データ
	 */
	public filter(unvisibleData: any[]): void {
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
	onSelectedFolderTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0];
		if (!this.selectedTreeNode.expanded) {
			this.selectedTreeNode.expanded = true;
		}

		if (this.selectedTreeNode.children.length > 0 && !this.selectableParent) {
			// 選択を解除する
			this.formTypeTree.info.selectedData[0] = null;
			this.selectedTreeNode = null;
		}

	}

}
