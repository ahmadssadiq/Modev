import os
from typing import Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()


class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@yourcostoptimizer.com")
        self.client = None
        
        if self.api_key:
            self.client = SendGridAPIClient(api_key=self.api_key)

    async def send_email(
        self,
        to_email: str,
        subject: str,
        message: str,
        html_content: Optional[str] = None
    ) -> bool:
        """Send an email using SendGrid"""
        
        if not self.client:
            print(f"Email service not configured. Would send email to {to_email}: {subject}")
            return False
        
        try:
            # Create email message
            mail = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                plain_text_content=message
            )
            
            if html_content:
                mail.html_content = html_content
            
            # Send email
            response = self.client.send(mail)
            
            # Check if email was sent successfully
            if response.status_code in [200, 201, 202]:
                print(f"Email sent successfully to {to_email}")
                return True
            else:
                print(f"Failed to send email. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    async def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email to new users"""
        subject = "Welcome to AI Cost Optimizer! 🚀"
        
        message = f"""
        Hi {user_name or 'there'}!

        Welcome to AI Cost Optimizer! We're excited to help you track and optimize your AI API usage.

        Getting Started:
        1. Add your AI provider API keys (OpenAI, Anthropic, etc.)
        2. Set up budget limits to control spending
        3. Start using our proxy URL for your AI API calls
        4. Monitor your usage and costs in real-time

        Your proxy endpoints:
        - OpenAI: https://your-domain.com/proxy/openai/v1/chat/completions
        - Anthropic: https://your-domain.com/proxy/anthropic/v1/messages

        Need help? Check out our documentation or contact support.

        Happy optimizing!
        The AI Cost Optimizer Team
        """
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to AI Cost Optimizer! 🚀</h1>
            </div>
            
            <div style="padding: 20px;">
                <p>Hi <strong>{user_name or 'there'}</strong>!</p>
                
                <p>Welcome to AI Cost Optimizer! We're excited to help you track and optimize your AI API usage.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Getting Started:</h3>
                    <ol style="color: #666;">
                        <li>Add your AI provider API keys (OpenAI, Anthropic, etc.)</li>
                        <li>Set up budget limits to control spending</li>
                        <li>Start using our proxy URL for your AI API calls</li>
                        <li>Monitor your usage and costs in real-time</li>
                    </ol>
                </div>
                
                <h3 style="color: #333;">Your proxy endpoints:</h3>
                <ul style="color: #666; font-family: monospace; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <li><strong>OpenAI:</strong> https://your-domain.com/proxy/openai/v1/chat/completions</li>
                    <li><strong>Anthropic:</strong> https://your-domain.com/proxy/anthropic/v1/messages</li>
                </ul>
                
                <p>Need help? Check out our documentation or contact support.</p>
                
                <p>Happy optimizing!<br>
                <strong>The AI Cost Optimizer Team</strong></p>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(user_email, subject, message, html_content)

    async def send_budget_limit_email(
        self, 
        user_email: str, 
        budget_info: dict,
        alert_type: str = "approaching"
    ) -> bool:
        """Send budget limit notification email"""
        
        if alert_type == "exceeded":
            subject = "🚨 Budget Limit Exceeded - AI Cost Optimizer"
            message_title = "Budget Limit Exceeded"
            emoji = "🚨"
        else:
            subject = "⚠️ Budget Alert - AI Cost Optimizer"
            message_title = "Budget Alert"
            emoji = "⚠️"
        
        message = f"""
        {emoji} {message_title}

        Your {budget_info['period_type']} budget is {alert_type}.

        Budget Details:
        - Period: {budget_info['period_type']}
        - Limit: ${budget_info['limit_amount']:.2f}
        - Current Spend: ${budget_info['current_spend']:.2f}
        - Percentage Used: {budget_info['percentage_used']:.1f}%

        Please review your usage in the dashboard.
        """
        
        return await self.send_email(user_email, subject, message)

    async def send_usage_report_email(
        self, 
        user_email: str, 
        report_data: dict
    ) -> bool:
        """Send periodic usage report"""
        subject = f"📊 Your {report_data['period']} AI Usage Report"
        
        message = f"""
        Your {report_data['period']} AI Usage Report

        Summary:
        - Total Requests: {report_data['total_requests']:,}
        - Total Tokens: {report_data['total_tokens']:,}
        - Total Cost: ${report_data['total_cost']:.2f}
        - Average Cost per Request: ${report_data['avg_cost_per_request']:.4f}

        Top Models Used:
        """
        
        for model in report_data.get('top_models', [])[:3]:
            message += f"- {model['name']}: {model['requests']} requests (${model['cost']:.2f})\n"
        
        message += f"""
        
        View detailed analytics in your dashboard.
        """
        
        return await self.send_email(user_email, subject, message) 