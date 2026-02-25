import { NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/tasks-store";

export async function GET() {
  const tasks = getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = createTask({
      id: body.id,
      title: body.title,
      description: body.description ?? "",
      column: body.column,
    });
    return NextResponse.json(task);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 400 }
    );
  }
}
