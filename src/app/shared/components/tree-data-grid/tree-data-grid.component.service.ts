import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalComponentService, EIMListComponentInfo, EIMHierarchicalDomain } from 'app/shared/shared.interface';

// TreeNodeの不足分を追加
export interface EIMTreeDataGridNode extends EIMHierarchicalDomain {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  partialSelected?: boolean;
  styleClass?: string;
  selectable?: boolean;
}

/**
 * ツリーコンポーネントサービス.
 */
@Injectable()
export class EIMTreeDataGridComponentService implements EIMHierarchicalComponentService<EIMTreeDataGridNode> {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
	) {}

	/**
	 * 初期化します.
	 */
	public initialize(info: EIMListComponentInfo<EIMTreeDataGridNode>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {
	}

	/**
	 * ノードを設定します.
	 * @param info インフォ
	 * @param data 設定データ
	 */
	public setData(info: EIMListComponentInfo<EIMTreeDataGridNode>, data: EIMTreeDataGridNode[]): void {
		info.data = data;
		info.selectedData = [];
	}

	/**
	 * ノードを選択します.
	 * @param info インフォ
	 * @param selectedData 選択データ
	 * @param selected 選択イベントエミッタ
	 * @param params パラメータ
	 */
	public select(info: EIMListComponentInfo<EIMTreeDataGridNode>, selectedData: EIMTreeDataGridNode[], selected?: EventEmitter<any>, params?: any): void {

		if (params.multiple) {
			// 複数選択可能な場合
			let data: EIMTreeDataGridNode[] = [];
			if (selectedData && selectedData.length > 0) {
				for (let i = 0; i < selectedData.length; i++) {
					let selectedNode: EIMTreeDataGridNode = this.hierarchicalDomainService.get(info.data, selectedData[i], this.defaultEquals);
					if (selectedNode != null) {
						data.push(selectedNode);
					}
				}
			}
			info.selectedData = data;

			if (selected) {
				selected.emit({selectedData: info.selectedData, params: params});
			}
		} else {
			// 複数選択不可能な場合
			if (selectedData && selectedData.length > 0) {
				let selectedNode: EIMTreeDataGridNode = this.hierarchicalDomainService.get(info.data, selectedData[0], this.defaultEquals);
				if (selectedNode != null) {
					(info.selectedData as any) = selectedNode;
				}

			} else {
				info.selectedData = null;
			}

			if (selected) {
				selected.emit({selectedData: [info.selectedData], params: params});
			}

		}
	}

	/**
	 * 子ノードを設定します.
	 * @param info インフォ
	 * @param parentNode 親ノード
	 * @param childNodes 追加する子ノード
	 */
	public setChildren(info: EIMListComponentInfo<EIMTreeDataGridNode>, parentNode: EIMTreeDataGridNode, childNodes: EIMTreeDataGridNode[]): void {
		if (!parentNode && !childNodes) {
				return;
		}

		if (!parentNode) {
			info.data = (!info.data) ? [] : info.data;
			info.data = childNodes;
			return;
		}

		if (!childNodes || childNodes.length === 0) {
			parentNode.children = [];
			parentNode.leaf = true;
			return;
		}

		// 退避
		let original: EIMTreeDataGridNode[] = parentNode.children;
		parentNode.children = childNodes;

		// 設定前のchildrenの参照を新しいparentに設定する
		for (let i = 0; i < parentNode.children.length; i++) {
			let newChild: EIMTreeDataGridNode = parentNode.children[i];
			newChild.parent = parentNode;
			if (original) {
				for (let j = 0; j < original.length; j++) {
					let oldChild: EIMTreeDataGridNode = original[j];
					if (this.defaultEquals(newChild, oldChild)) {
						newChild.children = oldChild.children;
						newChild.expanded = oldChild.expanded;
						newChild.leaf = oldChild.leaf;
						break;
					}
				}
			}
		}
	}

	/**
	 * ノードを追加します.
	 * @param info インフォ
	 * @param parentNode 親ノード（ルートに追加する場合はnullを指定）
	 * @param addNodes 追加するノード
	 */
	public addNode(info: EIMListComponentInfo<EIMTreeDataGridNode>, parentNode: EIMTreeDataGridNode, addNodes: EIMTreeDataGridNode[]): void {

		// ルートに追加する場合
		if (parentNode === null) {
			for (let i = 0; i < addNodes.length; i++) {
				addNodes[i].parent = parentNode;
				addNodes[i].label = this.getPropertyValueUsedForLabel(addNodes[i].data);

				info.data = info.data ?? [];
				info.data.push(addNodes[i]);
			}

			info.data = info.data.concat();
			return;
		}

		// 親ノードに追加する場合
		for (let i = 0; i < addNodes.length; i++) {
			addNodes[i].parent = parentNode;
			addNodes[i].label = this.getPropertyValueUsedForLabel(addNodes[i].data);

			// 親ノードに追加する場合
			if (!parentNode.children) {
				parentNode.children = [];
			}
			parentNode.children.push(addNodes[i]);
		}
	}

	/**
	 * ノードを削除します.
	 * @param info インフォ
	 * @param data 削除するデータ
	 */
	public deleteNode(info: EIMListComponentInfo<EIMTreeDataGridNode>, data: any[]): void {

		for (let i = 0; i < data.length; i++) {
			// 該当ノードを特定する
			let targetNode: EIMTreeDataGridNode = this.hierarchicalDomainService.get(info.data, data[i], this.defaultEquals);
			if (!targetNode) {
				continue;
			}

			// 親が存在する場合
			if (targetNode.parent) {
				// 該当ノードの親ノードを特定する
				let parentNode: EIMTreeDataGridNode = this.hierarchicalDomainService.get(info.data, (targetNode.parent as EIMTreeDataGridNode).data, this.defaultEquals);
				if (!parentNode) {
					continue;
				}
				// 親ノードから該当ノードを削除する
				let deleteIndex = -1;
				for (let j = 0; j < parentNode.children.length; j++) {
					let node: EIMTreeDataGridNode = (parentNode.children[j] as EIMTreeDataGridNode);
					if (this.defaultEquals(node.data, targetNode.data)) {
						deleteIndex = j;
						break;
					}
				}
				if (deleteIndex > -1) {
					parentNode.children.splice(deleteIndex, 1);
				}
			}
			// 親が存在しない場合（ルートの場合）
			else {

				for (let j = 0; j < info.data.length; j++) {
					if (!this.defaultEquals(info.data[j], targetNode)) {
						continue;
					}

					info.data.splice(j, 1);
				}
			}
			info.data = info.data.concat();
		}

	}

	/**
	 * ノードを更新します.
	 */
	public updateNode(info: EIMListComponentInfo<EIMTreeDataGridNode>, data: any): void {
		// 該当ノードを特定
		let targetNode: EIMTreeDataGridNode = this.hierarchicalDomainService.get(info.data, data, this.defaultEquals);
		if (targetNode) {
			targetNode.data = data;
			targetNode.label = this.getPropertyValueUsedForLabel(data);
		}
	}

	/** 選択対象の行かどうか判定します */
	public defaultEquals(arg1: any, arg2: any): boolean {
		if (!arg2 || arg2.length === 0) {
			return false;
		}
		return arg1.data.id === arg2.data.id;
	};

	/**
	 * ノードが選択できるかどうか返却します.
	 * @param node 判定対象のノード
	 * @return ノードが選択できるかどうか
	 */
	public canSelect(node: EIMTreeDataGridNode): boolean {
		return true;
	}

	/**
	 * ラベルに使用する値を取得します
	 */
	protected getPropertyValueUsedForLabel(data: any): string {
		return data?.objName;
	}

}
