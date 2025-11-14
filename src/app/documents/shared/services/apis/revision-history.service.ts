import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';

import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * 改訂履歴階層ドメイン
 */
export interface EIMHierarchicalRevisionHistory extends EIMHierarchicalDomain {
	objId: number;
	objName: string;
	objTypeId: number;
	objTypeName: string;
	rev: number;
	modifyUserName: string;
	modifyDate: string;
	modifyDateTime: number;
	updateComment: string;
	path: string;
	statusTypeKind: number;
	parentObjId: number;
	isDspPubIconForNoWF: boolean;
	isPDFJoinFailed: boolean;
	isDspPdfIcon: boolean;
	expiration: boolean;
	readOnly: boolean;
	signencr: number;
	ocrResultStatus: number;
	default: boolean;
	initialSelect: boolean;
	hasChild: boolean;
	isSearch: boolean;
	isDocumentLink: boolean;
	isDspLatestLink: boolean;
	documentLinkUpdateTiming: number;
	children?: EIMHierarchicalRevisionHistory[];
	isTargetPath?: boolean; // 選択したエレメントからルートまでのパス上のエレメントかどうか
	isTargetElement?: boolean; // 選択したエレメントかどうか
	rootId?: number; // ルートのID
	level?: number;	// 階層レベル（ルートから何階層目か）
	isDocument: boolean; // ドキュメントかどうか
	pdfConversionStatus?: number;
	isPdfPreRegistered: boolean;
}

/**
 * 改訂履歴APIサービス.
 */
@Injectable()
export class EIMRevisionHistoryService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService) {}

	/**
	 * ルートから該当リビジョンまでの改訂履歴の階層を取得します.
	 * @param id 取得対象のオブジェクトID
	 */
	public getHierarchical(id: number): Observable<EIMHierarchicalRevisionHistory> {
		return this.httpService.get('/app/document/object/dspDefaultHistoryTree.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.createHierarchicalRevisionHistory(res.value.branch, id));
			}));
	}

	/**
	 * 該当リビジョンを含む、関連する全ての改訂履歴の階層を取得します.
	 * @param id 取得対象のオブジェクトID
	 */
	public getAllHierarchical(id: number, rootRevObjId: number): Observable<EIMHierarchicalRevisionHistory> {
		return this.httpService.get('/app/document/object/dspBranchHistoryTree.jsp', {objId: rootRevObjId, initialSelectedObjId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.createHierarchicalRevisionHistory(res.value.branch, id));
			}));
	}

	// JSONをドメインに変換します。
	private convertToEIMHierarchicalRevisionHistory(json: any): EIMHierarchicalRevisionHistory {

		return {
			objId: Number(json.attr.objId),
			objName: json.attr.objName,
			objTypeId: Number(json.attr.objTypeId),
			objTypeName: json.attr.objTypeName,
			rev: Number(json.attr.rev),
			modifyUserName: json.attr.modifyUserName,
			modifyDate: json.attr.modifyDate,
			modifyDateTime: Number(json.attr.modifyTime),
			updateComment: json.attr.updateComment,
			path: json.attr.path,
			statusTypeKind: Number(json.attr.statusTypeKind),
			parentObjId: Number(json.attr.parentObjId),
			isDspPubIconForNoWF: json.attr.isDspPubIconForNoWF == 'true' ? true : false,
			isPDFJoinFailed: json.attr.isPDFJoinFailed == 'true' ? true : false,
			isDspPdfIcon: json.attr.isDspPdfIcon == 'true' ? true : false,
			expiration: json.attr.expiration == 'true' ? true : false,
			readOnly: json.attr.readOnly == 'true' ? true : false,
			signencr: Number(json.attr.signencr),
			ocrResultStatus: Number(json.attr.ocrResultStatus),
			default: json.attr.default == 'true' ? true : false,
			initialSelect: json.attr.initialSelect == 'true' ? true : false,
			hasChild: json.attr.hasChild == 'true' ? true : false,
			isSearch: json.attr.isSearch == 'true' ? true : false,
			isDocumentLink: json.attr.isDocumentLink == 'true' ? true : false,
			isDspLatestLink: json.attr.isDspLatestLink == 'true' ? true : false,
			documentLinkUpdateTiming: Number(json.attr.documentLinkUpdateTiming),
			pdfConversionStatus: Number(json.attr.pdfConversionStatus),
			isPdfPreRegistered: json.attr.isPdfPreRegistered == 'true' ? true : false,
			isTargetPath: false,
			isTargetElement: false,
			isDocument: true,
			children: [],
		}
	}

	// ブランチの階層を生成します.
	//
	// <branch>
	//   <node> node1-1
	//     <branch>
	//       <node> node2-1
	//       <node> node2-2
	//     <branch>
	//       <node> node3-1
	//       <node> node3-2
	//   <node> node1-2
	//    ↓
	// node1-1
	//   ├node1-2
	//   ├node2-1
	//   │ └node2-2
	//   └node3-1
	//      └node3-2
	private createHierarchicalRevisionHistory(jsonBranch: any, id: number, level = 0, parentDomain?: EIMHierarchicalRevisionHistory): EIMHierarchicalRevisionHistory {
		let jsonNodes: any[] = this.toArray(jsonBranch.node);

		let rootDomain: EIMHierarchicalRevisionHistory;
		let preRevDomain: EIMHierarchicalRevisionHistory;
		let targetDomain: EIMHierarchicalRevisionHistory;
		let levelInBranch: number = level;
		for (let i = 0; i < jsonNodes.length; i++) {
			let domain:  EIMHierarchicalRevisionHistory = this.convertToEIMHierarchicalRevisionHistory(jsonNodes[i]);

			// 前の履歴との親子関係を設定
			if (preRevDomain) {
				if (!preRevDomain.children) {
					preRevDomain.children = [];
				}
				// 先頭に追加
				preRevDomain.children.unshift(domain);
				domain.parent = preRevDomain;
			} else if (parentDomain) {
				if (!parentDomain.children) {
					parentDomain.children = [];
				}
				// 先頭に追加
				parentDomain.children.push(domain);
				domain.parent = parentDomain;
			}

			// ブランチの1件目のノードはルートノード
			if (i == 0) {
				rootDomain = domain;
			}

			// ノードの属性値を設定
			domain.rootId = rootDomain.objId;
			domain.level = levelInBranch;
			if (domain.objId == id) {
				domain.isTargetElement = true;
				targetDomain = domain;
			}

			if (jsonNodes[i].branch) {
				// 子ブランチがある場合
				let jsonBranches: any[] = this.toArray(jsonNodes[i].branch);
				let childDomains: EIMHierarchicalRevisionHistory[] = [];
				for (let j = 0; j < jsonBranches.length; j++) {
					childDomains.push(this.createHierarchicalRevisionHistory(jsonBranches[j], id, levelInBranch + 1, domain));
				}
				// 子ブランチとの親子関係を設定
				this.hierarchicalDomainService.setChildren(domain, childDomains);
			}

			preRevDomain = domain;
			levelInBranch++;
		}
		if (targetDomain) {
			this.setTargetPath(targetDomain);
		}
		return rootDomain;
	}

	// JSONを配列に変換します。
	private toArray(json: any): any[] {
		let array: any[] = json;
		if (!Array.isArray(json)) {
			array = [json];
		}
		return array;
	}

	// 選択したエレメントからルートまでのパス上のエレメントにフラグを設定
	private setTargetPath(domain: EIMHierarchicalRevisionHistory): void {
		if (!domain) {
			return;
		}
		domain.isTargetPath = true;
		if (domain.parent) {
			this.setTargetPath(<EIMHierarchicalRevisionHistory>domain.parent);
		}
	}
}
