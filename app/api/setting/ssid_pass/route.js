import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const docRef = doc(db, "setting", "RCdo66cmMpFYigXsSxJT");

export async function GET() {
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  return new Response(JSON.stringify({ SSID_PASS: docSnap.data().SSID_PASS }), { status: 200 });
}

export async function PATCH(req) {
  const body = await req.json();
  if (!body.SSID_PASS) return new Response(JSON.stringify({ error: "SSID_PASS required" }), { status: 400 });
  await updateDoc(docRef, { SSID_PASS: body.SSID_PASS });
  return new Response(JSON.stringify({ message: "Updated successfully" }), { status: 200 });
}
