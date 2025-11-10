import { Injectable, EventEmitter, Output, Directive } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMObjectTypeDTO } from 'app/object-editors/shared/dtos/object-type.dto';
import { EIMObjectEditorsRelationService } from 'app/object-editors/shared/services/apis/object-editors-relation.service';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';
import { EIMObjectTypeTreeNode } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';

/**
 * リレーションタイプツリーコンポーネントサービス.
 */
@Directive()
@Injectable()
export class EIMRelationTypeTreeComponentService extends EIMObjectTypeTreeComponentService {

	// 初期処理時エラー発生エミッタ
	@Output() initializeErrored: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected relationService: EIMObjectEditorsRelationService) {
			super(translateService, hierarchicalDomainService, null, null);
		}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 初期化します.
	 */
	public initialize(info: EIMListComponentInfo<EIMObjectTypeTreeNode>, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {
		// リレーションタイプツリーを設定する
		this.relationService.getTree().subscribe(
			(tree: EIMObjectTypeDTO[]) => {
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
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 階層データをツリーノードに変換します.
	 * @param objectType リレーションタイプ階層データ
	 * @return ツリーノード
	 */
	protected convertHierarchicalDataToEIMObjectTypeTreeNode(objectType: EIMObjectTypeDTO): EIMObjectTypeTreeNode {
		let icon = 'fa fa-fw eim-icon-relation';
		let parent: EIMObjectTypeTreeNode = {
			label: objectType.name,
			data: objectType,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: true,
			expanded: true,

			objTypeId: Number(objectType.id),
			objTypeName: objectType.name,
			isBranch: true,
			isSearch: true,
		};

		return parent
	}

}
