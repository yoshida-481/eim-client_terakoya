import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMHierarchicalContentsService, EIMHierarchicalContents } from 'app/admins/shared/services/apis/hierarchical-contents.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * フォルダツリー用ツリーノードインタフェース
 */
export interface EIMFolderTreeNode extends EIMTreeNode {
	objTypeId?: number;
	objTypeName?: string;
	isRootType?: boolean;
	isBranch?: boolean;
	isSearch?: boolean;
	rootObjTypeDefName?: string;
	isTrash?: boolean;
}

/**
 * コンテンツツリーコンポーネントサービス.
 */
@Injectable()
export class EIMClassTreeComponentService extends EIMTreeComponentService {

	// ごみ箱オブジェクトID
	private trashObjectId: number;

	constructor(
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected hierarchicalContentsService: EIMHierarchicalContentsService) {
		super(hierarchicalDomainService);

		/**
		 * 選択対象の行かどうか判定します.
		 */
		this.defaultEquals = (arg1: any, arg2: any) => {
			return (arg1.objId === arg2.objId);
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 初期化します.
	 */
	public initialize(info: EIMListComponentInfo<EIMFolderTreeNode>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

			// 第1階層のワークスペースを設定する
			this.hierarchicalContentsService.getRoot(false)
				.subscribe((workspaces: EIMHierarchicalContents[]) => {
					let selectedObjectId: number;
					for (let i = 0; i < workspaces.length; i++) {
						let folderTreeNode: EIMFolderTreeNode = this.convertHierarchicalDataToEIMFolderTreeNode(workspaces[i]);
						info.data.push(folderTreeNode);
					}
					// 初期化処理が終わったのでイベント発行
					if (initialized) {
						initialized.emit();
					}

					// 選択処理実行
					if (info.selectedData && info.selectedData.length > 0) {
						this.select(info, [{ objTypeId: info.selectedData[0].objTypeId }], selected);
					}

				});
	}

	/**
	 * 階層データをツリーノードに変換します.
	 * @param contents 階層データ
	 * @return ツリーノード
	 */
	public convertHierarchicalDataToEIMFolderTreeNode(contents: EIMHierarchicalContents): EIMFolderTreeNode {
		let icon: string = 'fa fa-fw fa-lg ' + this.getIcon(contents);
		let parent: EIMFolderTreeNode = {
			label: contents.label,
			data: contents,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: false,

			objTypeId: Number(contents.objTypeId),
			objTypeName: contents.objTypeName,
			isRootType: contents.isRootType,
			isBranch: true,
			isSearch: false,
			rootObjTypeDefName: contents.rootObjTypeDefName,
			isTrash: (contents.objTypeName === EIMAdminsConstantService.OBJECT_TYPE_TRASH_CAN ||
				contents.objTypeName === EIMAdminsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN ? true : false),
		};

		let children: EIMFolderTreeNode[] = [];
		// 子ノードを設定する
			for (let i = 0; i < contents.children.length; i++) {
				children.push(this.convertHierarchicalDataToEIMFolderTreeNode(<EIMHierarchicalContents>contents.children[i]));
			this.hierarchicalDomainService.setChildren(parent, children);
		}

		if (children.length === 0) {
			parent.leaf = true;
		}
		return parent;
	}

	/**
	 * 最新の情報に更新する.
	 * @param info グリッドコンポーネント情報
	 * @param objId 現在選択しているツリーノードのオブジェクトID
	 * @param objIds グリッド選択状態のオブジェクトID
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public updateLatest(info: EIMListComponentInfo<EIMFolderTreeNode>, objId: number, objIds: number[], initialized?: EventEmitter<any>, selected?: EventEmitter<any>, params?: any): void {

		if (objId) {
			// 選択階層までを設定する
			info.selectedData[0] = {objTypeId: objId};
			info.data = [];
			this.initialize(info, null, initialized, selected);
		} else {
			// ツリー初期表示を実行する
			info.selectedData = [];
			info.data = [];
			this.initialize(info, null, initialized, selected);
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * アイコンを取得する
	 * @param node ツリーノード
	 * @return アイコンクラス文字列
	 */
	protected getIcon(node): string {
		if (node.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_WORKSPACE) {
			return 'eim-icon-workspace eim-icon-workspace-color';
		}
		if (node.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_DOCUMENT) {
			return 'eim-icon-document eim-icon-document-color';
		}
		if (node.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TAG) {
			return 'eim-icon-tag eim-icon-tag-color';
		}
		if (node.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_TRASH_CAN ||
			node.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
			return 'eim-icon-trash eim-icon-trash-color';
		}
		if (node.rootObjTypeDefName === EIMAdminsConstantService.OBJECT_TYPE_FOLDER) {
			return 'eim-icon-folder eim-icon-folder-color';
		}
		if (node.objName === EIMAdminsConstantService.OBJECT_NAME_FAVORITE) {
			return 'fa fa-star';
		}
		if (node.objName === EIMAdminsConstantService.OBJECT_NAME_PDF_CONVERSION) {
			return 'eim-icon-pdf';
		}
		if (node.objName === EIMAdminsConstantService.OBJECT_NAME_MY_DOCUMENTS) {
			return 'fa fa-folder-open';
		}
		if (node.objName === EIMAdminsConstantService.OBJECT_NAME_CONFIRM_RECEPTION) {
			return 'fa fa-envelope';
		}
		return 'eim-icon-file eim-icon-file-color';
	}

}
