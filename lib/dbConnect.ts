import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Vérifie si la variable d'environnement `MONGO_URI` est définie
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Interface pour gérer le cache Mongoose
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Ajout d'une déclaration globale pour TypeScript afin de gérer le cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Initialisation du cache global pour éviter des reconnections multiples
const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

// En mode développement, le cache global est attaché à `global`
if (process.env.NODE_ENV === "development") {
  global.mongooseCache = cached;
}

/**
 * Fonction pour connecter à MongoDB.
 * Elle utilise un cache global pour éviter des reconnections multiples.
 * @returns {Promise<typeof mongoose>} - Retourne l'objet de connexion Mongoose.
 */
const dbConnect = async (): Promise<typeof mongoose> => {
  // Si une connexion existe déjà, elle est retournée
  if (cached.conn) {
    return cached.conn;
  }

  // Si aucune connexion n'existe, une nouvelle promesse est créée pour la connexion
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI); // Connexion sans options inutiles
    cached.promise.catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
  }

  // Attente de la promesse pour établir la connexion et stockage dans le cache
  cached.conn = await cached.promise;
  return cached.conn;
};

/**
 * Fonction pour déconnecter de MongoDB.
 * Utile pour libérer les ressources, notamment lors des tests.
 */
export const dbDisconnect = async () => {
  if (cached.conn) {
    await mongoose.disconnect(); // Ferme la connexion existante
    cached.conn = null; // Réinitialise la connexion dans le cache
    cached.promise = null; // Réinitialise la promesse dans le cache
  }
};

// Exporte la fonction `dbConnect` comme méthode par défaut
export default dbConnect;
