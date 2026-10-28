# IMSA
Static site (GitHub Pages) + Firebase (Google login + Firestore). No PHP/MySQL backend.
1. Put your apiKey in js/firebase.js   2. Publish firestore.rules in Firebase -> Firestore -> Rules
3. Firebase -> Authentication -> Settings -> Authorized domains: add <username>.github.io
4. Make yourself admin: Firestore -> users -> your doc -> role = admin
