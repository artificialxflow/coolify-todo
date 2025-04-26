import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Todo from '@/app/models/Todo';

export async function GET() {
  try {
    await dbConnect();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos. Please check your database connection.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const todo = await Todo.create({
      title: body.title.trim(),
      completed: false,
    });
    
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return NextResponse.json(
      { error: 'Failed to create todo. Please check your database connection.' },
      { status: 500 }
    );
  }
} 