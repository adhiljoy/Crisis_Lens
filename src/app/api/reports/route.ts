import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let reports = db.getReports();
    
    // If not admin, only show user's own reports
    if (session.role !== 'admin') {
      reports = reports.filter(r => r.email === session.email);
    }

    return NextResponse.json({ success: true, data: reports }); 
  } catch (error) {
     return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
       return NextResponse.json({ success: false, error: "Missing ID or status" }, { status: 400 });
    }

    db.updateReportStatus(id, status);
    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Failed to update report:", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}
