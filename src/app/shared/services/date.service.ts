import { Injectable, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { isValid, parse } from 'date-fns';

/**
 * 日時サービス
 */
@Injectable()
export class EIMDateService {
	private dateTimeFormat: string;
	private dateFormat: string;

	constructor(
			protected datePipe: DatePipe,
			protected translateService: TranslateService,
	) {
	}

	public getDateTimeString(dateTime: number): string {
		if (!dateTime) {
			return '';
		}
		let date: Date = new Date(dateTime);

		return this.getFormattedDate(date, this.translateService.instant('EIM.DATE_TIME_FORMAT'));
	}

	/**
	 * 固定フォーマットの現在日時文字列を返却します.
	 * @return 現在日時をyyyyMMddHH24MISSでフォーマットした文字列
	 */
	public getFixedCurrentDateTimeString(): string {
		let now: any = new Date();
		return this.getFormattedDate(now, 'yyyyMMddHHmmss');
	}

	/**
	 * 固定フォーマットの任意の日時文字列を返却します.
	 * @return 現在日時をyyyyMMddHH24MISSでフォーマットした文字列
	 */
	public getFixedDateTimeString(dateTime: number): string {
		if (!dateTime) {
			return '';
		}
		let date: Date = new Date(dateTime);
		return this.getFormattedDate(date, 'yyyyMMddHHmmss');
	}

	public getDateString(date: Date): string {
		if (!date || Number.isNaN(date.getTime())) {
			return '';
		}
		this.dateFormat = this.translateService.instant('EIM.DATE_FORMAT');
		return this.datePipe.transform(date, this.dateFormat);
	}

	private getFormattedDate(date: Date, fomatted: string): string {
		fomatted = fomatted.replace(/yyyy/g, '' + date.getFullYear());
		fomatted = fomatted.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
		fomatted = fomatted.replace(/dd/g, ('0' + date.getDate()).slice(-2));
		fomatted = fomatted.replace(/HH/g, ('0' + date.getHours()).slice(-2));
		fomatted = fomatted.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
		fomatted = fomatted.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
	  return fomatted;

	}

	/**
	 * 日時をソートして返却します。
	 * @return ソート結果
	 */
	public dateComparator(date1: any, date2: any) {
		let langId: string = localStorage.getItem('langId');
		if ( !date1 && !date2 ) {
		  return 0;
		}
		if ( !date1) {
		  return -1;
		}
		if ( !date2) {
		  return 1;
		}
		if (langId === 'EN' ) {
			// MM-DD-YYYY hh:mm:ss →　YYYY-MM-DD-hh:mm:ssへ変更
			date1 = date1.substring(6, 10) + '-' + date1.substring(0, 2) + '-' + date1.substring(3, 5) + date1.substring(10);
			date2 = date2.substring(6, 10) + '-' + date2.substring(0, 2) + '-' + date2.substring(3, 5) + date2.substring(10);
		}
		return date1 < date2 ? -1 : 1;
	}

	/**
	 * 日付文字列が正しいフォーマットかチェックします.
	 * フォーマットはEIM.CALENDAR.CHECK_DATE_FORMATSで指定します.
	 * @param dateString 日付文字列
	 * @returns フォーマットが正しければtrue
	 */
	public isValidDate(dateString: string): boolean {

		const date = this.getDate(dateString);

		return date !== null ? true : false;
	}

	/**
	 * 日付を返却します.
	 * @param dateString 日付文字列
	 * @returns 日付
	 */
	public getDate(dateString: string): Date {
	
		const formats: string[] = this.translateService.instant('EIM.CALENDAR.CHECK_DATE_FORMATS');

		for (const format of formats) {
			const parsedDate = parse(dateString, format, new Date());
			if (isValid(parsedDate)) {
				return parsedDate;
			}
		}
		
		return null;
	}
}