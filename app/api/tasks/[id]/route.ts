import { NextResponse } from "next/server";
import {
  getTaskById,
  updateTask as updateTaskStore,
  deleteTask as deleteTaskStore,
} from "@/lib/tasks-store";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const task = getTaskById(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updates: Partial<{ title: string; description: string; column: string }> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.column !== undefined) updates.column = body.column;
    const task = updateTaskStore(id, updates);
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const task = getTaskById(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  deleteTaskStore(id);
  return new NextResponse(null, { status: 204 });
}
