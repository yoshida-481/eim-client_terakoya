import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';



/** 属性情報 */
export interface EIMAttribute {
	objId: number,
	objName: string,
	label: string,
	value: string,
	objTypeId: number,
	objTypeName: string,
	isBranch: any,
	isSearch: boolean,
	isLeaf: any,
	isWorkflowFolder: boolean,
	attrTreeId: number,
	attrTreePath: string,
	attrTreeSettings: string,
	attrTreeValues: string[],
	children: EIMAttribute[],
	rev: string;
}

/**
 * 属性ツリーAPIサービス
 */
@Injectable()
export class EIMAttributeTreeService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dateService: EIMDateService,
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected attributeService: EIMDocumentsAttributeDomainService,
		protected translateService: TranslateService) {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 属性ツリーのルート階層を取得します.
	 * @return 属性ツリールート階層
	 */
	public getRoot(): Observable<EIMAttribute[]> {

		return this.httpService.get('/app/document/attrTree/dspAttrTree.jsp', null, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.nodes.node, param => this.convertToEIMAttribute(param)));
			}));
	}

	/**
	 * 子階層の属性を取得します.
	 * @param params 取得条件
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 * @return 子階層の属性
	 */
	public getAttrTreeChild(attrTreeId: number , attrTreePath: string , attrTreeSettings: string, attrTreeValues: string[] = [] ): Observable<EIMAttribute[]> {
		let params: any = {attrTreeId: attrTreeId , attrTreePath: attrTreePath , attrTreeSettings: attrTreeSettings}
		this.addValuesParam(params, attrTreeValues);
		return this.httpService.postForForm('/app/document/attrTree/dspAttrTreeChild.jsp',
				params, false)
			.pipe(mergeMap((json: any) => {
				return of(this.jsonService.getJsonChildren(json.value.nodes.node, param => this.convertToEIMAttribute(param)));
			}));
	}

	/**
	 * 指定オブジェクトを元にルートまでのツリー情報を取得します.
	 * @param attrTreeId 属性ツリーID
	 * @param attrTreePath 属性ツリーパス
	 * @param attrTreeSettings 属性ツリー設定
	 * @param attrTreeValues 属性ツリー値配列
	 * @return ルートまでのツリー情報
	 */
	public getAttrTreeForTarget(attrTreeId: string, attrTreePath: string, attrTreeSettings: string, attrTreeValues: string[] = []): Observable<EIMAttribute[]> {

		let params: any = {attrTreeId: attrTreeId , attrTreePath: attrTreePath , attrTreeSettings: attrTreeSettings}
		this.addValuesParam(params, attrTreeValues);
		return this.httpService.postForForm('/app/document/attrTree/dspAttrTree.jsp',
		params, false)
		.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.nodes.node, param => this.convertToEIMAttribute(param)));
		}));
	}

	/**
	 * 指定した属性値の子階層のコンテンツを取得します.
	 * @param attrTreeId 属性ツリーID
	 * @param attrTreePath 属性ツリーパス
	 * @param attrTreeSettings 属性ツリー設定
	 * @param attrTreeValues 属性値の配列
	 * @param objId オブジェクトID
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 * @return 属性値の子階層のコンテンツ
	 */
	public getAttrChildObjects(attrTreeId: number, attrTreePath: string, attrTreeSettings: string, attrTreeValues: any[], objId?: Number): Observable<any[]> {
		let returnObjectIds: string = null;
		let params: any = {attrTreeId: attrTreeId , attrTreePath: attrTreePath , attrTreeSettings: attrTreeSettings}
		this.addValuesParam(params, attrTreeValues);
		if (objId) {
			params['objId'] = objId;
		}
		return this.getAttrChildObjectList(params, false);
	}

/**
 * 子階層のフォルダ一覧を取得します.
 * @param attrTreeId 属性ツリーID
 * @param attrTreePath 属性ツリーパス
 * @param attrTreeSettings 属性ツリー設定
 * @param attrTreeValues 属性ツリー値
 * @param ObjectId オブジェクトID
 * @return 子階層のフォルダ一覧
 */
	public getAttrChildFolders(attrTreeId: number, attrTreePath: string, attrTreeSettings: string, attrTreeValues: any[], ObjectId: number): Observable<EIMAttribute[]> {
		let params: any = {attrTreeId: attrTreeId , attrTreePath: attrTreePath , attrTreeSettings: attrTreeSettings, ObjectId: ObjectId};
		this.addValuesParam(params, attrTreeValues);
		return this.httpService.postForForm('/app/document/folder/dspFolderTreeChild.jsp', params, false)
			.pipe(mergeMap((json: any) => {
				return of(this.jsonService.getJsonChildren(json.value.nodes.node, param => this.convertToEIMAttribute(param)));
			}));
	}

	/**
	 * 属性の子階層のコンテンツをIDを指定して取得します.
	 * @param attrTreeId 属性ツリーID
	 * @param attrTreePath 属性ツリーパス
	 * @param attrTreeSettings 属性ツリー設定
	 * @param attrTreeValues 属性値の配列
	 * @param objId オブジェクトID
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 * @return 属性の子階層のコンテンツ
	 */
	public getAttrChildObjectsByIds(attrTreeId: number, attrTreePath: string, attrTreeSettings: string, attrTreeValues: any[], targetObjectIds: number[], objId?: number): Observable<any[]> {
		let returnObjectIds: string = null;
		let params: any = {attrTreeId: attrTreeId , attrTreePath: attrTreePath , attrTreeSettings: attrTreeSettings}
		this.addValuesParam(params, attrTreeValues);
		if (objId) {
			params['objId'] = objId;
		}
		if (targetObjectIds) {
			returnObjectIds = targetObjectIds.join(',');
		}
		params.returnObjectIds = returnObjectIds;
		return this.getAttrChildObjectList(params, false);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 属性の子階層のコンテンツを取得します.
	 * @param params 取得条件
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 * @return 属性の子階層のコンテンツ
	 */
	private getAttrChildObjectList(params: any, displayProgressDialog: boolean): Observable<any[]> {

		return this.httpService.postForForm('/app/document/folder/dspChildObject.jsp',
				params, displayProgressDialog)
			.pipe(mergeMap((json: any) => {
				let objList: any[] = this.jsonService.getJsonChildren(json.value.objList);

				let children: any[] = this.jsonService.getJsonChildren(json.value.objList.object);
				let objects: EIMAttribute[] = [];
				for (let i = 0; i < children.length; i++) {
					let object: any = children[i].attr;
					for (let key in children[i]) {
						if (key !== 'attr') {
							object[key] = this.getMultiValue(children[i][key]);
						}
					}
					object['attrTreeId'] = objList[0].attr.attrTreeId;
					object['label'] = children[i].attr.objName;
					let attrTreeValueNm = 'attrTreeValue';
					let j = 1;
					while (true) {
						if (objList[0].attr[attrTreeValueNm + String(j)]) {
							if (!object['attTreeValues']) {
								object['attTreeValues'] = [];
							}
							object['attTreeValues'].push(objList[0].attr[attrTreeValueNm + String(j)]);
							j++;
							continue;
						}
						break;
					}
					objects.push(object);
				}
				return of(objects);
			}));
	}

	/**
	 * 配列からattrTreeValue + 番号のパラメータを追加します.
	 * @param params パラメータ
	 * @param attrTreeValues value配列
	 */
	private addValuesParam(params: any, attrTreeValues: string[]) {
		let attrTreeValueNm = 'attrTreeValue';
		for (let i = 0; i < attrTreeValues.length; i++) {
			params[attrTreeValueNm + String(i + 1)] = typeof attrTreeValues[i] === 'undefined' ? '' :  attrTreeValues[i];
		}
	}

	/**
	 * 取得したjsonデータをEIMAttributeに変換します.
	 * @param json jsonデータ
	 */
	private convertToEIMAttribute(json: any): EIMAttribute {

		let objId: number = null;
		let label: string;
		let value = '';
		let objTypeId = null;
		let objTypeName = '';
		let isBranch: boolean;
		let isSearch: boolean;
		let isLeaf: boolean;
		let isWorkflowFolder: boolean;
		let attrTreeId: number = null;
		let attrTreeSettings: string;
		let attrTreePath: string;
		let attrTreeValues: string[];
		let rev = '-';
		let children = [];

		if (json.attr.objId) {
			objId = JSON.parse(json.attr.objId);
		}
		if (json.attr.label === '') {
			label = this.translateService.instant('EIM_DOCUMENTS.LABEL_02029');
		} else if (json.attr.label && json.attr.label !== '') {
			label = json.attr.label;
		} else {
			label = json.attr.objName;
		}
		if (json.attr.value) {
			value = json.attr.value;
		}
		if (json.attr.objTypeId) {
			objTypeId = JSON.parse(json.attr.objTypeId);
		}
		if (json.attr.objTypeName) {
			objTypeName = json.attr.objTypeName;
		}
		if (json.attr.isBranch) {
			isBranch = JSON.parse(json.attr.isBranch);
		} else {
			isBranch = null;
		}
		if (json.attr.isSearch) {
			isSearch = JSON.parse(json.attr.isSearch);
		} else {
			isSearch = null;
		}
		if (json.attr.isLeaf ) {
			isLeaf = JSON.parse(json.attr.isLeaf);
		} else {
			isLeaf = null;
		}
		if (json.attr.isWorkFlowFolder) {
			isWorkflowFolder = JSON.parse(json.attr.isWorkFlowFolder);
		} else {
			if (json.attr.isWorkflowFolder) {
				isWorkflowFolder = JSON.parse(json.attr.isWorkflowFolder);
			} else {
				isWorkflowFolder = null;
			}
		}
		if (json.attr.attrTreeId) {
			attrTreeId = JSON.parse(json.attr.attrTreeId);
		}
		if (json.attr.attrTreeSettings) {
			attrTreeSettings = json.attr.attrTreeSettings;
		}
		if (json.attr.rev) {
			rev = json.attr.rev;
		}
		if (json.node) {
			if (json.node.length) {
				for (let i = 0; i < json.node.length; i++) {
					children.push(this.convertToEIMAttribute(json.node[i]));
				}
			} else {
				children.push(this.convertToEIMAttribute(json.node));
			}
		}

		return {
			objId: objId,
			objName: label,
			label: label,
			value : value ,
			objTypeId : objTypeId ,
			objTypeName : objTypeName ,
			isBranch: isBranch,
			isSearch: isSearch,
			isLeaf: isLeaf,
			isWorkflowFolder: isWorkflowFolder,
			attrTreeId: attrTreeId,
			attrTreeSettings: attrTreeSettings,
			attrTreePath: attrTreePath,
			attrTreeValues: attrTreeValues,
			rev: rev,
			children: children,
		};
	}

	/**
	 * 取得データから複数値属性を取得します.
	 * @param object 取得データ
	 */
	private getMultiValue(object: any): any[] {
		let values: any[] = [];

		if (!object.attValue) { return values; }

		if (Array.isArray(object.attValue)) {
			for (let i = 0; i < object.attValue.length; i++) {
				values.push(object.attValue[i].attr.value);
			}
		} else {
			values.push(object.attValue.attr.value);
		}
		return values;
	}
}
