import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where, orderBy, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const getDayBoundaries = (dateString) => {
  const startOfDay = new Date(dateString);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(dateString);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString()
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateQuery = searchParams.get("date");

    const sensorRef = collection(db, "sensor3");
    let q;

    if (dateQuery) {
      const { start, end } = getDayBoundaries(dateQuery);
      q = query(
        sensorRef,
        where("timestamp", ">=", start),
        where("timestamp", "<=", end),
        orderBy("timestamp", "asc")
      );
    } else {
      q = query(sensorRef, orderBy("timestamp", "asc"));
    }

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      idDoc: doc.id,
      ...doc.data(),
      moisture: parseFloat(doc.data().moisture),
      tempt: parseFloat(doc.data().tempt),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { moisture, tempt } = await request.json();
    const newData = {
      moisture: parseFloat(moisture),
      tempt: parseFloat(tempt),
      timestamp: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "sensor3"), newData);

    return NextResponse.json({ success: true, idDoc: docRef.id, ...newData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
