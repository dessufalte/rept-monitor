import { db } from "@/app/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const docRef = doc(db, "setting", "RCdo66cmMpFYigXsSxJT");


export async function GET() {
  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
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

export async function PATCH(req) {
  try {
    const body = await req.json();
    if (!body.LED_TXT) {
      return NextResponse.json({ success: false, error: "LED_TXT is required" }, { status: 400 });
    }

    await updateDoc(docRef, { LED_TXT: body.LED_TXT });

    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
