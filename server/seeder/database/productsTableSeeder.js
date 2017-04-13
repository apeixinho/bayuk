import {addProductWithAllFields} from "../../api/services/products";
import faker from "faker";
import {sample} from "lodash/collection";
import {times} from "lodash/util";
import {MAX_PRODUCTS, categories} from "../config";
import {wrapDataInPromise} from "../../../utils/utils";

export const getProduct = userId => ({
	uuid:        faker.random.uuid(),
	owner:       userId,
	name:        faker.random.words(),
	description: faker.lorem.sentences(),
	category:    sample(categories),
	price:       faker.random.number(500),
	createdAt:   faker.date.recent(),
	sold:        faker.random.boolean()
});

const addAllProductsToDB = products => Promise.all(wrapDataInPromise(products, addProductWithAllFields));

export default users => {
	const userIds  = Array.from(users, ({id}) => id),
				products = times(MAX_PRODUCTS, getProduct.bind(void 0, sample(userIds)));

	return addAllProductsToDB(products)
		.then(() => products);
};