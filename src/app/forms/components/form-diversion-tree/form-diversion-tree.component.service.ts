import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormWorkspaceService } from 'app/forms/shared/services/apis/form-workspace.service';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMAttributeDomain} from 'app/shared/domains/entity/attribute.domain';
import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeFolderDTO } from 'app/shared/dtos/form-type-folder.dto';

import { EIMWorkspaceTreeComponentService, EIMWorkspaceTreeNode } from 'app/forms/components/workspace-tree/workspace-tree.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 流用元帳票タイプ選択用帳票ワークスペースツリーコンポーネントサービス.
 */
@Injectable()
export class EIMFormDiversionTreeComponentService extends EIMWorkspaceTreeComponentService {
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected messageService: EIMMessageService,
		protected formService: EIMFormService,
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
		
		// ワークスペースを設定する
		this.formWorkspaceService.getListForWriteAuthority({}).subscribe((workspaces: EIMFormWorkspaceDTO[]) => {
			
			info.data.splice(0, info.data.length);
			
			for (let i = 0; i < workspaces.length; i++) {
				let treeNode: EIMWorkspaceTreeNode = super.convertToEIMWorkspaceTreeNode(workspaces[i], workspaces[i].id);
				info.data.push(treeNode);
			}
			
			// 初期選択フラグが立っている場合
			if (serviceParam.initialSelectionFlag) {
				// 選択のためにツリーノードを作成する
				let workspaceTreeNode: EIMWorkspaceTreeNode = {};
				workspaceTreeNode.formWorkspaceId = serviceParam.formWorkspaceId;
				workspaceTreeNode.formTypeId = serviceParam.formTypeId;
				workspaceTreeNode.formTypeFolderId = serviceParam.formTypeFolderId;
				workspaceTreeNode.isTrash = false;
				workspaceTreeNode.uniqueKey = super.createUniqueKey(workspaceTreeNode);
				
				// 選択処理
				info.equals = this.defaultEquals;
				super.select(info, [workspaceTreeNode], selected);
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
		
	}
	
	/**				
	 * ノードが選択できるかどうか返却します.				
	 * @param node 判定対象のノード				
	 * @return ノードが選択できるかどうか				
	 */				
	public canSelect(node: EIMTreeNode): boolean {				
		for (let i = 0; i < node.data.accessRoleTypeList.length; i++) {			
			if (node.data.accessRoleTypeList[i].definitionName == "CREATE" ) {		
				if(node.parent != null){	
					return true;
				}	
			}		
		}			
		return false;			
	}				

}
