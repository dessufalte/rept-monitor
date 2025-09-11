import { firestoreAdmin } from "@/app/lib/firebaseadmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await firestoreAdmin.collection("sensor3").get();
    const data = snapshot.docs.map((doc) => ({
      idDoc: doc.id,
      ...doc.data(),
    }));

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { moisture, tempt } = await request.json();
    const newData = { moisture, tempt, timestamp: new Date().toISOString() };
    const docRef = await firestoreAdmin.collection("sensor3").add(newData);
    return NextResponse.json({ success: true, idDoc: docRef.id, ...newData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
