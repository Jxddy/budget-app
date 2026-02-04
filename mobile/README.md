# 📱 BUDGET MANAGER - APPLICATION MOBILE REACT NATIVE

## ✅ APPLICATION MOBILE CRÉÉE !

Application React Native complète pour Android et iOS avec Expo.

---

## 🚀 INSTALLATION RAPIDE

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo CLI

### Installation

```bash
cd mobile

# Installer Expo CLI globalement (si pas déjà fait)
npm install -g expo-cli

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

---

## 📱 TESTER SUR VOTRE TÉLÉPHONE

### Option 1 : Expo Go (Plus rapide) ⭐

1. **Téléchargez Expo Go** sur votre téléphone :
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Lancez le projet** :
   ```bash
   cd mobile
   npm start
   ```

3. **Scannez le QR code** :
   - Android : Ouvrez Expo Go et scannez
   - iOS : Ouvrez l'appareil photo et scannez

4. L'app se charge automatiquement !

---

### Option 2 : Émulateur Android

```bash
# Installer Android Studio
# https://developer.android.com/studio

# Créer un émulateur dans Android Studio (AVD Manager)

# Lancer l'émulateur puis :
npm run android
```

---

### Option 3 : Simulateur iOS (Mac uniquement)

```bash
# Installer Xcode depuis l'App Store

# Lancer le simulateur :
npm run ios
```

---

## 📂 STRUCTURE DU PROJET MOBILE

```
mobile/
├── src/
│   ├── screens/          # Écrans de l'application
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── ...
│   ├── services/         # Services API (réutilisés du web)
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── budgetService.ts
│   │   └── transactionService.ts
│   ├── store/            # Redux (réutilisé du web)
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── budgetSlice.ts
│   │       └── transactionSlice.ts
│   └── components/       # Composants réutilisables
├── App.tsx               # Point d'entrée
├── app.json              # Configuration Expo
└── package.json
```

---

## 🎨 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Authentification
- [x] Écran de connexion
- [x] Écran d'inscription
- [x] Stockage sécurisé des tokens (AsyncStorage)
- [x] Auto-refresh JWT

### ✅ Dashboard
- [x] Vue d'ensemble du budget
- [x] Cartes statistiques (Budget/Dépensé/Restant)
- [x] Barre de progression
- [x] Liste des sous-budgets
- [x] Pull-to-refresh

### ✅ Navigation
- [x] Bottom Tab Navigator (4 onglets)
- [x] Stack Navigator pour les écrans
- [x] Icônes Material Community

### ✅ Design
- [x] React Native Paper (Material Design)
- [x] Thème cohérent avec la version web
- [x] Responsive
- [x] Mode sombre (à activer)

---

## ⚙️ CONFIGURATION

### Modifier l'URL de l'API

Éditez `src/services/api.ts` :

```typescript
// Pour tester sur votre téléphone, utilisez l'IP locale :
const API_BASE_URL = 'http://192.168.1.X:5000/api/v1';

// Pour tester sur émulateur Android :
// const API_BASE_URL = 'http://10.0.2.2:5000/api/v1';

// Pour production :
// const API_BASE_URL = 'https://votre-api.com/api/v1';
```

**Comment trouver votre IP locale :**
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig

# Cherchez l'adresse IPv4 (ex: 192.168.1.10)
```

---

## 📦 BUILD POUR PRODUCTION

### Android (APK)

```bash
# Build APK pour tester
expo build:android -t apk

# Build AAB pour Google Play Store
expo build:android -t app-bundle
```

### iOS (IPA)

```bash
# Build pour l'App Store
expo build:ios
```

### Méthode moderne (EAS Build)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurer
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

---

## 📱 PUBLICATION SUR LES STORES

### Google Play Store

1. **Créer un compte développeur** (25$ one-time)
2. **Générer le AAB** : `expo build:android -t app-bundle`
3. **Aller sur** : [Google Play Console](https://play.google.com/console)
4. **Créer une nouvelle app**
5. **Uploader le AAB**
6. **Remplir les informations** (description, screenshots)
7. **Soumettre pour review**

### Apple App Store

1. **Créer un compte développeur** (99$/an)
2. **Générer l'IPA** : `expo build:ios`
3. **Aller sur** : [App Store Connect](https://appstoreconnect.apple.com)
4. **Créer une nouvelle app**
5. **Uploader avec Transporter**
6. **Remplir les informations**
7. **Soumettre pour review**

---

## 🎯 ÉCRANS À DÉVELOPPER

Les bases sont créées, il reste à développer :

### Écrans principaux
- [ ] Écran Liste des Budgets
- [ ] Écran Détail d'un Budget
- [ ] Écran Création de Budget
- [ ] Écran Liste des Transactions
- [ ] Écran Création de Transaction
- [ ] Écran Profil utilisateur
- [ ] Écran Paramètres

### Composants
- [ ] Modal création sous-budget
- [ ] Sélecteur de catégorie
- [ ] Graphiques (react-native-chart-kit)
- [ ] Calendrier pour dates
- [ ] Filtres avancés

**Voulez-vous que je crée ces écrans supplémentaires ?**

---

## 🐛 DÉBOGAGE

### L'app ne se connecte pas au backend

1. **Vérifiez que le backend est lancé** :
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Vérifiez l'URL dans `src/services/api.ts`**
   - Sur téléphone : utilisez votre IP locale
   - Sur émulateur Android : `10.0.2.2`
   - Sur simulateur iOS : `localhost`

3. **Testez l'API** :
   ```bash
   curl http://VOTRE_IP:5000/api/v1/health
   ```

### Expo Go ne charge pas

```bash
# Nettoyer le cache
expo start --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

---

## 📚 RESSOURCES

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 🎉 PROCHAINES ÉTAPES

1. **Tester l'app sur votre téléphone** avec Expo Go
2. **Développer les écrans manquants**
3. **Ajouter des graphiques**
4. **Implémenter les notifications push**
5. **Build et publier sur les stores**

---

**Version mobile créée avec succès ! 🎉**

**Besoin d'aide pour lancer l'app ? Dites-moi !**
