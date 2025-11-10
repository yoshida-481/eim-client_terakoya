import { Injectable, EventEmitter, Output, Directive } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMObjectEditorsObjectTypeService } from 'app/object-editors/shared/services/apis/object-editors-object-type.service';
import { EIMObjectTypeDTO } from 'app/object-editors/shared/dtos/object-type.dto';
import { EIMObjectEditorsIconService } from 'app/object-editors/shared/services/object-editors-icon.service';

/**
 * オブジェクトタイプツリー用ツリーノードインタフェース
 */
export interface EIMObjectTypeTreeNode extends EIMTreeNode {
	objTypeId?: number;
	objTypeName?: string;
	isRootType?: boolean;
	isBranch?: boolean;
	isSearch?: boolean;
	rootObjTypeDefName?: string;
}

/**
 * オブジェクトタイプツリーコンポーネントサービス.
 */
@Directive()
@Injectable()
export class EIMObjectTypeTreeComponentService extends EIMTreeComponentService {

	// ごみ箱オブジェクトID
	private trashObjectId: number;

	// 初期処理時エラー発生エミッタ
	@Output() initializeErrored: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected objectEditorsIconService: EIMObjectEditorsIconService,
		protected objectTypeService: EIMObjectEditorsObjectTypeService) {

		super(hierarchicalDomainService);

		/**
		 * 選択対象の行かどうか判定します.
		 */
		this.defaultEquals = (arg1: any, arg2: any) => {
			return (arg1.objTypeId === arg2.objTypeId);
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 初期化します.
	 */
	public initialize(info: EIMListComponentInfo<EIMObjectTypeTreeNode>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {
		window.setTimeout(() => {
			// オブジェクトタイプツリーを設定する
			this.objectTypeService.getTree()
				.subscribe((tree: EIMObjectTypeDTO[]) => {
					for (let i = 0; i < tree.length; i++) {
						let objectTypeTreeNode: EIMObjectTypeTreeNode = this.convertHierarchicalDataToEIMObjectTypeTreeNode(tree[i]);
						info.data.push(objectTypeTreeNode);
					}
					// 初期化処理が終わったのでイベント発行
					if (initialized) {
						initialized.emit();
					}

				},
				() => {
					this.initializeErrored.emit();
				}
			);
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 階層データをツリーノードに変換します.
	 * @param objectType オブジェクトタイプ階層データ
	 * @param level 階層レベル(0,1,2,･･･：0はルート階層)
	 * @return ツリーノード
	 */
	protected convertHierarchicalDataToEIMObjectTypeTreeNode(objectType: EIMObjectTypeDTO, level = 0): EIMObjectTypeTreeNode {
		let icon: string = this.objectEditorsIconService.getIcon(objectType.name);
		let parent: EIMObjectTypeTreeNode = {
			label: objectType.name,
			data: objectType,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: false,
			expanded: false,

			objTypeId: Number(objectType.id),
			objTypeName: objectType.name,
			isBranch: true,
			isSearch: false,
		};

		let children: EIMObjectTypeTreeNode[] = [];
		// 子ノードを設定する
		for (let i = 0; i < objectType.children.length; i++) {
			children.push(this.convertHierarchicalDataToEIMObjectTypeTreeNode(<EIMObjectTypeDTO>objectType.children[i], ++level));
			this.hierarchicalDomainService.setChildren(parent, children);
		}

		if (children.length === 0) {
			parent.children = [];
			parent.leaf = true;
		}

		return parent
	}
}
