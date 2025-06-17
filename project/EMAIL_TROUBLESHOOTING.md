# 🔧 Email Service Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 📧 SendGrid Issues

**Problem: "API Key Invalid" or "Unauthorized"**
```
❌ SendGrid API error: {"errors":[{"message":"The provided authorization grant is invalid, expired, or revoked","field":null,"help":null}]}
```

**Solutions:**
1. **Check API Key Format:**
   - Must start with `SG.`
   - Example: `SG.abc123def456...`
   - No spaces or extra characters

2. **Verify API Key Permissions:**
   - Go to SendGrid → Settings → API Keys
   - Click your API key → Edit
   - Ensure "Mail Send" is enabled
   - Set to "Full Access" or "Restricted Access" with Mail Send

3. **Test API Key:**
   ```bash
   curl -X "POST" "https://api.sendgrid.com/v3/mail/send" \
        -H "Authorization: Bearer YOUR_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"from@example.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'
   ```

**Problem: "From Email Not Verified"**
```
❌ SendGrid API error: {"errors":[{"message":"The from address does not match a verified Sender Identity"}]}
```

**Solutions:**
1. **Single Sender Verification:**
   - Go to SendGrid → Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Add your email and verify

2. **Domain Authentication (Recommended):**
   - Go to Settings → Sender Authentication
   - Click "Authenticate Your Domain"
   - Follow DNS setup instructions

### 📨 Resend Issues

**Problem: "API Key Invalid"**
```
❌ Resend API error: {"message":"Invalid API key"}
```

**Solutions:**
1. **Check API Key Format:**
   - Must start with `re_`
   - Example: `re_abc123def456...`
   - Get from Resend Dashboard → API Keys

2. **Test API Key:**
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
        -H 'Authorization: Bearer YOUR_API_KEY' \
        -H 'Content-Type: application/json' \
        -d '{"from":"test@example.com","to":["test@example.com"],"subject":"Test","html":"<p>Test</p>"}'
   ```

**Problem: "Domain Not Verified"**
```
❌ Resend API error: {"message":"Domain not found"}
```

**Solutions:**
1. **Add Domain:**
   - Go to Resend Dashboard → Domains
   - Click "Add Domain"
   - Follow DNS verification steps

2. **Use Resend's Domain (for testing):**
   - Use `onboarding@resend.dev` as from email
   - Only works for testing, not production

### 🔧 Environment Variable Issues

**Problem: Environment variables not loading**

**Check your `.env` file:**
```env
# ✅ Correct format
VITE_EMAIL_PROVIDER=sendgrid
VITE_EMAIL_API_KEY=SG.your-actual-api-key-here
VITE_FROM_EMAIL=alerts@yourdomain.com
VITE_FROM_NAME=AlgoMetrics Alerts

# ❌ Common mistakes
VITE_EMAIL_API_KEY = SG.key-with-spaces
VITE_EMAIL_API_KEY="SG.key-with-quotes"
EMAIL_API_KEY=SG.missing-vite-prefix
```

**Solutions:**
1. **Restart Development Server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Check Environment Loading:**
   ```javascript
   // Add to your component temporarily
   console.log('Email Config:', {
     provider: import.meta.env.VITE_EMAIL_PROVIDER,
     apiKey: import.meta.env.VITE_EMAIL_API_KEY ? '✅ Set' : '❌ Missing',
     fromEmail: import.meta.env.VITE_FROM_EMAIL
   });
   ```

### 🌐 CORS Issues (Custom Backend)

**Problem: CORS errors when using custom backend**
```
❌ Custom email service error: CORS policy blocked
```

**Solutions:**
1. **Add CORS Headers:**
   ```javascript
   // Express.js example
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
     next();
   });
   ```

2. **Handle Preflight Requests:**
   ```javascript
   app.options('/api/send-email', (req, res) => {
     res.sendStatus(200);
   });
   ```

## 🧪 Testing Your Email Setup

### 1. Quick Console Test

Add this to your browser console on the dashboard:

```javascript
// Test email service configuration
import { emailService } from './src/services/emailService.ts';

// Test subscription (replace with your email)
emailService.subscribe('your-email@example.com', 1000000, 'instant')
  .then(success => console.log('✅ Subscription test:', success))
  .catch(error => console.error('❌ Subscription failed:', error));
```

### 2. Manual API Test

**SendGrid Test:**
```bash
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_SENDGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{"to": [{"email": "your-email@example.com"}]}],
    "from": {"email": "alerts@yourdomain.com"},
    "subject": "AlgoMetrics Test",
    "content": [{"type": "text/html", "value": "<h1>Test Email</h1>"}]
  }'
```

**Resend Test:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "alerts@yourdomain.com",
    "to": ["your-email@example.com"],
    "subject": "AlgoMetrics Test",
    "html": "<h1>Test Email</h1>"
  }'
```

## 🔍 Debug Mode

Enable detailed logging by adding to your `.env`:

```env
VITE_DEBUG_EMAIL=true
```

This will show:
- ✅ Email provider selection
- 📧 Email sending attempts
- ❌ Detailed error messages
- 📊 API response details

## 📞 Getting Help

### SendGrid Support:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [API Reference](https://docs.sendgrid.com/api-reference/mail-send/mail-send)
- [Status Page](https://status.sendgrid.com/)

### Resend Support:
- [Resend Documentation](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference)
- [Discord Community](https://resend.com/discord)

### Quick Fixes Checklist:

- [ ] API key starts with correct prefix (`SG.` or `re_`)
- [ ] No spaces in API key
- [ ] From email is verified in provider dashboard
- [ ] Environment variables have `VITE_` prefix
- [ ] Development server restarted after `.env` changes
- [ ] Browser console shows no CORS errors
- [ ] Email provider status page shows no outages

---

**Still having issues?** Check the browser console for specific error messages and compare with the examples above. 