/**
 * Configuration de sécurité pour l'API
 * Rate limiting et validation
 */

/**
 * Valide le JWT_SECRET au démarrage
 * Lance une erreur si invalide
 */
export function validateJwtSecret(): void {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      '❌ JWT_SECRET est requis! Définissez JWT_SECRET dans votre fichier .env'
    );
  }

  if (jwtSecret.length < 32) {
    throw new Error(
      `❌ JWT_SECRET trop court! Il doit contenir au moins 32 caractères (actuellement: ${jwtSecret.length} caractères)`
    );
  }

  console.log('✅ JWT_SECRET validé (longueur: ' + jwtSecret.length + ' caractères)');
}

/**
 * Configuration du rate limiting
 */
export const rateLimitConfig = {
  global: true,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),       // 100 requêtes
  timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',  // par minute
  errorResponseBuilder: (request: any, context: any) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Trop de requêtes. Réessayez dans ${context.after}`,
      retryAfter: context.after
    }
  })
};

/**
 * Rate limit spécifique pour les routes d'authentification
 */
export const authRateLimitConfig = {
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),    // 5 tentatives
  timeWindow: process.env.AUTH_RATE_LIMIT_WINDOW || '1 minute'
};

/**
 * Valide toutes les variables d'environnement requises
 */
export function validateEnvironment(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET'];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Variables d'environnement manquantes: ${missing.join(', ')}\n` +
      'Créez un fichier .env avec ces variables.'
    );
  }

  // Validate JWT_SECRET
  validateJwtSecret();

  console.log('✅ Toutes les variables d\'environnement requises sont présentes');
}
