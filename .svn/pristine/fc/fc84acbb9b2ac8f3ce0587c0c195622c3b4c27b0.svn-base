import {Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import {EIMComponent, EIMUpdatable} from 'app/shared/shared.interface';
import {EIMConstantService} from 'app/shared/services/constant.service';
import {EIMLocalStorageService} from 'app/shared/services/apis/local-storage.service';
import {EIMAttrTreeService} from 'app/admins/shared/services/apis/attributeTreeView.service'
import {EIMAttrTreeUpdateDTO} from 'app/admins/shared/dtos/attrTreeUpdate.dto';

/**
 * 属性ツリービュー更新コンポーネント
 * @example
 *
 *      <eim-format-updator
 *          [attrId]="attrId"
 *      </eim-format-updator>
 */
@Component({
    selector: 'eim-attribute-tree-view-updator',
    templateUrl: './attribute-tree-view-updator.component.html',
    styleUrls: ['./attribute-tree-view-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeTreeViewUpdatorComponent) }
    ],
    standalone: false
})

export class EIMAttributeTreeViewUpdatorComponent implements OnInit, EIMUpdatable {

	/** 属性フォーム */
	@ViewChild('attributeTreeUpdatorForm', { static: true }) attributeTreeUpdatorForm: NgForm;

	/** 属性ID */
	@Input() attrId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラーのイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 分類対象 */
	public Categories: string;

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected AttrTreeService: EIMAttrTreeService,
			protected localStorageService: EIMLocalStorageService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリービューを更新します.
	 */
	public update(): void {

		this.AttrTreeService.update(this.attrId, this.nameList, this.Categories).subscribe(
			(data: any) => {
				this.updated.emit(data);
			},
			(err: any) => {
				return;
			}
		);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリー更新可否を返却します.
	 * @return フォーマット更新可否
	 */
	public updatable(): boolean {
		return this.attributeTreeUpdatorForm.dirty && this.attributeTreeUpdatorForm.valid
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
		this.AttrTreeService.get(this.attrId).subscribe(
			(data: EIMAttrTreeUpdateDTO) => {
				for (let idx = 0; idx < data.lang.length; idx++) {
					this.nameList[data.lang[idx].attr.otherLId] = data.lang[idx].attr.otherName;
				}
				this.Categories = data.classifyTarget;
			}
		);
	}
}
