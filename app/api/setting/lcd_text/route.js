import { db } from "@/lib/firebase"; // import Firestore instance
import { doc, getDoc, updateDoc } from "firebase/firestore";

const docRef = doc(db, "setting", "RCdo66cmMpFYigXsSxJT");

export async function GET() {
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Document not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ LED_TXT: docSnap.data().LED_TXT }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    if (!body.LED_TXT) {
      return new Response(JSON.stringify({ error: "LED_TXT is required" }), { status: 400 });
    }
    await updateDoc(docRef, { LED_TXT: body.LED_TXT });
    return new Response(JSON.stringify({ message: "Updated successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
