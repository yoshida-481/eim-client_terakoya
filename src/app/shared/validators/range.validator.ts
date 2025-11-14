import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * 入力値が範囲内であることを検証します.<br>
 * 他の入力コンポーネントの入力値と比較する場合はEIMFormのchangedイベントハンドラにて、updateValueAndValidity()を呼び出してください.<br>
 * <br>
 * 例）終了予定日にcreateRangeValidatorを設定する場合、開始予定日を変更して範囲内となっても、終了予定日を更新していないためinValidの状態となったままとなる.<br>
 * 　　その場合は開始予定日のchangedイベントハンドラにて、終了予定日の手動更新が必要となる.<br>
 * <br>
 * 		<pre>
 * 		// 終了予定日
 *		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
 *			name: 'endYoteiDate', label: this.translateService.instant('EIM_TASKS.LABEL_02015'),
 *			value: this.endYoteiDate,
 *			validators: [
 *				createRangeValidator(this.startYoteiDate, null, true)
 *			]
 *		}));
 *		</pre>
 * 
 * 		onChange(event): void {
 * 			if (emitValue.name === 'startYoteiDate') {
 * 				// ※ "_0"を忘れないこと
 *				this.form.controls['endYoteiDate_0']?.updateValueAndValidity();
 *			}
 *		}
 * 
 * 
 * @param startValue 開始値
 * @param endValue 終了値
 * @param containStartEqual 開始値と等価を含めるかどうか
 * @param containEndEqual 終了値と等価を含めるかどうか
 * @returns 範囲内ではない場合、"range"を設定したValidationErrorsを返却
 */
export function createRangeValidator(startValue: any[] = null, endValue: any[] = null, containStartEqual: boolean = false, containEndEqual: boolean = false): ValidatorFn {
	return (control:AbstractControl) : ValidationErrors | null => {

		const value = control.value;
		let leftValue = startValue === null || startValue.length === 0 ? null : startValue[0] === '' ? null : startValue[0];
		let rightValue = endValue === null || endValue.length === 0 ? null : endValue[0] === '' ? null : endValue[0];
		let targetValue = value === '' ? null : value;

		if (targetValue === null) {
			return null;
		}

		// 日付の場合はtimeを使用して比較する
		if (leftValue !== null && leftValue instanceof Date) {
			leftValue = leftValue.getTime();
		}
		if (rightValue !== null && rightValue instanceof Date) {
			rightValue = rightValue.getTime();
		}
		if (value instanceof Date) {
			targetValue = targetValue.getTime();
		}

		let isValid = true;
		if (leftValue !== null) {
			const sub = targetValue - leftValue;
			if (containStartEqual && sub < 0) {
				isValid = false;
			}
			if (!containStartEqual && sub <= 0) {
				isValid = false;
			}
		}
		if (rightValue !== null) {
			const sub = rightValue - targetValue;
			if (containEndEqual && sub < 0) {
				isValid = false;
			}
			if (!containEndEqual && sub <= 0) {
				isValid = false;
			}
		}

		// 未入力でも赤枠を表示するためにDirty扱いにする
		if (!isValid) {
			control.markAsDirty();
		}
		return isValid ? null : { range: true };
	}
}