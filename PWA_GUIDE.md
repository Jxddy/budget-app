# 📱 PWA - PROGRESSIVE WEB APP

## ✅ Configuration PWA ajoutée !

Votre Budget Manager peut maintenant être installé comme une application mobile sur Android et iOS.

---

## 📦 INSTALLATION DES DÉPENDANCES

```bash
cd frontend
npm install -D vite-plugin-pwa
```

---

## 🎨 CRÉER LES ICÔNES

Vous avez besoin de 2 icônes :
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

### Option 1 : Créer vous-même
Utilisez un outil comme [Figma](https://figma.com) ou Photoshop

### Option 2 : Générateur en ligne
1. Allez sur https://realfavicongenerator.net/
2. Uploadez votre logo
3. Téléchargez les icônes

### Option 3 : Icône simple (temporaire)
Créez un carré bleu avec le texte "B" au centre

---

## 🚀 DÉPLOIEMENT

### 1. Build l'application
```bash
cd frontend
npm run build
```

### 2. Déployez sur Vercel/Netlify
```bash
# Vercel
npm install -g vercel
vercel

# Netlify
npm install -g netlify-cli
netlify deploy --prod
```

### 3. Activez HTTPS (obligatoire pour PWA)
Vercel et Netlify activent HTTPS automatiquement

---

## 📲 INSTALLATION SUR MOBILE

### **Android (Chrome):**
1. Ouvrez votre site dans Chrome
2. Menu (⋮) → "Installer l'application"
3. L'icône apparaît sur l'écran d'accueil

### **iOS (Safari):**
1. Ouvrez votre site dans Safari
2. Touchez le bouton Partage (⬆️)
3. "Sur l'écran d'accueil"
4. Touchez "Ajouter"

---

## ✨ FONCTIONNALITÉS PWA

✅ Fonctionne hors ligne
✅ Installation sur écran d'accueil
✅ Plein écran (comme une app native)
✅ Notifications push (avec configuration supplémentaire)
✅ Cache intelligent
✅ Mises à jour automatiques

---

## 🎯 PROCHAINES ÉTAPES

1. Créez les icônes (192x192 et 512x512)
2. Installez vite-plugin-pwa : `npm install -D vite-plugin-pwa`
3. Buildez : `npm run build`
4. Déployez sur Vercel/Netlify
5. Testez sur mobile !

---

## 🔗 RESSOURCES

- [PWA Builder](https://www.pwabuilder.com/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Icon Generator](https://realfavicongenerator.net/)
