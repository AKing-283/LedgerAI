from sqlalchemy import text

from app.db.session import engine

try:

    with engine.connect() as conn:

        result = conn.execute(
            text("SELECT 1")
        )

        print(result.scalar())

        print("Database Connected")

except Exception as e:

    print(e)