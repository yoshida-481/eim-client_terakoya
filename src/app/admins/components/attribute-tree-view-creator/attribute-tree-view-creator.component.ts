import {Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {EIMComponent, EIMCreatable} from 'app/shared/shared.interface';
import {EIMConstantService} from 'app/shared/services/constant.service';
import {EIMLocalStorageService} from 'app/shared/services/apis/local-storage.service';
import {EIMAttrTreeService} from 'app/admins/shared/services/apis/attributeTreeView.service';
import {EIMAdminDialogManagerComponentService, dialogName} from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { NgForm } from '@angular/forms';

/**
 * 属性ツリービュー登録コンポーネント
 * @example
 *
 *      <attribute-tree-view-creator>
 *      </attribute-tree-view-creator>
 */
@Component({
    selector: 'eim-attribute-tree-view-creator',
    templateUrl: './attribute-tree-view-creator.component.html',
    styleUrls: ['./attribute-tree-view-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeTreeViewCreatorComponent) }
    ],
    standalone: false
})

export class EIMAttributeTreeViewCreatorComponent implements OnInit, EIMCreatable {

	/** 属性フォーム */
	@ViewChild('attributeTreeCreatorForm', { static: true }) attributeTreeCreatorForm: NgForm;


	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラーのイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: {[key: string]: string; } = {};

	/** 分類対象 */
	public categories: string ;
	/** 分類対象 */
	private CATEGORIESDEFAULT = '0';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected AttrTreeService: EIMAttrTreeService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリービューを登録します.
	 */
	public create(): void {
		this.AttrTreeService.create(this.nameList, this.categories).subscribe(
			(data: any) => {
				this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_CREATOR);
				this.created.emit(data);
			},
			(err: any) => {
				return;
			}
		);
	}

	/**
	 * 属性ツリー登録可否を返却します.
	 * @return フォーマット登録可否
	 */
	public creatable(): boolean {
		return this.attributeTreeCreatorForm.valid
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		for (let idx = 0; idx < this.languages.length; idx++) {
			this.nameList[this.languages[idx].lang] = '';
		}
		this.categories = this.CATEGORIESDEFAULT;
	}
}
