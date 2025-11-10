import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMAttribute, EIMAttributeTreeService } from 'app/documents/shared/services/apis/attribute-tree.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMObjectNameRendererComponentService } from 'app/documents/shared/components/renderer/object-name-renderer.component.service';

/**
 * 属性ツリー用ツリーノードインタフェース
 */
export interface EIMAttributeTreeNode extends EIMTreeNode {
	objTypeId?: number;
	objTypeName?: string;
	isWorkflowFolder?: boolean;
	isBranch?: boolean;
	isSearch?: boolean;
	isLeaf?: boolean;
	tagListKind?: number;
	isTrash?: boolean;
	attrTreeId?: number;
	attrTreePath?: string;
	attrTreeSettings?: string;
	value?: string;
	attrTreeValues?: any[];
}

/**
 * コンテンツツリーコンポーネントサービス.
 */
@Injectable()
export class EIMAttributeTreeComponentService extends EIMTreeComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected attributeTreeService: EIMAttributeTreeService,
			protected objectNameRendererComponentService: EIMObjectNameRendererComponentService) {
		super(hierarchicalDomainService);

		/**
		 * 選択対象の行かどうか判定します.
		 */
		this.defaultEquals = (arg1: any, arg2: any) => {
			return (
				arg1.attrTreeId === arg2.attrTreeId
				&& JSON.stringify(arg1.attrTreeValues) === JSON.stringify(arg2.attrTreeValues)
			);
		}
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 検索を実行します.
	 * @param info 一覧コンポーネント情報
	 * @param selected ノード選択イベントエミッタ
	 */
	public searchAttrTree(info: EIMListComponentInfo<EIMAttributeTreeNode>, selected?: EventEmitter<any>): void {
		// 第1階層の属性ツリーを設定する
		this.attributeTreeService.getRoot()
			.subscribe((attributetree: EIMAttribute[]) => {
				let selectedNode;
				for (let i = 0; i < attributetree.length; i++) {
					let node: EIMAttributeTreeNode = this.convertEIMAttributeToEIMAttributeTreeNode(attributetree[i], false);
					info.data.push(node);
				}
			});
	}

	/**
	 * ツリーの子ノードのデータを補完する
	 * @param parentNode 親ノード
	 * @param childNode 子ノード
	 */
	public complementChildNodeData(parentNode: EIMAttributeTreeNode, childNode: EIMAttributeTreeNode): void {

		childNode.attrTreeId = parentNode.attrTreeId;
		childNode.attrTreeSettings = parentNode.attrTreeSettings;
		childNode.attrTreePath = parentNode.attrTreePath + childNode.label + '/';
		if (parentNode.attrTreeValues && parentNode.attrTreeValues.length > 0) {
			childNode.attrTreeValues = [].concat(parentNode.attrTreeValues);
		} else {
			childNode.attrTreeValues = [];
		}
		if (childNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
			childNode.attrTreeValues.push(childNode.value);
		} else {
			childNode.attrTreeValues.push(String(childNode.data.objId ? childNode.data.objId : childNode.data.value));
			childNode.value = String(childNode.data.objId ?  childNode.data.objId : childNode.data.value);
		}
	}

	/**
	 * 行データをツリーノードに変換します.
	 * @param folder 行データ
	 * @return ツリーノード
	 */
	public convertRowDataToEIMAttributeTreeNode(attribute: EIMAttribute): EIMAttributeTreeNode {
		let icon: string = 'fa fa-fw fa-lg ' + this.getIcon(attribute);
		let tn: EIMAttributeTreeNode = {

			label: attribute.label,
			data: attribute,
			expandedIcon: icon,
			collapsedIcon: icon,
			isLeaf: attribute.isLeaf,
			value: attribute.value,
			children: [],
			objTypeName: attribute.objTypeName,
			isWorkflowFolder: attribute.isWorkflowFolder,
			isBranch: attribute.isBranch,
			isSearch: false,
			leaf: false,
		};
		return tn;
	}

	/**
	 * 最新の情報に更新する.
	 * @param info グリッドコンポーネント情報
	 * @param objId 現在選択しているツリーノードのオブジェクトID
	 * @param objIds グリッド選択状態のオブジェクトID
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public updateLatest(info: EIMListComponentInfo<EIMAttributeTreeNode>, selectedNode, selectionTargetRows, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

		if (selectedNode && selectedNode.attrTreeId) {
			// 選択階層までを設定する
			this.attributeTreeService.getAttrTreeForTarget(selectedNode.attrTreeId, selectedNode.attrTreePath, selectedNode.attrTreeSettings, selectedNode.attrTreeValues)
			.subscribe((attributes: EIMAttribute[]) => {
				info.data = [];
				for (let i = 0; i < attributes.length; i++) {
					let attributeTreeNode: EIMAttributeTreeNode = this.convertEIMAttributeToEIMAttributeTreeNode(attributes[i], true);
					this.treeComplementChildNodeData(attributeTreeNode);
					info.data.push(attributeTreeNode);
				}
				let attrTreeNode: EIMAttributeTreeNode = {
					objId: selectedNode.objId,
					attrTreeId: selectedNode.attrTreeId,
					attrTreePath: selectedNode.attrTreePath,
					attrTreeSettings:	selectedNode.attrTreeSettings,
					attrTreeValues:	selectedNode.attrTreeValues,
				};
				this.select(info, [attrTreeNode], selected, {selectionTargetRows: selectionTargetRows});
			}, (err: any) => {
				// エラーの場合、ツリー初期表示を実行する
				info.selectedData = [];
				info.data = [];
				this.searchAttrTree(info, selected);
			});
		} else {
			// ツリー初期表示を実行する
			info.selectedData = [];
			info.data = [];
			this.searchAttrTree(info, selected);
		}
	}

	/**
	 * ノードを選択します.
	 * @param info 一覧コンポーネント情報
	 * @param selectedData 選択ノード
	 * @param selected ノード選択エミッタ
	 * @param params パラメータ
	 */
	public select(info: EIMListComponentInfo<EIMTreeNode>, selectedData: EIMAttributeTreeNode[], selected?: EventEmitter<any>, params?: any): void {

		let data: EIMTreeNode[] = [];
		let selectedNode: EIMTreeNode = this.hierarchicalDomainService.get(info.data, selectedData[0], this.defaultEquals);
		if (selectedNode != null) {
			data.push(selectedNode);
		}
		info.selectedData = data;

		if (selected) {
			selected.emit({selectedData: info.selectedData, params: params});
		}
	}

	/**
	 * 指定したノードをツリーから選択します.
	 * @param attrTree 属性ツリー
	 * @param targetNode 選択ノード
	 * @param selected 選択状態
	 */
	public selectNode(attrTree: EIMTreeComponent, targetNode: any, selected: boolean): void {
		// 属性ツリー分ループ
		for (let i = 0; i < attrTree.info.data.length; i++) {
			let attrTreeNode: EIMAttributeTreeNode = attrTree.info.data[i];
			let children: EIMAttributeTreeNode[] = attrTreeNode.children;
			let selectNode;
			// 属性ツリーIDが一致する場合
			if (attrTreeNode.attrTreeId === targetNode.attrTreeId) {
				if (targetNode.attrTreeValues) {
					// ターゲットのvalue分ループする
					attrTreeNode.expanded = true;
					for (let j = 0; j < targetNode.attrTreeValues.length; j++) {
						let value = targetNode.attrTreeValues[j];
						for (let k = 0; k < children.length; k++) {
							if (value === children[k].value) {
								children[k].expanded = true;
								selectNode = children[k];
								children = children[k].children;
								break;
							}
						}
					}
				} else {
					selectNode = attrTreeNode;
				}
				// ターゲットノードを選択状態にする
				attrTree.select([selectNode], selected);
				break;
			}
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
	private getIcon(node): string {
		if (node.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
			return 'fa-cubes eim-icon-workspace-color';
		}
		return this.objectNameRendererComponentService.getIcon(node);
	}

	/**
	 * ツリーの親ノードの情報から子ノードの情報を補完する
	 * @param parent 親ノード
	 */
	private treeComplementChildNodeData(parent: EIMAttributeTreeNode): void {
		for (let i = 0; i < parent.children.length; i++) {
			this.complementChildNodeData(parent, parent.children[i]);
			this.treeComplementChildNodeData(parent.children[i]);
		}
	}

	/**
	 * 階層データを属性ツリーノードに変換します.
	 * @param contents 階層データ
	 * @param expandChildNode 展開子ノード
	 * @return ツリーノード
	 */
	private convertEIMAttributeToEIMAttributeTreeNode(contents: EIMAttribute, expandChildNode: boolean): EIMAttributeTreeNode {
		let icon: string = 'fa fa-fw fa-lg ' + this.getIcon(contents);
		let parent: EIMAttributeTreeNode = {
			label: contents.label,
			data: contents,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: false,
			objTypeName: contents.objTypeName,
			isWorkflowFolder: contents.isWorkflowFolder,
			isBranch: true,
			isSearch: false,
			isLeaf: contents.isLeaf,
			attrTreeId: Number(contents.attrTreeId),
			attrTreePath: '/' + contents.label + '/',
			attrTreeSettings: contents.attrTreeSettings,
			value: contents.value,
		};

		let children: EIMAttributeTreeNode[] = [];
		// 子ノードを設定する
		for (let i = 0; i < contents.children.length; i++) {
			let child: EIMAttributeTreeNode;
			child = this.convertEIMAttributeToEIMAttributeTreeNode(<EIMAttribute>contents.children[i], expandChildNode);
			children.push(child);
		}
		this.hierarchicalDomainService.setChildren(parent, children);

		if (expandChildNode === true && children.length > 0) {
			parent.expanded = true;
		} else {
			parent.expanded = false;
		}
		return parent
	}
}
