const express = require('express')
const fs = require('fs')
const path = require('path')
const csv = require('csv')
const request = require("request")
const Promise = require("bluebird")
const _ = require('underscore');

const router = express.Router()

const config = loadDynamicConfig()
const rootURL = "https://docs.google.com/spreadsheets/d/" + config.spreadsheets_id + "/export?format=csv&id=" + config.spreadsheets_id + "&gid="

function GoogleDocToJson(gid, name, list) {
	return new Promise(function (resolve, reject) {
		const url = rootURL + gid
		request({
			url: url,
			json: true
		}, function (error, response, body) {
			const headerStart = 0
			const dataStart = 1

			var outJson = []

			if (!error && response.statusCode === 200) {

				csv.parse(body, function (err, data) {
					var keyMap = []
					var header = data[headerStart]

					for (var i = 0; i < header.length; i++) {
						var key = header[i].trim()
						if (key.length > 0 && !key.startsWith("*")) {
							keyMap[i] = key.toString().replace(/\n/g, '')
						}
					}

					for (var i = dataStart; i < data.length; i++) {
						var currentRow = data[i]
						var currentJson = {}

						// skip for no id field
						if (currentRow[0].trim().length == 0) {
							continue
						}

						for (var k = 0; k < keyMap.length; k++) {
							if (keyMap[k] == undefined) {
								continue
							}
							var currentValue = currentRow[k].trim().toString().replace(/\n/g, '')

							if (!isNaN(parseFloat(currentValue)) && isFinite(currentValue)) {
								currentJson[keyMap[k]] = Number(currentValue)
							} else if (currentValue.startsWith("[")) {
								currentJson[keyMap[k]] = eval(currentValue)
							} else if (currentValue.startsWith("{")) {
								currentJson[keyMap[k]] = JSON.parse(currentValue)
							} else if (currentValue.startsWith("[ARRAY]")) {
								currentJson[keyMap[k]] = eval(currentValue.replace('[ARRAY]', ''))
							} else {
								currentJson[keyMap[k]] = currentValue
							}
						}
						outJson.push(currentJson)
					}

					result = {}
					if (list) {
						result[name] = outJson
					} else {
						result[name] = outJson[0]
					}
					resolve(result)

				})
			} else {
				reject(error)
			}

		})
	})
}

function GoogleDocToValueList(gid, name, colName) {
	return new Promise(function (resolve, reject) {
		const url = rootURL + gid
		request({
			url: url,
			json: true
		}, function (error, response, body) {
			const headerStart = 0
			const dataStart = 1

			var outJson = []

			if (!error && response.statusCode === 200) {

				csv.parse(body, function (err, data) {
					var keyMap = []
					var header = data[headerStart]
					var col = header.indexOf(colName)

					for (var i = dataStart; i < data.length; i++) {
						var value = parseInt(data[i][col])
						outJson.push(value)
					}

					result = {}
					result[name] = outJson
					resolve(result)

				})
			} else {
				reject(error)
			}

		})
	})
}

function loadDynamicConfig() {
	var config = null
	try {
		config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json')))
	} catch (err) {
		config = {}
	}
	return config
}

router.get('/', function (req, res, next) {
	return res.send('Google Spreadsheet Database')
})

router.get('/data/all', function (req, res, next) {
	if (!CheckWhitelistIP(req)) {
		res.status(401).json({ error: 401 })
		return
	}

	api = []
	try {
		const configJson = loadDynamicConfig()
		const googleConfig = configJson.google_config
		googleConfig.forEach(element => {
			if (element.is_value_list == true) {
				api.push(GoogleDocToValueList(element.gid, element.name, element.name))
			} else {
				useList = true
				if (element.is_dict == true) {
					useList = false
				}
				api.push(GoogleDocToJson(element.gid, element.name, useList))
			}
		})
	} catch (err) {
		res.err(err)
		return
	}

	Promise.all(api)
		.then(function (responses) {
			result = {}
			responses.forEach(element => {
				_.extend(result, element)
			})
			res.send(result)
		})
		.catch(function (error) {
			res.status(500).send("Parsing Error " + error)
		})
})

function GetRemoteIP(req) {
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}

function CheckWhitelistIP(req) {
	return req.app.whitelist_ip.indexOf(GetRemoteIP(req)) > -1
}

router.get('/letmein', function (req, res, next) {
	const config = loadDynamicConfig()
	if (req.query.k == config.letmein_key) {
		if (!CheckWhitelistIP(req)) {
			req.app.whitelist_ip.push(GetRemoteIP(req))
		}
		return res.status(200).json(req.app.whitelist_ip)
	}
	return res.status(404).json({ 'rc': 404 })
})

module.exports = router
