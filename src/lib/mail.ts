/**
 * MISSION CRITICAL TELEMETRY: Brevo SMTP Handshake
 * Used for authorization key (OTP) dispatch to grid operators.
 */
export async function sendOTPEmail(email: string, otp: string) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const requestTime = new Date().toLocaleString();

    // High-Reliability Simple Responsive Email Template
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; background-color: #f8fafc; border-radius: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-bottom: 20px; font-weight: 800; letter-spacing: -0.025em;">CrisisLens AI Connection Request</h2>
        <p style="color: #64748b; font-size: 15px; margin-bottom: 30px; line-height: 1.5;">An operator has initiated a neural link to the CrisisLens AI grid. Use the authorization key below to finalize the handshake.</p>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 16px; text-align: center; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <span style="display: block; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 12px; text-transform: uppercase;">UPLINK AUTHORIZATION KEY</span>
          <span style="font-size: 36px; font-family: monospace; font-weight: 900; color: #1e40af; letter-spacing: 0.25em;">${otp}</span>
        </div>
        
        <p style="color: #94a3b8; font-size: 11px; margin-top: 30px; text-transform: uppercase; font-weight: 700; text-align: center; letter-spacing: 0.05em;">Code expires in 5 minutes.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #cbd5e1; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
          Connection Source: ${requestTime} <br/>
          Secure Node ID: ${email.substring(0, 3)}***${email.substring(email.indexOf('@') - 1)}<br/>
          &copy; 2026 CrisisLens Aerospace & Defense
        </div>
      </div>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey || ''
      },
      body: JSON.stringify({
        sender: { name: 'CrisisLens AI Node', email: 'adhiljoyappu@gmail.com' },
        to: [{ email }],
        subject: `Your Authorization Key: ${otp}`,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
       console.error("Critical: Brevo SMTP API Error Output:", data);
       return { success: false, error: data };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Critical: Telemetry dispatch failure (Fatal):", err);
    return { success: false, error: err };
  }
}
