import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMSelectable, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMFormFolderDTO } from 'app/admins/shared/dtos/form-folder.dto';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';


/**
 * 帳票フォルダ選択コンポーネント
 * @example
 *
 *      <eim-workspace-folder-single-selector
 *          [formWorkspaceId]="formWorkspaceId"
 *          [formTypeId]="formTypeId"
 *      >
 *      </eim-workspace-folder-single-selector>
 */
@Component({
    selector: 'eim-workspace-folder-single-selector',
    templateUrl: './workspace-folder-single-selector.component.html',
    styleUrls: ['./workspace-folder-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceFolderSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMWorkspaceFolderSingleSelectorComponent) }],
    standalone: false
})
export class EIMWorkspaceFolderSingleSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** 帳票フォルダツリーデータグリッド */
	@ViewChild('formFolderTreeGrid', { static: true }) public formFolderTreeGrid: EIMTreeDataGridComponent;

	/** 帳票ワークスペースID */
	@Input() public formWorkspaceId: number;

	/** 帳票タイプID */
	@Input() public formTypeId: number;

	/** 選択完了イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeDataGridNode;

	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		{ label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); } },
		{ label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); } },
	];


	/**
	 * コンストラクタ.
	 */
	constructor(
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected adminsFormWorkspaceService: EIMAdminsFormWorkspaceService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
	) {
		super();
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {
		let selectedNode = this.formFolderTreeGrid.getSelectedData()[0];
		let nodeHierarchyNum = this.adminsFormWorkspaceService.countNodeHierarchy(selectedNode);
		// 階層が最大を越えている場合、エラーメッセージを表示
		if (nodeHierarchyNum >= EIMAdminsConstantService.FORM_FOLDER_MAX_HIERARCHY ) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00022',
				{value: EIMAdminsConstantService.FORM_FOLDER_MAX_HIERARCHY}));
			return;
		}
		// 呼び出し元に選択したドキュメントタイプを返却する
		// 選択したドキュメントタイプ情報を呼び出し元に通知
		this.selected.emit(this.formFolderTreeGrid.getSelectedData()[0].data);
	}


	/**
	 * 選択ボタン押下可否を返却します.
	 * @return 帳票タイプ選択可否
	 */
	public selectable(): boolean {
		return (this.selectedTreeNode != null);
	}


	/**
	 * 画面を表示します.
	 */
	public show(): void {
		// 帳票フォルダ一覧を取得
		this.adminsFormWorkspaceService.getFormFolderList(this.formWorkspaceId, this.formTypeId).subscribe(
			(formFolderList: EIMFormFolderDTO[]) => {

				let formFolderTreeNodeList: EIMTreeDataGridNode[] = [];
				if (formFolderList && formFolderList.length > 0) {
					let loopCnt = formFolderList.length;
					for (let idx = 0; idx < loopCnt; idx++) {
						let treeDataNode = this.convertToEIMWsFormFolderTreeNode(formFolderList[idx]);
						formFolderTreeNodeList.push(treeDataNode);

					}
					this.formFolderTreeGrid.setData(formFolderTreeNodeList);
				} else {
					this.formFolderTreeGrid.setData([]);
				}

			}, (err: any) => {
				// 検索エラーの場合、画面を閉じる
				window.setTimeout(() => {
					this.errored.emit();
				});
			});

	}

	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.formFolderTreeGrid.expandAll();
	}


	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.formFolderTreeGrid.collapseAll();
	}


	/**
	 * 選択情報を取得します.
	 */
	public getSelectedData(): EIMFormFolderDTO[] {
		return [this.formFolderTreeGrid.getSelectedData()[0].data];
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		let columns: EIMTreeDataGridColumn[] = [];
		// 帳票フォルダの名前
		columns.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 260 });
		// セキュリティ
		columns.push({ field: 'securityName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02015'), width: 250 });
		this.formFolderTreeGrid.setColumns(columns);

		// 帳票フォルダ一覧を取得
		this.show();

	}


	/**
	 * 帳票フォルダ選択押下のイベントハンドラです．
	 * @param event イベント
	 */
	public onSelectedTreeNode(event: any): void {
		this.selectedTreeNode = event;
		// 選択行を展開
		event.selectedData[0].expanded = !event.selectedData[0].expanded;
		this.formFolderTreeGrid.info.data = [...this.formFolderTreeGrid.info.data];
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * EIMFormFolderDTOをツリーノードに変換します.
	 * @param formFolderDto EIMFormFolderDTO
	 * @return ツリーノード
	 */
	private convertToEIMWsFormFolderTreeNode(formFolderDto: EIMFormFolderDTO): EIMTreeDataGridNode {
		let icon = 'fa-fw fa-lg eim-icon-folder eim-icon-folder-color';

		formFolderDto.securityName = this.getNameNoNamespace(formFolderDto.securityName);
		let parent: EIMTreeDataGridNode = {
			label: formFolderDto.name,
			icon: icon,
			data: formFolderDto,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: (formFolderDto.children.length === 0),
		};
		parent.data.icon = icon;

		let children: EIMTreeDataGridNode[] = [];
		for (let idx = 0; idx < formFolderDto.children.length; idx++) {
			children.push(this.convertToEIMWsFormFolderTreeNode(formFolderDto.children[idx]));
		}

		this.hierarchicalDomainService.setChildren(parent, children);
		parent.expanded = false;

		return parent;
	}


	/**
	 * ネームスペース文字列を除いた定義名称を取得します。
	 * @param name ネームスペース文字列を含む定義名称
	 * @return ネームスペース文字列を除いた定義名称
	 */
	private getNameNoNamespace(name: string): string {
		let nameNoNamespace = '';
		if (name) {
			let idx = name.indexOf(EIMAdminsConstantService.DELIMITER_COLON);
			nameNoNamespace = name.substring(idx + 1);
		}
		return nameNoNamespace;
	}

}
