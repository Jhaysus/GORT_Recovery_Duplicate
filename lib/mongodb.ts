import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
console.log("Available Mongo env:", {
  MONGODB_URI: Boolean(process.env.MONGODB_URI),
  MONGO_URL: Boolean(process.env.MONGO_URL),
});

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, reuse the cached connection across hot reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a fresh connection
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;