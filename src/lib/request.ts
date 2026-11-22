import 'server-only';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { problem, type ProblemCode } from '@/core/response';
export const requestId=()=>randomUUID();
export function jsonOk(data:unknown,id:string,status=200){return NextResponse.json({data,meta:{request_id:id}},{status,headers:{'Cache-Control':'no-store','X-Request-Id':id}});}
export function jsonError(code:ProblemCode,status:number,id:string){return NextResponse.json(problem(code,status,id),{status,headers:{'Cache-Control':'no-store','X-Request-Id':id}});}
