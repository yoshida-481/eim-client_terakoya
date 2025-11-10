import { EIMWorkspaceTreeComponentService, EIMWorkspaceTreeNode } from '../workspace-tree/workspace-tree.component.service';
import { Component, ViewChild, OnInit, Input, HostListener, EventEmitter, Output, forwardRef, AfterViewInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';

import { EIMComponent, EIMHierarchicalDomain, EIMMenuItem, EIMSelectable } from 'app/shared/shared.interface';

import { EIMFormWorkspaceService } from 'app/forms/shared/services/apis/form-workspace.service';

import { EIMFormCriteria } from 'app/shared/domains/criteria/form.criteria';

import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeFolderDTO } from 'app/shared/dtos/form-type-folder.dto';


/**
 * 帳票タイプ帳票タイプフォルダツリー選択コンポーネント
 * @example
 *
 *      <eim-form-workspace-tree-selector
 *      
 *      >
 *      </eim-form-workspace-tree-selector>
 */
@Component({
    selector: 'eim-form-workspace-tree-selector',
    templateUrl: './form-workspace-tree-selector.component.html',
    styleUrls: ['./form-workspace-tree-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkspaceTreeSelectorComponent) }],
    standalone: false
})
export class EIMFormWorkspaceTreeSelectorComponent implements OnInit, AfterViewInit, EIMSelectable {
	
	/** 帳票ワークスペースID */
	@Input() formWorkspaceId: number;
	
	/** 帳票タイプID */
	@Input() formTypeId: number;
	
	/** 帳票タイプフォルダID */
	@Input() formTypeFolderId: number;
	
	/** 同一タイプ選択不可フラグ */
	@Input() identicalTypeSelectionDisabledFlag: boolean;
	
	/** 初期選択フラグ */
	@Input() initialSelectionFlag: boolean;
	
	/** ワークスペースツリーコンポーネント */
	@ViewChild('formWorkspaceTree', { static: true })
		formWorkspaceTree: EIMTreeComponent;
	
	/** ツリーコンポーネントサービス */
	@Input() treeComponentService: EIMWorkspaceTreeComponentService;
	
	/** ツリー選択完了のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();
	
	/** ツリー選択ノード */
	public selectedTreeNode: EIMWorkspaceTreeNode;
	
		/** ツリーコンテキストメニュー */
	public treeMenuItems: EIMMenuItem[] = [
			{label: this.translateService.instant('EIM.LABEL_03027'), name: '', icon: 'fa fa-fw fa-expand', command: (event) => { this.expandAll(); }},
			{label: this.translateService.instant('EIM.LABEL_03028'), name: '', icon: 'fa fa-fw fa-compress', command: (event) => { this.collapseAll(); }},
	];
	
	/**
	 * コンストラクタ.
	 */
	constructor(
		protected translateService: TranslateService,
		protected formWorkspaceService: EIMFormWorkspaceService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
	) {
		
	}
	
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit() {
		
	}
	
	/**
	 * ビュー生成後イベントハンドラ.
	 */
	ngAfterViewInit(): void {
		this.formWorkspaceTree.initialize({formWorkspaceId: this.formWorkspaceId, formTypeId: this.formTypeId, formTypeFolderId: this.formTypeFolderId, initialSelectionFlag: this.initialSelectionFlag}, true);
	}
	
	/**
	 * ツリー初期化イベントハンドラ.
	 * @param event イベント
	 */
	public onInitialize(event: any): void {
		// ツリー全展開
		this.formWorkspaceTree.expandAll();

		let nodes: EIMTreeNode[] = this.formWorkspaceTree.getSelectedData();

		if (nodes.length > 0) {
			// ツリースクロール位置設定
			window.setTimeout(() => {
				this.formWorkspaceTree.ensureIndexVisible(nodes[0]);
			});
		}

	}
	
	/**
	 * ツリーアイテム選択イベントハンドラ.
	 * @param event イベント
	 */
	public onSelectTreeNode(event: any): void {
		this.selectedTreeNode = event.selectedData[0];
	}
	
	/**
	 * 選択ボタン押下時の処理を実施します.
	 */
	public select(): void {
		let selectedTreeNode: any = this.formWorkspaceTree.getSelectedData()[0];
		this.selected.emit([selectedTreeNode]);
	}
	
	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		if (!this.selectedTreeNode) {
			// 未選択の場合、選択不可
			return false;
		}
		
		if (this.identicalTypeSelectionDisabledFlag && (this.formTypeId === this.selectedTreeNode.formTypeId && this.formTypeFolderId === this.selectedTreeNode.formTypeFolderId)) {
			// 移動元と移動先が同じ場合、選択不可
			return false;
		}
		
		for (let i = 0; i < this.selectedTreeNode.data.accessRoleTypeList.length; i++) {		
			if (this.selectedTreeNode.data.accessRoleTypeList[i].definitionName == "CREATE") {	
				//書き込み権限がある場合、選択可能
				return true;
			}	
		}		

		return false;
	}
	
	/**
	 * 全展開イベントハンドラ.
	 * ツリーノードを全て展開する
	 */
	public expandAll(): void {
		this.formWorkspaceTree.expandAll();
	}
	
	/**
	 * 全縮小イベントハンドラ.
	 * ツリーノードを全て折り畳む
	 */
	public collapseAll(): void {
		this.formWorkspaceTree.collapseAll();
	}
	
}
