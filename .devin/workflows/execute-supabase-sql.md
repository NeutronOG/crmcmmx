---
description: Execute Supabase SQL migrations to create ingresos, gastos, and nomina tables
---

# Execute Supabase SQL Migrations

This workflow creates the necessary database tables for Finanzas (ingresos/gastos) and Nómina functionality.

## Steps

1. **Open Supabase Dashboard**
   - Go to https://supabase.com and log in to your project
   - Navigate to the SQL Editor section

2. **Create New Query**
   - Click "New Query" or "+" button
   - Copy the entire contents of `.windsurf/supabase-migrations.sql`
   - Paste into the SQL editor

3. **Execute the Migration**
   - Click "Run" button (or Cmd+Enter)
   - Wait for confirmation that all tables were created successfully
   - You should see no errors in the output

4. **Verify Tables Created**
   - Go to the "Tables" section in Supabase
   - Confirm you see:
     - `ingresos` table
     - `gastos` table
     - `usuarios_nomina` table
   - Each should have the correct columns (concepto, monto, fecha, categoria, etc.)

5. **Optional: Add Sample Data**
   - Uncomment the sample INSERT statements at the bottom of the SQL file
   - Run again to populate test data
   - This helps verify the UI works correctly

6. **Test in Application**
   - Refresh the app at `localhost:3000`
   - Navigate to Finanzas section
   - You should see:
     - Ingresos and Gastos tabs populate with data (if sample data was added)
     - Stats cards show real totals instead of $0
   - Navigate to Nómina section
   - Employee list should show data from `usuarios_nomina` table

## Troubleshooting

**Error: "relation 'ingresos' does not exist"**
- The SQL migration hasn't been executed yet
- Follow steps 1-3 above

**Error: "permission denied"**
- Check your Supabase user role has DDL permissions
- Contact your Supabase project admin

**Tables created but no data shows**
- Sample data INSERT statements are commented out
- Uncomment them in the SQL file and run again
- Or manually add records via Supabase UI

**RLS (Row Level Security) blocking access**
- The policies allow authenticated users by default
- If you see "new row violates row-level security policy", check your auth setup
- Verify the user is properly authenticated in the app
