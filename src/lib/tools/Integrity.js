/**
 * @param {any} data
 * @param {any} schema
 * @param {boolean} filtered
 */
function formCheck(data, schema, filtered = false) {
	const copyData = data;

	for (const key of Object.keys(schema)) {
		if (
			!(key in data) ||
			(schema[key] == 'array' && !Array.isArray(data[key])) ||
			(schema[key] == 'number' && !Number.isFinite(data[key])) ||
			typeof data[key] != schema[key]
		) {
			if (filtered) delete copyData[key];
			else return false;
		}
	}

	return filtered ? copyData : true;
}

export { formCheck };
