import { NextResponse } from "next/server";

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  console.error(error);

  return NextResponse.json(
    { message: "Something unexpected went wrong." },
    { status: 500 },
  );
}
