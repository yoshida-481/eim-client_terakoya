import { Injectable, Output } from '@angular/core';

import { EIMHierarchicalDomain } from 'app/shared/shared.interface';

/**
 * 階層ドメインサービス
 */
@Injectable()
export class EIMHierarchicalDomainService {

	constructor() {
	}

	/**
	 * 親とするノードと子とするノードに親子関係を設定します.
	 */
	public setChildren(parent: EIMHierarchicalDomain, children: EIMHierarchicalDomain[]): void {
		if (!parent && !children) {
			return;
		}

		if (!parent) {
			return;
		}

		if (!children || children.length === 0) {
			parent.children = [];
			return;
		}

		parent.children = children;
		for (let i = 0; i < children.length; i++) {
			children[i].parent = parent;
		}
	}

	/**
	 * 階層をフラット化し、配列にして返却します.
	 */
	public getList(domains: EIMHierarchicalDomain[]): EIMHierarchicalDomain[] {
		let retNode: EIMHierarchicalDomain[] = [];
		let nodes: EIMHierarchicalDomain[];
		if (!domains) {
			nodes = [];
		} else if (!Array.isArray(domains)) {
			nodes = [domains];
		} else {
			nodes = domains;
		}
		for (let i = 0; i < nodes.length; i++) {
			let node: EIMHierarchicalDomain = nodes[i];
			retNode.push(node);
			let children: EIMHierarchicalDomain[] = this.getList(node.children);
			Array.prototype.push.apply(retNode, children);
		}
		return retNode;
	}

	/**
	 * 階層から該当するノードを取得します.
	 */
	public get(nodes: EIMHierarchicalDomain[], selectNode: any, isSelectTarget: Function): EIMHierarchicalDomain {

		if (nodes == null) {
			return null;
		}

		for (let i = 0; i < nodes.length; i++) {
			let node: EIMHierarchicalDomain = nodes[i];
			if (isSelectTarget(node, selectNode)) {
				return node;
			} else {
				let children: EIMHierarchicalDomain[] = node.children;
				if (children != null && children.length > 0) {
					node = this.get(children, selectNode, isSelectTarget);
					if (node != null && isSelectTarget(node, selectNode)) {
						return node;
					} else {
						continue;
					}
				}
			}
		}
		return null;
	}

	/**
	 * 各階層をコンバート関数を使用して更新します.
	 * 引数のドメインを更新します.
	 */
	public update(nodes: any[], converter: (domain: any, params?: any) => void, params?: any): any[] {

		if (!nodes) {
			return;
		}
		for (let i = 0; i < nodes.length; i++) {
			converter(nodes[i], params);
			this.update(nodes[i].children, converter, params);
		}
		return nodes;
	}

	/**
	 * 各階層をコンバート関数を使用してコンバートします.
	 * 引数のドメインは更新しません.
	 */
	public convert(nodes: any[], converter: (domain: any, params?: any) => any, params?: any): any[] {

		if (!nodes) {
			return;
		}
		let parentNodes: EIMHierarchicalDomain[] = [];
		for (let i = 0; i < nodes.length; i++) {
			let parentNode: EIMHierarchicalDomain;
			parentNode = converter(nodes[i], params);

			let childNodes: EIMHierarchicalDomain[];
			childNodes = this.convert(nodes[i].children, converter, params);
			// 親子を連結
			this.setChildren(parentNode, childNodes);
			parentNodes.push(parentNode);
		}
		return parentNodes;
	}


	/**
	 * 該当ノードのルートノードを返却します.
	 */
	public getRoot(node: EIMHierarchicalDomain): EIMHierarchicalDomain {
		if (node.parent == null) {
			return node;
		}
		return this.getRoot(node.parent);
	}
}
