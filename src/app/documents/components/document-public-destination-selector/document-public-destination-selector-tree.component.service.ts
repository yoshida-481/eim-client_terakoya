import { Injectable, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';

import { EIMDocumentsConstantService} from 'app/documents/shared/services/documents-constant.service';

/** エントリ情報インターフェース */
export interface EIMEntry {
	entryId?: number;
	entryName?: string;
	entryTypeId?: number;
	entryTypeName?: string;
	groupName?: string;
	roleName?: string;
}

/**
 * 公開通知先選択ツリーコンポーネントサービス
 */
@Injectable()
export class EIMDocumentPublicDestinationSelectorTreeComponentService extends EIMTreeComponentService {

	/**
	 * コンストラクタです.
	 * @param hierarchicalDomainService 階層ドメインサービス
	 * @param translateService 翻訳サービス
	 */
	constructor(
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			private translateService: TranslateService,
			private entryService: EIMDocumentsEntryService,
	) {
		super(hierarchicalDomainService);
	}

	/**
	 * グループからツリー要素を生成します.
	 * @param groups グループ
	 * @return ツリー要素リスト
	 */
	public convertGroupsToTreeNodes(group: any): EIMTreeNode[] {

		let rtTreeNode: EIMTreeNode[] = [];

		let groups: any[] = [];
		if (group !== void 0) {
			if (group instanceof Array) {
				groups = groups.concat(group);
			} else {
				groups.push(group);
			}
		}

		// ツリーの子要素を再帰的に生成
		for (let i = 0; i < groups.length; i++) {
			let childGroups: EIMTreeNode[] = [];
			if (groups[i].group !== void 0 && groups[i].group != null) {
				if (groups[i].group instanceof Array) {
					for (let j = 0; j < groups[i].group.length; j++) {
						childGroups = this.convertGroupsToTreeNodes(groups[i].group);
					}
				} else {
					let temps: any[] = [];
					temps.push(groups[i].group);
					childGroups = this.convertGroupsToTreeNodes(temps);
				}
			}

			// ツリー要素を生成
			let treeNode: EIMTreeNode = {
				label: groups[i].attr.label,
				children: childGroups,
				data: this.entryService.convertGroupToEntry(groups[i].attr),
			}
			rtTreeNode.push(treeNode);
		}

		return rtTreeNode;
	}


	/**
	 * ロールからツリー要素を生成します.
	 * @param role ロール
	 * @return ツリー要素リスト
	 */
	public convertRolesToTreeNodes(role: any): EIMTreeNode[] {

		let rtTreeNode: EIMTreeNode[] = [];

		let roles: any[] = [];
		if (role !== void 0) {
			if (role instanceof Array) {
				roles = roles.concat(role);
			} else {
				roles.push(role);
			}
		}

		// ツリーの子要素を再帰的に生成
		for (let i = 0; i < roles.length; i++) {
			let childRoles: EIMTreeNode[] = [];
			if (roles[i].role !== void 0 && roles[i].role != null) {
				if (roles[i].role instanceof Array) {
					for (let j = 0; j < roles[i].role.length; j++) {
						childRoles = this.convertRolesToTreeNodes(roles[i].role);
					}
				} else {
					let temps: any[] = [];
					temps.push(roles[i].role);
					childRoles = this.convertRolesToTreeNodes(temps);
				}
			}

			// ツリー要素を生成
			let treeNode: EIMTreeNode = {
				label: roles[i].attr.label,
				children: childRoles,
				data: this.entryService.convertRoleToEntry(roles[i].attr),
			}
			rtTreeNode.push(treeNode);
		}

		return rtTreeNode;
	}

	/**
	 * 複合グループからツリー要素を生成します.
	 * @param complexGroup 複合グループ
	 * @return ツリー要素リスト
	 */
	public convertComplexGroupsToTreeNodes(complexGroup: any): EIMTreeNode[] {

		let rtTreeNode: EIMTreeNode[] = [];

		let complexGroups: any[] = [];
		if (complexGroup !== void 0) {
			if (complexGroup instanceof Array) {
				complexGroups = complexGroups.concat(complexGroup);
			} else {
				complexGroups.push(complexGroup);
			}
		}

		// ツリー要素を生成
		for (let i = 0; i < complexGroups.length; i++) {

			let treeNode: EIMTreeNode = {
						label: complexGroups[i].attr.label,
						data: this.entryService.convertComplexGroupToEntry(complexGroups[i].attr),
					}

			rtTreeNode.push(treeNode);
		}

		return rtTreeNode;
	}

	/**
	 * 選択対象の行かどうか判定します.
	 * @param arg1 比較対象1
	 * @param arg2 比較対象2
	 */
	public defaultEquals(arg1: any, arg2: any): boolean {
		return arg1.data.entryId == arg2.data.entryId;
	};
}
