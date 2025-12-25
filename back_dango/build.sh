#!/usr/bin/env bash
# Script de build pour Render

set -o errexit  # Arrêter en cas d'erreur

# Installer les dépendances Python
pip install -r requirements.txt

# Aller dans le dossier src
cd src

# Collecter les fichiers statiques
python manage.py collectstatic --no-input

# Appliquer les migrations
python manage.py migrate
