import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, forwardRef, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EIMPortalsModule } from 'app/portals/portals.module';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMMessageService } from 'app/shared/services/message.service';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMTaskManagerComponent } from 'app/tasks/components/task-manager/task-manager.component';
import { EIMTasksModule } from 'app/tasks/tasks.module';

/**
 * ワークスペースタスクコンポーネント
 * @example
 *
 *      <eim-workspace-task>
 *      </eim-workspace-task>
 */
@Component({
	selector: 'eim-workspace-task',
	templateUrl: './workspace-task.component.html',
	styleUrls: ['./workspace-task.component.scss'],
	imports: [
		CommonModule,
		EIMTasksModule,
		EIMTaskManagerComponent,
	],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceTaskComponent)}, ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkspaceTaskComponent {

	/** タスクマネージャ */
	@ViewChild('taskManager', { static: false }) taskManager: EIMTaskManagerComponent;

	/** 選択中のワークスペースID */
	@Input()
	public workspaceId: number = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected route: ActivatedRoute
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コンポーネントを初期化します.
	 * 選択されたワークスペースIDを設定します.
	 * 
	 * @param workspaceId 選択されたワークスペースID
	 */
	public initialize(workspaceId: number): void {
		this.workspaceId = workspaceId;
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		// タスクマネージャの画面状態を復元
		this.taskManager.setState(state);
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return this.taskManager.getState();
	}

	/**
	 * タスク表示内容を更新します.
	 * 
	 * @param parentDTO 更新されたタスクオブジェクトの親オブジェクト
	 * @param updatedDTO 更新されたタスクオブジェクト
	 */
	public updateTask(parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO): void {

		if (this.taskManager.updateTask) {

			this.taskManager.updateTask(parentDTO, updatedDTO);
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

	}


}
