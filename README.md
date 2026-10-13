# Pennywise — Personal Expense Tracker

A responsive React + Vite application to record, review, and analyze personal expenses.

## Features
- Add expenses with name, amount, category, date, and optional note
- Monthly spending total, average transaction, and last-7-days total
- Category-wise spending breakdown with percentage bars
- Search transactions and filter by category
- Delete entries
- Persists expenses in browser localStorage
- Responsive desktop and mobile layout
- Currency displayed in Indian Rupees (INR)

## Run locally
1. Install Node.js (LTS) from https://nodejs.org/
2. Extract this ZIP and open the folder in VS Code.
3. Open Terminal in VS Code and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown in the terminal (usually http://localhost:5173).

## Notes
- Example entries are included for demonstration. Delete them if you want a blank start.
- Data is stored in the browser on the same device; it is not synced to an account or cloud.
