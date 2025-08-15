# RTPA : ready tailwindcss project assistant

Un outil en ligne de commande (CLI) simple pour automatiser la configuration d'un projet web de base avec **Tailwind CSS V4**. Il permet de démarrer rapidement un projet sans avoir à configurer manuellement toutes les dépendances et les fichiers de configuration et permet l'installation automatique des dépendances npm, tout en offrant la possibilité d'automatiser également les étapes de publication de votre code sur un dépot github.

---

## Fonctionnalités

-   **Installation rapide** des dépendances (`tailwindcss @tailwindcss/cli`).
-   **Création de la structure de fichiers** de base (`css/input.css`, `index.html`, `.gitignore`).
-   **Configuration automatique** des fichiers `package.json` et `.gitignore`.
-   **Initialisation d'un dépôt Git** et création d'un fichier `.gitignore`.
-   **Ajout d'un script de démarrage** (`npm run start`) dans `package.json` pour compiler Tailwind en mode *watch*.
-   **Connectivité GitHub** : Crée un dépôt sur votre compte GitHub (public ou privé) et y pousse votre projet initial.

---

## Installation

Pour utiliser l'outil, vous devez l'installer globalement via npm. Assurez-vous d'avoir Node.js et git d'installé sur votre machine.

```bash
npm install -g rtpa
```

## Utilisation

Pour créer un nouveau projet Tailwind CSS, exécutez la commande suivante dans le terminal :

```bash
rtpa 
```

Un shell interactif vous guidera pour choisir le type de projet, lui donner un nom, et vous proposera de vous connecter à GitHub.

## Connexion à GitHub

L'outil vous propose de vous connecter à votre compte GitHub pour créer un dépôt et y pousser le projet automatiquement. Vous pouvez choisir de vous connecter ou de continuer sans créer de repo.

Si vous choisissez de vous connecter à GitHub, l'outil vous demandera votre token d'accès personnel (PAT). Ce token est nécessaire pour que le script puisse créer et pousser le dépôt en votre nom.

### Comment obtenir votre token d'accès personnel (PAT) :

- Rendez-vous sur les (Paramètres des jetons d'accès personnels de GitHub)[https://github.com/settings/tokens].

- Cliquez sur "Generate new token" (Générer un nouveau jeton).

- Choisissez le token classic

- Donnez un nom explicite à votre token (`ex: cli-tailwind-tool`).

- Cochez la case pour la permission `repo` (pour créer un dépôt).

- Cliquez sur "Generate token" et copiez le token affiché. Gardez-le en lieu sûr, il ne sera plus affiché après !

## Note : 

Votre token n'est stocké nulle part. Il est utilisé une seule fois lors de l'exécution du script pour authentifier votre requête à l'API de GitHub. ceci garanti la sécurité de votre compte github.



coded with love by @likeur