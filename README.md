# 📦 Portal ERP2 

Aplikacja internetowa typu ERP2 ułatwiająca komunikację między Działem Zakupów a Dostawcami. System umożliwia monitorowanie zamówień, aktualizację ich statusów oraz śledzenie historii zmian (Audit Log).

## 🚀 Funkcjonalności

* **Panel Logowania:** Bezpieczne logowanie z podziałem na role (Admin, Dostawca).
* **Dla Dostawców:**
    * Podgląd listy przypisanych zamówień.
    * Szczegóły zamówienia (pozycje, ilości).
    * Możliwość zmiany statusu zamówienia (np. *Potwierdzone*, *Wysłane*).
    * Dodawanie komentarzy do zamówień.
* **Dla Administratora (Dział Zakupów):**
    * Podgląd wszystkich zamówień od wszystkich dostawców.
    * **Audit Log:** Pełna historia zmian w systemie (kto, co i kiedy zmienił).
* **Tech Stack:**
    * **Frontend:** React, TypeScript, SCSS (responsywny design).
    * **Backend:** Node.js, Express.js.
    * **Baza Danych:** PostgreSQL + Prisma ORM.
    * **Autoryzacja:** JWT (JSON Web Tokens) + bcryptjs.



