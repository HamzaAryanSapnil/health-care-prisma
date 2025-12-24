"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactZodSchema = void 0;
const zod_1 = require("zod");
exports.contactZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        email: zod_1.z.string().email("Please enter a valid email address"),
        subject: zod_1.z.string().min(3, "Subject must be at least 3 characters"),
        message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
    }),
});
