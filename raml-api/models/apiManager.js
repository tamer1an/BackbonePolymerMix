var _ = require('lodash'),
	amanda = require('amanda'),
	Q = require('q'),
	winston = require('winston'),
	url = require('url'),
	ramlRoot,
	methodToValidate = ['post', 'put'];

var getResponse = function (ramlRoot, req) {
	debugger;
	var deffered = Q.defer();

	var contentType, basedPath, preparedPath, currentResource, currentMethod, successResponse, validationSchema, postPutReq,
		successResponseObj, currentHeaders;

	contentType = localUtils.getContentType(req);

	req.method = req.method.toLowerCase();

	// remove baseUri path
	basedPath = localUtils.removeBaseUri(req.path, ramlRoot.baseUri, ramlRoot.version);

	// prepare req path for searching
	preparedPath = localUtils.pathPrepare(basedPath);

	// find current resource in raml definitions
	currentResource = localUtils.findResource(ramlRoot, preparedPath);

	// find chosen method in raml definitions
	currentMethod = localUtils.findMethod(currentResource, req.method);

	// find success response in this resource
	successResponseObj = localUtils.findSuccessResponse(currentMethod.responses, contentType);
	successResponse = successResponseObj.body;

	// find success headers in this resource
	var headers;
	if (successResponseObj.headers) {
		headers = successResponseObj.headers;
	} else if (currentMethod.headers) {
		headers = currentMethod.headers;
	}

	currentHeaders = headers;
	//currentHeaders = successResponseObj.headers;

	// check if POST or PUT method
	postPutReq = methodToValidate.indexOf(req.method) >= 0;

	// find validation schema for request data
	validationSchema = postPutReq ? localUtils.findValidationSchema(currentMethod, contentType) : null;

	// check if sent data is valid (POST, PUT)
	if (validationSchema && _.isPlainObject(req.body)) {

		localUtils.validateJson(req.body, validationSchema, function (err) {

			var _finalRes;
			if (err) {
				_finalRes = {
					data: {
						message: err['0'].message
					},
					code: 400
				}
			} else {

				var resBody;

				var example = JSON.parse(successResponse.example);

				if (_.isObject(req.body) && _.isObject(example)) {
					resBody = _.clone(example, true);
					for (var key in req.body) {
						resBody[key] = req.body[key];
					}
				} else {
					resBody = req.body;
				}

				_finalRes = {
					data: resBody,
					code: successResponseObj.code,
					headers: currentHeaders
				}
			}
			deffered.resolve(_finalRes);
		});

	} else {
		// send response
		deffered.resolve({
			data: successResponse.example,
			code: successResponseObj.code,
			headers: currentHeaders
		});
	}

	return deffered.promise;

};

var localUtils = {

	removeBaseUri: function (path, baseUri, version) {
		if (baseUri) {
			var basePath = url.parse(baseUri).pathname.replace(/^\/?/, '/');
			versionedBasePath = basePath.replace(/{version}/, version).replace(/%7Bversion%7D/, version),
				re = new RegExp('^' + versionedBasePath),
				basedPath = path.replace(re, '/').replace(/\/\//, '/');
			return basedPath;
		} else {
			return path;
		}
	},

	pathPrepare: function (path) {
		var p = path.split('/');
		p.splice(0, 1);

		if (_.last(p) === '') {
			p.pop();
		}

		return p;
	},

	getContentType: function (req) {
		var contentType = req.header('Content-Type');
		return contentType ? contentType.split(';')[0] : null;
	},

	findResource: function (ramlRoot, preparedPath) {
		var currentResource = ramlRoot,
			elementName, nextElement, relativeUri;

		for (var i = 0, l = preparedPath.length; i < l; i++) {

			elementName = preparedPath[i];
			nextElement = _.find(currentResource.resources, function (resource) {
				relativeUri = resource.relativeUri.substring(1);
				return relativeUri === elementName;
			});

			if (!nextElement) {
				nextElement = _.find(currentResource.resources, function (resource) {
					relativeUri = resource.relativeUri.substring(1);
					return relativeUri.match(/{(.*?)}/);
				});
			}

			if (nextElement) {
				currentResource = nextElement;
				nextElement = null;
			} else {
				throw new Error('Specified path not in raml');
			}

		}

		return currentResource;
	},

	findMethod: function (resource, method) {
		var res = _.find(resource.methods, {method: method});
		if (res) {
			return res;
		} else {
			throw new Error('Specified method not in raml');
		}
	},

	findSuccessResponse: function (responses, contentType) {
		var resObj = localUtils.getFirstElem(responses),
			code = resObj.value,
			responseCode = resObj.key;

		if (!code) {
			throw new Error('Success response is not specified for this resource');
		}

		var body = code.body,
			headers = code.headers;
		if (!body) {
			throw new Error('Body is not specified for this resource');
		}

		var succ;
		if (contentType) {
			succ = body[contentType];
			if (!succ) {
				throw new Error('Content-Type ' + contentType + ' is not specified for this resource');
			}
		} else {
			succ = body['application/json'];
			if (!succ) {
				throw new Error('No data for undefined Content-Type');
			}
		}
		//TODO: Custom Headers Setting
		//headers = {
		//  'Access-Control-Allow-Origin': {example:'*'}
		//};

		return {
			body: succ,
			headers: headers,
			code: responseCode
		};
	},

	findValidationSchema: function (method, contentType) {
		return method && method.body && method.body[contentType] && method.body[contentType].schema ? JSON.parse(method.body[contentType].schema) : null;
	},

	validateJson: function (body, schema, succ) {
		var jsonSchemaValidator = amanda('json');
		jsonSchemaValidator.validate(body, schema, succ);
	},

	setCustomHeaders: function (headers, res) {
		for (var key in headers) {
			var curr = headers[key];
			res.set(key, curr.example);
		}
	},

	getFirstElem: function (obj) {
		for (var key in obj) {
			return {
				key: key,
				value: obj[key]
			}
			break;
		}
	}

}

module.exports = {

	setRamlRoot: function (raml) {
		ramlRoot = raml;
	},

	ramlMethods: function (req, res) {

		var self = this;

		try {
			getResponse(ramlRoot, req).then(function (ramlRes) {
				if (ramlRes.headers) {
					localUtils.setCustomHeaders(ramlRes.headers, res);
				}
				if (!res.get('Content-Type')) {
					res.set('Content-Type', 'application/json'); // set default content-type
				}
				res.status(ramlRes.code).send(ramlRes.data);
			});
		} catch (e) {
			winston.error(e);
			res.status(404).send({
				"message": "This resource does not exist, look into the documentation",
				"code": 40402
			});
		}

	}


};
