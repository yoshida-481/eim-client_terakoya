import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Checkbox  } from 'primeng/checkbox';

@Component({
	selector: 'eim-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		Checkbox,
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => EIMCheckBoxComponent),
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
 *		<eim-checkbox>
 *		</eim-checkbox>
 */
export class EIMCheckBoxComponent implements ControlValueAccessor {
	innerValue:any = false;

	@Input() name: string;
	@Input() inputId: string;
	@Input() label: string;
	@Input() binary: Boolean;
	@Input() disabled:boolean;
	@Input() value: any;

	@Output() onChange = new EventEmitter<any>(); 

	private onChangeModel = (_: any) => { };
	public onTouched = () => { };

	constructor(){
		this.inputId = "eim-checkbox_" + this.generateRandomString(5);
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

	onChangeHandler(event: any) {
		this.innerValue = event.checked;

		this.onChangeModel(this.innerValue);

		if(this.onChange){
			this.onChange.emit(this.innerValue);
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
