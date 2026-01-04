import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";

export default async function name(params) {

    await initMongoose();
    const session = getServerSession(authOptions);
    const {destination} = requestAnimationFrame.body;
}