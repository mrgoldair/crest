import { Interpreter } from './Interpreter';

export interface CrestCallable {
  arity():number
  call(interpreter:Interpreter,args:Array<object>):object
}