import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, forwardRef, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EIMDocumentsComponent } from 'app/documents/documents.component';
import { EIMPortalsModule } from 'app/portals/portals.module';
import { EIMMessageService } from 'app/shared/services/message.service';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMFileManagerComponent } from 'app/tasks/components/file-manager/file-manager.component';
import { EIMTasksModule } from 'app/tasks/tasks.module';

/**
 * ワークスペースドキュメントコンポーネント
 * @example
 *
 *      <eim-workspace-documents>
 *      </eim-workspace-documents>
 */
@Component({
	selector: 'eim-workspace-documents',
	templateUrl: './workspace-documents.component.html',
	styleUrls: ['./workspace-documents.component.scss'],
	imports: [
		CommonModule,
		EIMPortalsModule,
		EIMTasksModule,
		EIMSharedModule,
		EIMFileManagerComponent,
	],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceDocumentsComponent)}, ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkspaceDocumentsComponent {

	/** ドキュメント一覧 */
	@ViewChild('documents', { static: true }) documents: EIMFileManagerComponent;

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
		this.documents.setState(state);
		// 	// プロジェクトツリー読み込み完了
		// 	const treeInitialized = this.taskManager.initialized.subscribe(() => {
		// 		treeInitialized.unsubscribe();

		// 		// ノード選択
		// 		const selectedData = state.projectTree.selectedData;
		// 		if (selectedData && selectedData.length > 0) {
		// 			this.projectTree.select(selectedData, true);
		// 		}

		// 		// スクロール
		// 		const offsetTop = state.projectTree.offsetTop;
		// 		window.setTimeout(() => {
		// 			this.projectTree.setScrollTop(offsetTop);
		// 		});
		// 	});

		// 	// タブ選択
		// 	this.tabIndex = state.tabIndex;
		// }

		// // プロジェクトツリー読み込み
		// this.initProjectTreeData();
		// // TODO 初期表示では取得階層を限定する。再表示では選択ノードを展開して取得/表示する。
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return this.documents.getState();
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
