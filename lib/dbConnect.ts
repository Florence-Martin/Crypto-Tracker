import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Interface pour la gestion du cache Mongoose
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Ajoute une déclaration globale dans TypeScript
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Utilise un cache global pour éviter des connexions multiples en mode développement
const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV === "development") {
  global.mongooseCache = cached; // Affecte le cache global uniquement en développement
}

const dbConnect = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn; // Retourne la connexion existante
  }

  if (!cached.promise) {
    // Crée une promesse pour la connexion à MongoDB
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise; // Attend la promesse et stocke la connexion
  return cached.conn; // Retourne la connexion
};

export default dbConnect;
