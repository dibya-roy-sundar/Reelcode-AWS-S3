const dotenv=require("dotenv")
dotenv.config()

module.exports.MailTemplate = (otp) => {

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            background-color: #18181b;
            color: #ffffff;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #27272a;
            border-radius: 8px;
            padding: 40px 20px;
        }
        span{
            color:white;
        }

        /* Custom Logo Styles */
        .logo-container {
            width: 64px;
            height: 64px;
            margin: 0 auto 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        .logo-text {
            letter-spacing: -2px;
        }

        .header {
            text-align: center;
            margin-bottom: 32px;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            color: #ffffff;
        }

        .header p {
            color: #a1a1aa;
            font-size: 16px;
        }

        .otp-container {
            background-color: #3f3f46;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            margin: 24px 0;
            letter-spacing: 8px;
            font-family: monospace;
            font-size: 24px;
            font-weight: bold;
        }

        .instructions {
            text-align: center;
            color: #a1a1aa;
            font-size: 14px;
            margin-bottom: 32px;
        }

        .support {
            text-align: center;
            padding: 24px 0;
            border-top: 1px solid #3f3f46;
            margin-top: 24px;
        }

        .support a {
            color: #F59E0B;
            text-decoration: none;
        }

        .support a:hover {
            text-decoration: underline;
        }

        .social-links {
            text-align: center;
            margin: 24px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #F59E0B;
            text-decoration: none;
        }

        .social-links svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .footer {
            text-align: center;
            color: #71717a;
            font-size: 12px;
            margin-top: 32px;
        }
        
        .instructions span{
            font-size:1.2rem;
        }

        @media only screen and (max-width: 480px) {
            body {
                padding: 10px;
            }

            .container {
                padding: 20px 15px;
            }

            .otp-container {
                font-size: 20px;
                letter-spacing: 6px;
            }
        }

        .logo-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo with link and image -->
        <a href=${process.env.CLIENT_URL} target="_blank" style="text-decoration: none;">
            <div class="logo-container">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-PS97iPnrFjNhEhtAEyQn10N3gOXXyt.png" alt="ReelCode Logo" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
        </a>
        
        <div class="header">
            <h1>Verify your email</h1>
            <p>Please enter this verification code to verify your account in <a style="text-decoration: none;" href=${process.env.CLIENT_URL}><span>Reelcode</span></a> </p>
        </div>

        <div class="otp-container">
           <span>${otp}</span>
        </div>

        <div class="instructions">
            This code will expire in  <span><strong>${process.env.OTP_EXPIRY / 60}</strong></span>  minutes.<br>
            If you didn't request this code, you can  ignore this email.
        </div>

        <div class="social-links">
            <a href="https://twitter.com/reelcode" target="_blank">
                <svg viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
            </a>
            <a href="https://github.com/reelcode" target="_blank">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
            </a>
            <a href="https://linkedin.com/company/reelcode" target="_blank">
                <svg viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </a>
        </div>

        <div class="support">
            Need help? Contact our support team at<br>
            <a href="mailto:support@reelcode.com">support@reelcode.com</a>
        </div>

        <div class="footer">
            © 2024 ReelCode. All rights reserved.<br>
            Learn coding concepts in 60-second bite-sized video lessons
        </div>
    </div>
</body>
</html>
`
}

