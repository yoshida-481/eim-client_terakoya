import { Component, Output, Input, ViewChild, EventEmitter, forwardRef, OnInit, AfterViewInit } from '@angular/core';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { EIMFormListColumnMultipleSelectorComponent } from 'app/forms/components/form-list-column-selector/form-list-column-multiple-selector.component';
import { EIMFormListColumnSingleSelectorComponent } from 'app/forms/components/form-list-column-selector/form-list-column-single-selector.component';
import { NgForm } from '@angular/forms';

import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';

import { EIMFormDomain } from "app/shared/domains/form.domain";
import { EIMFormService } from "app/forms/shared/services/apis/form.service";
import { EIMStatusChangeWorkflowDiagramComponentService } from '../status-change-workflow-diagram/status-change-workflow-diagram.component.service';
import { EIMStatusTypeDomain } from "app/shared/domains/entity/status-type.domain";
import { EIMWorkflowDiagramComponent } from 'app/forms/components/workflow-diagram/workflow-diagram.component';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';
import { SelectItem } from "primeng/api";
import { EIMDataGridColumn, EIMDataGridComponent } from "app/shared/components/data-grid/data-grid.component";
import { TranslateService } from '@ngx-translate/core';
import { EIMConstantService } from "app/shared/services/constant.service";
import { EIMUserService } from "app/shared/services/apis/user.service";
import { EIMUserCriteriaDTO } from "app/shared/dtos/criteria/user-criteria.dto";
import { EIMMultipleCriteriaDTO } from "app/shared/dtos/criteria/multiple-criteria.dto";
import { EIMUserDTO } from "app/shared/dtos/user.dto";
import { EIMEventTypeDomain } from "app/shared/domains/entity/event-type.domain";
import { EIMStatusDomain } from "app/shared/domains/entity/status.domain";
import { EIMAssignmentDomain } from "app/shared/domains/entity/assignment.domain";
import { EIMAssignmentEntryDomain } from "app/shared/domains/entity/assignment-entry.domain";
import { EIMFormEventExecDomain } from "app/shared/domains/form-event-exec.domain";
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUserDomain } from "app/shared/domains/entity/user.domain";
import { EIMDialogManagerComponentService } from "app/forms/shared/components/dialog-manager/dialog-manager.component.service";
import { EIMFormWorkspaceEntryUserCriteriaDTO } from "app/shared/dtos/criteria/form-workspace-entry-user-criteria.dto";
import { EIMFormWorkspaceEntryUserService } from "app/forms/shared/services/apis/form-workspace-entry-user.service";
import { EIMAttributeDomain } from "app/shared/domains/entity/attribute.domain";
import { EIMAttributeService } from "app/shared/services/attribute.service";
import { EIMNoticeMailDomain } from "app/shared/domains/entity/notice-mail.domain";
import { EIMAssignmentEntryUserService } from "app/forms/shared/services/apis/assignment-entry-user.service";
import { EIMAssignmentEntryUserCriteriaDTO } from "app/shared/dtos/criteria/assignment-entry-user-criteria.dto";
import { EIMFormEventService } from "app/forms/shared/services/apis/form-event.service";
import { EIMFormEventDTO } from "app/shared/dtos/form-event.dto";
import { EIMFormEventDomain } from "app/shared/domains/form-event.domain";
import { EIMFormEventTypeService } from "app/forms/shared/services/apis/form-event-type.service";
import { EIMFormEventTypeDomain } from "app/shared/domains/form-event-type.domain";
import { EIMEntryUserDTO } from "app/shared/dtos/entry-user.dto";
import { EIMEntryElementDomain } from "app/shared/domains/entity/entry-element.domain";
import { EIMGroupDomain } from "app/shared/domains/entity/group.domain";
import { EIMTooltipRendererComponent } from "app/shared/components/renderer/tooltip-renderer.component";
import { EIMServerConfigService } from "app/shared/services/server-config.service";


/**
 * ステータス変更コンポーネント
 * @example
 *	<eim-status-change
 *		[form]="form"
 *		[workflow]="workflow"
 *		[eventTypeList]="eventTypeList">
 *	</eim-status-change>
 */
@Component({
    selector: 'eim-status-change',
    templateUrl: './status-change.component.html',
    styleUrls: ['./status-change.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMStatusChangeComponent) }],
    standalone: false
})
export class EIMStatusChangeComponent implements OnInit, EIMExecutable, AfterViewInit {

	/** 帳票タイプ */
	@Input() form: EIMFormDomain;

	/** ワークフロー */
	@Input() workflow: EIMWorkflowDomain;

	/** イベントタイプリスト */
	@Input() eventTypeList: EIMEventTypeDomain[];

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true })
		workflowDiagram: EIMWorkflowDiagramComponent;

	/** 依頼先データグリッド */
	@ViewChild('requestUserList', { static: true })
	requestUserList: EIMDataGridComponent;

	/** アクセス履歴データグリッド */
	@ViewChild('notifyUserList', { static: true })
	notifyUserList: EIMDataGridComponent;

	/** フォーム */
	@ViewChild('propertyForm', { static: true })
	propertyForm: NgForm;

	/** データグリッド変更フラグ */
	public isDirty: boolean = false;

	/** コメント */
	public comment: String = '';

	/** 通知方法 */
	public notifyCondition: any = {};

	/** 通知方法の変更可否 */
	public canChangeNotify: boolean = false;

	/** 検索ボタンの押下可否 */
	public canSearch: boolean = false;

	/** 依頼先削除ボタンの押下可否 */
	public canDeleteRequest: boolean = false;

	/** 通知先削除ボタンの押下可否 */
	public canDeleteNotify: boolean = false;

	/** 依頼先デフォルト表示フラグ */
	private entryUserDisplay: boolean = false;

	/** 属性タイプ適用処理完了のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 実行可能な処理一覧 */
	public eventTypeSelectTypeList: SelectItem[] = [];

	/** 選択された処理 */
	public selectedEventType: EIMEventTypeDomain = null;

	/** 全選択候補依頼先一覧 */
	public allAssignmentUser: EIMUserDTO[] = [];

	/** 全選択候補メール通知先一覧 */
	public allNotifyUser: EIMUserDTO[] = [];

	/** 選択中処理が最終処理かどうか */
	public isFinalEvent: boolean = false;
	/**
	 * コンストラクタです.
	 */
	constructor(
			protected formService: EIMFormService,
			public statusChangeWorkflowDiagramComponentService: EIMStatusChangeWorkflowDiagramComponentService,
			protected translateService: TranslateService,
			protected userService: EIMUserService,
			protected formWorkspaceEntryUserService: EIMFormWorkspaceEntryUserService,
			protected messageService: EIMMessageService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected attributeService: EIMAttributeService,
			protected assignmentEntryUserService: EIMAssignmentEntryUserService,
			protected formEventService: EIMFormEventService,
			protected formEventTypeService: EIMFormEventTypeService,
			protected serverConfigService: EIMServerConfigService,
	) {
      this.eventTypeSelectTypeList.push({label: this.translateService.instant('EIM.INFO_00002'), value: { id: 0 }});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 実行ボタン押下時の処理を実施します.
	 */
	public execute(): void {
		// 確認ダイアログ

		let contents: string[] = [];
		contents.push(this.selectedEventType.fromStatusType.name + this.translateService.instant('EIM_FORMS.LABEL_02032') + this.selectedEventType.toStatusType.name);
		let msg: string = this.translateService.instant('EIM_FORMS.CONFIRM_00003') + this.selectedEventType.fromStatusType.name + this.translateService.instant('EIM_FORMS.LABEL_02032') + this.selectedEventType.toStatusType.name;
		this.messageService.showContents(EIMMessageType.confirm, this.translateService.instant('EIM_FORMS.CONFIRM_00003'), contents,
			() => {

			// 各コンポーネントから必要な情報を収集する。
			let formEventExec: EIMFormEventExecDomain = new EIMFormEventExecDomain();

			// 依頼先を設定
			for (let i = 0; i < this.requestUserList.getData().length; i++) {
				formEventExec.assignmentUserList.push(this.createUser(this.requestUserList.getData()[i]));
			}

			// 追加のメール通知先
			for (let i = 0; i < this.notifyUserList.getData().length; i++) {
				formEventExec.mailAddedList.push(this.createUser(this.notifyUserList.getData()[i]));
			}

			// コメント
			formEventExec.comment = this.comment;

			// 通知メール設定
			let noticeMail: EIMNoticeMailDomain = this.selectedEventType.noticeMailList[0];
			if (noticeMail != null) {
				if (this.notifyCondition == 0) {
					formEventExec.immediateMailList.push(noticeMail);
				} else if (this.notifyCondition == 1) {
					formEventExec.accumulationMailList.push(noticeMail);
				} else {
					formEventExec.nothingMailList.push(noticeMail);
				}
			}
			// ベースイベントタイプ
			formEventExec.baseEventType = this.selectedEventType.base;
			// 実行対象オブジェクト
			formEventExec.object = this.form;
			formEventExec.object.status.modificationDate = null;
			formEventExec.eventType = this.selectedEventType;

			this.formService.doEvent(formEventExec)
				.subscribe(
					(object: any) => {
						// 完了イベントを通知(画面が閉じる)
						this.executed.emit(object);
					},
					(err) => {
						this.errored.emit();
					}
				);
			}
		);
	}


	/**
	 * 実行ボタン押下可否を返却します.
	 * @return 実行ボタン押下可否
	 */
	public executable(): boolean {
		return this.isFinalEvent || this.requestUserList.getData().length > 0;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();
		if (this.propertyForm.dirty || this.isDirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						close.emit();
					}
			);
		} else {
			close.emit();
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit() {

		// 表示するイベントタイプを制限する
		this.removeEventType(this.form, this.workflow, this.eventTypeList);

		this.show();

		let columns: EIMDataGridColumn[] = [];
		// ID
		columns.push({field: 'code', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 80});
		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 160});
		// グループ
		columns.push({field: 'groupNames', headerName: this.translateService.instant('EIM.LABEL_02003'), cellRendererFramework: EIMTooltipRendererComponent, width: 130});
		// ロール
		columns.push({field: 'roleNames', headerName: this.translateService.instant('EIM.LABEL_02004'), cellRendererFramework: EIMTooltipRendererComponent, width: 130});

		this.requestUserList.setColumns(columns);

		let columns2: EIMDataGridColumn[] = [];
		// ID
		columns2.push({field: 'code', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 80});
		// 名前
		columns2.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 160});
		// グループ
		columns2.push({field: 'groupNames', headerName: this.translateService.instant('EIM.LABEL_02003'), cellRendererFramework: EIMTooltipRendererComponent, width: 130});
		// ロール
		columns2.push({field: 'roleNames', headerName: this.translateService.instant('EIM.LABEL_02004'), cellRendererFramework: EIMTooltipRendererComponent, width: 130});

		this.notifyUserList.setColumns(columns2);

	// 処理履歴取得
		if (this.form.id != 0) {
			let workspaceAttr: EIMAttributeDomain = this.attributeService.getAttributeByDefinitionName(this.form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID);
			this.formEventService.getPreviousByForm({formId: this.form.id, formWorkspaceId: workspaceAttr.getValueList()[0]})
			.subscribe(
					(previousEvent: EIMFormEventDomain) => {
						this.setPreviousEventHistory(previousEvent);
					});
		}

		// dirty初期化
		this.propertyForm.control.markAsPristine();
	}

	/**
	 * コンポーネント描画後イベントハンドラ.
	 */
	ngAfterViewInit() {
		window.setTimeout(() => {
			// ワークフロー情報を表示
			this.workflowDiagram.clear();
			this.workflowDiagram.show({workflow: this.workflow, form: this.form, eventTypeList: this.eventTypeList});
		});
	}

	/**
	 * ワークフロー選択時イベントハンドラ.
	 * @param event イベント
	 */
	onChangeDiagram(event): void {
		this.canDeleteRequest = false;
		let selectedElement: EIMDiagramNode[] = this.workflowDiagram.getSelectedData();
		if (selectedElement.length == 0) {
			this.selectedEventType = this.eventTypeSelectTypeList[0].value;
			this.requestUserList.setData(null);
			this.notifyCondition = -1;
			this.canChangeNotify = false;
			this.canSearch = false;
			return;
		}
		// 変更処理
		let eventType: EIMEventTypeDomain = selectedElement[0].domain;
		this.selectEventTypeDropDown(eventType);
		this.setUserData(eventType.toStatusType.id, false);
		this.setMailMethod(this.selectedEventType.noticeMailList);
		this.canSearch = !eventType.toStatusType.auto;
		if (this.isFinalStatusType(eventType.toStatusType)) {
			this.isFinalEvent = true;
		} else {
			this.isFinalEvent = false;
		}
	}

	/**
	 * 処理変更イベントハンドラ
	 * @param event イベント
	 */
	onChangeEvent(event): void {
		this.canDeleteRequest = false;
		if (event.value.id == 0) {
			this.allAssignmentUser = []
			this.requestUserList.setData([]);
			this.selectedEventType = null;
			this.notifyCondition = -1;
			this.canChangeNotify = false;
			this.canSearch = false;
			this.workflowDiagram.select(null, false);
			this.isFinalEvent = false;
		} else {
			this.selectEventTypeEdge(event.value);
			this.setUserData(event.value.toStatusTypeId, false);
			this.setMailMethod(this.selectedEventType.noticeMailList);
			this.canSearch = !event.value.toStatusType.auto;
			this.isFinalEvent = this.isFinalStatusType(event.value.toStatusType);
		}
	}

	/**
	 * キーダウンの処理です.
	 * @param event イベント
	 */
	onKeyDown(event: any): void {
		let keyCode: number = event.keyCode;
		// Endキー、Homeキー、←↑→↓キーでのラジオボタン間選択移動を禁止する
		if (35 <= keyCode && keyCode <= 40) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 * 依頼先ユーザ検索ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickSearchAssignmentUser(event: any): void {
		if (this.allAssignmentUser.length != 0) {
			this.showRequestUsers(this.allAssignmentUser);
		} else {
			this.setUserData(this.selectedEventType.toStatusType.id, true);
		}
	}

	/**
	 * 依頼先ユーザ削除ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDeleteAssignmentUser(event: any): void {
		this.requestUserList.removeRowData(this.requestUserList.getSelectedData());
		this.isDirty = true;
	}

	/**
	 * メール通知先ユーザ検索ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickSearchNotifyUser(event: any): void {

		if (this.allNotifyUser.length == 0) {
			this.setNotifyData();
		} else {
			this.showNotifyUsers(this.allNotifyUser);
		}
	}

	/**
	 * メール通知先ユーザ削除ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDeleteNotifyUser(event: any): void {
		this.notifyUserList.removeRowData(this.notifyUserList.getSelectedData());
		this.isDirty = true;
	}


	/**
	 * 依頼先選択イベントハンドラ.
	 * @param event イベント
	 */
	onSelectRequest(event): void {
		let selectedUser = this.requestUserList.getSelectedData();
		if (selectedUser.length > 0 && !this.selectedEventType.toStatusType.auto) {
			this.canDeleteRequest = true;
		} else {
			this.canDeleteRequest = false;
		}
	}

	/**
	 * 通知先選択イベントハンドラ.
	 * @param event イベント
	 */
	onSelectNotify(event): void {
		let selectedUser = this.notifyUserList.getSelectedData();
		if (selectedUser.length > 0) {
			this.canDeleteNotify = true;
		} else {
			this.canDeleteNotify = false;
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 画面を表示します.
	 */
	protected show(): void {
		if (!this.form)
			return;
		this.setEventData();
	}


	/**
	 * 処理一覧を定義します.
	 */
	protected setEventData(): void {
		for (let i = 0; i < this.eventTypeList.length; i++) {
			let eventType: EIMEventTypeDomain = this.eventTypeList[i];
			this.eventTypeSelectTypeList.push({label: eventType.name, value: eventType});
		}
	}

	/**
	 * 指定されたイベントの遷移先ステータスIDと合致するステータスのアサインユーザを設定します.
	 * @param toStatusTypeId 遷移先ステータスタイプID
	 * @param entryUserGetFlag エントリユーザ取得後フラグ
	 */
	protected setUserData(toStatusTypeId, entryUserGetFlag: boolean): void {

		let criteria: EIMAssignmentEntryUserCriteriaDTO = new EIMAssignmentEntryUserCriteriaDTO();
		criteria.statusTypeId = this.selectedEventType.toStatusType.id;
		criteria.objectId = this.form.id;
		criteria.assignPlanGetFlag = true;
		// 自動の場合は必ず依頼先を取得する。
		if (this.selectedEventType.toStatusType.auto) {
			criteria.entryUserGetFlag = true;
		} else {
			criteria.entryUserGetFlag = entryUserGetFlag;
		}

		this.assignmentEntryUserService.getList(criteria).subscribe((users: EIMUserDTO[]) => {
			users.sort(function(a: EIMUserDTO, b: EIMUserDTO) {
				// ユーザ名称順にソートする
				if ( a.name < b.name )
					return -1;
				if ( a.name > b.name )
					return 1;
				return 0;
			});
			if (entryUserGetFlag) {
				this.allAssignmentUser = users.concat();
				this.showRequestUsers(users);
			} else {
				if (this.serverConfigService.onlySuperiorAutoApproval) {
					users = this.onlySuperiorTrim(<EIMEntryUserDTO[]>users);
				}
				this.requestUserList.setData(users);
				this.allAssignmentUser = [];
			}
		});
	}


	/**
	 * 指定されたユーザリストを用いてメール通知先エントリ選択画面を開きます.
	 * @param users ユーザDTOリスト
	 */
	protected showNotifyUsers(users: EIMUserDTO[]): void {
		let dialogId: string = this.dialogManagerComponentService.showEntryList(
			this.allNotifyUser, this.notifyUserList.getData(), true, {
				selected: (data: any[]) => {
					this.dialogManagerComponentService.close(dialogId);
					this.notifyUserList.setData(data);
					this.isDirty = true;
				}
		});
	}

	/**
	 * 指定されたイベントの通知方法を取得します.
	 * @param noticeMailList メール通知方法
	 */
	protected setMailMethod(noticeMailList: EIMNoticeMailDomain[]): void {

		if (noticeMailList == null || noticeMailList.length == 0) {
			this.notifyCondition = 2;
			this.canChangeNotify = false;
		} else if (noticeMailList[0].method == EIMConstantService.MAIL_METHOD_ENUM_IMMEDIATE) {
			this.notifyCondition = 0;
			this.canChangeNotify = false;
		} else if (noticeMailList[0].method == EIMConstantService.MAIL_METHOD_ENUM_ACCUMULATE) {
			this.notifyCondition = 1;
			this.canChangeNotify = false;
		} else if (noticeMailList[0].method == EIMConstantService.MAIL_METHOD_ENUM_SELECTABLE) {
			this.notifyCondition = 0;
			this.canChangeNotify = true;
		}
	}

	/**
	 * 指定されたイベントの遷移先ステータスIDと合致するステータスのアサインユーザを取得します.
	 */
	protected setNotifyData(): void {

		let criteria: EIMFormWorkspaceEntryUserCriteriaDTO = new EIMFormWorkspaceEntryUserCriteriaDTO();

		criteria.formWorkspaceId = this.attributeService.getAttributeByDefinitionName(this.form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID).longList[0];
		this.formWorkspaceEntryUserService.getList(criteria).subscribe((users: EIMUserDTO[]) => {
		this.allNotifyUser = users;
		this.showNotifyUsers(users);
		});
	}

	/**
	 * ワークフローの矢印を選択します.
	 * @param eventType イベントタイプ情報
	 */
	protected selectEventTypeEdge(eventType: EIMEventTypeDomain): void {
		let data = this.workflowDiagram.getData();
		for (let i = 0; i < data.length; i++) {
			if (data[i].domain.id == eventType.id) {
				this.workflowDiagram.select([data[i]], false);
			}
		}
	}

	/**
	 * 処理のドロップダウンを選択します.
	 * @param eventType イベントタイプ情報
	 * @return 処理が存在するかどうか
	 */
	protected selectEventTypeDropDown(eventType: EIMEventTypeDomain): boolean {
		for (let i = 0; i < this.eventTypeSelectTypeList.length; i++) {
			if (this.eventTypeSelectTypeList[i].value.id == eventType.id) {
				this.selectedEventType = this.eventTypeSelectTypeList[i].value;
				return true;
			}
		}
		return false;
	}

	/**
	 * 指定されたユーザリストを用いて依頼先エントリ選択画面を開きます.
	 * @param users ユーザDTOリスト
	 */
	protected showRequestUsers(users: EIMUserDTO[]): void {
		let dialogId: string = this.dialogManagerComponentService.showEntryList(
				users, this.requestUserList.getData(), false, {
				selected: (data: any[]) => {
					this.dialogManagerComponentService.close(dialogId);
					this.requestUserList.setData(data);
					this.isDirty = true;
				}
			});
	}


	/**
	 * イベント履歴取得後のハンドリングを行います.
	 * @param previousEvent 過去に実行したイベント
	 */
	protected setPreviousEventHistory(previousEvent: EIMFormEventDomain): void{
		if (previousEvent != null && previousEvent.id > 0 && this.selectEventTypeDropDown(previousEvent.type)) {
			this.selectEventTypeEdge(previousEvent.type);
			this.requestUserList.setData(this.convertEntryUser(previousEvent.toStatus.assignmentList));
			this.allAssignmentUser = [];
			// 通知方法を設定
			let mailMethodAttr: EIMAttributeDomain = this.attributeService.getAttributeByDefinitionName(previousEvent.attributeList, EIMConstantService.ATTRIBUTE_NAME_NOTIFICATION_METHOD);
			if (mailMethodAttr != null) {
				this.canChangeNotify = true;
				this.notifyCondition = mailMethodAttr.longList[0];
			} else {
				this.canChangeNotify = false;
				this.notifyCondition = '2';
			}
			// 通知先を設定
			let notifyUserAttr: EIMAttributeDomain = this.attributeService.getAttributeByDefinitionName(previousEvent.attributeList, EIMConstantService.ATTRIBUTE_NAME_ADDMAIL_NOTIFICATION);
			if (notifyUserAttr != null) {
				this.notifyUserList.setData(this.convertUser(notifyUserAttr.userList));
			}
			this.canSearch = !previousEvent.toStatus.type.auto;
			if (this.attributeService.getAttributeByDefinitionName(previousEvent.attributeList, EIMConstantService.ATTRIBUTE_NAME_COMMENT) != null) {
				this.comment = (this.attributeService.getAttributeByDefinitionName(previousEvent.attributeList, EIMConstantService.ATTRIBUTE_NAME_COMMENT)).textList[0];
			}

			// 最後のイベント(遷移先が最後のステータスタイプ)かどうかを判定する
			this.isFinalEvent = this.isFinalStatusType(previousEvent.toStatus.type);

		} else {
			let attributeList: EIMAttributeDomain[] = this.form.attributeList;
			if (attributeList == null || attributeList.length == 0) {
			return;
			}
			// 複製元オブジェクトID属性が設定されている場合
			let srcAttr: EIMAttributeDomain = this.attributeService.getAttributeByDefinitionName(this.form.attributeList, EIMConstantService.ATTRIBUTE_NAME_SRC_OBJECT_ID);
			if (srcAttr == null) {
				return;
			}
			// 実行対象イベントタイプ取得
			this.formEventTypeService.forcastEventType({fromStatusTypeId: this.form.status.type.id, objectId: this.form.id})
			.subscribe(
					(srcEvent: EIMFormEventTypeDomain) => {
						if (srcEvent != null && srcEvent.id > 0 && this.selectEventTypeDropDown(srcEvent)) {
							this.selectEventTypeEdge(srcEvent);
							this.setUserData(srcEvent.toStatusType.id, false);
							this.setMailMethod(srcEvent.noticeMailList);
							this.canSearch = true;
							this.isFinalEvent = this.isFinalStatusType(srcEvent.toStatusType);
						}
					});
		}
	}

	/**
	 * 取得したユーザドメイン一覧をユーザDTO一覧に変換します.
	 * @param userList ユーザドメインリスト
	 * @return ユーザDTOリスト
	 */
	protected convertUser(userList: EIMUserDomain[]): any{
		let userDTOList: EIMUserDTO[] = [];

		for (let i = 0; i < userList.length; i++) {
			let userDTO: EIMUserDTO = new EIMUserDTO();
			userDTO.code = userList[i].code;
			userDTO.name = userList[i].name;
			userDTO.id = userList[i].id;
			userDTO.mail = userList[i].mail;
			userDTO.admin = userList[i].admin;
			userDTO.disable = userList[i].disable;
			userDTO.groupNames = this.convertName(userList[i].groupList);
			userDTO.roleNames = this.convertName(userList[i].roleList);
			userDTOList.push(userDTO);
		}
		return userDTOList;
	}

	/**
	 * 取得したアサインメントドメイン一覧をユーザDTO一覧に変換します.
	 * @param assignmentList アサインメントドメインリスト
	 * @return ユーザDTOリスト
	 */
	protected convertEntryUser(assignmentList: EIMAssignmentDomain[]): any{
		let userList: EIMUserDTO[] = [];

		for (let i = 0; i < assignmentList.length; i++) {
			if (assignmentList[i].entryType == EIMConstantService.ENTRY_TYPE_NAME_USER) {
				let userDTO: EIMUserDTO = new EIMUserDTO();
				let user: EIMUserDomain = <EIMUserDomain>(assignmentList[i].entryElement);
				userDTO.code = user.code;
				userDTO.name = user.name;
				userDTO.id = user.id;
				userDTO.mail = user.mail;
				userDTO.admin = user.admin;
				userDTO.disable = user.disable;
				userDTO.groupNames = this.convertName(user.groupList);
				userDTO.roleNames = this.convertName(user.roleList);
				userList.push(userDTO);
			}
		}
		return userList;
	}

	/**
	 * 取得したエントリーエレメントドメイン一覧をカンマ区切りの名称に変換します.
	 * @param entryList エントリーエレメントドメインリスト
	 * @return 名称
	 */
	protected convertName(entryList: EIMEntryElementDomain[]): any{
		let names: String = '';
		for (let i = 0; i < entryList.length; i++) {
			names += entryList[i].name;
			names += EIMConstantService.DELIMITER_COMMA;
		}
		// 最後のカンマを除去
		names = names.substring(0, names.length - 1);
		return names;
	}


	protected createUser(userDTO: EIMUserDTO): any {
		let user: EIMUserDomain = new EIMUserDomain();
		user.id = userDTO.id;
		user.mail = userDTO.mail;
		user.lang = userDTO.lang;
		user.disable = userDTO.disable;
		return user;
	}

	/**
	 * 取得したエントリーユーザDTO一覧のうち、上長のみを返します.
	 * @param users エントリーユーザDTOリスト
	 * @return 上長のみユーザリスト
	 */
	protected onlySuperiorTrim(users: EIMEntryUserDTO[]): any {
		let trimmedUsers: EIMEntryUserDTO[] = [];
		for (let i = 0; i < users.length; i++) {
			if (users[i].isBoss) {
				trimmedUsers.push(users[i]);
			}
		}
		return trimmedUsers;
	}

	/**
	 * 対象ステータスタイプが最後のステータスタイプかどうかを判定します.
	 * @param targetStatusType 判定対象ステータスタイプ
	 * @return 最後のステータスタイプの場合:true
	 */
	protected isFinalStatusType(targetStatusType: EIMStatusTypeDomain): boolean {
		if (this.workflow.statusTypeList && this.workflow.statusTypeList.length > 0) {
			let lastStatusType: EIMStatusTypeDomain = this.workflow.statusTypeList[this.workflow.statusTypeList.length - 1];
			if (targetStatusType.id === lastStatusType.id) {
				return true;
			}
		}

		return false;
	}

	/**
	 * イベントタイプを取り除く.
	 * 権限に応じて表示するイベントタイプを制限するために使用する。
	 * 引数のイベントタイプリストの参照を切らずに中身を変更すること。
	 * @param form 帳票
	 * @param workflow ワークフロー
	 * @param eventTypeList 表示イベントタイプリスト
	 */
	protected removeEventType(form: EIMFormDomain, workflow: EIMWorkflowDomain, eventTypeList: EIMEventTypeDomain[]): void {
		// 継承して作成したコンポーネント側で実装する
	}

}
