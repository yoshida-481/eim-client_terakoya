import { EIMFormsConstantService } from '../../shared/services/forms-constant.service';
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
import { TranslateService } from '@ngx-translate/core';
import { EIMAccessRoleTypeDomain } from "app/shared/domains/entity/access-role-type.domain";
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 帳票ワークスペースツリーノードインタフェース.
 */
export interface EIMWorkspaceTreeNode extends EIMTreeNode {
	id?: number;
	formWorkspaceId?: number;
	formTypeId?: number;
	formTypeFolderId?: number;
	isTrash?: boolean;
	formCount?: number;
	uniqueKey?: string;
	securityId?: number;
	accessRoleTypeList?: EIMAccessRoleTypeDomain[];
}

/**
 * 帳票ワークスペースツリーコンポーネントサービス.
 */
@Injectable()
export class EIMWorkspaceTreeComponentService extends EIMTreeComponentService {

	/** 初期化処理実行可能フラグ */
	public canInitialize: boolean = false;

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
		super(hierarchicalDomainService);

		/**
		 * 選択対象の行かどうか判定します.
		 * 判定はユニークキーで行います.
		 * @param arg1 元
		 * @param arg2 対象
		 * @return 同じ場合:true、異なる場合:false
		 */
		this.defaultEquals = (arg1: any, arg2: any) => {
			return (arg1.uniqueKey === arg2.uniqueKey);
		};
	}

	/**
	 * 初期化します.
	 * @param info コンポーネント情報
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

		// ワークスペースを設定する
		this.formWorkspaceService.getList({}).subscribe((workspaces: EIMFormWorkspaceDTO[]) => {

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
	 * DTOをツリーノードに変換します.
	 * @param dto DTO
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @return ツリーノード
	 */
	public convertToEIMWorkspaceTreeNode(dto: any, formWorkspaceId?: number, formTypeId?: number): EIMWorkspaceTreeNode {
		let icon: string = 'fa fa-fw fa-lg ' + this.getIcon(dto);
		
		if (dto instanceof EIMFormTypeDTO) {
			formTypeId = dto.id;
		}

		let formTypeFolderId: number = 0;
		if (dto instanceof EIMFormTypeFolderDTO) {
			formTypeFolderId = dto.id;
		}

		let parent: EIMWorkspaceTreeNode = {
			label: dto.name,
			data: dto,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: (dto.children.length === 0),
			formWorkspaceId: formWorkspaceId,
			formTypeId: (formTypeId ? formTypeId : 0),
			formTypeFolderId: formTypeFolderId,
			isTrash: false,
			objId: Number(dto.id),
			formCount: dto.formCount,
			securityId: dto.securityId,
			accessRoleTypeList: dto.accessRoleTypeList,
		};
		parent.uniqueKey = this.createUniqueKey(parent);

		this.convertToEIMWorkspaceTreeNodePostProcForCreateTreeNode(parent, dto, formWorkspaceId, formTypeId, formTypeFolderId);

		let children: EIMWorkspaceTreeNode[] = [];
		for (let i = 0; i < dto.children.length; i++) {
			children.push(this.convertToEIMWorkspaceTreeNode(dto.children[i], formWorkspaceId, formTypeId));
		}

		// ワークスペースの場合、後処理を実行する
		if (dto instanceof EIMFormWorkspaceDTO) {
			this.convertToEIMWorkspaceTreeNodePostProcForWorkspace(children, formWorkspaceId);
		}

		this.hierarchicalDomainService.setChildren(parent, children);
		parent.expanded = false;

		return parent;
	}

	/**
	 * 作成ツリーノードに対する後処理
	 * @param node ツリーノード
	 * @param dto DTO
	 * @param formWorkspaceId 帳票ワークスペースID
	 * @param formTypeId 帳票タイプID
	 * @param formTypeFolderId 帳票タイプフォルダID
	 */
	public convertToEIMWorkspaceTreeNodePostProcForCreateTreeNode(node: EIMWorkspaceTreeNode, dto: any, formWorkspaceId: number, formTypeId: number, formTypeFolderId: number): void {
		// 空実装
	}

	/**
	 * ワークスペースに対する後処理.
	 * @params nodes ツリーノードリスト
	 * @params formWorkspaceId 帳票ワークスペースID
	 */
	public convertToEIMWorkspaceTreeNodePostProcForWorkspace(nodes: EIMWorkspaceTreeNode[], formWorkspaceId: number): void {
		if (this.serverConfigService.showFormTrash) {
			// ごみ箱を作成する
			let trashNode: EIMWorkspaceTreeNode = {};
			trashNode.formWorkspaceId = formWorkspaceId;
			trashNode.objId = null;
			trashNode.icon = 'fa-fw fa-lg eim-icon-trash';
			trashNode.leaf = true;
			trashNode.label = this.translateService.instant('EIM_FORMS.LABEL_02016');
			trashNode.isTrash = true;
			trashNode.children = [];
			trashNode.uniqueKey = this.createUniqueKey(trashNode);
			nodes.push(trashNode);
		}
	}

	/**
	 * ノードを追加します.
	 * @param info コンポーネント情報
	 * @param parentNode 親ツリーノード
	 * @param data 親ツリーノードにツリーノードとして追加するデータ
	 */
	public addNode(info: EIMListComponentInfo<EIMTreeNode>, parentNode: EIMTreeNode, data: any[]): void {
		// 親ノードを特定する
		let node: EIMTreeNode = this.hierarchicalDomainService.get(info.data, parentNode.data, this.defaultEquals);
		if (!node) {
			return;
		}


		let addNodes: EIMTreeNode[] = [];

		// 追加ノードを作成して親ノードに追加する
		for (let i = 0; i < data.length; i++) {
			let addNode: EIMWorkspaceTreeNode = {};
			addNode.data = data[i];
			addNode.objId = data[i].objId;
			addNode.icon = 'fa fa-fw fa-lg ' + this.getIcon(data[i]);
			addNode.leaf = true;
			addNodes.push(addNode);
		}

		super.addNode(info, parentNode, addNodes);

	}

	/**
	 * ツリー展開状態を復元する.
	 * @param targetData 対象ツリーデータ
	 * @param treeNode 対象ツリーノード
	 * @param srcData 復元元ツリーデータ
	 */
	public expandTreeForTarget(targetData: any[], treeNode?: EIMWorkspaceTreeNode, srcData?: any[]): void {

		let srcExpandMap: Map<string, EIMWorkspaceTreeNode>;

		// 元データの開閉状態をマップに格納する
		if (srcData) {
			srcExpandMap = new Map<string, EIMWorkspaceTreeNode>();
			let srcList: any[] = this.hierarchicalDomainService.getList(srcData);
			srcList.forEach((src: EIMWorkspaceTreeNode) => {
				if (src.expanded) {
					srcExpandMap.set(src.uniqueKey, src);
				}
			});
		}

		let targetList: any[] = this.hierarchicalDomainService.getList(targetData);

		targetList.forEach((target: EIMWorkspaceTreeNode) => {
			if (srcExpandMap) {
				let src: EIMWorkspaceTreeNode = srcExpandMap.get(target.uniqueKey);
				if (src) {
					target.expanded = src.expanded;
				}
			}

			if (treeNode && target.uniqueKey === treeNode.uniqueKey) {
				let parent: EIMWorkspaceTreeNode = target.parent;
				while (parent) {
					parent.expanded = true;
					parent = parent.parent;
				}
			}
		});

	}

	/**
	 * 対象オブジェクトまでツリー展開して選択状態にする.
	 * @param info コンポーネント情報
	 * @param targetObjectId 対象オブジェクトID
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public contentsAccess(info: EIMListComponentInfo<any>, targetObjectId: number, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

		// ワークスペース一覧を取得する
		this.formWorkspaceService.getList({}).subscribe((workspaces: EIMFormWorkspaceDTO[]) => {
			let selectedObjectId: number;

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

			// 帳票オブジェクトIDで帳票を取得する
			this.formService.getByIdForTemporaryObject(targetObjectId).subscribe( (form: EIMFormDomain) => {

				if (!form) {
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_FORMS.ERROR_00006'));
					info.errored.emit('contentsAccess');
					return;
				}

				// ツリーノードに変換する
				let formTreeNode: EIMWorkspaceTreeNode = this.createWorkspaceTreeNodeFromForm(form);

				// 取得した帳票の帳票ワークスペースIDと帳票タイプフォルダIDが、ワークスペース一覧に含まれているかを判定する。
				// 含まれていない場合は参照権限が無いとみなして「読み取り権限がありません。」エラーメッセージをクライアント側で表示する。
				if (!this.isReadAuthority(info.data, formTreeNode)) {
					// 参照権限がない
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00008'));
					info.errored.emit('contentsAccess');
					return;
				}

				// ツリー展開
				this.expandTreeForTarget(info.data, formTreeNode, oldData);

				// 選択処理
				let params: any = {};
				params.targetObjectList = [form];

				info.equals = this.defaultEquals;

				this.select(info, [formTreeNode], selected, params);


			}, (err: any) => {
				info.errored.emit('contentsAccess');
			});

		});

	}

	/**
	 * ツリーデータに対象帳票の帳票ワークスペースID、帳票タイプフォルダIDが含まれているのかを判定する.
	 * 含まれている場合は対象帳票に参照権限があるとみなす.
	 * @param treeDataList 帳票ワークスペースツリーデータリスト
	 * @param formTreeNode 帳票のツリーノード
	 * @return 含まれている場合true、含まれていない場合false
	 */
	private isReadAuthority(treeDataList: EIMWorkspaceTreeNode[], formTreeNode: EIMWorkspaceTreeNode): boolean {
		// 親子関係を持つツリーデータをフラット化する
		let flatList: EIMWorkspaceTreeNode[] = this.hierarchicalDomainService.getList(treeDataList);

		for (let i = 0; i < flatList.length; i++) {
			let treeData: EIMWorkspaceTreeNode = flatList[i];
			if (treeData.uniqueKey === formTreeNode.uniqueKey) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 指定した帳票が存在しているツリーノードを選択状態にします.
	 * @param info コンポーネント情報
	 * @param form 帳票ドメイン
	 * @param selected 選択イベントエミッタ
	 */
	public selectByForm(info: EIMListComponentInfo<any>, form: EIMFormDomain, selected?: EventEmitter<any>): void {

		let workspaceTreeNode: EIMWorkspaceTreeNode = this.createWorkspaceTreeNodeFromForm(form);
		let params: any = {};
		params.targetObjectList = [{id: form.id}];

		// ツリー展開
		this.expandTreeForTarget(info.data, workspaceTreeNode);

		// 選択処理
		this.select(info, [workspaceTreeNode], selected, params);

	}

	/**
	 * 帳票ドメインから帳票ワークスペースツリーノードを作成します.
	 * @param form 帳票ドメイン
	 * @return 帳票ワークスペースツリーノード
	 */
	private createWorkspaceTreeNodeFromForm(form: EIMFormDomain): EIMWorkspaceTreeNode {
		let formWorkspaceId: number;
		let formTypeId: number = form.type.id;
		let formTypeFolderId: number;
		let isTrash: boolean = false;
		form.attributeList.forEach( (attribute: EIMAttributeDomain) => {
			if (attribute.attributeType.definitionName === EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID) {
				formWorkspaceId = attribute.longList[0];
			} else if (attribute.attributeType.definitionName === EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_FORM_TYPE_FOLDER_ID) {
				formTypeFolderId = attribute.longList[0];
			} else if (attribute.attributeType.definitionName === EIMFormsConstantService.ATTRIBUTE_TYPE_NAME_DELETE_FLAG) {
				if (attribute.longList[0] === 1) {
					isTrash = true;
				}
			}
		});

		let workspaceTreeNode: EIMWorkspaceTreeNode = {};
		workspaceTreeNode.formWorkspaceId = formWorkspaceId;
		workspaceTreeNode.formTypeId = formTypeId;
		workspaceTreeNode.formTypeFolderId = formTypeFolderId;
		workspaceTreeNode.isTrash = isTrash;
		workspaceTreeNode.uniqueKey = this.createUniqueKey(workspaceTreeNode);

		return workspaceTreeNode;
	}

	/**
	 * ノードが選択できるかどうか返却します.
	 * ルートのワークスペースは選択不可とします.
	 * @param node 判定対象のノード
	 * @return ノードが選択できるかどうか
	 */
	public canSelect(node: EIMTreeNode): boolean {
		return (node.parent != null);
	}

	/**
	 * アイコンを取得します.
	 * @param dto 帳票ワークスペースDTOとその子クラスのDTO
	 * @return アイコンクラス
	 */
	protected getIcon(dto: any): string {
		if (dto instanceof EIMFormWorkspaceDTO) {
			return 'eim-icon-form-workspace eim-icon-form-workspace-color';
		}
		if (dto instanceof EIMFormTypeDTO) {
			return 'eim-icon-form-type eim-icon-form-type-color';
		}
		if (dto instanceof EIMFormTypeFolderDTO) {
			return 'eim-icon-folder eim-icon-folder-color';
		}
		return 'eim-icon-trush eim-icon-trush-color';
	}

	/**
	 * ツリー内で一意になるキーを作成します.
	 * @param treeNode ツリーノード
	 * @return ユニークキー
	 */
	protected createUniqueKey(treeNode: EIMWorkspaceTreeNode): string {
		let key: string = '';

		if (treeNode.formWorkspaceId || treeNode.formWorkspaceId >= 0) {
			key += treeNode.formWorkspaceId;

			if (treeNode.isTrash) {
				key += '-' + 'trash';
			} else {
				if (treeNode.formTypeId) {
					key += '-' + treeNode.formTypeId;
					if (treeNode.formTypeFolderId) {
						key += '-' + treeNode.formTypeFolderId;
					}
				}
			}

		}

		return key;
	}

}
