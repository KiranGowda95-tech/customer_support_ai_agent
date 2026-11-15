from __future__ import annotations

from typing import Any

from customer_support_agent.repositories.sqlite.base import (
    connect,
    row_to_dict,
)

class MessagesRepository:

    def create(
            self,
            ticket_id:int,
            sender:str,
            content:str,
    )->dict[str,Any]:
        if sender not in ("customer","agent"):
            raise ValueError("Sender must be 'customer' or 'agent'.")

        content=content.strip()
        if not content:
            raise ValueError("Message content cannot be empty.")

        with connect() as conn:
            cursor=conn.execute(
                """
                INSERT INTO messages (ticket_id,sender,content)
                VALUES (?,?,?)
                """,
                (ticket_id,sender,content)
            )

            row=conn.execute(
                "SELECT * FROM messages WHERE id=?",
                (cursor.lastrowid,),
            ).fetchone()

            return row_to_dict(row)
        return result

    def list_for_ticket(
            self,
            ticket_id:int,
    )->list[dict[str,Any]]:

        with connect() as conn:
            rows=conn.execute(
                """
                    SELECT * FROM messages WHERE ticket_id=? ORDER BY id ASC
                """,
                (ticket_id,),
            ).fetchall()


            return [dict(row) for row in rows]

    def get_by_id(self,message_id:int)->dict[str,Any] | None:
        with connect() as conn:
            row=conn.execute(
                "SELECT * FROM messages WHERE id=?",
                (message_id,),
            ).fetchone()

        return row_to_dict(row)

    def list_by_ticket(self,ticket_id:int)->list[dict]:
        with connect() as conn:
            rows=conn.execute(
                """
            SELECT id,ticket_id,sender,content,created_at
            FROM messages
            WHERE ticket_id=?
            ORDER BY id ASC

                """,
                (ticket_id,),
            ).fetchall()

        return [row_to_dict(row) for row in rows]