export async function onRequestPost(context) {
  const { request } = context;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const formData = await request.json();

    const { name, email, phone, zip, evBrand, message, calcData } = formData;

    // Validate required fields
    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Build email content
    const estimateDetails = calcData ? `
CALCULATOR ESTIMATE:
- Panel situation: ${calcData.panelSituation === 'sub-panel' ? 'Needs sub-panel' : 'Space available'}
- Base install: $${calcData.baseInstall}
- Sub-panel cost: $${calcData.subPanelCost || 0}
- Permit (${calcData.permitInfo?.city || 'Twin Cities'}): $${calcData.permitCost}
- Subtotal: $${calcData.subtotal}
- Xcel rebate: -$${calcData.xcelRebate}
- Federal credit: -$${Math.round(calcData.federalCredit)}
- NET COST: $${Math.round(calcData.netCost)}
` : 'No calculator estimate provided';

    const emailBody = `
NEW EV CHARGER INSTALLATION LEAD

CONTACT INFO:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- ZIP Code: ${zip || 'Not provided'}
- EV Brand: ${evBrand || 'Not specified'}

MESSAGE:
${message || 'No message provided'}

${estimateDetails}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
Source: Twin Cities EV Installer Directory
`;

    // Send email via MailChannels
    const mailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'bganje@gmail.com', name: 'EV Directory Leads' }],
          },
        ],
        from: {
          email: 'leads@twincitiessolarevinstallers.com',
          name: 'TC EV Directory',
        },
        reply_to: {
          email: email,
          name: name,
        },
        subject: `New EV Install Lead: ${name} - ${zip || 'Twin Cities'}`,
        content: [
          {
            type: 'text/plain',
            value: emailBody,
          },
        ],
      }),
    });

    if (!mailResponse.ok) {
      const errorText = await mailResponse.text();
      console.error('MailChannels error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send email' }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Lead submitted successfully' }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error' }),
      { status: 500, headers }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
