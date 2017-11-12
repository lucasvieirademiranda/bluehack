// Consts.
const { Router } = require('express');
const statisticsService = require("../services/statisticsService.js");

// Variables.
var uuidv4 = require("uuid/v4");
var router = Router();
var express=require("express");
var app = express();
var fs = require("fs");
var watson = require('watson-developer-cloud');
var chatBotOutput;

// Create a conversation instance.
var conversation = watson.conversation({
  username: '3839fc6b-817b-4f85-b841-1ec0c66ddba0',
  password: 'IxmySHmPS2eV',
  version: 'v1',
  version_date: '2017-05-26'
});


// Create a text to speech instance.
var text_to_speech = watson.text_to_speech({
    username: 'a703abe3-c07f-40ce-b20b-1af94f42b2f8',
    password: 'cdBRoxFmTl5w',
    version: 'v1'
});
// Parameters to speech to text.
var params = {
    text: '',
    voice: 'pt-BR_IsabelaVoice',
    accept: 'audio/wav'
};

router.post('/ask', (request, response) => {

	conversation.message({
			workspace_id: 'fdbe7f43-8f6a-4d4b-9bab-71a11de8eacb',
			input: {'text': request.body.input }
	},  function(cnvError, cnvRes) {

		if (cnvError)
		{
			response.status(500)
					.type("application/json")
					.json({
						Success: false,
						Error: cnvError
					});
		} else {

			if(!cnvRes.output.search)
			{

				let text = cnvRes.output.text[0];
				
				textToSpeech(text, function(file, error) {

					if(error)
					{
						response.status(500)
								.type("application/json")
								.json({
									Success: false,
									Error: error
								});
						return;
					}

					response.status(200)
						    .type("application/json")
							.json({
								Success: true,
								Data: {
									File: file,
									Text: text 				
								}
							});

				});
				
				return;
			}

			let parameters = cnvRes.context;
			var file = null;
			var text = null;

            statisticsService.getStatistics(parameters,function(data,error) {

				if (error)
				{
					response.status(500)
							.type("application/json")
							.json({
								Success: false,
								Error: error
							});
		            return;
		        }

		        if(cnvRes.context.period1 && cnvRes.context.period2){
		        	text = `Ha um total de ${data.recordset[0].TOTAL} ocorrencias de ${cnvRes.context.occurrence} no periodo de ${cnvRes.context.period1} a ${cnvRes.context.period2} na cidade de ${cnvRes.context.city}`;
		        } else if(cnvRes.context.period1) {
		        	text = `Ha um total de ${data.recordset[0].TOTAL} ocorrencias de ${cnvRes.context.occurrence} no periodo de ${cnvRes.context.period1} na cidade de ${cnvRes.context.city}`;
		        } else {
		        	text = `Ha um total de ${data.recordset[0].TOTAL} ocorrencias de ${cnvRes.context.occurrence} na cidade de ${cnvRes.context.city}`;
		        }

		        textToSpeech(text, function(file, error) {

					if(error)
					{
						response.status(500)
								.type("application/json")
								.json({
									Success: false,
									Error: error
								});
						return;
					}

					var output = {
						Success: true,
						Data: {
							File: file,
							Text: text
						}
					};
					
					response.status(200)
							.type("application/json")
							.json(output);

				});

            });
			
		}

	});



});


function textToSpeech(text, callback) {

	params.text = text;
	
	var fileName = uuidv4()  + '.wav';
	var folder = '/public/';
	
	var relativeFolderPath = '../../..' + folder;
	var relativeFilePath = relativeFolderPath + fileName;
	
	var folderPath = __dirname + relativeFolderPath;
	var filePath = __dirname + relativeFilePath;

	try 
	{
		fs.statSync(folderPath);
	} catch(e)
	{
		fs.mkdirSync(folderPath);
	}

    text_to_speech.synthesize(params).pipe(fs.createWriteStream(filePath).on('finish', function(error) {
		
		if(error)
		{
			callback(null, error);
			return;
		}

		callback(folder + fileName, null);
		
	}));

}


module.exports = router;