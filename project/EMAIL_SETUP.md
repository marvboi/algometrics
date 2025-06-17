# 📧 Email Service Setup Guide

This guide will help you set up external email services for whale transaction alerts in AlgoMetrics Dashboard.

## 🚀 Quick Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Choose your email provider and configure:**

## 📮 Email Provider Options

### Option 1: SendGrid (Recommended)

**Why SendGrid?**
- Reliable delivery
- Free tier: 100 emails/day
- Easy setup
- Great analytics

**Setup Steps:**

1. **Create SendGrid Account:**
   - Go to [SendGrid.com](https://sendgrid.com)
   - Sign up for free account
   - Verify your email

2. **Create API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Choose "Restricted Access"
   - Enable "Mail Send" permission
   - Copy the API key

3. **Configure Domain (Optional but Recommended):**
   - Go to Settings → Sender Authentication
   - Set up domain authentication
   - Or use single sender verification

4. **Update your `.env` file:**
   ```env
   VITE_EMAIL_PROVIDER=sendgrid
   VITE_EMAIL_API_KEY=SG.your-sendgrid-api-key-here
   VITE_FROM_EMAIL=alerts@yourdomain.com
   VITE_FROM_NAME=AlgoMetrics Alerts
   ```

### Option 2: Resend

**Why Resend?**
- Modern API
- Free tier: 3,000 emails/month
- Developer-friendly
- Great documentation

**Setup Steps:**

1. **Create Resend Account:**
   - Go to [Resend.com](https://resend.com)
   - Sign up with GitHub or email
   - Verify your account

2. **Create API Key:**
   - Go to API Keys section
   - Click "Create API Key"
   - Copy the API key

3. **Add Domain (Optional):**
   - Go to Domains section
   - Add your domain
   - Configure DNS records

4. **Update your `.env` file:**
   ```env
   VITE_EMAIL_PROVIDER=resend
   VITE_EMAIL_API_KEY=re_your-resend-api-key-here
   VITE_FROM_EMAIL=alerts@yourdomain.com
   VITE_FROM_NAME=AlgoMetrics Alerts
   ```

### Option 3: Custom Backend

**For Advanced Users:**
If you have your own email service or backend.

**Setup Steps:**

1. **Create your email endpoint:**
   ```javascript
   // Example Express.js endpoint
   app.post('/api/send-email', async (req, res) => {
     const { to, subject, html, from } = req.body;
     
     // Your email sending logic here
     // Could use Nodemailer, AWS SES, etc.
     
     res.json({ success: true });
   });
   ```

2. **Update your `.env` file:**
   ```env
   VITE_EMAIL_PROVIDER=custom
   VITE_EMAIL_API_KEY=your-custom-api-key
   VITE_FROM_EMAIL=alerts@yourdomain.com
   VITE_FROM_NAME=AlgoMetrics Alerts
   ```

## 🧪 Testing Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test email subscription:**
   - Open the dashboard
   - Click Settings (⚙️ icon)
   - Go to "Email Alerts" tab
   - Enter your email and subscribe
   - Check your email for welcome message

3. **Check browser console:**
   - Look for email service logs
   - Successful sends show: `✅ Email sent successfully via [provider]`
   - Errors show: `❌ [Provider] API error: [details]`

## 🔧 Troubleshooting

### Common Issues:

**1. "API Key Invalid" Error:**
- Double-check your API key in `.env`
- Make sure there are no extra spaces
- Verify the key has correct permissions

**2. "From Email Not Verified" Error:**
- Verify your sender email in your provider dashboard
- Use the exact email address you verified

**3. "CORS Error" (for custom backend):**
- Add CORS headers to your backend
- Make sure your endpoint accepts POST requests

**4. Emails Going to Spam:**
- Set up domain authentication (SPF, DKIM)
- Use a professional from address
- Avoid spam trigger words

### Debug Mode:

Add this to your `.env` for detailed logging:
```env
VITE_DEBUG_EMAIL=true
```

## 📊 Email Features

### 🐋 Whale Alerts Include:
- **Transaction Details:** Amount, USD value, addresses
- **Visual Design:** Professional HTML templates
- **Direct Links:** View transaction on Pera Explorer
- **Real-time:** Instant notifications for large transactions

### 📅 Frequency Options:
- **Instant:** Immediate alerts for each whale transaction
- **Hourly:** Digest of whale activity every hour
- **Daily:** Daily summary of whale movements

### 🎯 Customizable Thresholds:
- Set minimum ALGO amount for alerts
- Default: 1,000,000 ALGO (≈$250K USD)
- Adjustable per subscriber

## 💡 Pro Tips

1. **Start with SendGrid free tier** - easiest to set up
2. **Use domain authentication** - improves delivery rates
3. **Test with your own email first** - verify everything works
4. **Monitor your email quotas** - upgrade if needed
5. **Set up proper DNS records** - prevents spam filtering

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor usage in your provider dashboard

## 📈 Scaling

**Free Tier Limits:**
- SendGrid: 100 emails/day
- Resend: 3,000 emails/month

**When to Upgrade:**
- More than 50 active subscribers
- High whale activity periods
- Need advanced analytics

---

**Need Help?** 
Check the browser console for detailed error messages, or review your email provider's documentation for specific API issues. 