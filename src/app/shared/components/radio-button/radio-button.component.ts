import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';

@Component({
	selector: 'eim-radio-button',
	templateUrl: './radio-button.component.html',
	styleUrls: ['./radio-button.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		RadioButton,
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => EIMRadioButtonComponent),
			multi: true
		}
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	standalone: true
})
/**
 * ヘッダーコンポーネント
 * @example
 *
 *		<eim-radio-button>
 *		</eim-radio-button>
 */
export class EIMRadioButtonComponent implements ControlValueAccessor {
	innerValue:any = false;

	@Input() name: string;
	@Input() value: any;
	@Input() inputId: string;
	@Input() label: string;
	@Input() disabled:boolean;

	@Output() onClick = new EventEmitter<any>(); 

	private onChangeModel = (_: any) => { };
	public onTouched = () => { };

	constructor(){
		this.inputId = "eim-radio-button_" + this.generateRandomString(5);
	}

	writeValue(value: any): void {
		this.innerValue = value;
	}

	registerOnChange(fn: any): void {
		this.onChangeModel = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onClickHandler(event: any) {
		this.onChangeModel(this.value);

		if(this.onClick){
			this.onClick.emit(this.value);
		}
	}

	generateRandomString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}
