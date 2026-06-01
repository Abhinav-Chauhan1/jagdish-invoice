# Jagdish Sharan & Sons — Invoice Manager

A mobile-first invoice management web app for Jagdish Sharan & Sons optical shop, Dhampur, UP.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Postgres database)
- **Tailwind CSS v4**
- **html2canvas + jsPDF** (PDF generation)
- **Lucide React** (Icons)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the SQL schema in `supabase/schema.sql` in the SQL Editor
3. Copy your **Project URL** and **anon key** from Settings → API

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Dashboard** — quick stats (total invoices, monthly revenue) + recent invoices
- **4-step invoice wizard** — customer details → products → prescription → review
- **Auto invoice numbering** — sequential, never repeats
- **PDF download** — generates A4 PDF from the invoice preview
- **WhatsApp share** — pre-filled message with invoice details
- **Prescription support** — full optometry prescription table (OD/OS, DV/NV)
- **Draft auto-save** — form data saved to localStorage so nothing is lost
- **Search & filter** — search by name, mobile, or invoice number; filter by week/month

## App Pages

| URL | Description |
|-----|-------------|
| `/` | Dashboard |
| `/invoices` | Invoice list with search |
| `/invoices/new` | Create new invoice (4 steps) |
| `/invoices/[id]` | View single invoice + download PDF |
| `/invoices/[id]/print` | Print-friendly layout |

## Brand Logos

Drop logo image files into `/public/logos/` with these exact names:
- `rayban.png`
- `titan.png`
- `crizal.png`
- `bausch.png`
- `vogue.png`
- `zeiss.png`

The invoice footer will display them. If files are missing, logo images are silently hidden and only text shows.

## Customization

All shop details (names, address, GST number, optometrist names) are hardcoded in:
```
components/InvoicePreview.tsx
```
Look for the `SHOP` constant at the top of the file.
