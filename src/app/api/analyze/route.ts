import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ success: false, error: "Unauthorized access detected." }, { status: 401 });
    }

    const { description, image } = await req.json();
    const userEmail = session.email as string;

    if (!description && !image) {
      return NextResponse.json({ success: false, error: "Description or Image data is required for analysis." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn("No GEMINI_API_KEY/GOOGLE_API_KEY found. Falling back to dynamic mock response.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const desc = description?.toLowerCase() || "";
      let type = "Security Threat";
      let severity = "MEDIUM";
      let actions = ["Secure perimeter", "Verify identification", "Alert supervisors"];
      let riskLevel = 75;

      if (desc.includes('fire') || desc.includes('smoke')) {
        type = "Fire Emergency";
        severity = "CRITICAL";
        actions = ["Evacuate building", "Activate fire suppression", "Call Fire Dept"];
        riskLevel = 98;
      } else if (desc.includes('blood') || desc.includes('medical') || desc.includes('injury')) {
        type = "Medical Crisis";
        severity = "HIGH";
        actions = ["Stop bleeding", "Perform CPR if needed", "Monitor vital signs"];
        riskLevel = 88;
      } else if (desc.includes('flood') || desc.includes('water')) {
        type = "Structural Failure";
        severity = "MEDIUM";
        actions = ["Shut off water supply", "Protect electronics", "Relocate to dry area"];
        riskLevel = 60;
      }

      const mockReport = {
        id: `ALRT-${Math.floor(1000 + Math.random() * 9000)}`,
        email: userEmail,
        type,
        severity,
        status: 'ACTIVE' as const,
        location: "Visual Telemetry - Zone 4",
        time: "JUST NOW",
        pulse: severity === "CRITICAL" || severity === "HIGH",
        description: description?.substring(0, 150) || "Analysis completed via visual telemetry stream.",
        riskLevel,
        confidence: 94,
        actions
      };
      
      db.saveReport(mockReport);
      return NextResponse.json({ success: true, data: mockReport });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an emergency response AI.
      Analyze the provided image and text description.
      
      User input: "${description || "None"}"
      
      Instructions:
      - Use the IMAGE as the primary source of truth.
      - Use the TEXT as additional context.
      - Identify the correct emergency type: Fire, Medical, or Security.
      - Determine severity: Low, Medium, High, Critical.
      - Provide 3 immediate actions.

      Rules:
      - If fire is visible → type = Fire, risk = Critical.
      - If injury/bleeding → type = Medical.
      - If threat/suspicious → type = Security.
      - Be accurate based on what you SEE in the image.

      Return ONLY JSON:
      {
        "type": "",
        "risk": "Low" | "Medium" | "High" | "Critical",
        "confidence": 0-100,
        "actions": ["", "", ""]
      }
    `;

    let result;
    if (image) {
      const base64Data = image.split(",")[1] || image;
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      };
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    let responseText = result.response.text().trim();
    responseText = responseText.replace(/^[^{]*{/g, '{').replace(/}[^}]*$/g, '}');

    let aiData;
    try {
      aiData = JSON.parse(responseText);
    } catch {
       throw new Error("Invalid response format from Gemini");
    }

    const sanitizedData = {
      type: aiData.type || "Undefined Incident",
      risk: (aiData.risk || "Medium").toUpperCase(),
      confidence: typeof aiData.confidence === 'number' ? aiData.confidence : 88,
      actions: Array.isArray(aiData.actions) ? aiData.actions : ["Assess situation", "Call backup"]
    };

    const severityMap: Record<string, string> = {
      "LOW": "LOW",
      "MEDIUM": "MEDIUM",
      "HIGH": "HIGH",
      "CRITICAL": "CRITICAL"
    };

    const riskLevelMap: Record<string, number> = {
      "LOW": 25,
      "MEDIUM": 50,
      "HIGH": 75,
      "CRITICAL": 95
    };

    const savedReport = {
      id: `ALRT-${Math.floor(1000 + Math.random() * 9000)}`,
      email: userEmail,
      type: sanitizedData.type,
      severity: severityMap[sanitizedData.risk] || "MEDIUM",
      status: 'ACTIVE' as const,
      location: "Visual Telemetry Feed",
      time: "JUST NOW",
      pulse: sanitizedData.risk === "CRITICAL" || sanitizedData.risk === "HIGH",
      description: (description || "Visual-only report").substring(0, 150),
      riskLevel: riskLevelMap[sanitizedData.risk] || 75,
      confidence: sanitizedData.confidence,
      actions: sanitizedData.actions
    };

    db.saveReport(savedReport);

    // LOG ACTIVITY: REPORT
    db.logActivity({
      email: userEmail,
      action: 'REPORT',
      data: { id: savedReport.id, type: savedReport.type, severity: savedReport.severity }
    });

    // LOG ACTIVITY: ANALYSIS
    db.logActivity({
       email: userEmail,
       action: 'ANALYSIS',
       data: { 
          id: savedReport.id, 
          risk: sanitizedData.risk, 
          confidence: sanitizedData.confidence 
       }
    });

    return NextResponse.json({ success: true, data: savedReport });
  } catch (error) {
    console.error("AI Analysis error:", error);
    return NextResponse.json({ success: false, error: "AI processing failed" }, { status: 500 });
  }
}
