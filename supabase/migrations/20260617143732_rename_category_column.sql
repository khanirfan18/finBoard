-- Rename Category column to category if it exists in any of the tables
-- This is defensive in case older versions of the app created tables with the capitalized "Category" column.

DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='transactions' and column_name='Category')
  THEN
      ALTER TABLE "public"."transactions" RENAME COLUMN "Category" TO "category";
  END IF;

  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='budgets' and column_name='Category')
  THEN
      ALTER TABLE "public"."budgets" RENAME COLUMN "Category" TO "category";
  END IF;
END $$;
