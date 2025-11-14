import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';

import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';

/**
 * ドキュメントタイプ選択ツリーコンポーネント
 * @example
 *
 *      <eim-object-type-tree-selector
 *          [content]="content"
 *          [workspaceObjId]="workspaceObjId"
 *      </eim-object-type-tree-selector>
 */
@Component({
    selector: 'eim-object-type-tree-selector',
    templateUrl: './object-type-tree-selector.component.html',
    styleUrls: ['./object-type-tree-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMObjectTypeTreeSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMObjectTypeTreeSelectorComponent) }],
    standalone: false
})
export class EIMObjectTypeTreeSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** ドキュメントツリーコンポーネント */
	@ViewChild('documentTypeTree', { static: true })
	public documentTypeTree: EIMTreeComponent;

	/** 対象のオブジェクト */
	@Input() public content: any;

	/** ワークスペースオブジェクトID */
	@Input() public workspaceObjId: number;

	/** 対象のオブジェクト */
	@Input() public typeName: string;

	/** 親タイプ選択可能フラグ */
	@Input() public selectableParent = false;

	/** オブジェクトタイプグリッド行選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeNode;

	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
			{label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); }},
			{label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); }},
	];

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected objectTypeService: EIMObjectTypeService,
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
		// 呼び出し元に選択したドキュメントタイプを返却する
		// 選択したドキュメントタイプ情報を呼び出し元に通知
		this.selected.emit(this.documentTypeTree.getSelectedData()[0].data);
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

		// ドキュメントタイプ一覧取得
		this.objectTypeService.getHierarchical(this.workspaceObjId, this.typeName)
			.subscribe((hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
				this.setTreeData(hierarchicalContentsType);
				window.setTimeout(() => {
					this.fetched.emit(hierarchicalContentsType);
				});
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				})
			}
		);
	}

	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.documentTypeTree.expandAll();
	}

	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.documentTypeTree.collapseAll();
	}

	/**
	 * 選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		let selectedData: any[] = this.documentTypeTree.getSelectedData();
		if (selectedData.length === 0) {
			return [];
		}
		return [selectedData[0].data];
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
	public onSelectFolderTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0];
		if (!this.selectedTreeNode.expanded) {
			this.selectedTreeNode.expanded = true;
		}

		if (this.selectedTreeNode.children.length > 0 && !this.selectableParent) {
			// 選択を解除する
			this.documentTypeTree.info.selectedData[0] = null;
			this.selectedTreeNode = null;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	private setTreeData(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]): void {
		let treeData = this.hierarchicalDomainService.convert(hierarchicalContentsType, (type: EIMHierarchicalObjectTypeDomain): EIMTreeNode => {
			// コンバート
			let selectable = true;
			if (type.children && type.children.length > 0) {
				selectable = false;
			}

			let label: string;
			// 「ドキュメント」を「一般ドキュメント」、「フォルダ」を「一般フォルダ」で表示する
			if (type.name === this.translateService.instant('EIM_DOCUMENTS.DOCUMENT')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_DOCUMENT')
			} else if (type.name === this.translateService.instant('EIM_DOCUMENTS.FOLDER')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_FOLDER')
			} else {
				label = type.name;
			}

			// 指定されたタイプに応じてアイコンを変更する
			let iconStr = 'fa fa-fw fa-lg eim-icon-document eim-icon-document-color';
			if (this.typeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
				iconStr = 'fa fa-fw fa-lg eim-icon-folder eim-icon-folder-color';
			} else if (this.typeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
				iconStr = 'fa fa-fw fa-lg eim-icon-tag eim-icon-tag-color';
			}
			let treeNode: EIMTreeNode = {
				label: label,
				// selectable: selectable,
				expandedIcon: iconStr,
				collapsedIcon: iconStr,
				data: type
			};
			return treeNode;
		});
		window.setTimeout(() => {
			// データをセット
			this.documentTypeTree.setData(treeData);

			// ツリーを全展開
			this.documentTypeTree.expandAll();
		});
	}
}
