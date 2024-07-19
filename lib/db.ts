import mongoose, { ConnectOptions } from 'mongoose';
import { MongooseCache } from '@/types/mongoose';
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI as string, {} as ConnectOptions)
            .then((mongoose) => {
                return mongoose;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
