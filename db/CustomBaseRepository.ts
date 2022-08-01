import {
	AnyEntity,
	EntityRepository,
	FindOneOptions,
	wrap,
} from "@mikro-orm/core";
import { FilterQuery } from "@mikro-orm/core/typings";

export class CustomBaseRepository<
	T extends AnyEntity<T>
> extends EntityRepository<T> {
	async upsert(
		data: any,
		where: FilterQuery<T>,
		options?: FindOneOptions<T> | undefined
	) {
		let e = await this.findOne(where, options);

		if (e) {
			wrap(e).assign(data);
		} else {
			// @ts-ignore
			e = this.create(data);
		}

		// @ts-ignore
		await this.persistAndFlush(e);

		return e;
	}
}
