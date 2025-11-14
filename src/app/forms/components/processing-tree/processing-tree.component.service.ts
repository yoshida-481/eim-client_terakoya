import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormWorkspaceService } from 'app/forms/shared/services/apis/form-workspace.service';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeFolderDTO } from 'app/shared/dtos/form-type-folder.dto';

import { EIMWorkspaceTreeComponentService, EIMWorkspaceTreeNode } from 'app/forms/components/workspace-tree/workspace-tree.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 処理待ちツリーコンポーネントサービス
 */
@Injectable()
export class EIMProcessingTreeComponentService extends EIMWorkspaceTreeComponentService {
	
	public canInitialize: boolean = false;
	
	constructor(
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected messageService: EIMMessageService,
			protected formService: EIMFormService,
			protected formWorkspaceService: EIMFormWorkspaceService,
			protected translateService: TranslateService,
			protected serverConfigService: EIMServerConfigService,
	) {
		super(hierarchicalDomainService, messageService, formService, formWorkspaceService, translateService, serverConfigService);
		
	}

	/**
	 * 初期化します.
	 * @param info グリッドコンポーネント情報
	 * @param serviceParam パラメータ
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public initialize(info: EIMListComponentInfo<any>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {
		
		if (serviceParam.canInitialize) {
			this.canInitialize = true;
		}
		
		if (!this.canInitialize) {
			return;
		}
		
		// 処理待ち一覧を取得する
		this.formWorkspaceService.getProcessingList().subscribe((workspaces: EIMFormWorkspaceDTO[]) => {
			
			let oldData: EIMWorkspaceTreeNode[];
			oldData = Object.assign([], info.data);
			info.data.splice(0, info.data.length);
			
			for (let i = 0; i < workspaces.length; i++) {
				let folderTreeNode: EIMWorkspaceTreeNode = this.convertToEIMWorkspaceTreeNode(workspaces[i], workspaces[i].id);
				
				info.data.push(folderTreeNode);
				
			}
			
			// 初期化処理が終わったのでイベント発行
			if (initialized) {
				initialized.emit();
			}
			
			if (serviceParam.formWorkspaceId && (serviceParam.formTypeId || serviceParam.isTrash)) {
				let params: any = {};
				let workspaceTreeNode: EIMWorkspaceTreeNode = {};
				workspaceTreeNode.formWorkspaceId = serviceParam.formWorkspaceId;
				workspaceTreeNode.formTypeId = serviceParam.formTypeId;
				workspaceTreeNode.formTypeFolderId = serviceParam.formTypeFolderId;
				workspaceTreeNode.isTrash = serviceParam.isTrash;
				workspaceTreeNode.uniqueKey = this.createUniqueKey(workspaceTreeNode);
				if (serviceParam.targetObjectId) {
					params.targetObjectId = serviceParam.targetObjectId;
				}
				
				// ツリー展開
				this.expandTreeForTarget(info.data, workspaceTreeNode, oldData);
				
				// 選択処理
				info.equals = this.defaultEquals;
				this.select(info, [workspaceTreeNode], selected, params);
			}
			
		});
		
	}
	
	/**
	 * 作成ツリーノードに対する後処理
	 * @param node ワークスペースツリーノード
	 * @param dto ノードのデータ
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @param formTypeFolderId 帳票タイプフォルダID
	 */
	public convertToEIMWorkspaceTreeNodePostProcForCreateTreeNode(node: EIMWorkspaceTreeNode, dto: any, formWorkspaceId: number, formTypeId: number, formTypeFolderId: number): void {
		node.label = this.createLabel(dto.name, dto.totalFormCount);
	}
	
	/**
	 * ワークスペースに対する後処理
	 * @param nodes ワークスペースツリーノードリスト
	 * @param formWorkspaceId 帳票ワークスペースID
	 */
	public convertToEIMWorkspaceTreeNodePostProcForWorkspace(nodes: EIMWorkspaceTreeNode[], formWorkspaceId: number): void {
		// 空実装
	}
	
	/**
	 * 帳票件数を表示します.
	 * @param node ワークスペースツリーノード
	 * @param formCount 帳票件数
	 */
	public updateFormCount(node: EIMWorkspaceTreeNode, targetFormCount: number): void {
		if (!node) {
			return;
		}

		let prevCount: number = node.data.formCount;

		// 件数が変更されていない場合は更新しない
		if (prevCount == targetFormCount) {
			return;
		}

		// 対象ノードの件数を変更する
		node.data.formCount = targetFormCount;
		node.data.totalFormCount = node.data.totalFormCount - prevCount + node.data.formCount;
		node.label = this.createLabel(node.data.name, node.data.totalFormCount);

		let parent: EIMWorkspaceTreeNode = node.parent;
		while (parent) {
			// 親ノードの合計件数を変更する
			parent.data.totalFormCount = parent.data.totalFormCount - prevCount + targetFormCount;
			parent.label = this.createLabel(parent.data.name, parent.data.totalFormCount);
			// 次の親
			parent = parent.parent;
		}

	}

	/**
	 * 処理待ちツリーノードのラベルを作成します.
	 * @param name 名称
	 * @param count 件数
	 */
	private createLabel(name: string, count: number): string {
		return (name + ' (' + count + ')');
	}

}
