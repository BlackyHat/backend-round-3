import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from 'uuid';
import todosService from '../../services';
export const getAllTodos = middyfy(async () => {
    const todos = await todosService.getAllTodos();
    return formatJSONResponse({
        todos,
    });
});
export const createTodo = middyfy(async (event) => {
    try {
        const id = v4();
        const todo = await todosService.createTodo({
            todosId: id,
            title: event.body.title,
            description: event.body.description,
            createdAt: new Date().toISOString(),
            status: false,
        });
        return formatJSONResponse({
            todo,
        });
    }
    catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e,
        });
    }
});
export const getTodo = middyfy(async (event) => {
    const id = event.pathParameters.id;
    try {
        const todo = await todosService.getTodo(id);
        return formatJSONResponse({
            todo,
            id,
        });
    }
    catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e,
        });
    }
});
export const updateTodo = middyfy(async () => {
    const id = event.pathParameters.id;
    try {
        const todo = await todosService.updateTodo(id);
        return formatJSONResponse({
            todo,
            id,
        });
    }
    catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e,
        });
    }
});
export const deleteTodo = middyfy(async (event) => {
    const id = event.pathParameters.id;
    try {
        const todo = await todosService.deleteTodo(id);
        return formatJSONResponse({
            todo,
            id,
        });
    }
    catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e,
        });
    }
});
//# sourceMappingURL=handlers.js.map