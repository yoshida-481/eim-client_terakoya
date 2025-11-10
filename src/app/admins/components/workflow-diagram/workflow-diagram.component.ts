import { UntypedFormGroup } from '@angular/forms';
import { Component, ElementRef, Input, OnInit, DoCheck } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMWorkflowDiagramComponentService } from 'app/admins/components/workflow-diagram/workflow-diagram.component.service';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMenuChangeDetectionService } from 'app/shared/services/menu-change-detection.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';

/**
 * ワークフローダイアグラムコンポーネント
 * @example
 *
 *      <eim-workflow-diagram
 *          [componentService]="componentService"
 *          [contextMenuItems]="contextMenuItems"
 *          [form]="form"
 *          [(selectedNode)]="selectedNode"
 *          (initialized)="onInitialized($event)"
 *          (changed)="onChanged($event)"
 *          (contextmenu)="onContextmenu($event)"
 *      >
 *      </eim-workflow-diagram>
 */
@Component({
    selector: 'eim-workflow-diagram',
    templateUrl: './workflow-diagram.component.html',
    styleUrls: ['./workflow-diagram.component.css'],
    providers: [],
    standalone: false
})
export class EIMWorkflowDiagramComponent extends EIMDiagramComponent implements DoCheck {
	/** 編集可否 */
	@Input() public editable = true;

	/** フォーム(非必須) */
	@Input() public form: UntypedFormGroup;

	/** ステータスタイプの高さ */
	public height = 150;

	/** 使用可能言語リスト */
	public languages: any[];

	/** イベント追加中かどうか */
	public addingEvent = false;

	/** ステータスタイプを選択しているかどうか */
	public isSelectStatusType = false;

	/** イベントタイプを選択しているかどうか */
	public isSelectEventType = false;

	/** 先頭のステータスタイプを選択しているかどうか */
	public isSelectedFirstStatusType = false;

	/** 末尾のステータスタイプを選択しているかどうか */
	public isSelectedLastStatusType = false;

	/** ワークフロー */
	private workflow: EIMWorkflowDomain;

	/** 追加対象の元ステータスタイプ */
	private fromStatusType: EIMStatusTypeDomain = null;

	/** クライアントで割り当てるステータスタイプ、イベントタイプのID */
	private nextId = 0;

	/** クライアントで割り当てるステータスタイプ、イベントタイプのID */
	private selectFinish = false;

	/** dirtyの予備値：formのdirtyの値を監視するために使用します. */
	private tempDirty = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected el: ElementRef,
			protected translateService: TranslateService,
			protected workflowDiagramComponentService: EIMWorkflowDiagramComponentService,
			protected messageService: EIMMessageService,
			public adminsCacheService: EIMAdminsCacheService,
			protected localStorageService: EIMLocalStorageService,
			protected menuChangeDetectionService: EIMMenuChangeDetectionService,
	) {
		super(el, workflowDiagramComponentService, menuChangeDetectionService);
		this.languages = this.localStorageService.getLanguages();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param serviceParam パラメータ
	 * @param isEmitEvent イベントを発火するかどうか
	 */
	public initialize(serviceParam: any = {}, isEmitEvent = true): void {
		this.componentService.initialize(this.info, serviceParam, this.initialized, this.changed, this.selected);
	}

	/**
	 * エレメントを選択します.
	 * 選択フラグを更新します.
	 * @param selectedData 選択するエレメント
	 * @param isEmitEvent 選択イベントを発火するかどうか
	 */
	public select(selectedData: any[], isEmitEvent = true): void {
		super.select(selectedData, isEmitEvent);
		if (selectedData.length === 0) {
			this.updateSelectFlag();
		} else {
			this.updateSelectFlag(selectedData[0].domain);
		}
	}

	/**
	 * 画面を描画します.
	 * @param param 帳票情報
	 */
	public show(param: any): void {
		// 初期化
		this.updateSelectFlag();
		this.addingEvent = false;
		this.fromStatusType = null;

		this.workflow = param.workflow;
		this.componentService.show(this.info, param);
	}

	/**
	 * ダイアグラムの状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}

		// 復元します
		this.workflow = state.workflow;
		super.setState(state);
	}

	/**
	 * ダイアグラムの状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		let state = super.getState();
		state.workflow = this.workflow;

		return state;
	}

	/**
	 * ダイアグラムのformをリセットします.
	 */
	public resetDirty(): void {
		if (!this.form) {
			return;
		}
		this.tempDirty = false;
		this.form.reset();
	}

	/**
	 * 再描画処理です.
	 */
	public refresh(): void {
		let selectedData: any[] = this.getSelectedData();
		if ( !this.info.options.elements || selectedData.length <= 0 ) {
			return;
		}
		if ( !this.isSelectStatusType ) {
			return;
		}
		if ( !this.isSelectStatusType ) {
			return;
		}
		let targetStatusTypeList: EIMStatusTypeDomain[] = this.workflow.statusTypeList;
		for (let i = 0; i < targetStatusTypeList.length; i++) {
			let statusType: EIMStatusTypeDomain = targetStatusTypeList[i];
			if ( !statusType.name ) {
				return;
			}
		}

		this.swapStatusTypeSeq(selectedData[0].domain.seq, selectedData[0].domain.seq);
		this.workflowDiagramComponentService.update(this.info, this.workflow);
		this.select([this.workflowDiagramComponentService.getElement(this.info, selectedData[0].domain.seq)]);
	}

	/**
	 * ワークフロークリア.
	 */
	public workflowClear(): void {
		this.workflow = null;
		this.isSelectStatusType = false;
		this.isSelectEventType = false;
		this.isSelectedFirstStatusType = false;
		this.isSelectedLastStatusType = false;
		this.clear();
	}

	/**
	 * ワークフローデータを取得する.
	 */
	public getWorkflow(): any {
		return this.workflow;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 変更検知後イベントハンドラ.
	 */
	ngDoCheck(): void {
		super.ngDoCheck();

		// formのdirtyの値が意図せず変更された際に復帰します.
		if (this.tempDirty && this.form && !this.form.dirty) {
			this.form.markAsDirty();
		}
	}

	/**
	 * ステータス追加ボタン押下時のハンドラです.
	 * @param event イベント
	 */
	onClickAddStatusType(event: any): void {
		let statusType: EIMStatusTypeDomain = this.createStatusType();
		if ( this.adminsCacheService.getAppId() === EIMAdminsConstantService.APP_ID_FORM ) {
			statusType.kind = EIMAdminsConstantService.STATUS_TYPE__KIND_ID_FORM_DEFAULT;
		} else if (this.adminsCacheService.getAppId() === EIMAdminsConstantService.APP_ID_TASK ) {
			statusType.kind = EIMTaskConstantService.STATUS_TYPE_KIND_ID_NEW;
		}

		this.workflow.statusTypeList.push(statusType);
		this.select(
			[this.workflowDiagramComponentService.addStatusType(this.info, statusType)]);
		if (this.form) {
			this.form.markAsDirty();
		}
	}

	/**
	 * イベント追加ボタン押下時のハンドラです.
	 * @param event イベント
	 */
	onClickAddEvent(event: any): void {

		if (!this.addingEvent && this.fromStatusType) {
			// トグルボタンがOFFになった場合選択をはずす
			this.workflowDiagramComponentService.updateFromStatusType(this.info, this.fromStatusType, false);
		}
		this.select([]);
		this.fromStatusType = null;
		if (this.form) {
			this.form.markAsDirty();
		}
	}

	/**
	 * 左へ移動ボタン押下時のハンドラです.
	 * @param event イベント
	 */
	onClickMoveLeft(event: any): void {
		let selectedData: any[] = this.getSelectedData();
		this.swapStatusTypeSeq(selectedData[0].domain.seq, selectedData[0].domain.seq - 1);

		// ステータス一覧の順序を更新
		for (let i = 0; i < this.workflow.statusTypeList.length; i++ ) {
			let targetStatus: EIMStatusTypeDomain = this.workflow.statusTypeList[i];
			if (targetStatus.id === selectedData[0].domain.id) {
				let temp = targetStatus;
				this.workflow.statusTypeList[i] = this.workflow.statusTypeList[i - 1];
				this.workflow.statusTypeList[i - 1] = temp;
				break;
			}
		}
		this.workflowDiagramComponentService.update(this.info, this.workflow);
		// 追加したイベントタイプを選択
		this.select(
			[this.workflowDiagramComponentService.getElement(this.info, selectedData[0].domain.seq)]);
		if (this.form) {
			this.form.markAsDirty();
		}
	}

	/**
	 * 右へ移動ボタン押下時のハンドラです.
	 * @param event イベント
	 */
	onClickMoveRight(event: any): void {
		let selectedData: any[] = this.getSelectedData();
		this.swapStatusTypeSeq(selectedData[0].domain.seq, selectedData[0].domain.seq + 1);

		// ステータス一覧の順序を更新
		for (let i = 0; i < this.workflow.statusTypeList.length; i++ ) {
			let targetStatus: EIMStatusTypeDomain = this.workflow.statusTypeList[i];
			if (targetStatus.id === selectedData[0].domain.id) {
				let temp = targetStatus;
				this.workflow.statusTypeList[i] = this.workflow.statusTypeList[i + 1];
				this.workflow.statusTypeList[i + 1] = temp;
				break;
			}
		}
		this.workflowDiagramComponentService.update(this.info, this.workflow);
		// 追加したイベントタイプを選択
		this.select(
			[this.workflowDiagramComponentService.getElement(this.info, selectedData[0].domain.seq)]);
		if (this.form) {
			this.form.markAsDirty();
		}
	}

	/**
	 * 削除ボタン押下時のハンドラです.
	 * @param event イベント
	 */
	onClickDelete(event: any): void {
		let selectedData: any[] = this.getSelectedData();
		if (selectedData[0].domain.constructor === EIMStatusTypeDomain) {
			// ステータスタイプの場合
			// 確認メッセージ
			this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_ADMINS.CONFIRM_00045') ,
					() => {
						this.deleteStatusType(selectedData[0].domain);
						this.workflowDiagramComponentService.update(this.info, this.workflow);
						if (this.form) {
							this.form.markAsDirty();
						}
				});
		} else {
			// イベントタイプの場合
			// 確認メッセージ
			this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_ADMINS.CONFIRM_00046') ,
					() => {
						this.deleteEventType(selectedData[0].domain);
						this.workflowDiagramComponentService.update(this.info, this.workflow);
						if (this.form) {
							this.form.markAsDirty();
						}
				});
		}
		this.changed.emit();
	}

	/**
	 * エレメント選択時のイベントハンドラです.
	 * イベントタイプを追加します.
	 * @param event イベント
	 */
	onSelectElement(event: any): void {
		// 選択フラグを更新
		this.updateSelectFlag(event.domain);

		if (!this.addingEvent) {
			// イベント追加中でなければ何もしない
			return;
		}

		if (!this.isSelectStatusType) {
			// ステータスタイプが選択された場合でなければ何もしない
			return;
		}

		if (this.fromStatusType) {
			// イベント元が選択済みの場合

			let toStatusType: EIMStatusTypeDomain = event.domain;

			// イベントタイプ追加
			let eventType: EIMEventTypeDomain = this.createEventType(this.fromStatusType, toStatusType);

			if ( this.adminsCacheService.getAppId() === EIMAdminsConstantService.APP_ID_FORM ) {
				eventType.baseEventTypeId = EIMConstantService.EVENT_TYPE_ID_SET_ASSIGNMENT_PLAN_BASE;
				eventType.guardConditionId = EIMConstantService.GUARD_COND_ID_DEFAULT_FORM;
			} else if (this.adminsCacheService.getAppId() === EIMAdminsConstantService.APP_ID_TASK) {
				eventType.baseEventTypeId = EIMTaskConstantService.EVENT_TYPE_KIND_ID_DEFAULT;
				eventType.guardConditionId = EIMTaskConstantService.GUARD_CONDITION_ID_DEFAULT;
			}
			this.workflow.eventTypeList.push(eventType);
			this.workflowDiagramComponentService.update(this.info, this.workflow);

			// 追加したイベントタイプを選択
			window.setTimeout(() => {
				this.select(
					[this.workflowDiagramComponentService.getElement(this.info, eventType.id)]);
			});

			this.workflowDiagramComponentService.updateFromStatusType(this.info, this.fromStatusType, false);
			this.fromStatusType = null;

		} else {
			// イベント元が未選択の場合
			this.fromStatusType = event.domain;
			this.workflowDiagramComponentService.updateFromStatusType(this.info, this.fromStatusType, true);
		}
	}

	/**
	 * エレメント選択解除時のイベントハンドラです.
	 * @param event イベント
	 */
	onUnSelectElement(event: any): void {
		// 選択フラグを更新
		this.updateSelectFlag();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ステータスタイプを生成します.
	 * @return ステータスタイプ
	 */
	private createStatusType(): EIMStatusTypeDomain {
		let statusType: EIMStatusTypeDomain = new EIMStatusTypeDomain();
		statusType.id = this.createId();
		statusType.seq = this.createStatusTypeSequence();
		statusType.name = statusType.seq.toString();
		statusType.nameList = this.createNameList(statusType.name);
		return statusType;
	}

	/**
	 * イベントタイプを生成します.
	 * @param fromStatusType 遷移元ステータスタイプ
	 * @param toStatusType 遷移先ステータスタイプ
	 * @return イベントタイプ
	 */
	private createEventType(fromStatusType: EIMStatusTypeDomain, toStatusType: EIMStatusTypeDomain): EIMEventTypeDomain {
		let eventType: EIMEventTypeDomain = new EIMEventTypeDomain();
		eventType.id = this.createId();
		eventType.sequence = this.createEventTypeSequence(fromStatusType, toStatusType);
		eventType.fromStatusTypeSequence = fromStatusType.seq;
		eventType.toStatusTypeSequence = toStatusType.seq;
		eventType.fromStatusTypeId = fromStatusType.id;
		eventType.toStatusTypeId = toStatusType.id;
		eventType.name = fromStatusType.name + '-' + toStatusType.name;
		eventType.nameList = this.createEventTypeNameList(fromStatusType, toStatusType);

		return eventType;
	}

	/**
	 * ステータスタイプ、イベントタイプのIDを生成します.
	 * @return 生成したID
	 */
	private createId(): number {
		return --this.nextId;
	}

	/**
	 * ステータスタイプのシーケンスを生成します.
	 * @return ステータスタイプのシーケンス
	 */
	private createStatusTypeSequence(): number {
		let seq = 0;
		for (let i = 0; i < this.workflow.statusTypeList.length; i++) {
			if (seq < this.workflow.statusTypeList[i].seq) {
				seq = this.workflow.statusTypeList[i].seq;
			}
		}
		return ++seq;
	}

	/**
	 * イベントタイプのシーケンスを生成します.
	 * @param fromStatusType 遷移元ステータスタイプ
	 * @param toStatusType 遷移先ステータスタイプ
	 * @return イベントタイプのシーケンス
	 */
	private createEventTypeSequence(fromStatusType: EIMStatusTypeDomain, toStatusType: EIMStatusTypeDomain): number {
		let seq = 0;
		for (let i = 0; i < this.workflow.eventTypeList.length; i++) {
			let eventType: EIMEventTypeDomain = this.workflow.eventTypeList[i];
			if (eventType.fromStatusTypeSequence !== fromStatusType.seq ||
					eventType.toStatusTypeSequence !== toStatusType.seq) {
				continue;
			}

			if (seq < eventType.sequence) {
				seq = eventType.sequence;
			}
		}
		return ++seq;
	}

	/**
	 * ステータスタイプを削除します.
	 * @param statusType 削除対象のステータスタイプ
	 */
	private deleteStatusType(statusType: EIMStatusTypeDomain): void {
		// ステータスタイプ削除
		for (let i = 0; i < this.workflow.statusTypeList.length; i++) {
			let targetStatusType: EIMStatusTypeDomain = this.workflow.statusTypeList[i];
			if (targetStatusType.seq === statusType.seq) {
				this.workflow.statusTypeList.splice(i, 1);
				// デクリメントする
				i--;
			}
		}

		// 削除対象リスト
		let deleteList: EIMEventTypeDomain[] = [];
		// イベントタイプ削除
		for (let i = 0; i < this.workflow.eventTypeList.length; i++) {
			let targetEventType: EIMEventTypeDomain = this.workflow.eventTypeList[i];
			if (targetEventType.fromStatusTypeSequence === statusType.seq ||
				targetEventType.toStatusTypeSequence === statusType.seq) {
				deleteList.push(new EIMEventTypeDomain(this.workflow.eventTypeList[i]));
			}
		}
		for (let i = 0; i < deleteList.length; i++) {
			this.deleteEventType(deleteList[i]);
		}

		// ステータスタイプのシーケンスを削除した分ずらす
		for (let i = 0; i < this.workflow.statusTypeList.length; i++) {
			let targetStatusType: EIMStatusTypeDomain = this.workflow.statusTypeList[i];
			if (targetStatusType.seq >= statusType.seq) {
				targetStatusType.seq = targetStatusType.seq - 1;
			}
		}

		// イベントタイプの遷移元、先のシーケンス（ステータスタイプのシーケンス）を削除した分ずらす
		for (let i = 0; i < this.workflow.eventTypeList.length; i++) {
			let targetEventType: EIMEventTypeDomain = this.workflow.eventTypeList[i];
			if (targetEventType.fromStatusTypeSequence >= statusType.seq) {
				targetEventType.fromStatusTypeSequence = targetEventType.fromStatusTypeSequence - 1;
			}
			if (targetEventType.toStatusTypeSequence >= statusType.seq) {
				targetEventType.toStatusTypeSequence = targetEventType.toStatusTypeSequence - 1;
			}
		}

		this.isSelectStatusType = false;
		this.isSelectEventType = false;
	}

	/**
	 * イベントタイプを削除します.
	 * @param eventType 削除対象のイベントタイプ
	 */
	private deleteEventType(eventType: EIMEventTypeDomain): void {
		// イベントタイプ削除
		for (let i = 0; i < this.workflow.eventTypeList.length; i++) {
			let targetEventType: EIMEventTypeDomain = this.workflow.eventTypeList[i];
			if (targetEventType.id === eventType.id) {
				this.workflow.eventTypeList.splice(i, 1);
			}
		}

		// シークエンスを更新
		this.updateEventTypeSequence(eventType);
		this.isSelectStatusType = false;
		this.isSelectEventType = false;
	}

	/**
	 * イベントタイプを削除後のシークエンスを更新します.
	 * @param eventType 削除されたイベントタイプ
	 */
	private updateEventTypeSequence(eventType: EIMEventTypeDomain): void {
		// イベントタイプ内のシーケンスを更新する
		for (let i = 0; i < this.workflow.eventTypeList.length; i++) {
			let targetEventType: EIMEventTypeDomain = this.workflow.eventTypeList[i];
			if (targetEventType.fromStatusTypeSequence !== eventType.fromStatusTypeSequence || targetEventType.baseEventTypeId !== eventType.baseEventTypeId) {
				continue;
			}
			if (eventType.sequence < targetEventType.sequence) {
				targetEventType.sequence = targetEventType.sequence - 1;
			}
		}
	}

	/**
	 * ステータスタイプのシーケンスを交換します.
	 * @param seq1 シーケンス番号１
	 * @param seq2 シーケンス番号２
	 */
	private swapStatusTypeSeq(seq1: number, seq2: number): void {
		// ステータスタイプのシーケンスを交換
		for (let i = 0; i < this.workflow.statusTypeList.length; i++) {
			let targetStatusType: EIMStatusTypeDomain = this.workflow.statusTypeList[i];
			if (targetStatusType.seq === seq1) {
				targetStatusType.seq = seq2;
			} else if (targetStatusType.seq === seq2) {
				targetStatusType.seq = seq1;
			}
		}

		// イベントタイプの遷移元、先のシーケンスを交換
		for (let i = 0; i < this.workflow.eventTypeList.length; i++) {
			let targetEventType: EIMEventTypeDomain = this.workflow.eventTypeList[i];
			if (targetEventType.fromStatusTypeSequence === seq1) {
				targetEventType.fromStatusTypeSequence = seq2;
			} else if (targetEventType.fromStatusTypeSequence === seq2) {
				targetEventType.fromStatusTypeSequence = seq1;
			}
			if (targetEventType.toStatusTypeSequence === seq1) {
				targetEventType.toStatusTypeSequence = seq2;
			} else if (targetEventType.toStatusTypeSequence === seq2) {
				targetEventType.toStatusTypeSequence = seq1;
			}
		}
	}

	/**
	 * 名前リストを返却します.
	 * @param name 名前
	 * @return 名称リスト
	 */
	private createNameList(name: string): { [key: string]: string; } {
		let nameList: { [key: string]: string; } = {};
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			nameList[lang.lang] = name;
		}
		return nameList;
	}

	/**
	 * イベントタイプ名称リストを返却します.
	 * 
	 * @param fromStatusType 遷移元ステータスタイプ
	 * @param toStatusType 遷移先ステータスタイプ
	 * @return 名称リスト
	 */
	private createEventTypeNameList(fromStatusType: EIMStatusTypeDomain, toStatusType: EIMStatusTypeDomain): { [key: string]: string; } {
		let nameList: { [key: string]: string; } = {};

		for (let idx = 0; idx < this.languages.length; idx++) {
			
			const lang = this.languages[idx];
			const name = fromStatusType.nameList[lang.lang] + '-' + toStatusType.nameList[lang.lang];

			nameList[lang.lang] = name;
		}

		return nameList;
	}

	/**
	 * 選択フラグを更新します.
	 * @param selectedDomain 選択されているエレメントに対応するドメイン
	 */
	private updateSelectFlag(selectedDomain?: any): void {
		if (this.form) {
			this.tempDirty = this.tempDirty || this.form.dirty;
		}
		if (!selectedDomain) {
			// 未選択の場合
			this.isSelectStatusType = false;
			this.isSelectEventType = false;
			this.isSelectedFirstStatusType = false;
			this.isSelectedLastStatusType = false;
		} else if (selectedDomain.constructor === EIMStatusTypeDomain) {
			// ステータスタイプの場合
			this.isSelectStatusType = true;
			this.isSelectEventType = false;
			this.isSelectedFirstStatusType = ((selectedDomain as EIMStatusTypeDomain).seq === 1);
			this.isSelectedLastStatusType = ((selectedDomain as EIMStatusTypeDomain).seq === this.workflow.statusTypeList.length);
		} else {
			// イベントタイプの場合
			this.isSelectStatusType = false;
			this.isSelectEventType = true;
			this.isSelectedFirstStatusType = false;
			this.isSelectedLastStatusType = false;
		}
	}
}
