"""
Async SQLite connection utility to be reused across the project.

Provides two methods:
- read_data(query, params=None, fetch="all"|"one") -> list[dict] | dict | None
- write_data(query, params=None) -> dict {"last_row_id": int | None, "rowcount": int}

This implementation uses the built-in sqlite3 module wrapped with asyncio.to_thread
so it remains dependency-free while offering async-friendly APIs.
"""

from __future__ import annotations

import asyncio
import sqlite3
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


class AsyncSQLite:
    """Lightweight async wrapper around sqlite3 using a thread executor.

    Example:
        from src.db_connections import db

        rows = await db.read_data("SELECT * FROM patients WHERE id = ?", [123], fetch="one")
        result = await db.write_data("UPDATE patients SET name = ? WHERE id = ?", ["John", 123])
    """

    def __init__(self, db_path: str) -> None:
        self.db_path = db_path
        self._write_lock = asyncio.Lock()

    # Internal helpers (run in a thread)
    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _read_blocking(self, query: str, params: Optional[Iterable[Any]], fetch: str):
        with self._connect() as conn:
            cur = conn.execute(query, tuple(params or []))
            if fetch == "one":
                row = cur.fetchone()
                return dict(row) if row is not None else None
            # default: fetch all
            rows = cur.fetchall()
            return [dict(r) for r in rows]

    def _write_blocking(self, query: str, params: Optional[Iterable[Any]]):
        with self._connect() as conn:
            cur = conn.execute(query, tuple(params or []))
            conn.commit()
            # sqlite3 cursor.rowcount can be -1 for SELECT; here we use it for DML
            return {"last_row_id": cur.lastrowid, "rowcount": cur.rowcount}

    # Public async API
    async def read_data(
        self,
        query: str,
        params: Optional[Iterable[Any]] = None,
        fetch: str = "all",
    ) -> Optional[List[Dict[str, Any]] | Dict[str, Any]]:
        """Execute a SELECT query asynchronously.

        Args:
            query: SQL SELECT query with placeholders ("?").
            params: Parameters for the query.
            fetch: "all" to fetchall(), "one" to fetchone().

        Returns:
            - If fetch="all": list of dict rows
            - If fetch="one": a single row dict or None if not found
        """
        fetch_mode = fetch.lower()
        if fetch_mode not in {"all", "one"}:
            raise ValueError("fetch must be 'all' or 'one'")

        return await asyncio.to_thread(self._read_blocking, query, params, fetch_mode)

    async def write_data(
        self,
        query: str,
        params: Optional[Iterable[Any]] = None,
    ) -> Dict[str, Any]:
        """Execute an INSERT/UPDATE/DELETE query asynchronously.

        Args:
            query: SQL DML query with placeholders ("?").
            params: Parameters for the query.

        Returns:
            Dict containing "last_row_id" and "rowcount".
        """
        async with self._write_lock:
            return await asyncio.to_thread(self._write_blocking, query, params)


# Determine the default DB path (../../healthcare_data.db from this file)
DEFAULT_DB_PATH = str((Path(__file__).resolve().parents[2] / "healthcare_data.db").resolve())

# Ready-to-use shared instance
db = AsyncSQLite(DEFAULT_DB_PATH)
