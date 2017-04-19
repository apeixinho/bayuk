export const notFoundError = () => ({
	code:    "ERR-1000",
	title:   "Product not found",
	details: "Product with the given id doesn't exist"
});

export const invalidProduct = (field = "Product", message) => ({
		code: "ERR-1001",
		title: "Product data is invalid",
		details: `${field.length ? field : "Product"} ${message}`
	});
