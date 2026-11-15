
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from customer_support_agent.api.dependencies import (
    get_messages_repository,
    get_tickets_repository,
)
from customer_support_agent.repositories.sqlite.messages import MessagesRepository
from customer_support_agent.repositories.sqlite.tickets import TicketsRepository
from customer_support_agent.schemas.api import (
    AgentReplyCreateRequest,
    CustomerMessageCreateRequest,
    MessageResponse,
)

router = APIRouter()


@router.get(
    "/api/tickets/{ticket_id}/messages",
    response_model=list[MessageResponse],
)
def get_ticket_messages(
    ticket_id: int,
    tickets_repo: TicketsRepository = Depends(get_tickets_repository),
    messages_repo: MessagesRepository = Depends(get_messages_repository),
):
    ticket = tickets_repo.get_by_id(ticket_id)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return messages_repo.list_by_ticket(ticket_id)


@router.post(
    "/api/tickets/{ticket_id}/messages/customer",
    response_model=MessageResponse,
    status_code=201,
)
def create_customer_message(
    ticket_id: int,
    payload: CustomerMessageCreateRequest,
    tickets_repo: TicketsRepository = Depends(get_tickets_repository),
    messages_repo: MessagesRepository = Depends(get_messages_repository),
):
    ticket = tickets_repo.get_by_id(ticket_id)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket_email = str(ticket.get("customer_email") or "").strip().lower()
    request_email = str(payload.customer_email).strip().lower()

    if ticket_email != request_email:
        raise HTTPException(
            status_code=403,
            detail="This customer is not associated with the ticket",
        )

    try:
        return messages_repo.create(
            ticket_id=ticket_id,
            sender="customer",
            content=payload.content,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post(
    "/api/tickets/{ticket_id}/messages/reply",
    response_model=MessageResponse,
    status_code=201,
)
def create_agent_reply(
    ticket_id: int,
    payload: AgentReplyCreateRequest,
    tickets_repo: TicketsRepository = Depends(get_tickets_repository),
    messages_repo: MessagesRepository = Depends(get_messages_repository),
):
    ticket = tickets_repo.get_by_id(ticket_id)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    try:
        return messages_repo.create(
            ticket_id=ticket_id,
            sender="agent",
            content=payload.content,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
