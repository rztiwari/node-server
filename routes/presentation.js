const express = require('express');
const presetationRoute = express.Router();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const jsonfile = require('jsonfile');

// create application/json parser
const jsonParser = bodyParser.json();

const slideListFile = path.join(process.cwd() + '/data/slideList.json');
const slideDataFile = path.join(process.cwd() + '/data/slideData.json');

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
  let slideId = req.params && req.params['id']
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
  let slideId = req.params && req.params['id']
    ? req.params['id']
    : null;
  jsonfile.readFile(slideDataFile, function(err, obj) {

    res.set("Content-Type", "application/json");
    if (err) {
      res.status(500).json({error: err});
      return;
    }

    if (obj && slideId && obj[slideId]) {
      delData = obj[slideId]
      delete obj[slideId];
      jsonfile.writeFile(slideDataFile, obj, function(err, success) {
        if (err) {
          res.status(500).json({error: err});
          return;
        }
        fileListData = jsonfile.readFileSync(slideListFile);
        if (fileListData && fileListData.data && fileListData.data.length > 0) {
          fileListData.data = fileListData.data.filter(function(item) {
            return item !== slideId;
          });
        }
        jsonfile.writeFileSync(slideListFile, fileListData);
        res.status(200).json(delData);
      });
    } else {
      res.status(200).json({data: []});
    }
  });
});

presetationRoute.post('/slideData/:id', jsonParser, function(req, res) {
  let slideId = req.params['id']
    ? req.params['id']
    : null;
  let fileStats = fs.statSync(slideDataFile);
  if (fileStats && fileStats.size > 0) {
    obj = jsonfile.readFileSync(slideDataFile);
  } else {
    obj = {};
  }

  res.set("Content-Type", "application/json");

  slideData = req.body;
  if (slideData && slideId && !obj[slideId]) {
    obj[slideId] = slideData[slideId];
  } else {
    res.status(500).json({'error': 'Can\'n add the record'});
    return;
  }

  writeDataToFile(obj, slideId, req, res);
});

presetationRoute.put('/slideData/:id', jsonParser, function(req, res) {
  let slideId = req.params['id']
    ? req.params['id']
    : null;
  let fileStats = fs.statSync(slideDataFile);
  if (fileStats && fileStats.size > 0) {
    obj = jsonfile.readFileSync(slideDataFile);
  } else {
    obj = {};
  }

  slideData = req.body;
  if (slideData && slideId) {
    obj[slideId] = slideData[slideId];
  }
  writeDataToFile(obj, slideId, req, res);
});

const writeDataToFile = function(json, slideId, req, res) {
  let fileListData,
    fileStats = fs.statSync(slideListFile);
  if (fileStats && fileStats.size > 0) {
    fileListData = jsonfile.readFileSync(slideListFile);
  } else {
    fileListData = {};
  }
  jsonfile.writeFile(slideDataFile, json, function(err, success) {
    if (err) {
      res.status(500).json({error: err});
      return;
    }

    if (fileListData && fileListData.data && Array.isArray(fileListData.data)) {
      if (fileListData.data.indexOf(slideId) === -1) {
        fileListData.data.push(slideId);
      }
    } else {
      fileListData = {};
      fileListData.data = [];
      fileListData.data.push(slideId);
    }

    jsonfile.writeFileSync(slideListFile, fileListData);

    res.set("Content-Type", "application/json");
    res.status(200).json(req.body);
  });
}

module.exports = presetationRoute;
