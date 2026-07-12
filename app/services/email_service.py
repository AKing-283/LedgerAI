import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def send_password_reset_email(to_email: str, token: str, org_name: str = "LedgerAI"):
    """
    Send a password reset email with a secure link via Gmail SMTP.
    """
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    if not SMTP_USER or not SMTP_PASSWORD:
        logger.error("SMTP_USER or SMTP_PASSWORD is not set in environment variables")
        return False

    try:
        # Build email
        msg = MIMEMultipart("alternative")
        msg["From"] = f"LedgerAI <{SMTP_USER}>"
        msg["To"] = to_email
        msg["Subject"] = "Reset your LedgerAI password"

        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #111827;">Password Reset Request</h2>
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
                We received a request to reset the password for your <strong>{org_name}</strong> account.
            </p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="{reset_link}"
                   style="display: inline-block; padding: 14px 28px; background: #6366f1; color: white;
                          text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
                    Reset Password
                </a>
            </div>
            <p style="color: #6b7280; font-size: 13px;">
                This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">
                LedgerAI &bull; AI-Powered Accounting
            </p>
        </div>
        """

        msg.attach(MIMEText(html_content, "html"))

        # Send via SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())

        logger.info(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False