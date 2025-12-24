import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContactService } from './contact.service';

const sendContactEmail = catchAsync(async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    await ContactService.sendContactEmail({
        name,
        email,
        subject,
        message
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Message sent successfully!',
        data: null
    });
});

export const ContactController = {
    sendContactEmail
};

