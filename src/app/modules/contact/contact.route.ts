import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { contactZodSchema } from './contact.validation';
import { ContactController } from './contact.controller';

const router = Router();

router.post(
    '/',
    validateRequest(contactZodSchema),
    ContactController.sendContactEmail
);

export default router;

