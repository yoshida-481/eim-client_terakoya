import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMClassService } from 'app/admins/shared/services/apis/class.service';
import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';

import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

/**
 * クラス選択ツリーコンポーネント
 * @example
 *
 *      <eim-class-single-selector
 *        [adminAppId]="adminAppId"
 *        [parentObjTypeName]="parentObjTypeName"
 *        [objTypeId]="objTypeId">eim-class-single-selector
 *        [adminAppId]="adminAppId"
 *        [parentObjTypeName]="parentObjTypeName"
 *        [objTypeId]="objTypeId">
 *      </eim-class-single-selector>
 */
@Component({
    selector: 'eim-class-single-selector',
    templateUrl: './class-single-selector.component.html',
    styleUrls: ['./class-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMClassSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMClassSingleSelectorComponent) }],
    standalone: false
})
export class EIMClassSingleSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** クラスツリーコンポーネント */
	@ViewChild('classContentsTree', { static: true })
	public classContentsTree: EIMTreeComponent;

	/** システム管理区分 */
	@Input() adminAppId: string;

	/** 親タイプ名 */
	@Input() parentObjTypeName: string;

	/** 選択タイプID */
	@Input() objTypeId: number;

	/** グリッド行選択イベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

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
		protected classService: EIMClassService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
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
		let selectedNode = this.classContentsTree.getSelectedData()[0];
		if ( this.isParent( selectedNode, this.objTypeId ) ) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00020'));
			return;
		}
		// 呼び出し元に選択したクラスを返却する
		// 選択したクラス情報を呼び出し元に通知
		this.selected.emit(this.classContentsTree.getSelectedData()[0].data);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 * @return 押下可否
	 */
	public selectable(): boolean {
		return true;
	}

	/**
	 * 画面を表示します.
	 */
	public show(): void {
		let objTypeId = this.objTypeId;
		if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_GENERAL) {
			objTypeId = null;
		}

		this.classService.getHierarchical(objTypeId)
		.subscribe((hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
			if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {

				// 文書管理用の場合、添付ファイルタイプを除外する
				for (let i = 0; i < hierarchicalContentsType.length; i++) {
					if (hierarchicalContentsType[i].definitionName === EIMAdminsConstantService.PRIMARY_ATTACHMENT
					|| hierarchicalContentsType[i].definitionName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT) {
						hierarchicalContentsType.splice(i, 1);
						i--;
					}
				}
			}
			this.setTreeData(hierarchicalContentsType);
			window.setTimeout(() => {
				this.fetched.emit(hierarchicalContentsType);
			});
		},
		(err: any) => {
			// エラーの場合
			window.setTimeout(() => {
				this.errored.emit();
			})
		});
	}

	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.classContentsTree.expandAll();
	}

	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.classContentsTree.collapseAll();
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
	onSelectFolderTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0];
		if (!this.selectedTreeNode.expanded) {
			this.selectedTreeNode.expanded = true;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 取得したクラス一覧を表示します.
	 * @param hierarchicalContentsType 取得したクラス一覧
	 */
	private setTreeData(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]): void {
		// 帳票管理から開く場合は帳票添付ファイルと一次添付ファイルを非表示
		for (let i = hierarchicalContentsType.length - 1; i >= 0; i--) {
			if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM &&
				hierarchicalContentsType[i].definitionName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT) {
				hierarchicalContentsType.splice(i, 1)
			} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_FORM &&
				hierarchicalContentsType[i].definitionName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
				hierarchicalContentsType.splice(i, 1)
			}
		}
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
			let iconStr = 'fa fa-fw fa-lg eim-icon-form-type';
			if (type.definitionName === EIMAdminsConstantService.OBJECT_TYPE_FOLDER) {
				iconStr = 'fa fa-fw fa-lg eim-icon-folder eim-icon-folder-color';
			} else if (type.definitionName === EIMAdminsConstantService.OBJECT_TYPE_TAG) {
				iconStr = 'fa fa-fw fa-lg eim-icon-tag eim-icon-tag-color';
			} else if (type.definitionName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
				iconStr = 'fa fa-fw fa-lg eim-icon-document eim-icon-document-color';
			} else if (type.definitionName === EIMAdminsConstantService.OBJECT_TYPE_TRASH_CAN) {
				iconStr = 'fa fa-fw fa-lg eim-icon-trash eim-icon-trash-color';
			} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT &&
				type.definitionName === EIMAdminsConstantService.DOCUMENT_ATTACHMENT) {
				iconStr = 'fa fa-fw fa-lg eim-icon-document eim-icon-document-color';
			} else if (this.adminAppId === EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT &&
				type.definitionName === EIMAdminsConstantService.PRIMARY_ATTACHMENT) {
				iconStr = 'fa fa-fw fa-lg eim-icon-document eim-icon-document-color';
			} else if (type.name === EIMAdminsConstantService.OBJECT_NAME_FAVORITE) {
				iconStr = 'fa fa-fw fa-lg fa-star';
			} else if (type.name === EIMAdminsConstantService.OBJECT_NAME_PDF_CONVERSION) {
				iconStr = 'fa fa-fw fa-lg eim-icon-pdf';
			} else if (type.name === EIMAdminsConstantService.OBJECT_NAME_MY_DOCUMENTS) {
				iconStr = 'fa fa-fw fa-lg fa-folder-open';
			} else if (type.name === EIMAdminsConstantService.OBJECT_NAME_CONFIRM_RECEPTION) {
				iconStr = 'fa fa-fw fa-lg fa-envelope';
			}
			let treeNode: EIMTreeNode = {
				label: label,
				expandedIcon: iconStr,
				collapsedIcon: iconStr,
				data: type
			};
			return treeNode;
		});
		window.setTimeout(() => {
			// データをセット
			// ツリー選択要素を選択
			this.classContentsTree.setData(treeData);
			for (let i = 0; i < treeData.length; i++) {
				this.selectedTree(treeData[i]);
			}
		});
	}

	/**
	 * ツリー選択要素を選択します.
	 * @param treeDataNode ツリーデータ
	 * @return 選択結果
	 */
	private selectedTree(treeDataNode: EIMTreeNode): boolean {
		if (treeDataNode.label === this.parentObjTypeName) {
			this.classContentsTree.select([treeDataNode] , false);
			return true;
		}
		for (let i = 0; i < treeDataNode.children.length; i++) {
			if (this.selectedTree(treeDataNode.children[i])) {
				this.classContentsTree.expand(treeDataNode, true);
				return true;
			}
		}
		return false;
	}

	/**
	 * 親（自分も含む）をチェックする.
	 * @param treeDataNode 選択したノード
	 * @param id 対象ID
	 * @return チェック結果
	 */
	private isParent(treeDataNode: EIMTreeNode, id: number ): boolean {
		if ( treeDataNode.data.id === id ) {
			return true;
		}
		if ( treeDataNode.parent ) {
			if ( this.isParent(treeDataNode.parent, id) ) {
				return true;
			}
		}
		return false;
	}

}
