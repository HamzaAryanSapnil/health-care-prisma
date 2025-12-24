"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contact_validation_1 = require("./contact.validation");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(contact_validation_1.contactZodSchema), contact_controller_1.ContactController.sendContactEmail);
exports.default = router;
