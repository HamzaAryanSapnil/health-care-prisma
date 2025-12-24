# Backend Contact Form Setup Instructions

## Overview
The frontend contact form follows the same pattern as other forms in the project (like forgot password). It calls a backend API endpoint, and the backend handles email sending using your existing email service (Resend/Nodemailer).

## Frontend Implementation

The frontend is already implemented with:
- Server action: `src/services/contact/contact.service.ts`
- Form component: `src/components/modules/Contact/ContactForm.tsx`
- Validation schema: `src/zod/contact.validation.ts`

The form follows the same pattern as `forgotPassword`:
- Uses `useActionState` hook
- Form uses `action={formAction}` prop (not handleSubmit)
- Server action validates with Zod
- Calls backend API endpoint

## Backend API Endpoint Required

You need to create the following endpoint in your backend:

### Endpoint Details

**POST** `/api/v1/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about NEXTMED",
  "message": "Hello, I would like to know more about..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Implementation Steps for Backend Developer

1. **Create Contact Route** (`src/app/modules/Contact/contact.route.ts`):
   ```typescript
   import { Router } from 'express';
   import { validateRequest } from '@/app/middlewares/validateRequest';
   import { contactZodSchema } from './contact.validation';
   import { sendContactEmail } from './contact.controller';
   
   const router = Router();
   
   router.post(
     '/',
     validateRequest(contactZodSchema),
     sendContactEmail
   );
   
   export default router;
   ```

2. **Create Validation Schema** (`src/app/modules/Contact/contact.validation.ts`):
   ```typescript
   import { z } from 'zod';
   
   export const contactZodSchema = z.object({
     body: z.object({
       name: z.string().min(2, 'Name must be at least 2 characters'),
       email: z.string().email('Invalid email format'),
       subject: z.string().min(3, 'Subject must be at least 3 characters'),
       message: z.string().min(10, 'Message must be at least 10 characters'),
     }),
   });
   ```

3. **Create Controller** (`src/app/modules/Contact/contact.controller.ts`):
   ```typescript
   import { Request, Response } from 'express';
   import { sendEmail } from '@/helpers/emailHelper'; // Your existing email helper
   import catchAsync from '@/shared/catchAsync';
   
   const sendContactEmail = catchAsync(async (req: Request, res: Response) => {
     const { name, email, subject, message } = req.body;
   
     // Send email using your existing email service (Resend/Nodemailer)
     await sendEmail({
       to: 'hamzaswapnil@gmail.com',
       from: 'noreply@yourdomain.com', // Use your verified domain
       replyTo: email,
       subject: `Contact Form: ${subject}`,
       html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
           <h2 style="color: #155DFC;">New Contact Form Submission</h2>
           <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject}</p>
           </div>
           <div style="margin-top: 20px;">
             <h3>Message:</h3>
             <p style="white-space: pre-wrap;">${message}</p>
           </div>
         </div>
       `,
     });
   
     res.status(200).json({
       success: true,
       message: 'Message sent successfully!',
     });
   });
   
   export { sendContactEmail };
   ```

4. **Add Route to Main Router** (`src/app/routes/index.ts`):
   ```typescript
   import contactRoutes from '@/app/modules/Contact/contact.route';
   
   // Add this line
   router.use('/contact', contactRoutes);
   ```

## Email Service

The backend should use the same email service you're using for forgot password emails (likely Resend or Nodemailer). The email should be sent to `hamzaswapnil@gmail.com` with the contact form details.

## Notes

- Frontend validation is already handled with Zod
- Backend should also validate the request
- Use the same email service pattern as forgot password
- Consider adding rate limiting to prevent spam
- The `replyTo` field should be set to the user's email so you can reply directly

## Current Status

**Frontend:** ✅ Complete
- Server action created
- Form component created
- Validation schema created
- Follows project patterns

**Backend:** ⏳ Required
- Create `/api/v1/contact` endpoint
- Handle email sending (same as forgot password)
- Add validation
