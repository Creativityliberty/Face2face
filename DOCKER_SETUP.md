# 🐳 Docker Setup Guide - Video Funnel Builder

Ce guide vous permet de lancer l'environnement de développement complet avec Docker Compose.

## 📋 Prérequis

- Docker Desktop installé et en cours d'exécution
- Docker Compose (inclus avec Docker Desktop)
- Git pour cloner le projet

## 🚀 Démarrage Rapide

### 1. Lancement de l'environnement de développement

```bash
# Lancer tous les services en mode développement
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Ou en arrière-plan
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

### 2. Vérification des services

Une fois lancé, vous aurez accès à :

- **Backend API** : http://localhost:3001
- **Health Check** : http://localhost:3001/health
- **PostgreSQL** : localhost:5432
- **pgAdmin** : http://localhost:5050

### 3. Connexion pgAdmin

- **URL** : http://localhost:5050
- **Email** : admin@videofunnel.com
- **Mot de passe** : admin123

Pour ajouter le serveur PostgreSQL dans pgAdmin :
- **Host** : postgres
- **Port** : 5432
- **Database** : video_funnel_builder
- **Username** : postgres
- **Password** : postgres_password

## 🛠️ Commandes Utiles

### Gestion des conteneurs

```bash
# Voir les logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache
```

### Base de données

```bash
# Accéder au conteneur PostgreSQL
docker exec -it video-funnel-db psql -U postgres -d video_funnel_builder

# Exécuter les migrations Prisma
docker exec -it video-funnel-backend npx prisma migrate dev

# Réinitialiser la base de données
docker exec -it video-funnel-backend npx prisma migrate reset
```

### Backend

```bash
# Accéder au conteneur backend
docker exec -it video-funnel-backend sh

# Voir les logs en temps réel
docker logs -f video-funnel-backend

# Redémarrer le backend
docker-compose restart backend
```

## 🔧 Configuration

### Variables d'environnement

Les variables principales sont configurées dans `docker-compose.yml` et `docker-compose.dev.yml` :

- **DATABASE_URL** : Connexion PostgreSQL automatique
- **JWT_SECRET** : Clé JWT pour le développement
- **FRONTEND_URL** : URL du frontend (http://localhost:5173)
- **GOOGLE_API_KEY** : À configurer plus tard

### Volumes persistants

- **postgres_data** : Données PostgreSQL persistantes
- **pgadmin_data** : Configuration pgAdmin persistante
- **uploads_data** : Fichiers uploadés

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Vérifier les ports utilisés
   lsof -i :3001
   lsof -i :5432
   ```

2. **Problème de permissions**
   ```bash
   # Réinitialiser les permissions
   sudo chown -R $USER:$USER .
   ```

3. **Base de données corrompue**
   ```bash
   # Supprimer le volume et redémarrer
   docker-compose down -v
   docker-compose up --build
   ```

4. **Cache Docker**
   ```bash
   # Nettoyer le cache Docker
   docker system prune -a
   ```

### Logs de débogage

```bash
# Logs détaillés de tous les services
docker-compose logs --tail=100 -f

# Logs spécifiques
docker-compose logs backend
docker-compose logs postgres
```

## 📊 Monitoring

### Health Checks

- **Backend** : http://localhost:3001/health
- **PostgreSQL** : Intégré dans Docker Compose

### Métriques

```bash
# Statistiques des conteneurs
docker stats

# Espace disque utilisé
docker system df
```

## 🔄 Workflow de développement

1. **Démarrer l'environnement**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

2. **Développer** : Les changements de code sont automatiquement détectés (hot reload)

3. **Tester les APIs** : Utiliser Postman ou curl sur http://localhost:3001

4. **Gérer la DB** : Utiliser pgAdmin sur http://localhost:5050

5. **Arrêter** : `docker-compose down`

## 🚀 Production

Pour la production, utiliser uniquement :
```bash
docker-compose up -d --build
```

Cela utilisera le Dockerfile optimisé sans les outils de développement.

## 📝 Notes

- Le hot reload fonctionne automatiquement en mode développement
- Les migrations Prisma sont exécutées automatiquement au démarrage
- pgAdmin est optionnel et peut être désactivé si non nécessaire
- Tous les services utilisent un réseau Docker personnalisé pour la sécurité
