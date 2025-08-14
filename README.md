# RTPA : ready tailwindcss project assistant

Un outil en ligne de commande (CLI) simple pour automatiser la configuration d'un projet web de base avec **Tailwind CSS V4**. Il permet de démarrer rapidement un projet sans avoir à configurer manuellement toutes les dépendances et les fichiers de configuration et permet l'installation automatique des dépendances npm.

---

## Fonctionnalités

-   **Installation rapide** des dépendances (`tailwindcss @tailwindcss/cli`).
-   **Création de la structure de fichiers** de base (`css/input.css`, `index.html`, `.gitignore`).
-   **Configuration automatique** des fichiers `package.json` et `.gitignore`.
-   **Initialisation d'un dépôt Git** et création d'un fichier `.gitignore`.
-   **Ajout d'un script de démarrage** (`npm run start`) dans `package.json` pour compiler Tailwind en mode *watch*.

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

Puis suivez les étapes pour créer le projet.

L'outil n'en est qu'à sa première version, des améliorations y seront apportés dans les jours qui suivent.

coded with love by @likeur