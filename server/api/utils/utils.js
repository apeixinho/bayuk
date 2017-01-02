export const sendJsonResponse = (res, status, content) => {
	res.status(status);
	res.json(content);
};

export const mapArraysSequentially = (arr1 = [], arr2 = []) => {
	if (arr1.length > arr2.length) {
		[arr1, arr2] = [arr2, arr1];
	}

	return func => arr1.map((val, index) => func(val, arr2[index]));
};

export const generateImagesObjs = (ids, data) => mapArraysSequentially(ids, data)((id, data) => ({id, data}));

export const wrapDataInPromise = (dataArr, func) => {
	if (!dataArr.length) {
		return Promise.reject("No data has been passed");
	}

	return dataArr.map(data => Promise.resolve(func(data)));
};

export const isBase64 = file => file.search(/^data:image\/\w+;base64,/) !== -1;

export const paramExists = (req, param) => req.params && req.params[param];

export const dataExists = req => req && req.body;