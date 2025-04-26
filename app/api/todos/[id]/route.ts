import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import Todo from '@/app/models/Todo';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string' },
        { status: 400 }
      );
    }

    if (body.completed !== undefined && typeof body.completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Completed status must be a boolean' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const todo = await Todo.findByIdAndUpdate(
      params.id,
      { 
        ...(body.title && { title: body.title.trim() }),
        ...(body.completed !== undefined && { completed: body.completed }),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error in PUT /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update todo. Please check your database connection.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID format' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const todo = await Todo.findByIdAndDelete(params.id);
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo. Please check your database connection.' },
      { status: 500 }
    );
  }
} 