import { Injectable, Output, Directive } from '@angular/core';
import { EventEmitter } from '@angular/core';

/**
 * ドロップファイルサービス
 */
@Directive()
@Injectable()
export class EIMDropFileService {
	/** ドロップファイルイベントエミッタ */
	@Output() dropFile: EventEmitter<any>;

	constructor() {
		this.dropFile = new EventEmitter<any[]>();
	}

	public doDropFile(files: any[]): void {
		this.dropFile.emit(files);
	}

}
