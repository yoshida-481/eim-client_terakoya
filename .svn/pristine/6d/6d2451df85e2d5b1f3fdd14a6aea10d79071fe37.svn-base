import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMTreeComponent, EIMTreeTreeNode } from 'app/shared/components/tree/tree.component';

import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';


import { EIMContentsTreeComponentService } from 'app/documents/components/contents-tree/contents-tree.component.service';
import { EIMObjectAPIService, EIMObjectAPIServiceGetListParam } from 'app/shared/services/apis/object-api.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSimpleSearchRelatedObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object.criteria';
import { EIMSimpleSearchRelatedObjectRelationCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object-relation.criteria';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMSimpleSearchRelationCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-relation-criteria.builder';
import { EIMTreeFormatResultDTO } from 'app/shared/dtos/tree-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSimpleSearchObjectResultAttributeType, EIMSimpleSearchRelationResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMJsonToTreeFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-tree-format-result-dto-converter.service';
import { EIMSimpleSearchObjectConditionLeftAttributeType, EIMSimpleSearchRelationConditionLeftAttributeType } from 'app/shared/builders/simple-search/simple-search-condition-left-attribute-type';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * フォルダ選択ツリーコンポーネント
 * @example
 *
 *      <eim-task-folder-tree-selector
 *          [content]="content"
 *          [workspaceObjId]="workspaceObjId"
 *      </eim-task-folder-tree-selector>
 */
@Component({
  selector: 'eim-task-folder-tree-selector',
  templateUrl: './task-folder-tree-selector.component.html',
  styleUrls: ['./task-folder-tree-selector.component.scss'],
  providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskFolderTreeSelectorComponent)},
	            {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMTaskFolderTreeSelectorComponent)},
	        		EIMContentsTreeComponentService,
	        		],
  standalone: false
})
export class EIMTaskFolderTreeSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {

	/** ドキュメントツリーコンポーネント */
	@ViewChild('folderTree', { static: true })
	public folderTree: EIMTreeComponent;

	/** 対象のワークスペースID */
	@Input() public workspaceObjId: number;

	/** デフォルト選択フォルダ */
	@Input() public selectedFolderDTO: EIMSimpleObjectDTO;

	/** 選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** ツリー選択ノード */
	public selectedTreeNode: EIMTreeTreeNode;

	/** ツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
	];

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected objectAPIService: EIMObjectAPIService,
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected treeComponentService: EIMTreeComponentService,
		protected jsonToTreeFormatResultDTOConverterService: EIMJsonToTreeFormatResultDTOConverterService
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * TreeTreeNodeへの追加設定
	 */
	public setAdditionalPropertiesToTreeNodeFunction(treeNode: EIMTreeTreeNode, dto: EIMSimpleObjectDTO): EIMTreeTreeNode {

		treeNode.expandedIcon = 'fa fa-fw fa-lg eim-icon-folder eim-icon-folder-color';
		treeNode.collapsedIcon = 'fa fa-fw fa-lg eim-icon-folder eim-icon-folder-color';

		return treeNode;
	};

	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {
		// 呼び出し元に選択したドキュメントタイプを返却する
		// 選択したドキュメントタイプ情報を呼び出し元に通知
		this.selected.emit(this.selectedTreeNode);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return (this.selectedTreeNode != null);
	}

	/**
	 * 画面を表示します.
	 */
	public show(): void {

		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		// apiParam.comparatorIds = ['baseObjectTypeComparator'];

		apiParam.resultConverterId = 'treeFormatResultDTOConverter';
		apiParam.objectCriteria =
				new EIMSimpleSearchObjectCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute('パス').end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(['baseType', 'definitionName'], EIMSearchOperatorEnum.EQ, 'ワークスペース'),
							new EIMSimpleSearchConditionCriteria(['id'], EIMSearchOperatorEnum.EQ, this.workspaceObjId)
						]
					})
					.build();

		// 子階層のフォルダ情報取得条件指定
		let destCriteria: EIMSimpleSearchRelatedObjectCriteria = new EIMSimpleSearchRelatedObjectCriteria();
		destCriteria.relationChild = new EIMSimpleSearchRelatedObjectRelationCriteria();
		destCriteria.relationChild.objectCriteria =
				new EIMSimpleSearchObjectCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute('パス').end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(
								new EIMSimpleSearchObjectConditionLeftAttributeType().baseType().definitionName().end(), 
								EIMSearchOperatorEnum.EQ, 'フォルダ')
						]
					})
					.build();
		destCriteria.relationChild.relationCriteria =
				new EIMSimpleSearchRelationCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchRelationResultAttributeType().id().end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(
								new EIMSimpleSearchRelationConditionLeftAttributeType().type().definitionName().end(), 
								EIMSearchOperatorEnum.EQ, 'ドキュメント')
						]
					})
					.build();

		apiParam.relatedObjectCriterias = [destCriteria];
		apiParam.repeatRelatedObjectCriteriasNum = EIMConstantService.INT_MAX_VALUE;

		// 子フォルダ情報取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {
			let treeFormatResult: EIMTreeFormatResultDTO = this.jsonToTreeFormatResultDTOConverterService.convert(res);
			if (treeFormatResult.treeNodes.length == 0) {
				this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
			}

			this.folderTree.setTreeFormatResult(treeFormatResult);
		});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		this.show();

	}

	/**
	 * フォルダツリーノード選択ハンドラです.
	 * 子オブジェクトを取得して、フォルダツリー、ドキュメント一覧を更新します.
	 * @param event イベント
	 */
		public onSelectFolderTreeNode(event: any) {
			this.selectedTreeNode = event.selectedData[0];

			let treeNodes: EIMTreeNode[] = event.selectedData as EIMTreeNode[];
			this.expandTree(treeNodes[0]);
		}

		/**
		 * フォルダツリーノードを展開イベントハンドラです.
		 * @param treeNode 展開対象のフォルダツリーノード
		 */
		public onExpandTreeNode(treeNode: EIMTreeNode): void {
			this.expandTree(treeNode);
		}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ツリーを展開します.
	 * @param treeNode 展開するツリーノード
	 */
	private expandTree(treeNode: any): void {

		treeNode.expanded = true;

		// 	if (!treeNode || treeNode['_isRetrievedChildren'] || treeNode['isTrash']) {
		// 		// ツリーノードが存在しない、又は子階層取得済み、又はごみ箱なら何もしない
		// 		return;
		// 	}

		// 	treeNode['_isRetrievedChildren'] = true;

		// 	this.folderService.getChildFolders(treeNode.objId)
		// 	.subscribe(
		// 			(objectList: any) => {

		// 				// ツリー選択ノードにグリッドデータ(子データ)をセットする
		// 				let data: any[] = objectList;
		// 				if (!data || data.length === 0) {
		// 					// 0件の場合
		// 					data = [];
		// 					treeNode.leaf = true;
		// 					treeNode.isBranch = false;
		// 					treeNode.isSearch = true;
		// 				} else if (data.length > 0 && !treeNode.isTrash ) {

		// 					let childFolderItems: EIMFolderTreeNode[] = [];
		// 					let wsRecycleNode: EIMFolderTreeNode;
		// 					for (let i = 0; i < data.length; i++) {
		// 						let folderItem = data[i];
		// 						if ( folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER ) {
		// 							childFolderItems.push(this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem));
		// 						} else if (folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
		// 							wsRecycleNode = this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem);
		// 							wsRecycleNode.isTrash = true;
		// 							wsRecycleNode.isSearch = true;
		// 							wsRecycleNode.isBranch = false;
		// 							wsRecycleNode.leaf = true;

		// 						}
		// 					}
		// 					if (wsRecycleNode) {
		// 						childFolderItems.push(wsRecycleNode);
		// 					}
		// 					this.folderTree.setChildren(treeNode, childFolderItems);
		// 					treeNode.expanded = true;
		// 					// セット済みをtrueにする
		// 					treeNode.isSearch = true;
		// 				}
		// 			}
		// 	);
		// }

	}

}
