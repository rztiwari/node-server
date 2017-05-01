var express = require('express');
var presetationRoute = express.Router();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

var jsonfile = require('jsonfile');

// create application/json parser
var jsonParser = bodyParser.json();

var slideListFile = path.join(process.cwd() + '/data/slideList.json');
var slideDataFile = path.join(process.cwd() + '/data/slideData.json');

presetationRoute.get('/slideList', function(req, res) {
  jsonfile.readFile(slideListFile, function(err, obj) {
    res.set("Content-Type", "application/json");
    if (err) {
      res.status(500).json({error: err});
    }

    if (obj && obj.data && obj.data.length > 0) {
      res.status(200).json(obj);
    } else {
      res.status(200).json({data: []});
    }
  });
});

presetationRoute.get('/slideData/:id', function(req, res) {
  var slideId = req.params && req.params['id']
    ? req.params['id']
    : null;
  jsonfile.readFile(slideDataFile, function(err, obj) {

    res.set("Content-Type", "application/json");
    if (err) {
      res.status(500).json({error: err});
    }

    if (obj && slideId && obj[slideId]) {
      res.status(200).json(obj[slideId]);
    } else {
      res.status(200).json({data: []});
    }
  });
});

presetationRoute.get('/slideData/:id', function(req, res) {
  var slideId = req.params && req.params['id']
    ? req.params['id']
    : null;
  jsonfile.readFile(slideDataFile, function(err, obj) {

    res.set("Content-Type", "application/json");
    if (err) {
      res.status(500).json({error: err});
    }

    if (obj && slideId && obj[slideId]) {
      res.status(200).json(obj[slideId]);
    } else {
      res.status(200).json({data: []});
    }
  });
});

presetationRoute.delete('/slideData/:id', function(req, res) {
  var slideId = req.params && req.params['id']
    ? req.params['id']
    : null;
  jsonfile.readFile(slideDataFile, function(err, obj) {

    res.set("Content-Type", "application/json");
    if (err) {
      res.status(500).json({error: err});
    }

    if (obj && slideId && obj[slideId]) {
      delData = obj[slideId]
      delete obj[slideId];
      jsonfile.writeFile(slideDataFile, obj, function(err, success) {
        if (err) {
          res.status(500).json({error: err});
        }
        res.status(200).json(delData);
      });
    } else {
      res.status(200).json({data: []});
    }
  });
});

presetationRoute.post('/slideData/:id', jsonParser, function(req, res) {
  var slideId = req.params['id']
    ? req.params['id']
    : null;
  var fileStats = fs.statSync(slideDataFile);
  if (fileStats && fileStats.size > 0) {
    obj = jsonfile.readFileSync(slideDataFile);
  } else {
    obj = {};
  }

  res.set("Content-Type", "application/json");

  slideData = req.body;
  if (slideData && slideId && !obj[slideId]) {
    obj[slideId] = slideData[slideId];
  }else{
    res.status(500).json({'error': 'Can\'n add the record'});
    return;
  }
  jsonfile.writeFile(slideDataFile, obj, function(err, success) {
    if (err) {
      res.status(500).json({error: err});
      return;
    }
    res.status(200).json(req.body);
  });
});

presetationRoute.put('/slideData/:id', jsonParser, function(req, res) {
  var slideId = req.params['id']
    ? req.params['id']
    : null;
  var fileStats = fs.statSync(slideDataFile);
  if (fileStats && fileStats.size > 0) {
    obj = jsonfile.readFileSync(slideDataFile);
  } else {
    obj = {};
  }

  res.set("Content-Type", "application/json");

  slideData = req.body;
  if (slideData && slideId) {
    obj[slideId] = slideData[slideId];
  }
  jsonfile.writeFile(slideDataFile, obj, function(err, success) {
    if (err) {
      res.status(500).json({error: err});
    }
    res.status(200).json(req.body);
  });
});

module.exports = presetationRoute;
