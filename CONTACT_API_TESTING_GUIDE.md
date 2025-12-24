# Contact Form API Testing Guide

## API Endpoint

**URL:** `POST /api/v1/contact`

**Base URL:**
- Production: `https://health-care-prisma.onrender.com`
- Local: `http://localhost:5000`

**Full Endpoint:** `https://health-care-prisma.onrender.com/api/v1/contact`

---

## Request Format

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about NEXTMED",
  "message": "Hello, I would like to know more about your services..."
}
```

### Field Requirements
- **name**: Minimum 2 characters
- **email**: Valid email format
- **subject**: Minimum 3 characters
- **message**: Minimum 10 characters

---

## Response Formats

### ✅ Success Response (200 OK)

```json
{
  "success": true,
  "message": "Message sent successfully!",
  "data": null
}
```

**Status Code:** `200`

---

### ❌ Validation Error Response (400 Bad Request)

যখন request body validation fail হয় (Zod validation):

```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "minimum": 2,
        "type": "string",
        "inclusive": true,
        "exact": false,
        "message": "Name must be at least 2 characters",
        "path": ["body", "name"]
      }
    ],
    "name": "ZodError"
  }
}
```

**Status Code:** `400`

**Common Validation Errors:**

1. **Name too short:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "message": "Name must be at least 2 characters",
        "path": ["body", "name"]
      }
    ]
  }
}
```

2. **Invalid email:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "invalid_string",
        "message": "Please enter a valid email address",
        "path": ["body", "email"]
      }
    ]
  }
}
```

3. **Subject too short:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "message": "Subject must be at least 3 characters",
        "path": ["body", "subject"]
      }
    ]
  }
}
```

4. **Message too short:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "message": "Message must be at least 10 characters",
        "path": ["body", "message"]
      }
    ]
  }
}
```

5. **Multiple validation errors:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "message": "Name must be at least 2 characters",
        "path": ["body", "name"]
      },
      {
        "code": "invalid_string",
        "message": "Please enter a valid email address",
        "path": ["body", "email"]
      }
    ]
  }
}
```

---

### ❌ Server Error Response (500 Internal Server Error)

যখন email send করতে সমস্যা হয় বা server error:

```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": {
    "message": "Error details here"
  }
}
```

**Status Code:** `500`

---

## Testing Examples

### Example 1: Valid Request (Success)

**Request:**
```bash
curl -X POST https://health-care-prisma.onrender.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry about NEXTMED",
    "message": "Hello, I would like to know more about your services."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!",
  "data": null
}
```

---

### Example 2: Missing Required Fields

**Request:**
```bash
curl -X POST https://health-care-prisma.onrender.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "invalid_type",
        "message": "Required",
        "path": ["body", "email"]
      },
      {
        "code": "invalid_type",
        "message": "Required",
        "path": ["body", "subject"]
      },
      {
        "code": "invalid_type",
        "message": "Required",
        "path": ["body", "message"]
      }
    ]
  }
}
```

---

### Example 3: Invalid Email Format

**Request:**
```bash
curl -X POST https://health-care-prisma.onrender.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "subject": "Test",
    "message": "This is a test message with more than 10 characters."
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "invalid_string",
        "message": "Please enter a valid email address",
        "path": ["body", "email"]
      }
    ]
  }
}
```

---

### Example 4: Short Message

**Request:**
```bash
curl -X POST https://health-care-prisma.onrender.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test",
    "message": "Short"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "message": "Message must be at least 10 characters",
        "path": ["body", "message"]
      }
    ]
  }
}
```

---

## Frontend Implementation Guide

### TypeScript Types

```typescript
// Request Type
interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Success Response Type
interface ContactSuccessResponse {
  success: true;
  message: string;
  data: null;
}

// Error Response Type
interface ContactErrorResponse {
  success: false;
  message: string;
  error: {
    issues?: Array<{
      code: string;
      message: string;
      path: string[];
    }>;
    [key: string]: any;
  };
}
```

### Example Fetch Implementation

```typescript
const submitContactForm = async (data: ContactFormRequest) => {
  try {
    const response = await fetch('https://health-care-prisma.onrender.com/api/v1/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Success handling
      console.log('Message sent successfully!');
      return { success: true, message: result.message };
    } else {
      // Error handling
      if (result.error?.issues) {
        // Validation errors
        const errors = result.error.issues.map((issue: any) => ({
          field: issue.path[issue.path.length - 1], // Get last path element (field name)
          message: issue.message,
        }));
        return { success: false, errors };
      } else {
        // Server error
        return { success: false, message: result.message || 'Something went wrong!' };
      }
    }
  } catch (error) {
    // Network error
    return { success: false, message: 'Network error. Please try again.' };
  }
};
```

### Example Axios Implementation

```typescript
import axios from 'axios';

const submitContactForm = async (data: ContactFormRequest) => {
  try {
    const response = await axios.post(
      'https://health-care-prisma.onrender.com/api/v1/contact',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      const errorData = error.response.data;
      
      if (errorData.error?.issues) {
        // Validation errors
        const errors = errorData.error.issues.map((issue: any) => ({
          field: issue.path[issue.path.length - 1],
          message: issue.message,
        }));
        return { success: false, errors };
      } else {
        // Server error
        return { success: false, message: errorData.message || 'Something went wrong!' };
      }
    } else {
      // Network error
      return { success: false, message: 'Network error. Please try again.' };
    }
  }
};
```

### Error Handling Helper Function

```typescript
const formatValidationErrors = (errorResponse: ContactErrorResponse) => {
  if (!errorResponse.error?.issues) {
    return { general: errorResponse.message };
  }

  const errors: Record<string, string> = {};
  
  errorResponse.error.issues.forEach((issue) => {
    const fieldName = issue.path[issue.path.length - 1]; // Get field name from path
    errors[fieldName] = issue.message;
  });

  return errors;
};

// Usage
const handleSubmit = async (formData: ContactFormRequest) => {
  const result = await submitContactForm(formData);
  
  if (!result.success) {
    if (result.errors) {
      // Display field-specific errors
      const formattedErrors = formatValidationErrors(result as any);
      setFormErrors(formattedErrors);
    } else {
      // Display general error
      setErrorMessage(result.message);
    }
  } else {
    // Show success message
    setSuccessMessage(result.message);
  }
};
```

---

## Testing Checklist

- [ ] ✅ Valid form submission (all fields correct)
- [ ] ❌ Empty name field
- [ ] ❌ Name less than 2 characters
- [ ] ❌ Invalid email format
- [ ] ❌ Empty email field
- [ ] ❌ Subject less than 3 characters
- [ ] ❌ Empty subject field
- [ ] ❌ Message less than 10 characters
- [ ] ❌ Empty message field
- [ ] ❌ Multiple validation errors at once
- [ ] ✅ Network error handling
- [ ] ✅ Server error handling (500)

---

## Notes

1. **Rate Limiting:** API has rate limiting applied. Too many requests may result in rate limit errors.

2. **Email Delivery:** Email is sent to `hamzaswapnil@gmail.com` with reply-to set to user's email.

3. **Response Time:** Email sending may take a few seconds. Consider adding loading state in UI.

4. **CORS:** Make sure your frontend domain is allowed in CORS settings if testing from browser.

5. **Error Path:** Validation errors have a `path` array. The last element is the field name (e.g., `["body", "email"]` → field is `"email"`).

---

## Support

If you encounter any issues during testing, please check:
1. Network connectivity
2. API endpoint URL is correct
3. Request body format matches the specification
4. Content-Type header is set correctly

