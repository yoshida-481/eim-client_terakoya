import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { Injectable, EventEmitter } from '@angular/core';

import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMObjectTypeTreeSelectorComponent } from 'app/documents/components/object-type-tree-selector/object-type-tree-selector.component';

/**
 * オブジェクトタイプ選択ツリーコンポーネントサービス
 */
@Injectable()
export class EIMObjectTypeTreeMultipleSelectorComponentSerivce extends EIMMultipleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
		super();
	}

	/**
	 * 追加します.
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): void {
		// 検索結果の選択行を選択一覧に追加
		let addData: EIMHierarchicalObjectTypeDomain[] = (info.searchResultList.getSelectedData());

		// 最上位のタイプを選択している場合、追加不可
		if (addData.length === 0 || addData[0].parent === null) {
			return
		}
		// 対象が選択済みの場合、追加不可
		for (let j = 0; j < info.selectedList.getData().length; j++) {
			if (info.selectedList.getData()[j].id === addData[0].id) {
				return;
			}
		}

		// 選択対象の子ノード全てをグレーアウト
		let selectedData: EIMTreeNode = this.getSelectedTreeNode((<EIMObjectTypeTreeSelectorComponent>info.searchResultList).documentTypeTree.info.data[0], addData[0].id);
		if (selectedData.styleClass != null) {
			return;
		}
		this.disableChild(selectedData.children, 'p-tree-disabled');

		info.selectedList.addRowData(addData);

		function compare(a, b) {

			function convertPath(node: EIMHierarchicalObjectTypeDomain): string {
				if (node.parent !== null && node.parent.parent !== null) {
					return  convertPath(node.parent) + node.parent.name + '/';
				}
				return '/';
			}

			let comparison = 0;
			a['_path'] = convertPath(a);
			b['_path'] = convertPath(b);
			let nameA: string = a['_path'] + a.name;
			let nameB: string = b['_path'] + b.name;
			if (nameA > nameB) {
				comparison = 1;
			} else if (nameB > nameA) {
				comparison = -1;
			}
			return comparison;
		}
		info.selectedList.setData(info.selectedList.getData().sort(compare));
	}

	/**
	 * 削除します.
	 * @param info 複数選択コンポーネント情報
	 * @param selectedData 選択データ
	 */
	public delete(info: EIMMultipleSelectionComponentInfo, selectedData: any[]): void {
		super.delete(info, selectedData);
		// 選択対象がグレーアウトされていない場合のみ子ノードのグレーアウト解除処理を実施する
		let target: EIMHierarchicalDomain[] = [];
		for (let i = 0; i < selectedData.length; i++) {
			let data: EIMTreeNode = this.getSelectedTreeNode((<EIMObjectTypeTreeSelectorComponent>info.searchResultList).documentTypeTree.info.data[0], selectedData[i].id);
			if (data.styleClass !== 'p-tree-disabled') {
				Array.prototype.push.apply(target, data.children);
			}
		}
		let selectedIds: number[] = [];
		for (let i = 0; i < info.selectedList.getData().length; i++) {
			selectedIds.push(info.selectedList.getData()[i].id);
		}
		this.clearDisableChild(target, selectedIds);
	}

	/**
	 * 一般オブジェクトから選択対象TreeNodeを取得します.
	 * @param node 選択ノード
	 * @param id 選択ID
	 * @return 選択対象TreeNode
	 */
	public getSelectedTreeNode(node: EIMTreeNode, id: number): any {
		if (node.data.id === id) {
			return node;
		}
		for (let i = 0; i < node.children.length; i++) {
			let child = this.getSelectedTreeNode(node.children[i], id);
			if (child !== null) {
				return child;
			}
		}
		return null;
	}


	/**
	 * 再帰的に子ノードに非活性用スタイルを付与します.
	 * @param node 選択ノード
	 * @param style スタイル
	 */
	public disableChild(node: EIMTreeNode[], style: string): void {
		for (let i = 0; i < node.length; i++) {
			node[i].styleClass = style;
			this.disableChild(node[i].children, style);
		}
	}

	/**
	 * 再帰的に子ノードに非活性用スタイルを解除します.
	 * @param node 選択ノード
	 * @param selectedIds 選択ID
	 */
	public clearDisableChild(node: EIMTreeNode[], selectedIds: number[]): void {
		for (let i = 0; i < node.length; i++) {
			node[i].styleClass = null;
			if (selectedIds.indexOf(node[i].data.id) >= 0) {
				continue;
			}
			this.clearDisableChild(node[i].children, selectedIds);
		}
	}

	/**
	 * single-selectorのデータ表示完了イベントハンドラ
	 * @param info 複数選択コンポーネント情報
	 * @param target 取得対象
	 */
	public onFetch(info: EIMMultipleSelectionComponentInfo, target: any): void {
		window.setTimeout(() => {
			let generalNode = (<EIMObjectTypeTreeSelectorComponent>info.searchResultList).documentTypeTree.info.data[0];
			let selectedNodes: EIMTreeNode[] = [];
			for (let i = 0; i < info.selectedList.getData().length; i++) {
				selectedNodes.push(this.getSelectedTreeNode(generalNode, info.selectedList.getData()[i].id));
			}
			for (let i = 0; i < selectedNodes.length; i++) {
				this.disableChild(selectedNodes[i].children, 'p-tree-disabled');
			}
		});
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択したノードからパス情報を作成します.
	 * @param node 選択ノード
	 * @return ツリー上のパス
	 */
	private convertPath(node: EIMHierarchicalObjectTypeDomain): string {
	if (node.parent !== null && node.parent.parent !== null) {
		return  this.convertPath(node.parent) + node.parent.name + '/';
	}
		return '/';
	}
}
