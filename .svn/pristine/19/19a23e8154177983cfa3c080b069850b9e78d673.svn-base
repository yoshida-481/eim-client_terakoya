import { Component, ViewChild, OnInit, forwardRef, Input, OnChanges, SimpleChanges, ViewContainerRef, ComponentFactoryResolver, EventEmitter, Type, ComponentRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMProjectUpdatorComponent } from 'app/tasks/components/project-updator/project-updator.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMMessageService } from 'app/shared/services/message.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMProgressBarRendererComponent } from 'app/shared/components/renderer/progress-bar-renderer.component';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { filter } from 'rxjs/operators';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { Subscription } from 'rxjs';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMWorkspaceHomeWidgetWrapperComponent } from '../workspace-home-widget-wrapper/workspace-home-widget-wrapper.component';
import { EIMWorkspaceHomeWidgetScheduledScopeTasksComponent } from '../workspace-home-widget-scheduled-scope-tasks/workspace-home-widget-scheduled-scope-tasks.component';
import { EIMWorkspaceHomeWidgetTodayCompletePlanTasksComponent } from '../workspace-home-widget-today-complete-plan-tasks/workspace-home-widget-today-complete-plan-tasks.component';
import { EIMWorkspaceHomeWidgetDelayedTasksComponent } from '../workspace-home-widget-delayed-tasks/workspace-home-widget-delayed-tasks.component';
import { EIMWorkspaceHomeWidgetMyTasksComponent } from '../workspace-home-widget-my-tasks/workspace-home-widget-my-tasks.component';
import { CommonModule } from '@angular/common';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMPortalsModule } from 'app/portals/portals.module';
import { PanelModule } from 'primeng/panel';
import { EIMTasksModule } from 'app/tasks/tasks.module';

export interface EIMWorkspaceHomeWidgetComponent {

	/** ワークスペースID */
	workspaceId: number;

	/** 表示内容をします. */
	update(): void;

	/** タスク選択時のイベントエミッタ */
	selectedTask?: EventEmitter<{taskId: number, parent: EIMSimpleObjectDTO}>;
}

export interface EIMWorkspaceHomeWidgetProfile {
	headerTitle: string;
	widgetComponent: Type<EIMWorkspaceHomeWidgetComponent>;
}

/**
 * ワークスペースホームコンポーネント
 * @example
 *
 *      <eim-workspace-home>
 *      </eim-workspace-home>
 */
@Component({
	selector: 'eim-workspace-home',
	templateUrl: './workspace-home.component.html',
	styleUrls: ['./workspace-home.component.scss'],
	imports: [
		CommonModule,
		EIMPortalsModule,
		EIMTasksModule,
		EIMSharedModule,
		TranslatePipe, 
		PanelModule,
	],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceHomeComponent)}, ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkspaceHomeComponent implements OnInit, OnChanges {

	/** プロジェクトフォーム */
	@ViewChild('projectUpdator', { static: true, read: EIMProjectUpdatorComponent }) projectUpdator: EIMProjectUpdatorComponent;

	/** お気に入りデータグリッド */
	@ViewChild('favoriteDataGrid', { static: false }) favoriteDataGrid: EIMDataGridComponent;
		
	/** 自担当タスク情報データグリッド */
	@ViewChild('myTaskListDataGrid', { static: false }) myTaskListDataGrid: EIMDataGridComponent;
	
	/** 遅延タスク情報データグリッド */
	@ViewChild('delayedTaskListDataGrid', { static: false }) delayedTaskListDataGrid: EIMDataGridComponent;
	
	/** 本日完了予定タスク情報データグリッド */
	@ViewChild('todayCompletePlanTaskListDataGrid', { static: false }) todayCompletePlanTaskListDataGrid: EIMDataGridComponent;
	
	/** 対応予定期間内タスク情報データグリッド */
	@ViewChild('scheduledScopeTaskListDataGrid', { static: false }) scheduledScopeTaskListDataGrid: EIMDataGridComponent;

	/** ウィジェットコンテナ */
	@ViewChild('widgetContainer', { read: ViewContainerRef, static: true }) widgetContainer: ViewContainerRef;

	/** 選択中のワークスペースID */
	@Input()
	public workspaceId: number = null;

	/** プロジェクト詳細が編集モードか否か */
	public isProjectEditMode = false;

	public taskId: any;
	
	public parent: EIMSimpleObjectDTO;

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** プロジェクト更新コンポーネントが初期化済みかどうか */
	public projectUpdatorComponentInitialized = false;

	/** 編集 */
	public menuEdit: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03014'), name: 'createTask', icon: 'fa fa-pencil', visible: true,
		command: (event) => {this.setProjectEditMode(true);}, disabled: true};

	/** キャンセル */
	public menuCancel: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03015'), name: 'createTask', icon: 'fa fa-remove', visible: false,
		command: (event) => {this.setProjectEditMode(false);}};

	/** 保存 */
	public menuSave: EIMMenuItem = {
		label: this.translateService.instant('EIM_TASKS.LABEL_03016'), name: 'createTask', icon: 'fa fa-check', visible: false,
		command: (event) => {this.onClickProjectSave();}};


	/** プロジェクト詳細メニュー */
	public projectFormMenuItems: EIMMenuItem[] = [
		// 編集
		this.menuEdit,
		// 保存
		this.menuSave,
		// キャンセル
		this.menuCancel,
	];

	public menuItems: EIMMenuItem[] = [
		// {
		// 	label: '', tooltip: '設定', name: 'createTask', icon: 'eim-icon-setting', visible: true,
		// 	command: (event) => {}
		// }
	]
	private routerSubscription: Subscription;
	
	/** ウィジェットプロファイル情報 */
	private widgetProfileMap: Map<string, EIMWorkspaceHomeWidgetProfile> = new Map([
		// 自担当タスク情報
		['myTask', {
			headerTitle: this.translateService.instant('EIM_TASKS.LABEL_02065'), 
			widgetComponent: EIMWorkspaceHomeWidgetMyTasksComponent}
		],
		// 遅延タスク情報
		['delayedTask', {
			headerTitle: this.translateService.instant('EIM_TASKS.LABEL_02066'), 
			widgetComponent: EIMWorkspaceHomeWidgetDelayedTasksComponent}
		],
		// 本日完了予定タスク情報
		['todayCompletePlanTask', {
			headerTitle: this.translateService.instant('EIM_TASKS.LABEL_02067'), 
			widgetComponent: EIMWorkspaceHomeWidgetTodayCompletePlanTasksComponent}
		],
		// 対応予定期間内タスク情報
		['scheduledScopeTask', {
			headerTitle: this.translateService.instant('EIM_TASKS.LABEL_02068'), 
			widgetComponent: EIMWorkspaceHomeWidgetScheduledScopeTasksComponent}
		],
	]);

	/** ウィジェットのコンポーネント参照リスト */
	private componentRefs: ComponentRef<EIMWorkspaceHomeWidgetWrapperComponent>[] = [];
	
	/** タスク選択イベントのサブスクリプションリスト */
	private selectedTaskSubscriptions: Subscription[] = [];

	/** projectUpdatorが使えるようになるまで、setState()の値を保持する */
	private state:any = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected resolver: ComponentFactoryResolver,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected taskService: EIMTaskService,
		protected route: ActivatedRoute,
		protected router: Router,
		protected localStorageService: EIMLocalStorageService,
		protected serverConfigService: EIMServerConfigService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		if (this.workspaceId) {

			if(this.projectUpdatorComponentInitialized)
			{
				// 基本情報更新
				this.projectUpdator.setState(state?.projectUpdator ?? null);

				// サーバ設定値を読み込んだあとに実施する必要があるため、addWidgetComponent()にて実施する
				//	// ウィジェットを更新します
				//	//this.updateWidgetComponents();
			}
			else{
				this.state = state;
			}
		}
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			projectUpdator: this.projectUpdator?.getState() ?? null
		};
	}

	/**
	 * コンポーネントを初期化します.
	 * 選択されたワークスペースIDを設定します.
	 * 
	 * @param workspaceId 選択されたワークスペースID
	 */
	public initialize(workspaceId: number): void {

		// 選択変更時のみ再描画
		if (this.workspaceId !== workspaceId) {

			this.projectUpdatorComponentInitialized = false;
			this.isProjectEditMode = false;
			this.setProjectEditMode(this.isProjectEditMode);
			this.menuEdit.disabled = true; // プロジェクト情報が読み込み完了した時点で有効化する
	
			this.workspaceId = workspaceId;

			// ウィジェットを更新します
			this.updateWidgetComponents();
		}
	}

	/**
	 * タスク表示内容を更新します.
	 * 
	 * @param parentDTO 更新されたタスクオブジェクトの親オブジェクト
	 * @param updatedDTO 更新されたタスクオブジェクト
	 */
	public updateTask(parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO): void {

		this.updateWidgetComponents();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		this.projectUpdatorComponentInitialized = false;
		this.isProjectEditMode = false;
		this.setProjectEditMode(this.isProjectEditMode);
		this.menuEdit.disabled = true; // プロジェクト情報が読み込み完了した時点で有効化する

		// ウィジェット追加
		this.addWidgetComponents();
	}

	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {


	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		// サブスクリプションを解除
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}

		if (this.selectedTaskSubscriptions.length > 0) {
			for (const selectedTaskSubscription of this.selectedTaskSubscriptions) {
				selectedTaskSubscription.unsubscribe();
			}
		}
	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (!this.workspaceId) {
			return;
		}

		// ワークスペースID変更の場合
		if (changes.workspaceId) {	

			// ウィジェットを更新します
			this.updateWidgetComponents();
		}
	}



	/**
	 * プロジェクトフォーム保存ボタンクリック時のイベントハンドラです.
	 */
	public onClickProjectSave(): void {

		this.projectUpdator.update();

	}

	/**
	 * プロジェクト更新完了時のイベントハンドラです.
	 * @param result EIMSimpleObjectDTO
	 */
	public onInitializedProject(result: EIMSimpleObjectDTO): void {

		this.projectUpdatorComponentInitialized = true;
		
		if(this.state){
			this.projectUpdator.setState(this.state.projectUpdator);
			this.state = null;
		}

		// 更新権限あり
		if (result?.exAttributeMap?.accessRoleTypeNameMap?.UPDATE ?? false) {
			this.menuEdit.disabled = false;
		}
		// 更新権限なし
		else {
			this.menuEdit.disabled = true;
		}
	}

	/**
	 * プロジェクト属性値変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangedProjectAttribute(event): void {
		this.menuSave.disabled = false;
	}

	/**
	 * プロジェクト更新完了時のイベントハンドラです.
	 * @param result プロジェクト更新結果情報
	 */
	public onUpdatedProject(result: {parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO}): void {
		this.isProjectEditMode = false;

		// 名称更新反映
		// for(let data of this.projectTree.info.data) {
		// 	if (data.objId === result.id) {
		// 		data.label = result.name;
		// 	}
		// }

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002', {value: this.translateService.instant('EIM_TASKS.LABEL_02010')}));
		// 編集モードの終了
		this.setProjectEditMode(false);
	}

	
	/**
	 * タスク名称リンククリック時のイベントハンドラです.
	 * @param dto タスク情報DTO
	 */
	public onClickTask(dto: any): void {
		this.taskId = dto.taskId;
		this.parent = dto.parent;
		this.viewDialogName = 'taskUpdator';
	}
	
	/**
	 * タスク更新時のイベントハンドラです.
	 *
	 * @param dto タスク情報
	 */
	public onUpdateTask(event): void {
		this.viewDialogName = null;

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));

		// ウィジェットを更新します
		this.updateWidgetComponents();

	}
	
	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * プロジェクト詳細の編集モードを設定します.
	 *
	 * 設定によりプロジェクト詳細メニュー、プロジェクト詳細の編集可否を切り替えます.
	 *
	 * @param isProjectEditoMode 編集可否（true:編集可）
	 */
	private setProjectEditMode(isProjectEditoMode: boolean): void {

		this.isProjectEditMode = isProjectEditoMode;

		// メニューの表示非表示を変更
		this.menuEdit.visible = !isProjectEditoMode;
		this.menuCancel.visible = isProjectEditoMode;
		this.menuSave.visible = isProjectEditoMode;
		this.menuSave.disabled = true;

	}

	/**
	 * ウィジェットを追加します.
	 * コンフィグファイルのworkspaceHomeWidgetIdsにて指定したウィジェットを表示します.
	 */
	private addWidgetComponents(): void {

		if (this.serverConfigService.workspaceHomeWidgetIds !== undefined) {
			this.addWidgetComponentInner();

			// ウィジェットを更新します
			this.updateWidgetComponents();

		}
		else {
			this.serverConfigService.configValueSet$.subscribe(() => {
				this.addWidgetComponentInner();

				// ウィジェットを更新します
				this.updateWidgetComponents();
			});
		}
	}

	/**
	 * ウィジェットを追加します.
	 */
	private addWidgetComponentInner(): void {

		const dispWorkspaceHomePanel = this.serverConfigService.workspaceHomeWidgetIds;
		const panelArray = dispWorkspaceHomePanel.split(",");
		this.selectedTaskSubscriptions = [];

		for (const panel of panelArray) {
			const factory = this.resolver.resolveComponentFactory(EIMWorkspaceHomeWidgetWrapperComponent);
			const componentRef = this.widgetContainer.createComponent(factory);

			const profile: EIMWorkspaceHomeWidgetProfile = this.widgetProfileMap.get(panel);
			componentRef.instance.headerTitle = profile.headerTitle;
			componentRef.instance.widgetComponent = profile.widgetComponent;
			componentRef.instance.workspaceId = this.workspaceId;

			if (componentRef.instance.hasOwnProperty('selectedTask')) {

				this.selectedTaskSubscriptions.push(
					componentRef.instance.selectedTask.subscribe((dto) => {

						this.onClickTask({taskId: dto.taskId, parent: dto.parent});
					})
				);
			}

			this.componentRefs.push(componentRef);
		}
	}

	/**
	 * ウィジェットを更新します.
	 */
	private updateWidgetComponents(): void {
		for (const componentRef of this.componentRefs) {

			componentRef.instance.workspaceId = this.workspaceId;
			componentRef.instance.update();
		}

	}

}
