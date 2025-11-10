import { Injectable } from '@angular/core';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMContentsAttributeTypeLayoutDomain } from 'app/documents/shared/domains/contents-attribute-type-layout.domain';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMContentsAttributeDomain } from 'app/documents/shared/domains/contents-attribute.domain';
import { SelectItem } from 'primeng/api';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

export enum EIMCheckAllPropertyState {
	some,
	all,
	nothing
}
/**
 * コンテンツプロパティサービス.
 */
@Injectable()
export class EIMContentsPropertyService {

	constructor(
		protected translateService: TranslateService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
		protected domainService: EIMDomainService,
	) {}

	/**
	 * すべて選択/すべて解除チェックON/OFFを変更します.
	 * @param attributeList 属性情報リスト
	 * @param check チェック（ON:true,OFF:false）
	 */
	public checkAllProperty(attributeList: EIMAttributeDomain[], check: boolean) {
		for (let i = 0; i < attributeList.length; i++) {
			attributeList[i]['_copyTarget'] = check;
		}
	}

	/**
	 * すべて選択/すべて解除チェックの選択状態を返却します.
	 * @param attributeList 属性情報リスト
	 * @return すべて選択/すべて解除チェックの状態(-1：チェックなし 0:一部チェックあり: )
	 */
	public getAllcheckFlg(attributeList: EIMAttributeDomain[]): EIMCheckAllPropertyState {
		let checkedCount = 0
		let dataCount = 0;
		for (let i = 0; i < attributeList.length; i++) {
			// コピー対象の場合
			if (attributeList[i]['_enableCopy']) {
				dataCount++;
				if (attributeList[i]['_copyTarget']) {
					checkedCount++;
				}
			}
		}

		if (checkedCount === dataCount) {
			return EIMCheckAllPropertyState.all;
		} else if (checkedCount === 0) {
			return EIMCheckAllPropertyState.nothing;
		} else {
			return EIMCheckAllPropertyState.some
		}
	}

	/**
	 * プロパティタブのコピー対象属性値を一次領域にコピーします.
	 * @param attributeList 属性情報リスト
	 */
	public copyAttribute(attributeList: EIMAttributeDomain[], attributeTypeLayoutList: any[] = []) {
		let copyTarget: any[] = [];
		for (let i = 0; i < attributeList.length; i++) {

			// リストの場合のコードタイプ取得
			let codeType;
			for (let j = 0; j < attributeTypeLayoutList.length; j++) {
				if (attributeTypeLayoutList[j].id === attributeList[i].attributeType.id) {
					codeType = attributeTypeLayoutList[j].codeType;
					break;
				}
			}

			// コピー対象（チェックボックスOFF）の場合は対象外
			if (!attributeList[i]['_copyTarget']) {
				continue;
			}

			if (attributeList[i].attributeType.valueType === EIMConstantService.VALUE_TYPE_NAME_DATE) {
				// 日付の場合セッションに入れる際、文字列に変換され、再び日付に変換できないため
				// msecにて保持する
				let valueList = attributeList[i].getValueList();
				let dateTimes: number[] = [];
				for (let j = 0; j < valueList.length; j++) {
					if (!valueList[j]) {
						continue;
					}
					dateTimes.push(valueList[j].getTime());
				}
				copyTarget.push({
					attributeTypeId: attributeList[i].attributeType.id,
					valueType: attributeList[i].attributeType.valueType,
					valueList: dateTimes
				});
			} else if (codeType) {
				// リストの場合
				let selectedCodeList = [];
				let values = attributeList[i].getValueList();

				// 選択されているコード取得
				for (let j = 0; j < values.length; j++) {
					for (let k = 0; k < codeType.codeList.length; k++) {
						if (values[j].code === codeType.codeList[k].code) {
							selectedCodeList.push(codeType.codeList[k]);
							break;
						}
					}
				}

				copyTarget.push({
					attributeTypeId: attributeList[i].attributeType.id,
					valueType: 'CODE',
					valueList: selectedCodeList
				});
			} else {
				copyTarget.push({
					attributeTypeId: attributeList[i].attributeType.id,
					valueType: attributeList[i].attributeType.valueType,
					valueList: attributeList[i].getValueList()
				});
			}
		}
		this.documentSessionStorageService.setCopyTagetAttribute(copyTarget);
	}

	/**
	 * 一次領域の属性値があるかを返却します.
	 * @return 一次領域の属性値有無
	 */
	public isAblePasteAttribute(): boolean {
		let copyTarget: any[] = this.documentSessionStorageService.getCopyTagetAttribute();
		if (!copyTarget || copyTarget.length === 0) {
			// ペースト対象がない場合は対象外
			return false;
		}
		return true;
	}

	/**
	 * ペースト対象属性値に一次領域の属性値をペーストします.
	 * @param attributeList 属性情報リスト
	 */
	public pasteAttribute(attributeList: EIMAttributeDomain[]) {
		let copyTarget: any[] = this.documentSessionStorageService.getCopyTagetAttribute();
		if (!copyTarget || copyTarget.length === 0) {
			// ペースト対象がない場合は対象外
			return;
		}
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];

			// コピー対象（チェックボックスOFF）の場合は対象外
			if (!attribute['_copyTarget']) {
				continue;
			}

			// 上位に下位引継ぎが設定されている属性項目は対象外
			if (attribute['_successionFlag']) {
				continue;
			}

			for (let j = 0; j < copyTarget.length; j++) {
				if (attribute.attributeType.id !== copyTarget[j].attributeTypeId) {
					continue;
				}
				if (attributeList[i].attributeType.valueType === EIMConstantService.VALUE_TYPE_NAME_DATE) {
					// 日付の場合は変換が必要
					let valueList: any[] = copyTarget[j].valueList;
					let dates: Date[] = [];
					for (let k = 0; k < valueList.length; k++) {
						if (isNaN(valueList[k])) {
							// コピー時に下位引き継ぎ設定されているとサーバから文字列型として返却される
							// そのため表示文字列が設定されている可能性がある
							dates.push(this.domainService.convertDateZero(valueList[k]));
						} else {
							let date: Date = new Date();
							date.setTime(valueList[k]);
							dates.push(date);
						}
					}
					attribute.setValueList(dates);
				} else {
					attribute.setValueList(copyTarget[j].valueList);
				}
				break;
			}
		}
	}

	/**
	 * 下位引継ぎ一覧対象属性情報リストを返却します.
	 * 引継ぎ情報かどうかを属性情報に追加設定します.
	 * @param layoutAndAttributeList レイアウトと属性情報リスト
	 * @return 下位引継ぎ一覧対象属性情報リスト
	 */
	public getAttributeListForLowSuccess(layoutAndAttributeList: any[], disabled?: boolean): EIMAttributeDomain[] {
		let retData: EIMAttributeDomain[] = [];

		for (let i = 0; i < layoutAndAttributeList.length; i++) {
			let attribute: EIMAttributeDomain = layoutAndAttributeList[i].attribute;
			let attributeTypeLayout: EIMContentsAttributeTypeLayoutDomain = layoutAndAttributeList[i].attributeTypeLayout;

			if (attribute.attributeType.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_PROPERTY ||
				attribute.attributeType.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_EXPIREDATE) {
					// プロパティ、有効期限は下位引継ぎの対象外
				continue;
			}

			if (disabled) {
				attribute['disabled'] = disabled;
			} else {
				attribute['disabled'] = attributeTypeLayout.successionFlag;
			}

			// 引継ぎ情報かどうかを属性情報に追加設定
			attribute['_successionFlag'] = attributeTypeLayout.successionFlag;

			retData.push(attribute);
		}
		return retData;
	}

	/**
	 * 名前割当表示リストを返却します.
	 * @param attributeLayoutList 属性タイプレイアウト情報リスト
	 */
	public createNameAllocationSelectItemList(attributeTypeList: any[],
			attributeLayoutList: EIMContentsAttributeTypeLayoutDomain[]): SelectItem[] {
		let nameAllocations: any[] = [];

		// 名称割当に"名称割当なし"を追加
		nameAllocations.push({
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03107'),
			value: -1,
		});

		// 名称割当、下位引継一覧を生成する
		for (let i = 0; i < attributeLayoutList.length; i++) {
			let attributeTypeLayout: EIMContentsAttributeTypeLayoutDomain = attributeLayoutList[i];

			// 表示フラグがfalseの場合は対象外
			if (!attributeTypeLayout.visible) {
				continue;
			}

			// プロパティ、有効期限は対象外
			if (attributeTypeLayout.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_PROPERTY ||
				attributeTypeLayout.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_EXPIREDATE) {
				continue;
			}

			// リスト型及び文字列型以外は対象外
			if (attributeTypeLayout.uiControlId !== 'uIControlComboBox' &&
					(attributeTypeLayout.uiControlId !== 'uIControlTextInput' || attributeTypeLayout.valueType !== 'STRING')
			) {
				continue;
			}

			// 複数値は対象外
			if (attributeTypeLayout.multiple === true) {
				continue;
			}

			// リスト型の場合は、リスト値の属性をチェック
			if (attributeTypeLayout.uiControlId === 'uIControlComboBox') {
				let check = false;
				for (let j = 0; j < attributeTypeList.length; j++) {
					let attributeType = attributeTypeList[j];
					if (Number(attributeType.attTypeId) === attributeTypeLayout.id) {
						if (attributeType.valTypeId === '2') {
							check = true;
							break;
						}
					}
				}
				if (!check) {
					continue;
				}
			}

			// 下位引継ぎ設定されているかをチェック
			if (attributeTypeLayout.successionFlag) {
				continue;
			}

			// 名称割当に追加
			let index = nameAllocations.push({
				label: attributeTypeLayout.name,
				value: attributeTypeLayout.id,
			});
		}
		return nameAllocations;
	}

	/**
	 * 名称割当選択済みの属性を返却します.
	 * @param attributeList 属性情報リスト
	 */
	public getSelectedNameAllocationAttributeTypeId(
			attributeList: EIMContentsAttributeDomain[]): number {
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMContentsAttributeDomain = attributeList[i];

			if (attribute.attributeType.definitionName !== EIMDocumentsConstantService.ATTRIBUTE_TYPE_FOLDER_TO_ASSIGN_NAME) {
				// 名称割当属性以外は対象外
				continue;
			}

			if (!attribute.longList || attribute.longList.length === 0) {
				// 名称割当の設定がない場合
				return -1;
			}

			return attribute.longList[0];
		}
		// 名称割当属性がない場合
		return -1;
	}
}
