import { Component, Input, DoCheck, OnDestroy, IterableDiffers, ViewContainerRef, TemplateRef, forwardRef, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, ValidatorFn } from '@angular/forms';

const noop = () => {
};

/**
 * 入力フォームコンポーネントの値変更イベントエミッタの設定値
 */
export interface EIMInputFormItemComponentChangedEmitValueDomain  {
	/** 値変更イベント */
	event: any,
	/** イベントが発生した入力フォームコンポーネント */
	component: EIMInputFormItemComponent,
	/** 属性値明細キー（複数値属性のインデックス） */
	index: number,
	/** HTMLのname属性（EIMFormComponentを使用した場合は属性タイプの定義名称） */
	name: string,
	/** 入力項目の表示ラベル */
	label: string,
	/** 変更後の値（空の場合はnull） */
	currentValue: any,
	/** 変更前の値（空の場合はnull） */
	previousValue: any
};

@Component({
    selector: 'eim-input-form-item',
    templateUrl: './input-form-item.component.html',
    styleUrls: ['./input-form-item.component.css'],
    standalone: false
})
/**
 * 入力フォームコンポーネント
 */
export class EIMInputFormItemComponent implements ControlValueAccessor, DoCheck, OnDestroy {

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 名称 */
	@Input() public name = '';

	/** ラベル文言 */
	@Input() public label = '';

	/** タイプ */
	@Input() public inputType = 'text';

	/** 必須かどうか */
	@Input() public required = false;

	/** 最大入力可能バイト数 */
	@Input() public maxlength = 524288;

	/** 入力フォーマット */
	@Input() public pattern: string;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** 複数値属性かどうか */
	@Input() public multiple = false;

	/** 編集したかどうか */
	@Input() public dirty = false;

	/** 親オブジェクトID */
	@Input() public pearentObjId = '';

	/** pTooltipで表示する非省略ラベル文言が必要かどうか */
	@Input() public pTooltipLabelFlg = false;

	/** 上メッセージ */
	@Input() public topMessage = '';

	/** 下メッセージ */
	@Input() public bottomMessage = '';

	/** 左メッセージ */
	@Input() public leftMessage = '';

	/** 右メッセージ */
	@Input() public rightMessage = '';

	/** 値変更イベントエミッタ */
	@Output() public changed: EventEmitter<EIMInputFormItemComponentChangedEmitValueDomain>
			= new EventEmitter<EIMInputFormItemComponentChangedEmitValueDomain>();

	/** 入力値 */
	public value: any;

	/** pTooltipに表示する非省略ラベル文言 */
	public pTooltipLabel = '';

	// 指定した行数分、入力行を出力したい。
	// Angular2では、ループする場合、配列を渡す方法しかないため
	// 出力したい行数分の長さを持つ配列として以下を使用する。
	// また、valueを直接指定した場合、入力値を変更するたびにngForが
	// 変更を検知し、入力欄を再描画してしまう。
	// そのため、１文字入力ごとにフォーカスが外れて連続入力ができない。
	protected itemsForLoop: any[] = [];

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = false;
	/** フォームコントロール */
	public formControls: UntypedFormControl[] = [];
	/** バリデータ */
	public validators: ValidatorFn[] = [];
	/** 値変更検知 */
	protected differ: any;
	/** 初期化済みかどうか */
	protected initialized = false;

	/**
	 * コンストラクタです.
	 */
	constructor(protected differs: IterableDiffers) {
		this.differ = differs.find([]).create(null);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 値
	 * @param initValue 複数コンポーネントで未入力の場合に設定する初期値
	 */
	public writeValue(value: any, initValue?: any) {
		if (value === undefined) {
			return;
		}

		if (value == null) {
			this.value = [];
		} else if (Array.isArray(value)) {
			this.value = value;
		} else {
			this.value = [value];
		}

		if (!this.isSingleFormControl) {
			// 複数コンポーネント表示する可能性がある場合は、空[]だと1行目が表示できない
			// 値を入れることで表示されるようになる
			if (this.value.length === 0) {
				if (initValue) {
					this.value.push(initValue);
				} else {
					this.value.push('');
				}
			}
		}

		if (this.value.length !== this.itemsForLoop.length) {
			this.itemsForLoop.splice(0, this.itemsForLoop.length);
			for (let i = 0; i < this.value.length; i++) {
				this.itemsForLoop.push({});
			}
		}

		if (!value) {
			return;
		}
		this.setValidators();

		this.addFormControl(this.value);
	}

	/**
	 * 値変更時のハンドラを登録します.
	 * 本コンポーネントでは何も登録しません.
	 * ControlValueAccessorの実装です.
	 */
	public registerOnChange(fn: (value: any) => void) {
	}

	/**
	 * タッチ時のハンドラを登録します.
	 * 本コンポーネントでは何も登録しません.
	 * ControlValueAccessorの実装です.
	 */
	public registerOnTouched(fn: any) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 値変更検出時のハンドラです.
	 * dirtyフラグを立てます.
	 */
	ngDoCheck() {
		const change = this.differ.diff(this.value);
		if (change === null) {
			this.initialized = true;
			return;
		}
		if (this.value === undefined) {
			this.initialized = true;
			return;
		}
		if (this.initialized) {
			// 値のペースト時用にdirtyにします
			window.setTimeout(() => {
				if (!this.isChangedValue()) {
					return;
				}
				this.removeFormControls();
				this.addFormControl(this.value);

				for (let i = 0; i < this.formControls.length; i++) {
					this.formControls[i].markAsDirty();
				}

				// 画面表示用のitemsForLoopを初期化
				if (this.value.length === this.itemsForLoop.length) {
					return;
				}
				this.itemsForLoop.splice(0, this.itemsForLoop.length);
				for (let i = 0; i < this.value.length; i++) {
					this.itemsForLoop.push({});
				}
				if (this.itemsForLoop.length === 0) {
					this.itemsForLoop.push({});
				}
			});
		}
		this.initialized = true;
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.form) {
			return;
		}

		this.removeFormControls();
	}

	/**
	 * ペースト時のイベントハンドラです.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onPaste(event: any, index: number): void {
		// ペーストしたら修正済み扱いにする
		this.formControls[index].markAsDirty();
	}

	/**
	 * キープレス時のイベントハンドラです.
	 * IME OFFの場合のみハンドルします.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onKeyPress(event: any, index: number): void {
		// キープレスしたら修正済み扱いにする
		this.formControls[index].markAsDirty();
	}

	/**
	 * キーダウン時のイベントハンドラです.
	 * IME ON/OFF どちらの場合もハンドルします.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onKeyDown(event: any, index: number): void {
		// 入力したキーの情報を取得.
		let keys = event.key;

		// backspaseとdeleteキーの場合のみdirtyを付与.
		if ( keys === "Backspace" || keys === "Delete" ) {
			this.formControls[index].markAsDirty();
		}
	}

	/**
	 * IME入力開始時のイベントハンドラです.
	 * IME ONの場合のみハンドルします.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onCompositionStart(event: any, index: number): void {
		// IME入力を開始したら修正済み扱いにする
		this.formControls[index].markAsDirty();
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		let prevValue = this.value[index];

		this.value[index] = event.currentTarget.value;
		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

	/**
	 * フォーカスアウト時のイベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onFocusOut(event, index) {
		// フォーカスが外れたら修正済み扱いにする
		this.formControls[index].markAsDirty();
	}

	/**
	 * プラスクリック時のハンドラです。
	 * 該当入力行の直下に新しい入力行を挿入します。
	 * @param index プラスボタンをクリックした同一属性値入力内の行のインデックス
	 */
	onPlusClick(index: number) {
		this.value.splice(index + 1, 0, null);
		let formControl = new UntypedFormControl(this.value[index + 1], Validators.compose(this.validators));
		this.formControls.splice(index + 1, 0, formControl);

		// フォームに追加する際、既存のインデックスを含むキーを更新する
		let prefix: string = this.name + '_';
		let keys: string[] = this.getFormControlKeysByPrefix(prefix);
		keys.sort(function(a, b) {
			if ( Number(a) > Number(b) ) { return -1 };
			if ( Number(a) < Number(b) ) { return 1 };
			return 0;
		});
		for (let i = 0; i < keys.length; i++) {
			let preIndex: number = Number(keys[i].slice(prefix.length));
			if (preIndex > index) {
				// 追加する位置より下のkeyを更新する
				this.form.setControl(prefix + (preIndex + 1), this.form.controls[prefix + preIndex]);
				this.form.removeControl(prefix + preIndex);
			}
		}
		this.form.addControl(prefix + (index + 1), formControl);

		// 更新を通知するためdirtyを設定
		for (let i = 0; i < this.formControls.length; i++) {
			if (this.formControls[i].value) {
				this.formControls[i].markAsDirty();
			}
		}

		this.itemsForLoop.push({});
	}

	/**
	 * マイナスクリック時のハンドラです。
	 * 該当入力行を削除します。
	 * 同一属性値内の各フォームはdirty扱いとなります。
	 * @param index マイナスボタンをクリックした同一属性値入力内の行のインデックス
	 */
	onMinusClick(index: number) {
		if (this.value.length > 1) {
			// コントローラ入れ替え
			let prefix: string = this.name + '_';
			for (let i = 0; i < this.value.length; i++) {
				if (index < i) {
					this.form.setControl(prefix + (i - 1), this.form.controls[prefix + i]);
				}
			}
			this.form.removeControl(prefix + (this.value.length - 1));

			this.value.splice(index, 1);

			this.formControls.splice(index, 1);
			// 更新を通知するためdirtyを設定
			for (let i = 0; i < this.formControls.length; i++) {
				if (this.formControls[i].value) {
					this.formControls[i].markAsDirty();
				}
			}
			this.itemsForLoop.pop();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 必須、パターンのバリデータを設定します.
	 */
	protected setValidators(): void {
		if (this.required) {
			this.addValidators(this.requiredValidatorFn());
		}

		if (this.pattern) {
			this.addValidators(this.patternValidatorFn());
		}
	}

	/**
	 * 必須バリデータ関数を返却します.
	 * @return 必須バリデータ関数
	 */
	protected requiredValidatorFn(): ValidatorFn {
		return Validators.required;
	}

	/**
	 * パターンバリデータ関数を返却します.
	 * @return パターンバリデータ関数
	 */
	protected patternValidatorFn(): ValidatorFn {
		return Validators.pattern(this.pattern);
	}

	/**
	 * バリデータを追加します.
	 * @param validator 追加するバリデータ
	 */
	protected addValidators(validator: ValidatorFn): void {
		this.validators.push(validator);
	}

	/**
	 * フォームから該当属性のフォームコントローラのキー一覧を返却します.
	 * @param prefix キーの接頭辞
	 * @return フォームコントローラのキー一覧
	 */
	protected getFormControlKeysByPrefix(prefix: string): string[] {
		let retKeys: string[] = [];

		let allKeys: string[] = Object.keys(this.form.controls);
		for (let i = 0; i < allKeys.length; i++) {
			if (allKeys[i].startsWith(prefix)) {
				retKeys.push(allKeys[i]);
			}
		}
		return retKeys;
	}

	/**
	 * フォームコントロールを追加します.
	 * @param value 入力値
	 */
	protected addFormControl(value: any[]): void {
		if (this.isSingleFormControl) {
			// コンストラクタでvalidatorを指定するとバリデータが動作してしまうため
			// formControlに拡張プロパティindexを設定した後にvalidatorを設定する
			// indexは、EIMCalendarInputFormItemComponentにて使用している
			const formControl = new UntypedFormControl(this.value);
			formControl['index'] = 0;

			// バリデータ設定 & 実行
			formControl.setValidators(Validators.compose(this.validators))
			this.formControls.push(formControl);
			formControl.updateValueAndValidity();

			// コントローラをフォームに追加
			if (this.form) {
				this.form.addControl(this.name, formControl);
			}
			if (this.dirty) {
				formControl.markAsDirty();
			}
		} else {
			for (let i = 0; i < value.length; i++) {
				// コンストラクタでvalidatorを指定するとバリデータが動作してしまうため
				// formControlに拡張プロパティindexを設定した後にvalidatorを設定する
				// indexは、EIMCalendarInputFormItemComponentにて使用している
				const formControl = new UntypedFormControl(this.value[i]);
				formControl['index'] = i;

				// バリデータ設定 & 実行
				formControl.setValidators(Validators.compose(this.validators))
				this.formControls.push(formControl);
				formControl.updateValueAndValidity();

				if (this.form) {
					this.form.addControl(this.name + '_' + i, formControl);
				}
				if (this.dirty) {
					formControl.markAsDirty();
				}
			}
		}
	}

	/**
	 * フォームコントロールを削除します.
	 */
	protected removeFormControls(): void {
		if (this.isSingleFormControl) {
			this.form?.removeControl(this.name);
		} else {
			for (let i = 0; i < this.value.length; i++) {
				this.form?.removeControl(this.name + '_' + i);
			}
		}
		this.formControls = [];
	}

	/**
	 * 値が変更されたかどうかを返却します.
	 * @return 変更された場合true
	 */
	protected isChangedValue(): boolean {
		if (this.value.length !== this.formControls.length) {
			return true;
		}

		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i] !== this.formControls[i].value) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 文字列のバイト数を数えます
	 * @param str 計算する文字列
	 * @return 文字列のバイト数
	 */
	protected strBytesLength(str: string): number {
		let len = 0;
		let strEncode = encodeURI(str);
		for (let i = 0; i < strEncode.length; i++, len++) {
			let encodeCharAt = strEncode.charAt(i);
			if (encodeCharAt === '%') {
				i += 8;
				len++;
			}
		}
		return len;
	}

	/**
	 * 値変更時のイベント発行時にハンドラに渡す値を生成します.
	 *
	 * @param component 入力フォームコンポーネント
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 * @param prevValue 変更前の値
	 * @returns 値変更時のイベント発行時にハンドラに渡す値 @see {@link EIMInputFormItemComponentChangedEmitValueDomain}
	 */
	protected createChangedEmitValue(component: EIMInputFormItemComponent,
			event: any, index: number, prevValue: any): EIMInputFormItemComponentChangedEmitValueDomain {

		return {
			component: component,
			event: event, index: index,
			name: this.name, label: this.label,
			currentValue: this.value[index] !== '' ? this.value[index] : null,
			previousValue: prevValue !== '' ? prevValue : null
		};
	}
}
