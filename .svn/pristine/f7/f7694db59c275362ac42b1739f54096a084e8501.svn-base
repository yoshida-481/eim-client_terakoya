import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/** フォルダ情報 */
export interface EIMFolder {
	objId: number,
	objTypeId: number,
	objTypeName: string,
	objName: string,
	isWorkflowFolder: boolean,
	tagListKind: number,
}
/** フォルダタイプ情報 */
export interface EIMFolderType {
	objTypeId: number,
	objTypeName: string,
	children: EIMFolderType[]
}

/**
 * フォルダAPIサービス
 */
@Injectable()
export class EIMFolderService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dateService: EIMDateService,
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected attributeService: EIMDocumentsAttributeDomainService) {}

	/**
	 * フォルダを作成します.
	 * @param contents コンテンツ
	 * @param parentObjId 親オブジェクトID
	 */
	public create(contents: EIMContentsDomain, parentObjId: number): Observable<null> {
		// パラメータを設定
		let params: any = {
				objId: parentObjId,
				objTypeId: contents.type.id,
				objName: contents.name,
				isDspAttributeInfo: 1,
				isReturnObjectId: true,
		};

		// 表示している属性一覧を取得
		let attributeTypeLayoutList = contents.formLayout.objectTypeLayout.attributeTypeLayoutList;
		let attributeList: EIMAttributeDomain[] = this.attributeService.getVisibleAttributeList(contents.attributeList, attributeTypeLayoutList);

		// 各属性をパラメータに設定
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];

			let attrKeyPrefix: string = 'attType_' + attribute.attributeType.id + '_';

			// 属性値
			this.attributeService.setAttributeParams(params, attrKeyPrefix, attribute);

		  // 読み込み専用
			let isReadOnly = false;
			for (let j = 0; j < attributeTypeLayoutList.length; j++) {
				let attributeTypeLayout = attributeTypeLayoutList[j];
				if (Number(attribute.attributeType.id) === Number(attributeTypeLayout.id) && attributeTypeLayout.successionFlag) {
					isReadOnly = true;
				}
			}
			params[attrKeyPrefix + 'readOnly'] = isReadOnly;

			// 下位引継ぎ
			if (attribute['_lowSuccession']) {
				params[attrKeyPrefix + 'lowerSuccession'] = 1;
			}
		}

		// 名称割当
		params['attType_nameAllocate'] = contents['_nameAllocationAttributeTypeId'];

		return this.httpService.postForForm('/app/document/folder/actCreateFolder.jsp', params)
		.pipe(mergeMap((res: any) => {
					return of(res.value.object.attr);
		}));
	}

	/**
	 * ワークスペース一覧を取得します.
	 */
	public getWorkspaces(): Observable<EIMFolder[]> {
		return this.httpService.post('/app/document/folder/dspFolderTree.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.nodes.node, this.convertToEIMFolder));
			}));
	}

	/**
	 * 子階層のフォルダ一覧を取得します.
	 * @param id 親のオブジェクトID
	 */
	public getChildFolders(id: number): Observable<EIMFolder[]> {
		return this.httpService.get('/app/document/folder/dspFolderTreeChild.jsp',
				{ObjectId: id})
			.pipe(mergeMap((json: any) => {
				return of(this.jsonService.getJsonChildren(json.value.nodes.node, this.convertToEIMFolder));
			}));
	}

	/**
	 * 子階層のコンテンツを取得します.
	 * @param id 親のオブジェクトID
	 * @param tagObjectIds タグオブジェクトIDの配列
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 */
	public getChildObjects(id: number, tagObjectIds: number[], displayProgressDialog = true): Observable<any[]> {
		let tagObjectIdsString = tagObjectIds.join(',');
		let params: any = {objId: id, tagObjectIds: tagObjectIdsString};
		return this.getChildObjectList(params, displayProgressDialog);
	}

	/**
	 * 子階層のコンテンツをIDを指定して取得します.
	 * @param id 親のオブジェクトID
	 * @param tagObjectIds タグオブジェクトIDの配列
	 * @param targetObjectIds 取得対象のオブジェクトIDの配列
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 */
	public getChildObjectsByIds(id: number, tagObjectIds: number[], targetObjectIds: number[], displayProgressDialog = true): Observable<any[]> {
		let returnObjectIds: string = null;
		let tagObjectIdsString = tagObjectIds.join(',');
		if (targetObjectIds) {
			returnObjectIds = targetObjectIds.join(',');
		}
		let params: any = {objId: id, tagObjectIds: tagObjectIdsString, returnObjectIds: returnObjectIds};
		return this.getChildObjectList(params, displayProgressDialog);
	}

	/**
	 * 指定のオブジェクトが存在するか否か、ごみ箱配下か否かを判定します.
	 * @param objId オブジェクトID
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 */
	public existsItem(objId: number, displayProgressDialog = true): Observable<boolean> {
		let tagObjectIds: number[] = [];
		let params: any = {ObjectId: objId, tagObjectIds: tagObjectIds};
		return this.httpService.postForForm('/app/document/folder/actCheckTreeItemExist.jsp', params, displayProgressDialog).pipe(mergeMap((json: any) => {
			let object: any[] = this.jsonService.getJsonChildren(json.value.object_exist.attr);
			let res = object[0].exist === 'true' ? true : false;
			return of(res);
		}));
	}

	/**
	 * 子階層のコンテンツを取得します.
	 * @param params 取得条件
	 * @param displayProgressDialog 進捗ダイアログを表示するかしないか
	 */
	private getChildObjectList(params: any, displayProgressDialog: boolean): Observable<any[]> {
		params.checkAuth = true;
		return this.httpService.get('/app/document/folder/dspChildObject.jsp',
				params, displayProgressDialog)
			.pipe(mergeMap((json: any) => {
				let children: any[] = this.jsonService.getJsonChildren(json.value.objList.object);
				let objects: EIMFolder[] = [];
				for (let i = 0; i < children.length; i++) {
					let object: any = children[i].attr;
					for (let key in children[i]) {
						if (key != 'attr') {
							object[key] = this.getMultiValue(children[i][key]);
						}
					}
					objects.push(object);
				}
				return of(objects);
			}));
	}

	/**
	 * 親フォルダを取得します.
	 * @param id 子フォルダのオブジェクトID
	 */
	public getParentFolder(id: number): Observable<any> {
		// isURLLogin=trueの場合、オブジェクトが「フォルダ、タグ、ワークスペース」のいずれかなら、親は求めずオブジェクト自身を返す
		return this.httpService.get('/app/document/object/dspParentFolder.jsp',
				{objId: id, isURLLogin: false})
			.pipe(mergeMap((json: any) => {
				return of({objId: json.value.object.attr.objId, parentObjId: json.value.object.attr.parentObjId, isWsRecycle: json.value.object.attr.isWsRecycle});
			}));
	}

	/**
	 * フォルダに対する権限を取得します.
	 * @param id 親フォルダのオブジェクトID
	 */
	public getAccessAuthority(id: number, displayProgressDialog: boolean): Observable<any> {
		return this.httpService.get('/app/document/object/dspAccessAuthority.jsp', {objId: id}, displayProgressDialog)
			.pipe(mergeMap((json: any) => {
				let auth: any = {};
				auth.create = (json.value.object.accessRole.attr.CREATE == 'true' ? true : false);
				auth.statusUp = (json.value.object.accessRole.attr.STATUS_UP == 'true' ? true : false);
				return of(auth);
			}));
	}

	/**
	 * フォルダツリー複製を実行します.
	 * @param data 複製対象情報
	 * @return 複製後フォルダのオブジェクトID
	 */
	public actDuplicateFolderTree(data: any): Observable<any> {
		let param = {
			folderId: data.objId,
			linkUpdateTiming: data.linkUpdateTiming,
			withDocLink: data.withDocLink,
		}
		return this.httpService.get('/app/document/folder/actDuplicateFolderTree.jsp', param)
			.pipe(mergeMap((res: any) => {
				return of({objId: res.value.OK.attr.objId, outOfTargetCount: res.value.OK.attr.outOfTargetCount});
			}));
	}


	/**
	 * 取得したデータをフォルダ情報型に変換します.
	 * @return フォルダ型
	 */
	private convertToEIMFolder(json: any): EIMFolder {
		return {
			objId: Number(json.attr.objId),
			objTypeId: Number(json.attr.objTypeId),
			objTypeName: json.attr.objTypeName,
			objName: json.attr.label,
			isWorkflowFolder: json.attr.isWorkflowFolder == 'true' ? true : false,
			tagListKind: json.attr.tagListKind
		}
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

	/**
	 * パスを取得します.
	 * @param json 取得データ
	 */
	private getPath(json: any): string {
		return json.path + json.parentObjName + '/';
	}
}
