import { firestoreAdmin } from "@/app/lib/firebaseadmin";
import { NextResponse } from "next/server";

// Referensi ke dokumen Firestore Anda.
const docRef = firestoreAdmin.collection("setting").doc("RCdo66cmMpFYigXsSxJT");

// Fungsi GET untuk mengambil data pengaturan.
export async function GET() {
  try {
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: docSnap.data() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Fungsi PATCH untuk memperbarui data pengaturan.
export async function PATCH(req) {
  try {
    const body = await req.json();
    if (!body.LED_TXT) {
      return NextResponse.json({ success: false, error: "LED_TXT is required" }, { status: 400 });
    }
    
    // Memperbarui dokumen dengan nilai LED_TXT yang baru.
    await docRef.update({ LED_TXT: body.LED_TXT });
    
    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
