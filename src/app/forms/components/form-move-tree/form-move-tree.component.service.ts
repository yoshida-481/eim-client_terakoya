import { EIMFormTypeDomain } from '../../../shared/domains/form-type.domain';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormTypeService } from 'app/forms/shared/services/apis/form-type.service';
import { EIMFormWorkspaceService } from 'app/forms/shared/services/apis/form-workspace.service';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMAttributeDomain} from 'app/shared/domains/entity/attribute.domain';
import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeFolderDTO } from 'app/shared/dtos/form-type-folder.dto';
import { EIMFormTypeCriteria } from 'app/shared/domains/criteria/form-type.criteria';

import { EIMFormWorkspaceDomain } from 'app/shared/domains/form-workspace.domain';

import { EIMWorkspaceTreeComponentService, EIMWorkspaceTreeNode } from 'app/forms/components/workspace-tree/workspace-tree.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 移動先帳票タイプ選択用帳票ワークスペースツリーコンポーネントサービス.
 */
@Injectable()
export class EIMFormMoveTreeComponentService extends EIMWorkspaceTreeComponentService {
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected messageService: EIMMessageService,
		protected formService: EIMFormService,
		protected formTypeService: EIMFormTypeService,
		protected formWorkspaceService: EIMFormWorkspaceService,
		protected translateService: TranslateService,
		protected serverConfigService: EIMServerConfigService,
	) {
		super(
			hierarchicalDomainService,
			messageService,
			formService,
			formWorkspaceService,
			translateService,
			serverConfigService,
		);
	}
	
	/**
	 * 初期化します.
	 * @param info コンポーネント情報
	 * @param serviceParam パラメータ
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public initialize(info: EIMListComponentInfo<EIMWorkspaceTreeNode>, serviceParam: any = {}, initialized?: EventEmitter<EIMWorkspaceTreeNode>, selected?: EventEmitter<EIMWorkspaceTreeNode>): void {
		
		// パラメータが無い（ngOnInitで呼び出される）場合は、無視する
		if (!serviceParam.formWorkspaceId && !serviceParam.formTypeId) {
			return;
		}
		
		// 帳票ワークスペースを取得する
		this.formWorkspaceService.getByIdForWriteAuthority(serviceParam.formWorkspaceId).subscribe((workspace: EIMFormWorkspaceDTO) => {
			
			// 参照を切らずにクリアする
			info.data.splice(0, info.data.length);
			
			for (let i = 0; i < workspace.children.length; i++) {
				let treeNode: EIMWorkspaceTreeNode;
				if (serviceParam.formTypeId === workspace.children[i].id) {
					treeNode = super.convertToEIMWorkspaceTreeNode(workspace.children[i], 0);
					info.data.push(treeNode);
					break;
				}
			}
			
			if (initialized) {
				initialized.emit();
			}
			
		});
		
	}
	
	/**
	 * ワークスペースに対する後処理.
	 * @params nodes ツリーノードリスト
	 * @params formWorkspaceId 帳票ワークスペースID
	 */
	public convertToEIMWorkspaceTreeNodePostProcForWorkspace(nodes: EIMWorkspaceTreeNode[], formWorkspaceId: number): void {
		// 空実装
	}
	
	/**
	 * ノードが選択できるかどうか返却します.
	 * @param node 判定対象のノード
	 * @return ノードが選択できるかどうか
	 */
	public canSelect(node: EIMTreeNode): boolean {
		for (let i = 0; i < node.data.accessRoleTypeList.length; i++) {			
			if (node.data.accessRoleTypeList[i].definitionName == "CREATE" ) {		
					return true;
			}		
		}			
		return false;			
	}
	
}
