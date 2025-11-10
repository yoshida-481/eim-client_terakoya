import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Router } from '@angular/router';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMProcessingHistoryDTO } from 'app/tasks/shared/dtos/processing-history.dto';
import { EIMProcessingWaitingListDTO } from 'app/tasks/shared/dtos/processing-waiting-list.dto';
import { map } from 'rxjs/operators';
import { EIMFormEventExecDomain } from 'app/shared/domains/form-event-exec.domain';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';

/**
 * タスクのサービスクラスです.
 */
@Injectable()
export class EIMTaskService {

	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected router: Router,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected domainService: EIMDomainService,
	) {
		
	}

	/**
	 * タスクの処理履歴一覧を取得します.
	 * @param タスクID
	 */
	public getProcessingHistoryList(taskObjId: number): Observable<EIMProcessingHistoryDTO[]> {

		let params: any = {};
		params['taskObjId'] = taskObjId;

		return this.httpForRestAPIService.get('/apis/tasks/get-processing-history-list', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (_json: any) => new EIMProcessingHistoryDTO(_json)));
			}));
	}

	/**
	 * 対象ユーザの処理待ち一覧を取得します.
	 * @param ユーザID
	 * @param ワークスペースID
	 * @returns 対象ユーザの処理待ち一覧
	 */
	public getMyTaskList(userId: number, workspaceId?: number) {

		const params = { userId, workspaceId: workspaceId ?? 0 };
	
		return this.httpForRestAPIService.get('/apis/tasks/my-tasks', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (_json: any) => new EIMProcessingWaitingListDTO(_json)));
			}));
	}

	/**
	 * 遅延タスク情報一覧を取得します.
	 * 
	 * @param workspaceId ワークスペースID
	 * @returns 遅延タスク情報一覧
	 */
	public getDelayedTaskList(workspaceId?: number) {

		const params = { workspaceId: workspaceId ?? 0 };
	
		return this.httpForRestAPIService.get('/apis/tasks/delayed-tasks', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (_json: any) => new EIMProcessingWaitingListDTO(_json)));
			}));
	}

	/**
	 * 本日完了予定タスク情報一覧を取得します.
	 * 
	 * @param workspaceId ワークスペースID
	 * @returns 本日完了予定タスク情報一覧
	 */
	public getTodayCompletePlanTaskList(workspaceId?: number) {

		const params = { workspaceId: workspaceId ?? 0 };
	
		return this.httpForRestAPIService.get('/apis/tasks/today-complete-plan-tasks', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (_json: any) => new EIMProcessingWaitingListDTO(_json)));
			}));
	}

	/**
	 * 対応予定期間内タスク情報一覧を取得します.
	 * 
	 * @param workspaceId ワークスペースID
	 * @returns 対応予定期間内タスク情報
	 */
	public getScheduledScopeTaskList(workspaceId?: number) {

		const params = { workspaceId: workspaceId ?? 0 };
	
		return this.httpForRestAPIService.get('/apis/tasks/scheduled-scope-tasks', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (_json: any) => new EIMProcessingWaitingListDTO(_json)));
			}));
	}

	/**
	 * 対象ユーザの処理待ち件数を取得します.
	 * @param ユーザID
	 */
	public getProcessingWaitingCount(userId: number) {
		const params = { userId };
	
		return this.httpForRestAPIService.get('/apis/tasks/get-processing-waiting-count', params)
        .pipe(
            map((res: any) => {
				return {
					totalCount: res.value.totalCount,
					delayedCount: res.value.delayedCount
				};
			})
        );
	}

	/**
	 * 各種タスク情報一覧を取得します.
	 * @param プロジェクトID
	 */
	public getTaskListForManagement(workspaceId: number) {

		const params = { workspaceId };
	
		return this.httpForRestAPIService.get('/apis/tasks/get-task-list-for-management', params)
			.pipe(mergeMap((res: any) => {
				const delayedTaskList = this.domainService.createObjectList(res.value.delayedTaskList, (_json: any) => new EIMProcessingWaitingListDTO(_json));
				const todayCompletePlanTaskList = this.domainService.createObjectList(res.value.todayCompletePlanTaskList, (_json: any) => new EIMProcessingWaitingListDTO(_json));
				const scheduledScopeTaskList = this.domainService.createObjectList(res.value.scheduledScopeTaskList, (_json: any) => new EIMProcessingWaitingListDTO(_json));

				return of({
					delayedTaskList,
					todayCompletePlanTaskList,
					scheduledScopeTaskList
				});
			}));
	}
	
	/**
	 * タスクを複製します.
	 * @param タスクID
	 */
	public copying(taskObjId: number, createTaskName: string) : Observable<any> {

		const params = { taskObjId, createTaskName };

		return this.httpForRestAPIService.post('/apis/tasks/copying', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * メッセージ送付します.
	 * 
	 * @param taskObjId タスクオブジェクトID
	 * @param userIds 送信先ユーザID
	 * @param comment コメント
	 */
	public sendMessage(taskObjId: number, userIds: number[], comment: string) : Observable<null> {
		const params = { userIds: userIds, comment: comment };

		return this.httpForRestAPIService.postJson('/apis/tasks/' + taskObjId + '/mail', params)
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}

	/**
	 * 指定された条件でタスクに対しイベントを実行します.
	 * @param formEventExec 帳票イベント実行ドメイン(タスクのイベント実行に関する情報)
	 * @param isProgressRateCalc 進捗率の計算を行うか
	 * @return イベント実行結果帳票オブジェクト
	 */
	public doEvent(formEventExec: EIMFormEventExecDomain, isProgressRateCalc: boolean): Observable<EIMFormDomain> {
		const params = { formEventExec: formEventExec, progressRateCalc: isProgressRateCalc}
		return this.httpForRestAPIService.postJson('/apis/tasks/do-event', params)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormDomain(res.value));
		}));
	}

	/**
	 * 指定された条件でタスクに対し取り戻しイベントを実行します.
	 * @param formEventExec 帳票イベント実行ドメイン(タスクのイベント実行に関する情報)
	 * @param isProgressRateCalc 進捗率の計算を行うか
	 * @return イベント実行結果帳票オブジェクト
	 */
	public doRegainEvent(formEventExec: EIMFormEventExecDomain, isProgressRateCalc: boolean): Observable<EIMFormDomain> {
		const params = { formEventExec: formEventExec, progressRateCalc: isProgressRateCalc}
		return this.httpForRestAPIService.postJson('/apis/tasks/do-regain-event', params)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormDomain(res.value));
		}));
	}

	/**
	 * 指定された条件でタスクに対して実行されるイベントタイプを予測します.
	 * @param formEventExec 帳票イベント実行ドメイン(タスクのイベント実行に関する情報)
	 * @return 実行されるであろうイベントタイプ
	 */
	public forecastEventType(formEventExec: EIMFormEventExecDomain): Observable<EIMEventTypeDomain> {
		return this.httpForRestAPIService.postJson('/apis/tasks/forecast-event-type', formEventExec)
		.pipe(mergeMap((res: any) => {
			return of(new EIMEventTypeDomain(res.value));
		}));
	}

}
