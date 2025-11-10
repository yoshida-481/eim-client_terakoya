import { Pipe, PipeTransform } from '@angular/core';

/**
 * アクセスロールパイプ
 */
@Pipe({
    name: 'eimContentsAccessRolePipe',
    standalone: false
})
export class EIMContentsAccessRolePipe implements PipeTransform {
	transform(items: any[], filter: Object): any {
		if (!items) {
			return items;
		}

		return items.filter( (item) => {
			if (item.roleId == '11' || item.roleId == '41' || item.roleId == '500' || item.roleId == '12') {
				return true;
			}
		});

	}
}
