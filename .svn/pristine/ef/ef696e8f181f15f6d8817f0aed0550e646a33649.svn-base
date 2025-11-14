import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { EIMHttpService } from 'app/shared/services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ステータスDTO
 */
export class StatusDTO {
	id: number;
	mDateLong: number;
	typeId: number;
	typeName: string;
}

/**
 * ワークフローDTO
 */
export class WorkflowDTO {
	id: number;
	name: string;
}

/**
 * オブジェクト詳細DTO
 */
export class ObjectDetailDTO {
	status: StatusDTO;
	workFlow: WorkflowDTO;
}

/**
 * イベント情報DTO
 */
export class EventDTO {
	baseEvent: any;
	fromEvent: any;
	toEvent: any;
}

/**
 * アサイン情報DTO
 */
export class AssignDTO {
	entryId: number;
	entryName: string;
	entryTypeName: string;
	belongName: string;
}

/**
 * オブジェクトAPIサービス
 */
@Injectable()
export class EIMObjectEditorsWorkFlowService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected translateService: TranslateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * オブジェクト情報を取得します.
 	 * @param オブジェクトID
	 * @return オブジェクト情報
	 */
	public getObjectDetail(objId: number): Observable<ObjectDetailDTO> {
		return this.httpService.postForForm('/rest/workflow/getCurrentStatus.mvc', {objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(this.convertObjectDetail(res.value.result));
		}));
	}

	/**
	 * アサイン一覧を取得します.
	 * @param オブジェクトID
	 * @return アサイン情報
	 */
	public getAssignList(objId: number): Observable<AssignDTO[]> {
		return this.httpService.postForForm('/rest/workflow/getAssignList.mvc', {objId: objId} )
			.pipe(mergeMap((res: any) => {
				return of(this.convertAssignDTO(res.value.taskList));
		}));
	}

	/**
	 * イベント履歴一覧を取得します.
	 * @param オブジェクトID
	 * @return イベント履歴
	 */
	public getEventDetail(objId: number): Observable<EventDTO[]> {
		return this.httpService.postForForm('/rest/workflow/getEventHistoryByObjId.mvc', {objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(this.convertEventDTO(res.value.eventList.event));
		}));
	}

	/**
	 * アサイン情報を更新します.
	 * @param アサイン情報
	 * @return アサイン情報
	 */
	public updateAssign(params: any): Observable<any> {
		return this.httpService.postForForm('/rest/workflow/updateAssign.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
		}));
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 取得データをオブジェクト詳細DTOに詰め替える.
	 * @param data 取得データ
	 * @return オブジェクト詳細DTO
	 */
	private convertObjectDetail(data: any): ObjectDetailDTO {
		let status = new StatusDTO();
		status.id = Number(data.status.attr.id);
		status.mDateLong = Number(data.status.attr.mDateLong);
		status.typeId = Number(data.status.attr.typeId);
		status.typeName = data.status.attr.typeName;

		let workFlow = new WorkflowDTO();
		workFlow.id = Number(data.workFlow.attr.id);
		workFlow.name = data.workFlow.attr.name;

		let detail = new ObjectDetailDTO();
		detail.status = status;
		detail.workFlow = workFlow;
		return detail;
	}

	/**
	 * 取得データをイベントDTOに詰め替える.
	 * @param data 取得データ
	 * @return イベント情報DTO
	 */
	private convertEventDTO(data: any): EventDTO[] {
		let event: EventDTO[] = [];
		if (!data) {
			return event;
		}
		if (data instanceof Array) {
			for (let i = 0 ; data.length > i ; i++) {
				let eventDTO = new EventDTO();
				// イベント情報
				eventDTO.baseEvent = {id: Number(data[i].attr.id), type: data[i].attr.eventTypeName, name : data[i].attr.cuserName, actionDate: data[i].attr.cDate};
				// 遷移元ステータス情報
				eventDTO.fromEvent = {fromStatusId: Number(data[i].fromStatus.attr.id), fromName: data[i].fromStatus.attr.name};
				// 遷移先ステータス情報
				eventDTO.toEvent = {toStatusId: Number(data[i].toStatus.attr.id), toName: data[i].toStatus.attr.name};
				event.push(eventDTO);
			}
		} else {
			let eventDTO = new EventDTO();
			// イベント情報
			eventDTO.baseEvent = {id: Number(data.attr.id), type: data.attr.eventTypeName, name : data.attr.cuserName, actionDate: data.attr.cDate};
			// 遷移元ステータス情報
			eventDTO.fromEvent = {fromStatusId: Number(data.fromStatus.attr.id), fromName: data.fromStatus.attr.name};
			// 遷移先ステータス情報
			eventDTO.toEvent = {toStatusId: Number(data.toStatus.attr.id), toName: data.toStatus.attr.name};
			event.push(eventDTO);
		}
	return event;
	}

	/**
	 * 取得データをアサインDTOに詰め替える.
	 * @param data 取得データ
	 * @return アサイン情報DTO
	 */
	private convertAssignDTO(data: any): AssignDTO[] {
		let assignList: AssignDTO[] = [];
		if (data.task) {
			if (data.task instanceof Array) {
				for (let i = 0 ; data.task.length > i ; i++) {
					let assign = new AssignDTO();
					assign.entryId = data.task[i].attr.entryId;
					assign.entryName = data.task[i].attr.entryName;
					if (data.task[i].belongList.belong instanceof Array) {
						for (let x = 0 ; data.task[i].belongList.belong.length > x ; x++) {
							if (x === 0) {
								assign.belongName = data.task[i].belongList.belong[x].attr.name;
							} else {
								assign.belongName += '  |  ' + data.task[i].belongList.belong[x].attr.name;
							}
						}
					} else {
						if (data.task[i].belongList.belong) {
							assign.belongName = data.task[i].belongList.belong.attr.name;
						}
					}
					// エントリータイプを変換
					if (data.task[i].attr.entryType === 'user') {
						assign.entryTypeName = this.translateService.instant('EIM.LABEL_02017');
					} else if (data.task[i].attr.entryType === 'sysFunc') {
						assign.entryTypeName = this.translateService.instant('EIM.LABEL_02055');
					}
					assignList.push(assign);
				}
			} else {
				let assign = new AssignDTO();
				assign.entryId = data.task.attr.entryId;
				assign.entryName = data.task.attr.entryName;
				if (data.task.belongList.belong instanceof Array) {
					for (let x = 0 ; data.task.belongList.belong.length > x ; x++) {
						if (x === 0) {
							assign.belongName = data.task.belongList.belong[x].attr.name;
						} else {
							assign.belongName += '  |  ' + data.task.belongList.belong[x].attr.name;
						}
					}
				} else {
					if (data.task.belongList.belong) {
						assign.belongName = data.task.belongList.belong.attr.name;
					}
				}
				// エントリータイプを変換
				if (data.task.attr.entryType === 'user') {
					assign.entryTypeName = this.translateService.instant('EIM.LABEL_02017');
				} else if (data.task.attr.entryType === 'sysFunc') {
					assign.entryTypeName = this.translateService.instant('EIM.LABEL_02055');
				}
				assignList.push(assign);
			}
		}
		return assignList;
	}
}
