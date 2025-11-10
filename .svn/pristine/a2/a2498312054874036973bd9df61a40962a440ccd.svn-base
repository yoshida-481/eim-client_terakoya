import { Injectable, Output, Directive } from '@angular/core';
import { EventEmitter } from '@angular/core';

export interface EIMMessage {
	msgType?: EIMMessageType;
	msg?: string;
	targetList?: string[];
	contents?: string[];
	isGrowl?: boolean;
	isMultipleLines?: boolean;
	accept?(): void;
	reject?(): void;
	chkmsg?: string,
	chkCheckbox?: boolean,
	changeCheck?: (V: boolean) => void,
}
export enum EIMMessageType {
	confirm,
	info,
	warn,
	error
}

/**
 * メッセージサービス
 */
@Directive()
@Injectable()
export class EIMMessageService {
	@Output() addMessage: EventEmitter<EIMMessage>;

	constructor() {
		this.addMessage = new EventEmitter<EIMMessage>();
	}

	public show(msgType: EIMMessageType, msg: string, accept?: () => void, reject?: () => void): void {
		this.addMessage.emit({msgType: msgType, msg: msg, isGrowl: false, accept: accept, reject: reject});
	}

	public showMultipleLines(msgType: EIMMessageType, msg: string, targetList: string[], accept?: () => void, reject?: () => void): void {
		this.addMessage.emit({msgType: msgType, msg: msg, targetList: targetList, isMultipleLines: true, isGrowl: false, accept: accept, reject: reject});
	}

	public showContents(msgType: EIMMessageType, msg: string, contents: string[], accept?: () => void, reject?: () => void): void {
		this.addMessage.emit({msgType: msgType, msg: msg, contents: contents, isGrowl: false, accept: accept, reject: reject});
	}

	public showGrowl(msg: string): void {
		this.addMessage.emit({msg: msg, isGrowl: true});
	}

	public showCheckBox(msgType: EIMMessageType, msg: string, chkmsg: string, changeCheck: (V: boolean) => void, accept?: () => void, reject?: () => void): void {
		this.addMessage.emit({msgType: msgType, msg: msg, chkmsg: chkmsg, changeCheck: changeCheck, isGrowl: false, accept: accept, reject: reject});
	}

	public showCheckBoxAndContents(msgType: EIMMessageType, msg: string, contents: string[], chkmsg: string, changeCheck: (V: boolean) => void, accept?: () => void, reject?: () => void): void {
		this.addMessage.emit({msgType: msgType, msg: msg, contents: contents, chkmsg: chkmsg, changeCheck: changeCheck, isGrowl: false, accept: accept, reject: reject});
	}
}
