import {MiniMaple} from "../src/miniMaple";
import { InvalidOperationError } from "../src/Errors/CustomErrors";
import { InvalidArgumentError } from "../src/Errors/CustomErrors";


test('empty diff variable will lead to exception', () => {
    expect(() => new MiniMaple().diff('12*x')).toThrow(new InvalidArgumentError('diff variable is incorrect'))
});

test('empty string diff variable will lead to exception', () => {
    expect(() => new MiniMaple().diff('12*x','')).toThrow(new InvalidArgumentError('diff variable is incorrect'));
});

test('empty string expr  will lead to exception', () => {
    expect(() => new MiniMaple().diff('','x')).toThrow(new InvalidArgumentError('Expr is incorrect'));
});

test('empty expr  will lead to exception', () => {
    expect(() => new MiniMaple().diff(null,'x')).toThrow(new InvalidArgumentError('Expr is incorrect'));
});

test('/ operation will lead to exception', () => {
    expect(() => new MiniMaple().diff('12*x+45/x','x')).toThrow(new InvalidArgumentError('Invalid operation is used'));
});

test('** operation will lead to exception', () => {
    expect(() => new MiniMaple().diff('12*x+45**x','x')).toThrow(new InvalidArgumentError('Invalid operation is used'));
});

test('() operation will lead to exception', () => {
    expect(() => new MiniMaple().diff('12*x+(45**x)','x')).toThrow(new InvalidArgumentError('Invalid operation is used'));
});

test('simple consts after diff equals 0', () => {
    const res = new MiniMaple().diff('4456','x')
    expect(res).toBe('0');
});

test('consts with other vars after diff equals 0', () => {
    const res = new MiniMaple().diff('4456*y-12*z','x')
    expect(res).toBe('0');
});

test('single operand diff-ed correctly', () => {
    const res = new MiniMaple().diff('4*x^3','x')
    expect(res).toBe('12*x^2');
});

test('single operand with diff var not used diff-ed correctly', () => {
    const res = new MiniMaple().diff('4*x^3','y')
    expect(res).toBe('0');
});

test('expr with - operation diff-ed correctly', () => {
    const res = new MiniMaple().diff('4*x^3-x^2','x')
    expect(res).toBe('12*x^2-2*x');
});

test('expr with + operation diff-ed correctly', () => {
    const res = new MiniMaple().diff('4*x^3+x^2','x')
    expect(res).toBe('12*x^2+2*x');
});

test('expr with + and - operations diff-ed correctly', () => {
    const res = new MiniMaple().diff('4*x^3+x^2-x','x')
    expect(res).toBe('12*x^2+2*x-1');
});

test('expr with + and - and consts  diff-ed correctly', () => {
    const res = new MiniMaple().diff('123*x+12y+4*x^400-x^45+12+12*45','x')
    expect(res).toBe('123+1600*x^3-45*x^44');
});

test('expr multiple diff var multiplication diff-ed correctly', () => {
    const res = new MiniMaple().diff('12*x*x*x*x','x')
    expect(res).toBe('48*x^3');
});

test('expr with + and - and consts with multiple diff var multiplication diff-ed correctly', () => {
    const res = new MiniMaple().diff('123*x+12y+4*x^400-x^45+12+12*45+7*x*x*x','x')
    expect(res).toBe('123+1600*x^3-45*x^44+21*x^2');
});