import { EIMEntry } from 'app/shared/services/apis/entry.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

/**
 * 公開通知テンプレートノード
 */
export class EIMPublicNotificationTemplateNode {
	label: string;
	isBranch: boolean;
	templateId: number;
	templateName: string;

	constructor(json: any) {
		const { attr: { label, isBranch, templateId, templateName } } = json;
		this.label = label;
		this.isBranch = !!isBranch;
		this.templateId = Number(templateId);
		this.templateName = templateName;
	}
}

/**
 * 公開通知テンプレート所属ノード
 */
export class EIMPublicNotificationTemplateAssignNode {
	userId?: number;
	userCode?: string;
	userName?: string;
	userKana?: string;
	userMail?: string;
	groupId?: number;
	groupName?: string;
	roleId?: number;
	roleName?: string;
	compId?: number;
	compName?: string;

	constructor(json: any) {
		const { attr } = json;
		if (attr.compId) {
			const { compId, compName, groupId, groupName, roleId, roleName } = attr;
			this.compId = Number(compId);
			this.compName = compName;
			this.groupId = Number(groupId);
			this.groupName = groupName;
			this.roleId = Number(roleId);
			this.roleName = roleName;
		} else if (attr.userId) {
			const { userId, userCode, userName, userKana, userMail } = attr;
			this.userId = Number(userId);
			this.userCode = userCode;
			this.userName = userName;
			this.userKana = userKana;
			this.userMail = userMail;
		} else if (attr.groupId) {
			const { groupId, groupName } = attr;
			this.groupId = Number(groupId);
			this.groupName = groupName;
		} else if (attr.roleId) {
			const { roleId, roleName } = attr;
			this.roleId = Number(roleId);
			this.roleName = roleName;
		}
	}
}

/**
 * 公開通知テンプレートAPIサービス
 */
@Injectable()
export class EIMPublicNotificationTemplateService {

	constructor(
		protected httpService: EIMHttpService,
		protected domainService: EIMDomainService,
		protected entryService: EIMEntryService,
	) { }

	/**
	 * テンプレートツリー取得
	 */
	getTemplateTree(): Observable<EIMPublicNotificationTemplateNode[]> {
		return this.httpService.get('/app/document/publish/dspTemplateTree.jsp')
			.pipe(map(res => this.domainService.createObjectList(
				res.value.nodes.node,
				json => new EIMPublicNotificationTemplateNode(json))));
	}

	/**
	 * テンプレート所属一覧取得
	 * @param templateId テンプレートID
	 */
	getTemplateAssign(templateId: number): Observable<EIMPublicNotificationTemplateAssignNode[]> {
		return this.httpService.get('/app/document/publish/dspTemplateAssign.jsp', { templateId })
			.pipe(map(res => {
				const users = this.domainService.createObjectList(
					res.value.assigns.user,
					json => new EIMPublicNotificationTemplateAssignNode(json));
				const groups = this.domainService.createObjectList(
					res.value.assigns.group,
					json => new EIMPublicNotificationTemplateAssignNode(json));
				const roles = this.domainService.createObjectList(
					res.value.assigns.role,
					json => new EIMPublicNotificationTemplateAssignNode(json));
				const comps = this.domainService.createObjectList(
					res.value.assigns.comp,
					json => new EIMPublicNotificationTemplateAssignNode(json));
				return [].concat(users, groups, roles, comps);
			}));
	}

	/**
	 * テンプレート登録
	 * @param templateName テンプレート名
	 */
	createTemplate(templateName: string, entries?: EIMEntry[]): Observable<EIMPublicNotificationTemplateNode> {
		const params = Object.assign({ templateName }, this.createTemplateEntryParams(entries));
		return this.httpService.postForForm('/app/document/publish/actCreateTemplate.jsp', params)
			.pipe(map(res => this.domainService.createObject(
				res.value.object,
				json => {
					const { attr: { templateId } } = json;
					return new EIMPublicNotificationTemplateNode({
						attr: {
							label: templateName,
							isBranch: false,
							templateId: Number(templateId),
							templateName,
						}
					});
				})));
	}

	/**
	 * テンプレート更新
	 * @param templateId テンプレートID
	 */
	updateTemplate(templateId: number, templateName: string, entries: EIMEntry[]): Observable<EIMPublicNotificationTemplateNode> {
		const params = Object.assign({ objId: templateId, templateName }, this.createTemplateEntryParams(entries));
		return this.httpService.postForForm('/app/document/publish/actUpdateTemplate.jsp', params)
			.pipe(map(res => new EIMPublicNotificationTemplateNode({
				attr: {
					label: templateName,
					isBranch: false,
					templateId: Number(templateId),
					templateName,
				}
			})));
	}

	/**
	 * テンプレート削除
	 * @param templateId テンプレートID
	 */
	deleteTemplate(templateId: number): Observable<any> {
		const params = { objId: templateId };
		return this.httpService.postForForm('/app/document/publish/actDeleteTemplate.jsp', params);
	}

	/**
	 * テンプレートをエントリに変換します.
	 * @param node テンプレート
	 * @return エントリ
	 */
	convertTemplateToEntry(node: EIMPublicNotificationTemplateNode): EIMEntry {
		return {
			entryId: node.templateId,
			entryName: node.label,
			entryObjName: node.templateName,
		};
	}

	/**
	 * テンプレートリストをエントリリストに変換します.
	 * @param nodes テンプレートリスト
	 * @return エントリリスト
	 */
	convertTemplatesToEntrys(nodes: EIMPublicNotificationTemplateNode[]): EIMEntry[] {
		return nodes.map(node => this.convertTemplateToEntry(node));
	}

	/**
	 * テンプレートをツリーノードに変換します.
	 * @param node テンプレート
	 * @return ツリーノード
	 */
	convertTemplateToTreeNode(node: EIMPublicNotificationTemplateNode): EIMTreeNode {
		return {
			label: node.label,
			expandedIcon: 'fa fa-fw fa-star',
			collapsedIcon: 'fa fa-fw fa-star',
			data: this.convertTemplateToEntry(node),
		};
	}

	/**
	 * テンプレートをツリーノードリストに変換します.
	 * @param nodes テンプレートリスト
	 * @return ツリーノードリスト
	 */
	convertTemplatesToTreeNodes(nodes: EIMPublicNotificationTemplateNode[]): EIMTreeNode[] {
		return nodes.map(node => this.convertTemplateToTreeNode(node));
	}

	/**
	 * テンプレート所属リストをエントリリストに変換します.
	 * @param nodes テンプレート所属リスト
	 * @return エントリリスト
	 */
	convertTemplateAssignListToEntrys(nodes: EIMPublicNotificationTemplateAssignNode[]): EIMEntry[] {
		return nodes.map(node => {
			if (node.compId) {
				return {
					entryId: node.compId,
					entryName: node.compName,
					entryObjName: node.compName,
					entryTypeId: EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP,
					entryTypeName: this.entryService.getEntryTypeName(EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP),
				};
			} else if (node.userId) {
				return {
					entryId: node.userId,
					entryName: node.userName,
					entryObjName: node.userName,
					entryTypeId: EIMConstantService.ENTRY_TYPE_USER,
					entryTypeName: this.entryService.getEntryTypeName(EIMConstantService.ENTRY_TYPE_USER),
				};
			} else if (node.groupId) {
				return {
					entryId: node.groupId,
					entryName: node.groupName,
					entryObjName: node.groupName,
					entryTypeId: EIMConstantService.ENTRY_TYPE_GROUP,
					entryTypeName: this.entryService.getEntryTypeName(EIMConstantService.ENTRY_TYPE_GROUP),
				};
			} else if (node.roleId) {
				return {
					entryId: node.roleId,
					entryName: node.roleName,
					entryObjName: node.roleName,
					entryTypeId: EIMConstantService.ENTRY_TYPE_ROLE,
					entryTypeName: this.entryService.getEntryTypeName(EIMConstantService.ENTRY_TYPE_ROLE),
				};
			} else {
				return {};
			}
		});
	}

	private createTemplateEntryParams(entries: EIMEntry[]): any {
		const params = {
			userCount: 0,
			groupCount: 0,
			roleCount: 0,
			compCount: 0,
		};
		if (entries) {
			entries.forEach(item => {
				switch (item.entryTypeId) {
					case EIMConstantService.ENTRY_TYPE_USER:
						params[`userId_${params.userCount++}`] = item.entryId;
						break;
					case EIMConstantService.ENTRY_TYPE_GROUP:
						params[`groupId_${params.groupCount++}`] = item.entryId;
						break;
					case EIMConstantService.ENTRY_TYPE_ROLE:
						params[`roleId_${params.roleCount++}`] = item.entryId;
						break;
					case EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP:
						params[`compId_${params.compCount++}`] = item.entryId;
						break;
				}
			})
		}
		return params;
	}

}
