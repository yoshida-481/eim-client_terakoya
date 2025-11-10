import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMHierarchicalSecurityDomain } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

export interface EIMSecurityTreeNode extends EIMTreeNode {
	isBranch?: boolean;
	secId?: number;
	secLabel?: string;
	workflowId?: number;
	workflowLabel?: string;
	stSecId?: number;
	stTypeId?: number;
	stSecLabel?: string;
}
export interface EIMSecurity {
	secId?: number,
	secName?: string,
	entryList?: EIMEntry[],
	updateRole?: boolean,
}
export interface EIMEntry {
	entryId?: number,
	entryTypeId?: number,
	entryTypeName?: string,
	entryObjName?: string,
	priority?: number,
}

/**
 * セキュリティAPIサービス
 */
@Injectable()
export class EIMObjectEditorsSecurityService {

	/**
	 * セキュリティサービス.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService) {}

	/**
	 * セキュリティリストを取得します.
	 * @return セキュリティリスト
	 */
	public getSecurityList(): Observable<any> {
		return this.httpService.postForForm('/rest/security/dspSecurityTree.mvc', {})
		.pipe(mergeMap((res: any) => {
			return of(this.convertSecurityToTreeNodes(res.value.secList));
		}));
	}

	/**
	 * アクセスエントリーリストを取得します.
	 * @param id セキュリティID
	 * @return アクセスエントリーのリスト
	 */
	public getEntryList(id: number): Observable<EIMEntryDTO[]> {
		let params: any = {};

		return this.httpService.postForForm('/rest/security/dspEntry.mvc', {secId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.entryList.entry,
					(_json: any) => {
						return new EIMEntryDTO(_json);
					}));

		}));
	}

	/**
	 * セキュリティからツリー要素を生成します.
	 * @param security セキュリティ
	 * @return ツリー要素リスト
	 */
	private convertSecurityToTreeNodes(security: any, pearent?: any, parentSecId?: number, parentSecName?: string): EIMSecurityTreeNode[] {
		let rtTreeNode: EIMSecurityTreeNode[] = [];

		if (!security) {
			return rtTreeNode;
		}

		if (security instanceof Array === false) {
			security = [security];
		}

		// ツリーの子要素を再帰的に生成
		for (let i = 0; i < security.length; i++) {

			// ツリー要素を生成
			let secData = this.convertToEIMHierarchicalSecurity(security[i], parentSecId, parentSecName);
			let treeNode: EIMSecurityTreeNode = {
				label: security[i].attr.label,
				objId: secData.id,
				expandedIcon: 'fa fa-fw fa-lg eim-icon-security',
				collapsedIcon: 'fa fa-fw fa-lg eim-icon-security',
				data: secData,
				parent: pearent,
			}

			let childlen: EIMSecurityTreeNode[] = [];
			// ワークフロー
			if (security[i].workflow) {
				if (security[i].workflow instanceof Array === false) {
					let temps: any[] = [];
					security[i].workflow = [security[i].workflow];
				}
				treeNode.expanded = false;
				childlen = this.convertSecurityToTreeNodes(security[i].workflow, treeNode, Number(security[i].attr.secId), security[i].attr.label);
			}

			// ステータス別セキュリティ
			if (security[i].statusSecurity) {
				if (security[i].statusSecurity instanceof Array === false) {
					security[i].statusSecurity = [security[i].statusSecurity];
				}
				treeNode.expanded = false;
				childlen = this.convertSecurityToTreeNodes(security[i].statusSecurity, null, parentSecId, parentSecName);
			}

			treeNode.children = childlen;
			rtTreeNode.push(treeNode);
		}

		return rtTreeNode;
	}

	private convertToEIMHierarchicalSecurity(json: any, parentSecId: number, parentSecName: string): EIMHierarchicalSecurityDomain {

		let resSecurity = {};
		let treeId: number = null;

		let workflowId: number  = null;
		if (json.attr.id !== void 0) {
			workflowId = Number(json.attr.id);
		}

		let statusTypeId: number = null;
		if (json.attr.statusTypeId !== void 0) {
			statusTypeId = Number(json.attr.statusTypeId);
		}

		let secId: number = null;
		if (json.attr.secId !== void 0) {
			secId = Number(json.attr.secId);
		}

		let stSecId: number = null;
		if (statusTypeId && secId) {
			stSecId = secId;
			secId = parentSecId;
		}

		if (workflowId) {
			treeId = workflowId;
		} else if (stSecId) {
			treeId = stSecId;
		} else {
			treeId = secId;
		}

		if (workflowId) {
			resSecurity['workflowId'] = workflowId;
		}

		if (stSecId) {
			resSecurity['stSecId'] = stSecId;
			resSecurity['stTypeId'] = statusTypeId;
		}

		if (secId) {
			resSecurity['secId'] = secId;
		}

		resSecurity['id'] = treeId;
		resSecurity['label'] = json.attr.label;
		resSecurity['isBranch'] = json.attr.isBranch;
		resSecurity['secName'] = parentSecName ? parentSecName : json.attr.label;

		return resSecurity;

	}
}
