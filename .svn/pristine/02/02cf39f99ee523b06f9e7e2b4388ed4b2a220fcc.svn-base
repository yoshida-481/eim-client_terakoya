import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMWorkspaceFormTypeDTO } from 'app/admins/shared/dtos/workspace-form-type.dto';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';


// TreeNodeの不足分を追加
export interface EIMFormTypeTreeNode extends EIMTreeNode {
	nodePath?: string;
	objectType?: string;
}


/**
 * 帳票タイプ選択ツリーコンポーネントサービス
 */
@Injectable()
export class EIMWorkspaceTypeSingleSelectorComponentService extends EIMTreeComponentService {

	/**
	 * コンストラクタです.
	 * @param hierarchicalDomainService 階層ドメインサービス
	 * @param translateService 翻訳サービス
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected translateService: TranslateService,
	) {
		super(hierarchicalDomainService);
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票タイプからツリー要素を生成します.
	 * @param formType 帳票タイプリスト
	 * @param path 帳票タイプパス
	 * @return ツリー要素リスト
	 */
	public convertFormTypeToTreeNodes(formType: EIMWorkspaceFormTypeDTO, path?: string): EIMFormTypeTreeNode {
		let icon = 'fa-fw fa-lg eim-icon-type';

		formType.formTypeName = this.getNameNoNamespace(formType.definitionName);

		if (path && path !== EIMAdminsConstantService.DELIMITER_PATH) {
			formType.path = path + formType.path;
		}

		let parent: EIMFormTypeTreeNode = {
			objId: formType.id,
			label: formType.formTypeName,
			data: formType,
			icon: icon,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: (formType.children.length === 0),
			nodePath: formType.path,
		};

		let children: EIMFormTypeTreeNode[] = [];
		let loopCnt = formType.children.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			if (formType.rootTypeDefName) {
				children.push(this.convertFormTypeToTreeNodes(formType.children[idx], formType.path));
			} else {
				children.push(this.convertFormTypeToTreeNodes(formType.children[idx], formType.path + formType.formTypeName));
			}

		}

		this.hierarchicalDomainService.setChildren(parent, children);

		parent.expanded = false;

		return parent;

	}


	/**
	 * 選択対象の行かどうか判定します.
	 * @param arg1 比較対象1
	 * @param arg2 比較対象2
	 */
	public defaultEquals(arg1: any, arg2: any): boolean {
		return arg1.data.id === arg2.data.id;
	};


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ネームスペース文字列を除いた定義名称を取得します。<br>
	 * @param definitionName ネームスペース文字列を含む定義名称<br>
	 * @return ネームスペース文字列を除いた定義名称<br>
	 * @since Ver 6.0
	 */
	private getNameNoNamespace(name: string): string {
		let nameNoNamespace = '';
		if (name) {
			let index = name.indexOf(EIMAdminsConstantService.DELIMITER_COLON);
			nameNoNamespace = name.substring(index + 1);
		}
		return nameNoNamespace;
	}

}
