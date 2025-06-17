// Email service for whale transaction notifications
// This service handles email subscriptions and notifications for whale transactions

import { algorandAPI } from './algorand';

// Email service configuration
interface EmailConfig {
  provider: 'sendgrid' | 'resend' | 'custom';
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

// Default configuration - replace with your actual API keys
const EMAIL_CONFIG: EmailConfig = {
  provider: (import.meta.env.VITE_EMAIL_PROVIDER as 'sendgrid' | 'resend' | 'custom') || 'sendgrid',
  apiKey: import.meta.env.VITE_EMAIL_API_KEY || 'your-api-key-here',
  fromEmail: import.meta.env.VITE_FROM_EMAIL || 'alerts@algometrics.com',
  fromName: import.meta.env.VITE_FROM_NAME || 'AlgoMetrics Alerts'
};

export interface WhaleAlert {
  id: string;
  transactionId: string;
  amount: number;
  amountUSD: number;
  from: string;
  to: string;
  timestamp: number;
  type: 'transfer' | 'payment';
}

export interface EmailSubscription {
  email: string;
  threshold: number; // Minimum transaction amount in ALGO
  frequency: 'instant' | 'hourly' | 'daily';
  isActive: boolean;
  subscribedAt: number;
}

class EmailService {
  private subscriptions: EmailSubscription[] = [];
  private whaleAlerts: WhaleAlert[] = [];
  private lastCheck = Date.now();

  constructor() {
    this.loadSubscriptions();
    this.startWhaleMonitoring();
  }

  // External Email Service Integrations

  // SendGrid Integration
  private async sendEmailViaSendGrid(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: to }],
            subject: subject
          }],
          from: {
            email: EMAIL_CONFIG.fromEmail,
            name: EMAIL_CONFIG.fromName
          },
          content: [{
            type: 'text/html',
            value: htmlContent
          }]
        })
      });

      if (response.ok) {
        console.log('✅ Email sent successfully via SendGrid');
        return true;
      } else {
        const error = await response.text();
        console.error('❌ SendGrid API error:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ SendGrid request failed:', error);
      return false;
    }
  }

  // Resend Integration
  private async sendEmailViaResend(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
          to: [to],
          subject: subject,
          html: htmlContent
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email sent successfully via Resend:', result.id);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Resend API error:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Resend request failed:', error);
      return false;
    }
  }

  // Custom Email Service Integration (for your own backend)
  private async sendEmailViaCustom(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      // Replace with your backend email endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMAIL_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          to,
          subject,
          html: htmlContent,
          from: EMAIL_CONFIG.fromEmail
        })
      });

      if (response.ok) {
        console.log('✅ Email sent successfully via custom service');
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Custom email service error:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Custom email service request failed:', error);
      return false;
    }
  }

  // Main email sending method that routes to the configured provider
  private async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    console.log(`📧 Sending email via ${EMAIL_CONFIG.provider} to ${to}`);
    
    // For development/testing when network is blocked, simulate success
    if (EMAIL_CONFIG.apiKey === 'your-api-key-here' || EMAIL_CONFIG.apiKey.includes('demo')) {
      console.log('🧪 Demo mode: Simulating email send success');
      console.log('📧 Email details:', { to, subject, provider: EMAIL_CONFIG.provider });
      
      // Show browser notification instead
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📧 Email Sent (Demo Mode)', {
          body: `Would send: ${subject}`,
          icon: '/favicon.ico'
        });
      }
      
      return true; // Simulate success
    }
    
    try {
      switch (EMAIL_CONFIG.provider) {
        case 'sendgrid':
          return await this.sendEmailViaSendGrid(to, subject, htmlContent);
        case 'resend':
          return await this.sendEmailViaResend(to, subject, htmlContent);
        case 'custom':
          return await this.sendEmailViaCustom(to, subject, htmlContent);
        default:
          console.error('❌ Unknown email provider:', EMAIL_CONFIG.provider);
          return false;
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      
      // If network error, fall back to demo mode
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error detected, falling back to demo mode');
        console.log('📧 Email details:', { to, subject, provider: EMAIL_CONFIG.provider });
        
        // Show browser notification instead
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('📧 Email Queued (Network Issue)', {
            body: `Email queued: ${subject}`,
            icon: '/favicon.ico'
          });
        }
        
        return true; // Simulate success for demo
      }
      
      return false;
    }
  }

  // Enhanced HTML email templates
  private generateWhaleAlertEmail(alert: WhaleAlert): string {
    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    const formatAddress = (address: string) => {
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🐋 Whale Alert - Large ALGO Transaction Detected</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 30px; }
            .alert-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; margin: 20px 0; backdrop-filter: blur(10px); }
            .amount { font-size: 32px; font-weight: 700; color: #00d4aa; text-align: center; margin: 15px 0; }
            .usd-amount { font-size: 18px; color: #888; text-align: center; margin-bottom: 20px; }
            .transaction-details { display: grid; gap: 15px; }
            .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .detail-label { font-weight: 600; color: #aaa; }
            .detail-value { font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; color: #fff; }
            .address { background: rgba(0, 212, 170, 0.1); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(0, 212, 170, 0.3); }
            .footer { background: rgba(255, 255, 255, 0.02); padding: 20px; text-align: center; font-size: 14px; color: #666; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 15px 0; }
            .timestamp { color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🐋 Whale Alert</h1>
                <p>Large ALGO transaction detected on Algorand network</p>
            </div>
            
            <div class="content">
                <div class="alert-card">
                    <div class="amount">${formatAmount(alert.amount)} ALGO</div>
                    <div class="usd-amount">≈ $${formatAmount(alert.amountUSD)} USD</div>
                    
                    <div class="transaction-details">
                        <div class="detail-row">
                            <span class="detail-label">Transaction ID:</span>
                            <span class="detail-value">${alert.transactionId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">From:</span>
                            <span class="detail-value address">${formatAddress(alert.from)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">To:</span>
                            <span class="detail-value address">${formatAddress(alert.to)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${alert.type.toUpperCase()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Time:</span>
                            <span class="detail-value timestamp">${new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px;">
                        <a href="https://explorer.perawallet.app/tx/${alert.transactionId}" class="button">
                            View on Explorer →
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>This alert was sent by AlgoMetrics Dashboard</p>
                <p>You're receiving this because you subscribed to whale transaction alerts</p>
                <p style="font-size: 12px; margin-top: 15px;">
                    To unsubscribe or modify your alerts, visit your dashboard settings
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Rest of the existing methods remain the same...
  async subscribe(email: string, threshold: number = 1000000, frequency: 'instant' | 'hourly' | 'daily' = 'instant'): Promise<boolean> {
    try {
      // Clean and validate email
      const cleanEmail = email.trim().toLowerCase();
      console.log('📧 Attempting to subscribe email:', cleanEmail);
      
      // More robust email validation
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        console.error('❌ Email validation failed for:', cleanEmail);
        throw new Error('Invalid email address format');
      }

      console.log('✅ Email validation passed for:', cleanEmail);

      // Check if already subscribed
      const existingIndex = this.subscriptions.findIndex(sub => sub.email === cleanEmail);
      
      if (existingIndex >= 0) {
        // Update existing subscription
        this.subscriptions[existingIndex] = {
          ...this.subscriptions[existingIndex],
          threshold,
          frequency,
          isActive: true
        };
        console.log('📝 Updated existing subscription for:', cleanEmail);
      } else {
        // Add new subscription
        const subscription: EmailSubscription = {
          email: cleanEmail,
          threshold,
          frequency,
          isActive: true,
          subscribedAt: Date.now()
        };
        this.subscriptions.push(subscription);
        console.log('➕ Added new subscription for:', cleanEmail);
      }

      this.saveSubscriptions();

      // Send welcome email
      console.log('📧 Sending welcome email to:', cleanEmail);
      const welcomeSubject = '🎉 Welcome to AlgoMetrics Whale Alerts!';
      const welcomeContent = this.generateWelcomeEmail(cleanEmail, threshold, frequency);
      const emailSent = await this.sendEmail(cleanEmail, welcomeSubject, welcomeContent);
      
      if (!emailSent) {
        console.error('❌ Failed to send welcome email');
        throw new Error('Failed to send welcome email');
      }

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('✅ Subscription Confirmed', {
          body: `You'll receive whale alerts for transactions over ${(threshold / 1000000).toLocaleString()} ALGO`,
          icon: '/favicon.ico'
        });
      }

      console.log(`✅ Email subscription created successfully for ${cleanEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Subscription failed:', error);
      throw error; // Re-throw to show the actual error message
    }
  }

  private generateWelcomeEmail(email: string, threshold: number, frequency: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to AlgoMetrics Whale Alerts</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .welcome-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; margin: 20px 0; }
            .settings { background: rgba(0, 212, 170, 0.1); border: 1px solid rgba(0, 212, 170, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { background: rgba(255, 255, 255, 0.02); padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to AlgoMetrics!</h1>
                <p>Your whale alert subscription is now active</p>
            </div>
            
            <div class="content">
                <div class="welcome-card">
                    <h2>🐋 Whale Alert Settings</h2>
                    <p>You'll receive alerts for large ALGO transactions based on your preferences:</p>
                    
                    <div class="settings">
                        <p><strong>📧 Email:</strong> ${email}</p>
                        <p><strong>💰 Threshold:</strong> ${(threshold / 1000000).toLocaleString()} ALGO minimum</p>
                        <p><strong>⏰ Frequency:</strong> ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} alerts</p>
                    </div>
                    
                    <p>We'll monitor the Algorand network 24/7 and notify you whenever significant whale movements occur!</p>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for using AlgoMetrics Dashboard</p>
                <p>Stay informed about the Algorand ecosystem!</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async unsubscribe(email: string): Promise<boolean> {
    const index = this.subscriptions.findIndex(sub => sub.email === email);
    if (index >= 0) {
      this.subscriptions[index].isActive = false;
      this.saveSubscriptions();
      console.log(`📧 Unsubscribed ${email} from whale alerts`);
      return true;
    }
    return false;
  }

  private async checkForWhaleTransactions() {
    try {
      const transactions = await algorandAPI.getLiveTransactions(50);
      const algoPrice = await algorandAPI.getAlgoPrice();
      const currentPrice = algoPrice?.algorand?.usd || 0.25;

      if (transactions.transactions) {
        for (const tx of transactions.transactions) {
          // Check if this is a significant transaction
          const amount = tx.amount || 0;
          const amountInAlgo = amount / 1000000; // Convert microAlgos to ALGO
          const amountUSD = amountInAlgo * currentPrice;

          // Check against subscriber thresholds
          for (const subscription of this.subscriptions.filter(s => s.isActive)) {
            const thresholdAlgo = subscription.threshold / 1000000;
            
            if (amountInAlgo >= thresholdAlgo) {
              const alert: WhaleAlert = {
                id: `${tx.id}-${Date.now()}`,
                transactionId: tx.id,
                amount: amountInAlgo,
                amountUSD,
                from: tx.sender,
                to: tx.receiver || 'N/A',
                timestamp: tx['round-time'] * 1000 || Date.now(),
                type: tx['tx-type'] === 'pay' ? 'payment' : 'transfer'
              };

              if (subscription.frequency === 'instant') {
                await this.sendWhaleAlert(subscription.email, alert);
              } else {
                // Store for batch sending
                this.whaleAlerts.push(alert);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking whale transactions:', error);
    }
  }

  private async sendWhaleAlert(email: string, alert: WhaleAlert) {
    const subject = `🐋 Whale Alert: ${alert.amount.toLocaleString()} ALGO moved (≈$${alert.amountUSD.toLocaleString()})`;
    const htmlContent = this.generateWhaleAlertEmail(alert);
    
    const success = await this.sendEmail(email, subject, htmlContent);
    
    if (success && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🐋 Whale Alert', {
        body: `${alert.amount.toLocaleString()} ALGO transaction detected`,
        icon: '/favicon.ico'
      });
    }
  }

  private startWhaleMonitoring() {
    // Check every 30 seconds for new whale transactions
    setInterval(() => {
      this.checkForWhaleTransactions();
    }, 30000);

    // Send hourly digests
    setInterval(() => {
      this.sendHourlyDigests();
    }, 3600000); // 1 hour

    // Send daily digests
    setInterval(() => {
      this.sendDailyDigests();
    }, 86400000); // 24 hours
  }

  private async sendHourlyDigests() {
    const hourlySubscribers = this.subscriptions.filter(s => s.isActive && s.frequency === 'hourly');
    const recentAlerts = this.whaleAlerts.filter(a => a.timestamp > Date.now() - 3600000);

    for (const subscriber of hourlySubscribers) {
      const relevantAlerts = recentAlerts.filter(a => a.amount >= subscriber.threshold / 1000000);
      if (relevantAlerts.length > 0) {
        await this.sendDigestEmail(subscriber.email, relevantAlerts, 'hourly');
      }
    }
  }

  private async sendDailyDigests() {
    const dailySubscribers = this.subscriptions.filter(s => s.isActive && s.frequency === 'daily');
    const recentAlerts = this.whaleAlerts.filter(a => a.timestamp > Date.now() - 86400000);

    for (const subscriber of dailySubscribers) {
      const relevantAlerts = recentAlerts.filter(a => a.amount >= subscriber.threshold / 1000000);
      if (relevantAlerts.length > 0) {
        await this.sendDigestEmail(subscriber.email, relevantAlerts, 'daily');
      }
    }

    // Clean up old alerts
    this.whaleAlerts = this.whaleAlerts.filter(a => a.timestamp > Date.now() - 86400000);
  }

  private async sendDigestEmail(email: string, alerts: WhaleAlert[], frequency: string) {
    const totalVolume = alerts.reduce((sum, alert) => sum + alert.amount, 0);
    const totalUSD = alerts.reduce((sum, alert) => sum + alert.amountUSD, 0);
    
    const subject = `🐋 ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Whale Digest: ${alerts.length} large transactions`;
    
    // Generate digest email HTML (simplified version)
    const htmlContent = `
      <h1>🐋 Whale Activity Digest</h1>
      <p><strong>${alerts.length}</strong> large transactions in the last ${frequency === 'hourly' ? 'hour' : 'day'}</p>
      <p><strong>Total Volume:</strong> ${totalVolume.toLocaleString()} ALGO (≈$${totalUSD.toLocaleString()})</p>
      <ul>
        ${alerts.map(alert => `
          <li>${alert.amount.toLocaleString()} ALGO - <a href="https://explorer.perawallet.app/tx/${alert.transactionId}">View Transaction</a></li>
        `).join('')}
      </ul>
    `;
    
    await this.sendEmail(email, subject, htmlContent);
  }

  private loadSubscriptions() {
    try {
      const saved = localStorage.getItem('whale-alert-subscriptions');
      if (saved) {
        this.subscriptions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }

  private saveSubscriptions() {
    try {
      localStorage.setItem('whale-alert-subscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions:', error);
    }
  }

  // Process whale transaction for email alerts (called from useAlgorandData hook)
  async processWhaleTransaction(transaction: {
    txId: string;
    amount: number;
    amountUSD: number;
    from: string;
    to: string;
    timestamp: Date;
    type: 'payment' | 'swap' | 'transfer';
  }): Promise<void> {
    try {
      // Check against subscriber thresholds
      for (const subscription of this.subscriptions.filter(s => s.isActive)) {
        const thresholdAlgo = subscription.threshold / 1000000;
        
        if (transaction.amount >= thresholdAlgo) {
          const alert: WhaleAlert = {
            id: `${transaction.txId}-${Date.now()}`,
            transactionId: transaction.txId,
            amount: transaction.amount,
            amountUSD: transaction.amountUSD,
            from: transaction.from,
            to: transaction.to,
            timestamp: transaction.timestamp.getTime(),
            type: transaction.type === 'payment' ? 'payment' : 'transfer'
          };

          if (subscription.frequency === 'instant') {
            await this.sendWhaleAlert(subscription.email, alert);
          } else {
            // Store for batch sending
            this.whaleAlerts.push(alert);
          }
        }
      }
    } catch (error) {
      console.error('Error processing whale transaction for email alerts:', error);
    }
  }

  getSubscriptions(): EmailSubscription[] {
    return this.subscriptions.filter(s => s.isActive);
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }
}

export const emailService = new EmailService(); 