# Blog App – Django REST API & Angular Frontend

Application de blog complète construite avec **Django REST Framework** (backend API) et **Angular** (frontend SPA).
Elle met en avant des fonctionnalités modernes : **authentification JWT**, permissions personnalisées, commentaires, filtrage avancé côté front, et intégration soignée entre front et back.

## 🧱 Architecture

- **Backend** : Django + Django REST Framework
	- API JSON pour articles, catégories, tags, auteurs, commentaires
	- Authentification via **JWT (SimpleJWT)**
- **Frontend** : Angular
	- SPA responsive avec Bootstrap 5 + Bootstrap Icons
	- Gestion de l’authentification, appels API, filtrage, formulaire de commentaires

## ✨ Fonctionnalités principales

### Backend (Django / DRF)

- **Modèle de blog complet**
	- `Author`, `Category`, `Tag`, `Article`, `Comment`
	- Slugs automatiques pour catégories/tags/articles
	- Relations :
		- `Article` ↔ `Author`, `Category`, `Tag(s)`
		- `Comment` ↔ `Article`

- **API RESTful**
	- `GET /api/articles/` – liste des articles
	- `GET /api/articles/<id>/` – détail d’un article (avec commentaires imbriqués)
	- `POST /api/articles/` – création d’article (authentifié)
	- `PUT/PATCH/DELETE /api/articles/<id>/` – édition/suppression
	- `GET /api/categories/`, `GET /api/tags/`
	- `GET/POST/DELETE /api/comments/` (selon permissions)

- **Sérialisation avancée**
	- `ArticleSerializer` :
		- `author_name` (champ dérivé)
		- `category` + `tags` sérialisés de façon imbriquée
		- `comments` renvoyés avec chaque article (via `SerializerMethodField`)
	- `CommentSerializer` :
		- champ `can_delete` calculé en fonction de l’utilisateur courant (`request.user`)

- **Authentification & Permissions**
	- JWT avec **SimpleJWT** :
		- `POST /api/token/` – obtenir `access` + `refresh`
		- `POST /api/token/refresh/` – rafraîchir le token
	- Permissions personnalisées (`IsAuthorOrAdminOrReadOnly`, `isAdmin`)
		- Seul l’auteur ou un admin peut modifier/supprimer un article/commentaire
	- `UserSerializer` pour exposer les infos de l’utilisateur + ses permissions/groupes

### Frontend (Angular)

- **Liste des articles**
	- Affichage des articles avec auteur, date, catégorie, tags
	- Aperçu de contenu tronqué
	- Boutons `Lire plus`, `Éditer`, `Supprimer` (suivant l’authentification)

- **Filtrage & recherche**
	- Barre de recherche par **mot-clé** (titre/contenu)
	- Filtre par **catégorie** / **tag**
	- Logique de filtrage combinée : term seul, catégorie/tag seul, ou les deux

- **Détail d’article**
	- Affichage de l’article (titre, image, contenu, auteur)
	- Section **commentaires** :
		- Liste des commentaires existants avec :
			- Initiale dans un avatar rond
			- Nom, email, date, contenu
			- Champ `can_delete` géré côté backend pour l’UI
	- Formulaire de **commentaire** :
		- Nom, email, contenu
		- Validation HTML5 + Angular (`ngForm`, `required`, `type="email"`, etc.)

- **Authentification & sécurité**
	- Page de login qui appelle `/api/token/` (JWT)
	- **HttpInterceptor** Angular :
		- Ajout automatique du header `Authorization: Bearer <token>` sur les requêtes API
	- Service d’auth (`AuthService`) :
		- Stockage du token, login/logout, méthode `isAuth()` pour le template
	- Affichage conditionnel des boutons sensibles (`Éditer`, `Supprimer`, etc.) selon l’état d’authentification

- **UI / UX**
	- Bootstrap 5 + **Bootstrap Icons** (via CDN)
	- Layout responsive :
		- Colonne principale (articles)
		- Sidebar (recherche, catégories, tags)
	- Écran “Aucun article trouvé” avec icône et message centré

## 🚀 Démarrer le projet

### Backend – Django API 

Dans le projet Django, typiquement :

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

L’API est exposée sur `http://127.0.0.1:8000/api/`.

### Frontend – Angular (ce dépôt)

```bash
npm install
ng serve
```

Par défaut : `http://localhost:4200/`.

Configurer l’URL de l’API dans `src/environments/environment.ts` :

```ts
export const environment = {
	production: false,
	apiUrl: 'http://127.0.0.1:8000/api'
};
```

Build de production :

```bash
npm run build -- --configuration production
```

## 🧪 Authentification JWT – Flow

1. L’utilisateur se connecte via le formulaire Angular.
2. Le front appelle `POST /api/token/` (SimpleJWT) avec `username` + `password`.
3. L’API renvoie `access` + `refresh`.
4. L’**interceptor Angular** stocke le token et ajoute `Authorization: Bearer <access>` à chaque requête API.
5. Le backend applique les permissions (`IsAuthenticatedOrReadOnly`, `IsAuthorOrAdminOrReadOnly`, etc.) en se basant sur `request.user`.
