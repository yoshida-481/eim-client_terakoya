import { Component, ViewChild, Input, EventEmitter, Output, forwardRef, signal } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceDeleteListParam, EIMObjectAPIServiceGetParam, EIMObjectAPIServiceUpdateParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMTaskWorkflowDiagramComponentService } from '../workflow-diagram/task-workflow-diagram.component.service';
import { EIMTaskWorkflowDiagramComponent } from '../workflow-diagram/task-workflow-diagram.component';
import { NgForm } from '@angular/forms';
import { EIMTextAreaInputFormItemComponentService } from 'app/shared/components/input-form-item/text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMCalendarInputFormItemComponentService } from 'app/shared/components/input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMNumberInputFormItemComponentService } from 'app/shared/components/input-form-item/number-input-form-item/number-input-form-item.component.service';
import { EIMTaskTemplateFileInputFormItemComponentService } from '../task-template-file-input-form-item/task-template-file-input-form-item.component.service';
import { EIMTaskOutputFileInputFormItemComponentService } from '../task-output-file-input-form-item/task-output-file-input-form-item.component.service';
import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMTaskOutputFolderInputFormItemComponentService } from '../task-output-folder-input-form-item/task-output-folder-input-form-item.component.service';
import { EIMValueTypeEnumeration } from 'app/shared/enumerations/value-type-enumeration';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { forkJoin } from 'rxjs';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSimpleSearchObjectResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMRichTextInputFormItemComponentService } from 'app/shared/components/input-form-item/rich-text-input-form-item/rich-text-input-form-item.component.service';
import { createRangeValidator } from 'app/shared/validators/range.validator';
import { EIMInputFormItemComponentChangedEmitValueDomain } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMUrlInputFormItemComponentService } from 'app/shared/components/input-form-item/url-input-form-item/url-input-form-item.component.service';
import { EIMUpdatedTaskDTO } from 'app/tasks/tasks.interface';
import { EIMCacheService } from 'app/shared/services/cache.service';

/**
 * タスク詳細コンポーネント
 * @example
 *
 *      <eim-task-updator
 *          [taskId]="taskId"
 *					[parentDTO]="parentDTO"
 *          (updated)="onUpdated($event)"
 *      >
 *      </eim-task-updator>
 */
@Component({
	selector: 'eim-task-updator',
	templateUrl: './task-updator.component.html',
	styleUrls: ['./task-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMTaskUpdatorComponent)}, ],
	standalone: false
})
export class EIMTaskUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** 回覧フォーム */
	@ViewChild('circulateForm', { static: true }) circulateForm: EIMFormComponent;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** タスクフォーム */
	@ViewChild('taskForm', { static: true }) taskForm: EIMFormComponent;

	/** メモフォーム */
	@ViewChild('memoForm', { static: true }) memoForm: EIMFormComponent;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true }) workflowDiagram: EIMTaskWorkflowDiagramComponent;

	/** タスクId */
	@Input() taskId: number;

	/** 親のオブジェクト */
	@Input() parentDTO: EIMSimpleObjectDTO;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** タスク情報取得完了時のイベントエミッタ */
	@Output() initialized: EventEmitter<EIMSimpleObjectDTO> = new EventEmitter<EIMSimpleObjectDTO>();

	/** タスク更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<EIMUpdatedTaskDTO> = new EventEmitter();

	/** 無効かどうか */
	public componentDisabled = true;

	/** タスク情報 */
	public taskDTO: EIMSimpleObjectDTO;

	/** フォーム形式の簡易結果DTO（タスク情報） */
	public formFormatResult: EIMFormFormatResultDTO;

	/** タスク名 */
	public taskName: string[] = [];

	/** ワークフローを表示するかどうか */
	public isDisplayWorkflow = false;

	/** 次へ進むイベントタイプリスト */
	public forwardEventTypes: EIMEventTypeDomain[] = [];

	/** 前へ戻るイベントタイプリスト */
	public backwordEventTypes: EIMEventTypeDomain[] = [];

	/** 取戻しイベントタイプ */
	public regainEventType: EIMEventTypeDomain;

	/** イベント変更画面に渡す遷移可能なイベントタイプリスト */
	public eventTypes: EIMEventTypeDomain[] = [];

	/** 表示タブのインデックス */
	public tabIndex = signal(0);

	/** 雛型ファイルの設定値 */
	// public templateFileAttributeValues: EIMSimpleObjectDTO[] = [];

	/** 表示するダイアログ名 */
	public viewDialogName = null;

	/** 雛型ファイル */
	public hinagataFiles: EIMSimpleObjectDTO[] = [];

	/** 画面表示時の雛型ファイル */
	public initHinagataFiles: EIMSimpleObjectDTO[] = [];

	/** 成果物データグリッド */
	public taskOutputFileDataGrid: EIMDataGridComponent;

	public updateCompleted: boolean = false;

	/** 編集権限有無(フッタボタン表示可否判定時に使用) */
	public hasUpdateAccessAuthority = false;

	/** ステータス変更権限有無(フッタボタン表示可否判定時に使用) */
	public hasApproveAccessAuthority = false;

	/** ワークスペースID */
	public workspaceId = null;

	/** 動的表示する属性入力欄から除外する属性タイプ定義名称のセット */
	protected readonly excluedeDefinitionNameSetForDynamicInputFormItems = new Set([

		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE, // 開始予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE, // 終了予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE, // 完了日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE, // 進捗率
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_STATUS, // ステータス
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT, // 成果物
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER, // 成果物保存先

		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE, // 担当
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT, // 作業内容
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_MEMO, // メモ

		// TODO: 以下はゴミデータを表示しないためなのでデータをきれいにしたら消してください。
		'app.task.dev:更新内容',
		'app.task.dev:添付ファイル',
		'app.task.dev:事前通知日',
		'app.task.dev:無効フラグ',
		'app.task.dev:担当1',
		'app.task.dev:成果物保存先_Del',
		'app.task.dev:雛型ファイル',
	]);

	/** 雛型ファイル利用方法：必須 */
	private readonly HINAGATA_USAGE_REQUIRED = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public workflowDiagramComponentService: EIMTaskWorkflowDiagramComponentService,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected urlInputFormItemComponentService: EIMUrlInputFormItemComponentService,
		protected textAreaInputFormItemComponentService: EIMTextAreaInputFormItemComponentService,
		protected numberInputFormItemComponentService: EIMNumberInputFormItemComponentService,
		protected calendarInputFormItemComponentService: EIMCalendarInputFormItemComponentService,
		protected richTextInputFormItemComponentService: EIMRichTextInputFormItemComponentService,
		protected templateFileInputFormItemComponentService: EIMTaskTemplateFileInputFormItemComponentService,
		protected taskOutputFileInputFormItemComponentService: EIMTaskOutputFileInputFormItemComponentService,
		protected taskOutputFolderInputFormItemComponentService: EIMTaskOutputFolderInputFormItemComponentService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected messageService: EIMMessageService,
		protected cacheService: EIMCacheService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * タスク情報を更新します.
	 */
	public update(callback: () => void = null): void {
		this.taskDTO.name = this.taskName[0];
	  
		// 成果物の更新処理
		const updateOutputFiles = () => {
			// 成果物のrevisionGroupIdとリビジョンアップフラグをパラメータ化
			const outputFileIdAndInfoMap: Map<number, {revisionGroupId: number, isRevisionUp:boolean}> = new Map();
			this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values.forEach(outputFile => {
				const revisionGroupId = outputFile.revisionGroupId ?? 0;
				const isRevisionUp = outputFile.isRevisionUp ? outputFile.isRevisionUp :  false;
				outputFileIdAndInfoMap.set(outputFile.id, {
					revisionGroupId: revisionGroupId, 
					isRevisionUp: isRevisionUp
				})
		  	});
	  
			// 成果物情報がすべてロックされていない場合、タスクの更新を実行
			updateTask(outputFileIdAndInfoMap);
		};
	  
		// タスクの更新処理
		const updateTask = (outputFileIdAndInfoMap?) => {

			/* 画面表示時と更新時で各雛型ファイルのrevisionを比較し、
			   revisionが変わっていれば（＝雛型最新化を実施）
			   雛型最新化処理用のexParameterを設定する */
			const updatingTemplateRevisionGroupIds: number[] = [];
			const beforeTemplateObjectIds: number[] = [];
			for (let i = 0; i < this.initHinagataFiles.length; i++) {
				if (this.initHinagataFiles[i].revision !== this.hinagataFiles[i].revision) {
					updatingTemplateRevisionGroupIds.push(this.hinagataFiles[i].revisionGroupId);
					beforeTemplateObjectIds.push(this.initHinagataFiles[i].id);
				}
			}

			const param: EIMObjectAPIServiceUpdateParam = {
				dto: this.taskDTO,
				updateAttributeTypeDefinitionNamePaths: [
					// 名称
					['name'],
					// 属性値
					['attributeMap']
				],
				exParameter: {
					// 成果物オブジェクト型属性のオブジェクトステータスをタスクのステータスに更新するかどうかのフラグ
					[EIMTaskConstantService.PLUG_IN_PARAM_NAME_UPDATE_OUTPUT_STATUS_FLAG]: true,
					// 最新化対象の雛型のリビジョングループIDリスト
					[EIMTaskConstantService.PLUG_IN_PARAM_NAME_UPDATING_TEMPLATE_REVISION_GROUP_IDS]: updatingTemplateRevisionGroupIds,
					// 最新化対象の雛型の更新前オブジェクトIDリスト
					[EIMTaskConstantService.PLUG_IN_PARAM_NAME_BEFORE_TEMPLATE_OBJECT_IDS]: beforeTemplateObjectIds,
					// 成果物実体化に必要なパラメータ
					[EIMTaskConstantService.PLUG_IN_PARAM_NAME_OUTPUT_FILE_ID_AND_INFO_MAP]: outputFileIdAndInfoMap,
				}
		  	};
		  	this.objectAPIService.update(param).subscribe((res: any) => {

				// コールバックの指定があれば実行
				if (callback) {
					callback();
				}
				// コールバックの指定がない場合
				else {
					// タスクの更新が完了した場合、完了イベントを通知して画面を閉じる
					this.updateCompleted = true;
					this.updated.emit({parentDTO: this.parentDTO, updatedDTO: this.taskDTO});
				}
		  	});
		};
	  
		// 成果物が存在する場合、成果物の更新処理を行う
		if (this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values.length > 0) {
			updateOutputFiles();
		} else {
			// 成果物が存在しない場合、タスクの更新処理のみ実行
			updateTask();
		}
	}

	/**
	 * タスク更新可否を返却します.
	 * @return タスク更新可否
	 */
	public updatable(): boolean {
		return (this.form.dirty && this.form.valid);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngOnInit(): void {

		// タスク情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: this.taskId,
			refObjectExpansionLevel: 1,
			resultAttributeTypeDefinitionNamePaths: [
				new EIMSimpleSearchObjectResultAttributeType().id().end().getAttributeTypeDefinitionNamePath(),
				new EIMSimpleSearchObjectResultAttributeType().type().end().getAttributeTypeDefinitionNamePath(),
				new EIMSimpleSearchObjectResultAttributeType().name().end().getAttributeTypeDefinitionNamePath(),
				new EIMSimpleSearchObjectResultAttributeType().status().end().getAttributeTypeDefinitionNamePath(),
				new EIMSimpleSearchObjectResultAttributeType().attribute().end().getAttributeTypeDefinitionNamePath(),
				// 成果物
				new EIMSimpleSearchObjectResultAttributeType()
						.attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT)
						.end().getAttributeTypeDefinitionNamePath(),
				// 成果物＞雛型ファイル
				// 雛型ファイルはREAD権限がないとIDしか取得できないためプラグインで取得する
			],
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				includeWorkflow: true,
				includeTemplateDocuments: true,
				includeAssign: true,
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ACCESS_ROLE_TYPE_NAME_MAP]: {
					[EIMTaskConstantService.OBJECT_TYPE_NAME_TASK]: ['UPDATE', 'APPROVE']
				},
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_SETTING_TEMPLATE_FILE_IN_OUTPUT]: true,
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_SETTING_LATEST_EVENT]: true,
			}
		}

		this.objectAPIService.get(param).subscribe((res: any) => {

			this.formFormatResult = new EIMFormFormatResultDTO(res);

			// ワークスペースID
			this.workspaceId = this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORKSPACE]?.values?.[0]?.id;

			// タスク情報初期化
			this.taskDTO = this.formFormatResult.dto;
			this.taskName = [this.taskDTO.name];

			// 編集権限チェック
			this.hasUpdateAccessAuthority = this.formFormatResult.dto.exAttributeMap?.accessRoleTypeNameMap?.UPDATE === true;

			// ステータス変更権限チェック
			this.hasApproveAccessAuthority = this.formFormatResult.dto.exAttributeMap?.accessRoleTypeNameMap?.APPROVE === true;

			if (!this.taskDTO['status']) {
				// ワークフローを持たないタスクのステータスは「-」をセット
				this.taskDTO['status'] = {
					id: null, sequence: null,
					type: {
						name: '-',
						assignmentEntryList: [],
						auto: false,
						definitionName: '',
						id: 0,
						sequence: 0,
						base: undefined
					}, assignmentList: null, attributeList: null, creationUser: null, creationDate: null, modificationUser: null, modificationDate: null
				};
			}

			this.componentDisabled = this.disabled || 
						!this.hasUpdateAccessAuthority || 
						this.taskDTO.status?.type?.base?.id === EIMTaskConstantService.STATUS_TYPE_KIND_ID_DONE;

			// ワークフロー設定
			this.isDisplayWorkflow = true;
			if (this.taskDTO.exAttributeMap['workflow']) {

				let workflow: EIMWorkflowDomain = this.taskDTO.exAttributeMap['workflow'];

				// 次へ進むイベントタイプ有無
				this.forwardEventTypes = this.getEventTypes(
						workflow.eventTypeList, this.taskDTO.status, false, true);

				// 前に戻るイベントタイプ有無
				this.backwordEventTypes = this.getEventTypes(
						workflow.eventTypeList, this.taskDTO.status, false, false);
				
				// 取戻しイベントタイプ有無
				const latestEvent = this.taskDTO.exAttributeMap['latestEvent'];
				if (latestEvent != null && latestEvent.type.base.id != EIMConstantService.EVENT_TYPE_ID_REGAIN_BASE
						&& latestEvent.creationUser.id == this.cacheService.getLoginUser().id) {
					
					// 取り戻しイベントタイプ取得
					const currentStatusRegainEventTypeList: EIMEventTypeDomain[] =
						this.getEventTypes(workflow.eventTypeList, this.taskDTO.status, true, false);
					
					for (let i = 0; i < currentStatusRegainEventTypeList.length; i++) {
						if (latestEvent.fromStatus.type.id === currentStatusRegainEventTypeList[i].toStatusType.id) {
							this.regainEventType = currentStatusRegainEventTypeList[i];
		
							break;
						}
					}
				}
			}

			// 雛型ファイルリスト初期化
			// relation ⇒ object
			for (const templateDocumentDto of this.taskDTO.exAttributeMap['templateDocumentDtos']) {
				const hinagataFile: EIMSimpleObjectDTO = {
					id: templateDocumentDto.child.id,
					name: templateDocumentDto.child.name,
					revision: templateDocumentDto.child.revision,
					latest: templateDocumentDto.child.latest,
					modificationDate: templateDocumentDto.child.modificationDate,
					revisionGroupId: templateDocumentDto.child.revisionGroupId,
					attributeMap: {
						'リレーションID': {
							valueType: EIMValueTypeEnumeration.LONG,
							values: [templateDocumentDto.id]
						},
						// 成果物文書タイプ
						[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE]: 
							templateDocumentDto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE],
						// 利用方法
						[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE]: 
							templateDocumentDto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE],
						'リンク更新タイミング': templateDocumentDto.attributeMap['リンク更新タイミング']
					}
				};

				const hinagataFileCopy = JSON.parse(JSON.stringify(hinagataFile));
				this.hinagataFiles.push(hinagataFile);
				this.initHinagataFiles.push(hinagataFileCopy);
			}

			// 成果物へ雛型ファイルを反映
			// 雛型ファイルにREAD権限がない場合は成果物の雛型ファイル属性にはIDのみ設定される
			// 雛型ファイル属性の情報を補完するため別に取得した雛型ファイル情報を反映する
			const outputDtos: EIMSimpleObjectDTO[] = 
					this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT]?.values ?? null;
			for (const outputDto of outputDtos) {

				const templateFileDtos: EIMSimpleObjectDTO[] = 
						outputDto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE]?.values ?? null;
				if (templateFileDtos === null || templateFileDtos.length === 0) {
					continue;
				}

				for (const templateFileDtoInOutput of this.taskDTO.exAttributeMap['templateFileDtosInOutput']) {
				
					if (templateFileDtos[0].id === templateFileDtoInOutput.id) {
						outputDto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE].values = [templateFileDtoInOutput];
					}
				}
			}
			
			// this.disabledが反映されるまで待つ
			window.setTimeout(() => {

				// 回覧フォーム初期化
				this.circulateForm.setInputFormItems(
					this.createCirculateInputFormItems(this.formFormatResult));

				// 概要上部初期化
				this.propertyForm.setInputFormItems(
					this.createStaticInputFormItems(this.formFormatResult));

				// 概要下部初期化
				this.taskForm.setInputFormItems(
					this.createCustomAttributeInputFormItems(this.formFormatResult));

					// メモフォーム初期化
				this.memoForm.setInputFormItems(
					this.createMemoAttributeInputFormItems(this.formFormatResult));
			});

			this.initialized.emit(this.taskDTO);
		});
	}

	ngOnDestroy(): void {
		if (!this.updateCompleted) {
			// 一時添付ファイルの削除
			// this.deleteTempOutputFile();
		} 
	}

	public onChangeTab(event): void {
		this.tabIndex.set(event);
	}

	/**
	 * メール送信ボタン押下時のイベントハンドラです.
	 * 
	 * @param event イベント
	 */
	public onClickSendMail(event): void {

		this.viewDialogName = 'mailSendExecutor';

	}

	/**
	 * ステータス変更画面表示ボタン押下時のイベントハンドラです.
	 * 
	 * @param event イベント
	 * @param isForward イベントタイプの方向（先へ進む場合はtrue）
	 */
	public onClickStatusChange(event, isForward: boolean): void {

		if (isForward) {
			this.eventTypes = this.forwardEventTypes;
		} else {
			this.eventTypes = this.backwordEventTypes;
		}

		// 成果物
		if (this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT]?.values.length != 0) {
			// 成果物情報を取得し、直接編集ロック状態を確認
			const observables = this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values.map(outputFile => {
				let getParam: EIMObjectAPIServiceGetParam = {
					id: outputFile.id,
					resultAttributeTypeDefinitionNamePaths: [["lockUser", "id"]]
				};
				return this.objectAPIService.get(getParam);
			});
			
			// 成果物情報の取得とロック状態の確認
			forkJoin(observables).subscribe((responses: any[]) => {
				if (responses.some(res => res.dto && new EIMFormFormatResultDTO(res).dto.lockUser !== null)) {
					// いずれかのファイルがロック中の場合は処理中止
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00001'));
					return;
				}

				if (isForward && this.taskDTO.status.type.base.id === EIMTaskConstantService.STATUS_TYPE_KIND_ID_WORKING
					&& this.checkOutputFileRequired()
				) {
					// "次へ進む" かつ "現在ステータスが「対応中」" かつ "利用方法が「必須」の雛型ファイルをもとにした成果物ナシ"
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00008'));
					return;
				} else {
					// 変更があれば保存してダイアログ表示
					this.updateAndShowStatusChangeDialog();
				}

			});
		} else {
			if (isForward && this.taskDTO.status.type.base.id === EIMTaskConstantService.STATUS_TYPE_KIND_ID_WORKING
				&& this.checkOutputFileRequired()
			) {
				// 利用方法が「必須」の雛型ファイルをもとにした成果物ナシの場合、ワーニングを表示する
				this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_TASKS.CONFIRM_00008'),
				() => {
					// 変更があれば保存してダイアログ表示
					this.updateAndShowStatusChangeDialog();
				},
				() => {return;});
			} else {
				// 変更があれば保存してダイアログ表示
				this.updateAndShowStatusChangeDialog();
			}
		}

	}

	/**
	 * ステータス変更時のイベントハンドラです.
	 *
	 * @param dto タスク情報
	 */
	public onChangeStatus(dto: EIMSimpleObjectDTO): void {
		this.viewDialogName = null;
		// ステータス変更が実行された場合、タスク情報の更新も行う
		this.taskDTO = dto;
		// this.update();

		// 完了イベントを通知(画面が閉じる)
		this.updated.emit({parentDTO:null, updatedDTO: dto});
	}

	/**
	 * 取り戻しボタン押下時のイベントハンドラです.
	 * 
	 * @param event イベント
	 */
	public onClickStatusRegain(event): void {

		// 成果物
		if (this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT]?.values.length != 0) {
			// 成果物情報を取得し、直接編集ロック状態を確認
			const observables = this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values.map(outputFile => {
				let getParam: EIMObjectAPIServiceGetParam = {
					id: outputFile.id,
					resultAttributeTypeDefinitionNamePaths: [["lockUser", "id"]]
				};
				return this.objectAPIService.get(getParam);
			});
			
			// 成果物情報の取得とロック状態の確認
			forkJoin(observables).subscribe((responses: any[]) => {
				if (responses.some(res => res.dto && new EIMFormFormatResultDTO(res).dto.lockUser !== null)) {
					// いずれかのファイルがロック中の場合は処理中止
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_TASKS.ERROR_00001'));
					return;
				}

				// 変更があれば保存してダイアログ表示
				this.updateAndShowStatusRegainDialog();
			});
		} else {
			// 変更があれば保存してダイアログ表示
			this.updateAndShowStatusRegainDialog();
		}

	}

	/**
	 * メール送信実行時のイベントハンドラです.
	 * 
	 * @param event イベント
	 */
	public onExecutedSendMail(event): void {
		this.viewDialogName = null;
	}

	/**
	 * 詳細タブ上部固定の入力フォーム値変更時のイベントハンドラです.
	 * @param emitValue 入力フォームコンポーネントの値変更イベントエミッタの設定値
	 */
	public onChangedPropertyForm(emitValue: EIMInputFormItemComponentChangedEmitValueDomain): void {

		// 開始予定日変更時
		if (emitValue.name === 'startDate') {

			// 終了予定日再検証
			this.form.controls['endDate_0']?.updateValueAndValidity();
		}

		// 終了予定日変更時
		if (emitValue.name === 'endDate') {

			// 開始予定日再検証
			this.form.controls['startDate_0']?.updateValueAndValidity();
		}
	}

	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.form.dirty) {
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
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 回覧の入力フォームリストを生成します.
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns 回覧の入力フォームリスト
	 */
	protected createCirculateInputFormItems(formFormatResult: EIMFormFormatResultDTO): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];

		// TODO 手入力できるようにしているが、ステータス変更により上書きされるため、手動か自動のどちらかに制限する設定が必要かも
		// 進捗率
		inputFormItems.push(this.numberInputFormItemComponentService.createInputFormDomain({
			name: 'progressRate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,
			label: this.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE].values,
			valueType: 'LONG',
			styleClass: ' eim-md-4'
		}));

		// ステータス
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'status',
			label: this.translateService.instant('EIM_TASKS.LABEL_02017'),
			value: this.formFormatResult.dto.status.type.name,
			disabled: true,
			styleClass: ' eim-md-4'
		}));

		// 雛型ファイル
		inputFormItems.push(this.templateFileInputFormItemComponentService.createInputFormDomain({
			name: 'template', definitionName: '雛型ファイル',
			label: this.translateService.instant('EIM_TASKS.LABEL_02037'),
			value: this.hinagataFiles,
			documentObjectTypes: formFormatResult.info['documentObjectTypes'],
			templateDocumentDtos: this.hinagataFiles,
			outputDocumentDtos: this.formFormatResult.dto.attributeMap[
				EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values,
			isTemplateFilesEditable: false,
			taskObjectId: this.taskDTO.id
		}));

		// 成果物
		inputFormItems.push(this.taskOutputFileInputFormItemComponentService.createInputFormDomain({
			name: 'taskOutputFile', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT,
			label: this.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, 
				EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values,
			templateFileAttributeValues: this.hinagataFiles,
			parentObjectId: this.taskId
		}));

		// 成果物保存先
		inputFormItems.push(this.taskOutputFolderInputFormItemComponentService.createInputFormDomain({
			name: 'taskOutputFile', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER,
			label: this.getAttributeTypeName(
				formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER].values,
			workspaceId: formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORKSPACE]?.values?.[0]?.id ?? 0
		}));

		return inputFormItems;
	}

	/**
	 * circulateFormのイベント受領
	 */
	onChanged (event: any) {
		
		switch (event.type) {
			case '雛型ファイル':
				this.taskOutputFileDataGrid.addRowData([event.data]);
				for (let inputFormItem of this.circulateForm.inputFormItems) {
					// 成果物
					if (inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT) {
						inputFormItem.values.push(event.data);
					}
				}
				break;
			case '成果物':
				// 成果物コンポーネントから成果物DataGridを取得
				this.taskOutputFileDataGrid = event.data as EIMDataGridComponent;
				break;
			default:
				break;
		}
	}

	/**
	 * 処理履歴一覧リンク押下時イベント
	 */
	onClickProcessingHistory (event: any) {
		event.preventDefault();
		this.viewDialogName = 'processingHistory';
	}
	/**
	 * 上部固定の入力フォームリストを生成します.
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns 上部固定の入力フォームリスト
	 */
	protected createStaticInputFormItems(formFormatResult: EIMFormFormatResultDTO): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];

		// URL
		inputFormItems.push(this.urlInputFormItemComponentService.createInputFormDomain({
			name: 'url', label: this.translateService.instant('EIM.LABEL_02022'),
			value: [this.setURL(this.taskDTO.id)], disabled: true, taskName: this.taskName[0]
		}));

		// 親
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'parent', label: this.translateService.instant('EIM_TASKS.LABEL_02027'),
			value: [this.parentDTO.name], disabled: true
		}));

		// タスク名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02009'),
			value: this.taskName, required: true
		}));

		// タスクタイプ
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'taskType', label: this.translateService.instant('EIM_TASKS.LABEL_02026'),
			value: [this.taskDTO.type.name], disabled: true,
		}));

		// 担当
		inputFormItems.push(this.responsibleObjectRoleInputFormItemComponentService.createInputFormDomain({
			name: 'responsibleObjectRole', label: this.translateService.instant('EIM_TASKS.LABEL_02020'),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE].values,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE, multiple: true,
			selectedObjectRoles: this.formFormatResult.dto.exAttributeMap['objectRoles']
		}));

		// 作業内容
		inputFormItems.push(this.textAreaInputFormItemComponentService.createInputFormDomain({
			name: 'workDetails', label: this.translateService.instant('EIM_TASKS.LABEL_02040'),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT].values,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT, required: false
		}));

		// 開始予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'startDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE,
			label: this.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE].values,
			useTimeNumber: true,
			validators: [
				createRangeValidator(null, this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE].values, false, true).bind(this)
			]
		}));

		// 終了予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'endDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE,
			label: this.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE].values,
			useTimeNumber: true,
			validators: [
				createRangeValidator(this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE].values, null, true).bind(this)
			]
		}));

		// 完了日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'completeDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE,
			label: this.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE].values,
			disabled: true, useTimeNumber: true
		}));

		return inputFormItems;
	}

	/**
	 * URLを設定します.
	 * 
	 */
	protected setURL(id: number): string {
		// URL設定
		let origin: string = window.location.origin;
		let pathname: string = window.location.pathname;
		//localhost:8080/eim/client/#/portals/main/workspaces/@workspaceId@/tasks?taskId=@taskId@
		return origin + pathname + '#/portals' + '/main/workspaces/' + this.workspaceId + '/tasks?taskId=' + id;
	}

	/**
	 * 表示する入力フォームアイテム情報リストを生成します.
	 * @param formFormatResult フォーム形式結果情報
	 * @return 表示する入力フォームアイテム情報リスト
	 */
	protected createCustomAttributeInputFormItems(formFormatResult: EIMFormFormatResultDTO): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] =
				this.taskForm.convertFormFormatResultToInputFormItems(formFormatResult, this.excluedeDefinitionNameSetForDynamicInputFormItems);

		return inputFormItems;

	}

	/**
	 * 表示する入力フォームアイテム情報リストを生成します.
	 * @param formFormatResult フォーム形式結果情報
	 * @return 表示する入力フォームアイテム情報リスト
	 */
	protected createMemoAttributeInputFormItems(formFormatResult: EIMFormFormatResultDTO): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];

		for (const layout of formFormatResult.info.attributeTypeLayouts) {

			// 非表示対象の場合
			if (layout.visible !== true) {
				continue;
			}

			switch (layout.definitionName) {
				// メモ
				case EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_MEMO:
					const inputFormItem = this.taskForm.convertToInputFormItem(layout, formFormatResult);
					inputFormItem.label = null;
					inputFormItems.push(inputFormItem);
				default:
			}
		}

		return inputFormItems;

	}

	/**
	 * 属性タイプ定義名称に該当する属性タイプの名称を返却します.
	 *
	 * @param attributeTypeLayouts 属性タイプのレイアウト情報
	 * @param definitionName 定義名称
	 * @returns 属性タイプの名称
	 */
	protected getAttributeTypeName(attributeTypeLayouts: any[], definitionName: string): string {

		for (const layout of attributeTypeLayouts) {
			if (layout.definitionName !== definitionName) {
				continue;
			}

			return layout.name;
		}

		return '';
	}

	/**
	 * イベントタイプのリストから指定の向きのイベントタイプのリストを抽出して返却します.
	 * ただし、遷移元のステータスが現行ステータスでないイベントタイプは無視します.
	 *
	 * @param eventTypeList イベントタイプのリスト
	 * @param status 現在のステータス
	 * @param isRegain trueの場合、取戻し用のイベントタイプを、falseの場合はそれ以外を取得します
	 * @param isForward イベントタイプの向き（次へ進む場合はtrueを指定する）
	 * @return 存在する場合true
	 */
	protected getEventTypes(eventTypeList: EIMEventTypeDomain[], status: EIMStatusDomain, isRegain: boolean, isForward: boolean): EIMEventTypeDomain[] {

		let list: EIMEventTypeDomain[] = [];

		for (let i = 0; i < eventTypeList.length; i++) {

			let eventType: EIMEventTypeDomain = eventTypeList[i];

			if (!isRegain && eventType.base.id == EIMTaskConstantService.EVENT_TYPE_KIND_ID_REGAIN) {
				// isRegainがfalseの場合、取戻しイベントタイプは対象外
				continue;
			}

			if (isRegain && eventType.base.id != EIMTaskConstantService.EVENT_TYPE_KIND_ID_REGAIN) {
				// isRegainがtrueの場合、取戻しイベントタイプ以外は対象外
				continue;
			}

			if (eventType.fromStatusType.id != status.type.id) {
				// 現在のステータスタイプからのイベントタイプでない場合は対象外
				continue;
			}

			if (isForward && eventType.toStatusType.sequence < status.type.sequence) {
				// 現在のステータスタイプより前に遷移するイベントタイプは対象外
				continue;
			}
			if (!isForward && eventType.toStatusType.sequence >= status.type.sequence) {
				// 現在のステータスタイプ以後に遷移するイベントタイプは対象外
				continue;
			}

			list.push(eventType);
		}

		return list;
	}

	/**
	 * 成果物の一時添付ファイルを削除します
	 * @param 
	 */
	private deleteTempOutputFile(): void {
		const params = new EIMObjectAPIServiceDeleteListParam();
		if (this.taskDTO) {
			// ダイアログを開いた直後だとtaskDTOが初期化されていないため判定文を追加。
			params.dtos = this.taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT].values
				// 一時添付ファイルに絞る
				.filter(outputFile => outputFile.type.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPORARY_ATTACHMENT_FILE)
				.map(outputFile => ({ id: outputFile.id }));
		}

		if (params.dtos && params.dtos.length > 0) {
			this.objectAPIService.deleteList(params).subscribe((res: any) => {

			});
		} 
	}

	/**
	 * 利用方法が「必須」の雛型ファイルを元にした成果物が存在するかチェックする
	 * @return true:存在しない  false:存在する 
	 */
	private checkOutputFileRequired(): boolean {

		for (const hinagataFile of this.hinagataFiles) {
			const outputFileCount = this.taskOutputFileDataGrid.getData().filter(outputFile => {
				// 雛型ファイル
				const values = outputFile.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE]?.['values'];
				return values && values[0]?.id === hinagataFile.id;
			}).length;
			const isRequired = hinagataFile.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE]?.['values'][0] === this.HINAGATA_USAGE_REQUIRED;

			if (outputFileCount === 0 && isRequired) {
				return true;
			}
		}

		return false;
	}

	/**
	 * タスク更新処理とステータス遷移画面の表示を行う
	 */
	private updateAndShowStatusChangeDialog(): void {
		if (this.form.dirty) {
			this.update(() => {
				// dirtyを初期化
				this.form.control.markAsPristine();
				this.viewDialogName = 'taskStatusChangeExecutor';
			});
		} else {
			this.viewDialogName = 'taskStatusChangeExecutor';
		}
	}

	/**
	 * タスク更新処理と取り戻し画面の表示を行う
	 */
	private updateAndShowStatusRegainDialog(): void {
		if (this.form.dirty) {
			this.update(() => {
				// dirtyを初期化
				this.form.control.markAsPristine();
				this.viewDialogName = 'taskStatusRegainExecutor';
			});
		} else {
			this.viewDialogName = 'taskStatusRegainExecutor';
		}
	}
}
