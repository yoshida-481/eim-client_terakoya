import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMApproveUserDTO } from 'app/documents/shared/dtos/approve-user.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMWorkflowStatusType {
	objId: number,
	objName: string,
	currentStatus?: boolean,
	step?: number,
	users?: EIMApproveUserDTO[],
	events?: any,
	canSkip?: boolean,
	skip?: boolean,
	statusTypeKindId?: number
}
export interface EIMWorkflowEventType {
	objId: number,
	seq: number,
	fromStatusTypeSeq: number,
	toStatusTypeSeq: number,
	fromStatusTypeId: number,
	toStatusTypeId: number,
	baseEventTypeId: number,
	guardConditionId: number,
}
export interface EIMWorkflow {
	objId: number,
	objName: string,
	statusTypes?: EIMWorkflowStatusType[],
	eventTypes?: EIMWorkflowEventType[]
}
export interface EIMWorkflowEvent {
	reply?: number,
	localPDFOutputSet?: boolean ,
	baseEventTypeId?: number,
	comment?: string,
	statusMDateLong?: number,
	publisherId?: string,
	nothingMailTypeId?: number,
	objId?: number,
	approverId?: string,
	skipStatusTypeId?: string,
	forcastStatusTypeId?: number,
	timing?: string,
	accumulateMailTypeId?: number,
	doSetReferencePassword?: string,
	doSetSecurity?: string,
	doSetSecurityPassword?: string,
	doSignPDF?: string,
	doSignPDFAndSetSecurity?: string,
	forbidAnnotate?: string,
	forbidEdit?: string,
	forbidPrint?: string,
	forbidReproduce?: string,
	immediateMailTypeId?: number,
	insertApproveDate?: string,
	insertApproveUser?: string,
	insertPage?: string,
	insertPlace?: string,
	insertPlaceX?: string,
	insertPlaceY?: string,
	referencePassword?: string,
	securityPassword?: string,
	finalApprove?: string,
	functionType?: string,
	statusId?: number,
	publicComment?: string,
	sendNotifyMailTiming?: string,
	lastEventFlag?: boolean, // 過去「自身」が承認依頼したイベントが存在するかどうか
}

/**
 * ワークフローAPIサービス.
 */
@Injectable()
export class EIMWorkflowService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService) {}

	/**
	 * ワークフロー（マスタ）情報を取得します.
	 * @pram createType 作成タイプ
	 * @param objTypeId オブジェクトタイプID
	 * @param parentId 親フォルダID
	 * @return ワークフロー（マスタ）情報
	 */
	public getByObjTypeId(createType: string, objTypeId: number, parentId: number): Observable<EIMWorkflow> {
		let param = {objTypeId: objTypeId, objId: parentId};
		if (createType) {
			param['createType'] = createType;
		}
		return this.httpService.get('/app/document/object/dspCreateOneDocumentAttribute.jsp', param)
			.pipe(mergeMap((res: any) => {
				if (!res.value.results.statusTypeList) {
					return [];
				}
				let workflow: EIMWorkflow = {
						objId: Number(res.value.results.statusTypeList.attr.workFlowId),
						objName: res.value.results.statusTypeList.attr.workFlowName,
						statusTypes: []
				};

				let statusTypeJson: any[] = res.value.results.statusTypeList.statusType;
				if (!statusTypeJson) {
					statusTypeJson = [];
				} else if (!Array.isArray(statusTypeJson)) {
					statusTypeJson = [statusTypeJson];
				}

				for (let i = 0; i < statusTypeJson.length; i++) {
					workflow.statusTypes.push({
							objId: statusTypeJson[i].attr.statusTypeId,
							objName: statusTypeJson[i].attr.statusTypeName
					});
				}
				return of(workflow);
			}));
	}

	/**
	 * ワークフロー情報とイベントを取得します.
	 * @param id オブジェクトID
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return ワークフロー情報とイベントのリスト
	 */
	 public getWorkflowAndEvent(id: number, displayProgressDialog = false): Observable<any> {
		return this.httpService.get('/app/document/workflow/dspWorkflowHistory.jsp', {objId: id}, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				if (!res.value.result.statusTypeList) {
					return [];
				}
				let workflow: EIMWorkflow = {
						objId: Number(res.value.result.statusTypeList.attr.workFlowId),
						objName: res.value.result.statusTypeList.attr.workFlowName,
						statusTypes: [],
						eventTypes: []
				};

				// ステータスタイプ変換
				let statusTypeJson: any[] = res.value.result.statusTypeList.statusType;
				if (!statusTypeJson) {
					statusTypeJson = [];
				} else if (!Array.isArray(statusTypeJson)) {
					statusTypeJson = [statusTypeJson];
				}

				let stepAndStatusTypeIdMap = new Map();
				for (let i = 0; i < statusTypeJson.length; i++) {
					stepAndStatusTypeIdMap.set(Number(statusTypeJson[i].attr.step), Number(statusTypeJson[i].attr.statusTypeId));

					let statusType: EIMWorkflowStatusType = {
							objId: statusTypeJson[i].attr.statusTypeId,
							objName: statusTypeJson[i].attr.statusTypeName,
							currentStatus: (statusTypeJson[i].attr.currentStatus === 'true' ? true : false),
							step: Number(statusTypeJson[i].attr.step),
							canSkip: (statusTypeJson[i].attr.canSkip === 'true' ? true : false),
							skip: (statusTypeJson[i].attr.skip === 'true' ? true : false),
							statusTypeKindId: Number(statusTypeJson[i].attr.statusKindId)
					};
					if (statusTypeJson[i].userList) {
						statusType.users = this.domainService.createObjectList(statusTypeJson[i].userList.user,
								(_json: any) => {
									return new EIMApproveUserDTO(_json);
								})
					}
					if (statusTypeJson[i].eventList) {
						statusType.events = this.domainService.createObjectList(statusTypeJson[i].eventList.event,
								(_json: any) => {
									return {
										baseEvtType: _json.attr.baseEvtType,
										user: this.domainService.createObjectList(_json.user,
											(_user: any) => {
												return {
													date: _user.attr.date,
													userName: _user.attr.userName
												}
											})
									}
								})
					}
					workflow.statusTypes.push(statusType);
				}

				// イベントタイプ変換
				let eventTypeJson: any[] = [];
				if ( Array.isArray( res.value.result.eventTypeList.eventType ) ) {
					eventTypeJson = res.value.result.eventTypeList.eventType ;
				} else {
					if (res.value.result.eventTypeList.eventType) {
						eventTypeJson = [res.value.result.eventTypeList.eventType];
					}
				}

				let eventTypes: any[] = [];
				for (let i = 0; i < eventTypeJson.length; i++) {
					let eventType: EIMWorkflowEventType = {
						objId: Number(eventTypeJson[i].attr.id),
						seq: Number(eventTypeJson[i].attr.seq),
						fromStatusTypeSeq: Number(eventTypeJson[i].attr.fromStatusTypeSeq),
						toStatusTypeSeq: Number(eventTypeJson[i].attr.toStatusTypeSeq),
						fromStatusTypeId: stepAndStatusTypeIdMap.get(Number(eventTypeJson[i].attr.fromStatusTypeSeq)),
						toStatusTypeId: stepAndStatusTypeIdMap.get(Number(eventTypeJson[i].attr.toStatusTypeSeq)),
						baseEventTypeId: Number(eventTypeJson[i].attr.baseEventTypeId),
						guardConditionId: Number(eventTypeJson[i].attr.guardConditionId)
					};
					workflow.eventTypes.push(eventType);
				}

				// イベント変換
				let eventJson: any[] = [];
				if ( Array.isArray( res.value.result.eventList.event ) ) {
					eventJson = res.value.result.eventList.event ;
				} else {
					if (res.value.result.eventList.event) {
						eventJson = [res.value.result.eventList.event];
					}
				}

				let events: any[] = [];
				for (let i = 0; i < eventJson.length; i++) {
					events.push(eventJson[i].attr);
				}

				return of({workflow: workflow, events: events});
			}));
	}



	/**
	 * ワークフロー（トランザクション）情報を送ります.
	 * @param EIMWorkflowEvent
	 */
	public doEvent(event: EIMWorkflowEvent): Observable<null> {
		return this.httpService.postForForm('/rest/app/document/workflow/doEvent.mvc', event)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * 公開中のドキュメントに対し公開取消を行います。
	 */
	public doPublicCancel(object: any): Observable<any> {

		let params: any = {};
		params['objId'] = object.objId;
		params['statusMDateLong'] = object.statusMDateLong;
		params['forcastStatusTypeId'] = object.forcastStatusTypeId;
		params['baseEventTypeId'] = EIMConstantService.BASE_EVENT_TYPE_ID_PUBLIC_CANCEL;
		params['comment'] = object.comment;
		params['publicCancelMailTypeId'] = EIMConstantService.MAIL_TYPE_ID_PUBLIC_CANCEL_NOTIFICATION;

		return this.httpService.postForForm('/rest/app/document/workflow/doEvent.mvc', params)
		.pipe(mergeMap((res: any) => {
			return of(object);
		}));
	}

}
