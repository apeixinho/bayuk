export const notFoundError = () => ({
	code:    "ERR-1000",
	title:   "Product not found",
	details: "Product with the given id doesn't exist"
});

export const fieldNotFound = field => ({
	code:    "ERR-1001",
	title:   "Products fields don't exist",
	details: `${field} field is not present`
});