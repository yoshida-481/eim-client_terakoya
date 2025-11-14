import {Component, forwardRef, ViewChild, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EIMComponent, EIMSelectable} from 'app/shared/shared.interface';
import {EIMTreeDataGridColumn, EIMTreeDataGridComponent} from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import {EIMTreeDataGridNode} from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import {EIMAdminsWorkflowService} from 'app/admins/shared/services/apis/admins-workflow.service';
import {EIMWorkflowDTO} from 'app/admins/shared/dtos/workflow.dto';
import {EIMAdminDialogManagerComponentService, dialogName} from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';


/**
 * ワークフロー選択コンポーネント
 * @example
 *      <eim-workflow-selector
 *         [selected]="selected"
 *      </eim-workflow-selector>
 */
@Component({
    selector: 'eim-workflow-single-selector',
    templateUrl: './workflow-single-selector.component.html',
    styleUrls: ['./workflow-single-selector.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowSingleSelectorComponent) }
    ],
    standalone: false
})
export class EIMWorkflowSingleSelectorComponent implements OnInit, EIMSelectable {

	/** ワークフローデータグリッド */
	@ViewChild('workflowTreeDataGrid', { static: true })
	workflowTreeDataGrid: EIMTreeDataGridComponent;

	@Input() disableOldRevision: boolean;

	/** 選択ボタン押下時のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	/** ツリー選択ノード */
	public selectedTreeNode: any;

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param workflowService ワークフローサービス
	 */
	constructor(
		private translateService: TranslateService,
		private workflowService: EIMAdminsWorkflowService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 */
	public select(): void {
		this.selected.emit(this.selectedTreeNode);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 * @return 選択ボタン押下可否
	 */
	public selectable(): boolean {
		return this.selectedTreeNode
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMTreeDataGridColumn[] = [];
		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), tooltip: true});
		// 改定
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02302'), width: 50});
		// 更新日時
		columns.push({field: 'modifyDateTimeString', headerName: this.translateService.instant('EIM.LABEL_02033'), width: 160});

		this.workflowTreeDataGrid.setColumns(columns);

		this.getWorkflowList();
	}


	/**
	 * ツリーノード展開時のイベントハンドラ
	 * @param treeNodes 展開されたノードリスト
	 */
	public onExpandTreeNode(treeNodes: EIMTreeDataGridNode[]): void {
		if (!treeNodes || treeNodes[0]['isSearch']) {
			return;
		}
		this.workflowService.getRevisionList(treeNodes[0].data.id).subscribe((workflows: EIMWorkflowDTO[]) => {
			let nodes: EIMTreeDataGridNode[] = [];
			for (let i = 0; i < workflows.length; i++) {
				if (workflows[i].type === 'backToList' || workflows[i].isLatest) {
					continue;
				}
				let node = this.convertWorkflowToTreeDataGridNode(workflows[i], true);
				node.parent = treeNodes[0];
				nodes.push(node);
			}
			if (nodes.length === 0) {
				treeNodes[0].children = [];
				treeNodes[0].leaf = true;
			} else {
				this.workflowTreeDataGrid.setChildren(treeNodes[0], nodes);
			}
			treeNodes[0]['isSearch'] = true;
		});
	}


	/**
	 * ワークフロー選択押下のイベントハンドラです．
	 * @param event イベント
	 */
	public onSelectTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0].data;
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ワークフロータイプDTOをツリーデータグリッドで使用できる型に変換して返却します.
	 * @param type ワークフローDTO
	 * @param isLeaf 末端かどうか
	 * @return ツリーデータグリッドノード
	 */
	private convertWorkflowToTreeDataGridNode(type: EIMWorkflowDTO, isLeaf: boolean): EIMTreeDataGridNode {
		let leaf: boolean = (isLeaf || type.revision === 0 || this.disableOldRevision);
		return {
			label: type.name,
			data: type,
			leaf: leaf,
			expanded: false
		};
	}

		/**
	 * ワークフロー一覧を取得します.
	 */
	private getWorkflowList(): void {
		// ワークフロー一覧を取得します．
		this.workflowService.getList().subscribe((workflows: EIMWorkflowDTO[]) => {
			let nodes: EIMTreeDataGridNode[] = [];
			for (let i = 0; i < workflows.length; i++) {
				nodes.push(this.convertWorkflowToTreeDataGridNode(workflows[i], false));
			}
			this.workflowTreeDataGrid.setData(nodes);
		}, (err: any) => {
			this.workflowTreeDataGrid.setData([]);
			this.adminDialogManagerComponentService.close(dialogName.WORKFLOW_SELECTOR);
		});
	}


}
