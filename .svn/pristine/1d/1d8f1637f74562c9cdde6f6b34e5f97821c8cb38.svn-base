import { EIMTreeNode } from './../../../shared/components/tree/tree.component.service';
import { EIMHierarchicalDomainService } from './../../../shared/services/hierarchical-domain.service';
import { EIMWorkspaceService, EIMWorkspace } from './../../shared/services/apis/workspace.service';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMSecuritySelectorComponent } from './../security-selector/security-selector.component';
import { EIMObjectTypeAttributeComponent } from './object-type-attribute.component';
import { EIMMasterContentsApproveWorkflowDiagramComponent } from './../master-contents-approve-workflow-diagram/master-contents-approve-workflow-diagram.component';
import { EIMComponentInfo } from './../../../shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

/**
 * コンポーネント情報
 */
export interface EIMWorkspaceCreatorComponentInfo extends EIMComponentInfo {
	/** ワークスペース名称 */
	name?: string,
	/** アクセスセキュリティ */
	accessSecurity?: EIMSecurity,
	/** フォルダ構成管理制限 */
	folderSecurity?: EIMSecurity,
	/** 手動削除禁止フラグ */
	isManualDeleteFlag?: boolean,
	/** ワークスペース管理権限フラグ */
	isWorkspaceSystemAuth?: boolean,
	/** 管理者リスト */
	adminUsers?: any[],

	/** ドキュメントタイプ制限フラグ */
	docTypeCondition?: string,
	/** ドキュメントタイプワークフローダイアグラム */
	documentTypeWorkflowDiagram?: EIMMasterContentsApproveWorkflowDiagramComponent,
	/** ドキュメントタイプ属性一覧 */
	docTypeAttributeList?: EIMObjectTypeAttributeComponent,
	/** ドキュメントツリーコンポーネント */
	documentTypeTree?: EIMTreeComponent,
	/** 選択中ドキュメントツリーノード */
	selectedDocumentType?: EIMHierarchicalObjectTypeDomain[],

	/** フォルダタイプ制限フラグ */
	folderTypeCondition?: string,
	/** フォルダタイプワークフローダイアグラム */
	folderTypeWorkflowDiagram?: EIMMasterContentsApproveWorkflowDiagramComponent,
	/** フォルダタイプ属性一覧 */
	folderTypeAttributeList?: EIMObjectTypeAttributeComponent,
	/** フォルダツリーコンポーネント */
	folderTypeTree?: EIMTreeComponent,
	/** 選択中フォルダツリーノード */
	selectedFolderType?: EIMHierarchicalObjectTypeDomain[],

	/** タグタイプ制限フラグ */
	tagTypeCondition?: string,
	/** タグタイプ属性一覧 */
	tagTypeAttributeList?: EIMObjectTypeAttributeComponent,
	/** タグツリーコンポーネント */
	tagTypeTree?: EIMTreeComponent,
	/** 選択中タグツリーノード */
	selectedTagType?: EIMHierarchicalObjectTypeDomain[],

	/** タグタイプ制限フラグ */
	securityCondition?: string,
	/** セキュリティアクセスエントリ */
	accessEntry?: EIMSecuritySelectorComponent,
	/** セキュリティデータグリッド */
	securityList?: EIMDataGridComponent,
	/** セキュリティ変更フラグ */
	isUpdateSecurity?: string,
}

/**
 * ワークスペース使用可能タイプ選択タブ情報
 */
const WORKSPACE_SELECTED_TAB = {
	DOCUMENT: 0,
	FOLDER: 1,
	TAG: 2,
}

/**
 * ワークスペース登録コンポーネントサービス
 */
@Injectable()
export class EIMWorkspaceCreatorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected workspaceService: EIMWorkspaceService,
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
	) {}


	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 * @param info コンポーネント情報
	 * @param tabIndex 選択中の使用可能制限タブ
	 */
	public expandAll(info: EIMWorkspaceCreatorComponentInfo, tabIndex: number): void {
		switch (tabIndex) {
			case WORKSPACE_SELECTED_TAB.DOCUMENT:
				info.documentTypeTree.expandAll();
				break;
			case WORKSPACE_SELECTED_TAB.FOLDER:
				info.folderTypeTree.expandAll();
				break;
			case WORKSPACE_SELECTED_TAB.TAG:
				info.tagTypeTree.expandAll();
				break;
			default:
				break;
		}
	}

	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 * @param info コンポーネント情報
	 * @param tabIndex 選択中の使用可能制限タブ
	 */
	public collapseAll(info: EIMWorkspaceCreatorComponentInfo, tabIndex: number): void {
		switch (tabIndex) {
			case WORKSPACE_SELECTED_TAB.DOCUMENT:
				info.documentTypeTree.collapseAll();
				break;
			case WORKSPACE_SELECTED_TAB.FOLDER:
				info.folderTypeTree.collapseAll();
				break;
			case WORKSPACE_SELECTED_TAB.TAG:
				info.tagTypeTree.collapseAll();
				break;
			default:
				break;
		}
	}

	/**
	 * アイコンを定義します
	 * @param typeName オブジェクトタイプ種別
	 * @return ツリーアイコン定義
	 */
	public setIcon(typeName: string): string {
		if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT) {
			return 'fa fa-fw fa-lg eim-icon-document eim-icon-document-color';
		}
		if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			return 'fa fa-fw fa-lg eim-icon-folder eim-icon-folder-color';
		}
		if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			return 'fa fa-fw fa-lg eim-icon-tag eim-icon-tag-color';
		}
	}

	/**
	 * 分割されたノードを合成し、各ツリーに設定します.
	 * @param hierarchicalContentsType オブジェクトタイプ一覧
	 * @param typeName オブジェクトタイプ種別
	 */
	public setTreeData(info: EIMWorkspaceCreatorComponentInfo, hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[], typeName: string): void {
		let selectedDomain: EIMHierarchicalObjectTypeDomain[] = [];

			// 表示対象のidを記憶
			let displayIdList: number[] = [];
			for (let i = 0; i < hierarchicalContentsType.length; i++) {

				let copyDomainHasChildren: EIMHierarchicalObjectTypeDomain = this.cloneChildren(hierarchicalContentsType[i], displayIdList);
				let rowDomain: EIMHierarchicalObjectTypeDomain = this.cloneParent(hierarchicalContentsType[i]);
				rowDomain.children = copyDomainHasChildren.children;
				rowDomain.selected = true;
				this.convertDisplayTree(rowDomain, selectedDomain, displayIdList);
		}

		let treeData = this.hierarchicalDomainService.convert(selectedDomain, (type: EIMHierarchicalObjectTypeDomain): EIMTreeNode => {
			// コンバート
			let selectable = true;
			if (type.children && type.children.length > 0) {
				selectable = false;
			}

			let label: string;
			// 「ドキュメント」を「一般ドキュメント」、「フォルダ」を「一般フォルダ」で表示する
			if (type.name === this.translateService.instant('EIM_DOCUMENTS.DOCUMENT')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_DOCUMENT');
			} else if (type.name === this.translateService.instant('EIM_DOCUMENTS.FOLDER')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_FOLDER')
			} else if (type.name === this.translateService.instant('EIM_DOCUMENTS.TAG')) {
				label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_TAG')
			} else {
				label = type.name;
			}
			let iconStr: string;
			// アイコンを設定する
			if (type.selected) {
				iconStr = 'fa fa-fw fa-lg fa-check-circle eim-icon-document-color';
			} else {
				iconStr = this.setIcon(typeName);
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
			if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT) {
				info.documentTypeTree.setData(treeData);
				// ツリーを全展開
				info.documentTypeTree.expandAll();
			} else if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
				info.folderTypeTree.setData(treeData);
				// ツリーを全展開
				info.folderTypeTree.expandAll();
			} else if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
				info.tagTypeTree.setData(treeData);
				// ツリーを全展開
				info.tagTypeTree.expandAll();
			}

		});
	}

	/**
	 * ツリー構造中に選択対象ノードが存在するか調べます.
	 * @param domain 調査対象オブジェクトタイプ
	 * @return ツリー構造中に選択対象ノードが存在するかどうか
	 */
	public checkExistSelected(domain: EIMHierarchicalObjectTypeDomain): boolean {
		if (domain.selected) {
			return true;
		}
		for (let i = 0; i < domain.children.length; i++) {
			if (this.checkExistSelected(domain.children[i])) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 親構造のコピーを再帰的に作成します.
	 * @param domain オブジェクトタイプ
	 * @return 親構造ツリーの複製
	 */
	public cloneParent(domain: EIMHierarchicalObjectTypeDomain): any {
		let copy: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
		copy.id = domain.id;
		copy.name = domain.name;
		if (domain.parent != null) {
			copy.parent = (this.cloneParent(domain.parent));
		}
		return copy;
	}

	/**
	 * 子構造のコピーを再帰的に作成します.
	 * @param domain オブジェクトタイプ
	 * @param displayIdList 表示対象オブジェクトタイプ一覧(選択対象の親・子ノードを含む)
	 * @return 子構造ツリーの複製
	 */
	public cloneChildren(domain: EIMHierarchicalObjectTypeDomain, displayIdList: number[]): any {
		let copy: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
		copy.children = [];
		copy.id = domain.id;
		copy.name = domain.name;
		if (displayIdList.indexOf(domain.id) === -1) {
			displayIdList.push(domain.id);
		}
		for (let i = 0; i < domain.children.length; i++) {
			copy.children.push(this.cloneChildren(domain.children[i], displayIdList));
		}
		return copy;
	}

	/**
	 * 親ノードオブジェクトタイプに対してオブジェクトタイプを接続し、二つの階層構造を合成します.
	 * @param domain オブジェクトタイプ
	 * @param parentDomain オブジェクトタイプ親ノード
	 */
	public chain(domain: EIMHierarchicalObjectTypeDomain, parentDomain: EIMHierarchicalObjectTypeDomain): void {
		if (domain.parent.id === parentDomain.id) {
			for (let i = 0; i < parentDomain.children.length; i++) {
				if (domain.id === parentDomain.children[i].id) {
					// ノードの途中でありながら選択済みの場合
					for (let j = 0; j < parentDomain.children.length; j++) {
						if ( parentDomain.children[j].id === domain.id ) {
							parentDomain.children[j] = domain;
							break;
						}
						if (j === parentDomain.children.length) {
							parentDomain.children.push(domain);
							break;
						}
					}
					return;
				}
			}
			parentDomain.children.push(domain);
			return;
		}
		for (let i = 0; i < parentDomain.children.length; i++) {
			this.chain(domain, parentDomain.children[i]);
		}
		return;
	}

	/**
	 * ワークスペース情報を取得します.
	 * @param info コンポーネント情報
	 * @return ワークスペース情報
	 */
	public getWorkspaceObject(info: EIMWorkspaceCreatorComponentInfo): EIMWorkspace {
		let secId = null;
		let lowerSuccessionSecId = null;
		if (info.accessSecurity != null) {
			secId = info.accessSecurity.secId;
		}
		if (info.folderSecurity != null) {
			lowerSuccessionSecId = info.folderSecurity.secId;
		}

		let docList = [];
		for (let i = 0; i < info.selectedDocumentType.length; i++) {
			docList.push(info.selectedDocumentType[i].id);
		}
		let folderList = [];
		for (let i = 0; i < info.selectedFolderType.length; i++) {
			folderList.push(info.selectedFolderType[i].id);
		}
		let tagList = [];
		for (let i = 0; i < info.selectedTagType.length; i++) {
			tagList.push(info.selectedTagType[i].id);
		}
		let secList = [];
		for (let i = 0; i < info.securityList.getData().length; i++) {
			secList.push(info.securityList.getData()[i].secId);
		}
		let entryList = [];
		let entryTypeList = [];
		for (let i = 0; i < info.adminUsers.length; i++) {
			entryList.push(info.adminUsers[i].entryId);
			entryTypeList.push(info.adminUsers[i].entryTypeId);
		}

		let workspace: EIMWorkspace = {
			objName: info.name,
			docAllFlag: info.docTypeCondition === 'false',
			folderAllFlag: info.folderTypeCondition === 'false',
			tagAllFlag: info.tagTypeCondition === 'false',
			secAllFlag: info.securityCondition === 'false',
			isDspAttributeInfo: 0,
			lowerSuccessionSecId : lowerSuccessionSecId,
			checkedLowerSuccession : 'true',
			isUpdateSecurity: info.isUpdateSecurity,
			isManualDeleteFlag: info.isManualDeleteFlag,
			secId: secId,
			docList: docList,
			folderList: folderList,
			tagList: tagList,
			secList: secList,
			entryList: entryList,
			entryTypeList: entryTypeList,
		}

		return workspace;
	}

	/**
	 * 選択されたオブジェクトタイプを表示用のツリー構造に付与します.
	 * @param domain 対象オブジェクトタイプ
	 * @param selectedDomain 選択済みオブジェクトタイプ
	 * @param displayIdList 表示対象ID一覧
	 */
	private convertDisplayTree(domain: EIMHierarchicalObjectTypeDomain, selectedDomain: EIMHierarchicalObjectTypeDomain[], displayIdList: number[]): void {
		let parent: EIMHierarchicalObjectTypeDomain = domain.parent;
		// 親がいない場合一般ドキュメント
		if (parent == null) {
			selectedDomain.push(domain);
			return;
		}
		// 既出の場合追加処理
		if (displayIdList.indexOf(parent.id) >= 0) {
			this.chain(domain, selectedDomain[0]);
			return;
		}
		displayIdList.push(parent.id);
		parent.children = [];
		parent.children.push(domain);
		this.convertDisplayTree(parent, selectedDomain, displayIdList);
	}
}
