const { default: mongoose } = require("mongoose");
const { Router } = require('express');
const { getBackup } = require("../controller/backup.controller");
const backupRoutes = Router()
backupRoutes.get('/',getBackup)
module.exports = { backupRoutes }