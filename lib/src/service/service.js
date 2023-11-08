export default class TodoService {
    constructor(docClient) {
        this.docClient = docClient;
        this.Tablename = 'TodosTable';
    }
    async getAllTodos() {
        const todos = await this.docClient
            .scan({
            TableName: this.Tablename,
        })
            .promise();
        return todos.Items;
    }
    async createTodo(todo) {
        await this.docClient
            .put({
            TableName: this.Tablename,
            Item: todo,
        })
            .promise();
        return todo;
    }
    async getTodo(id) {
        const todo = await this.docClient
            .get({
            TableName: this.Tablename,
            Key: {
                todosId: id,
            },
        })
            .promise();
        if (!todo.Item) {
            throw new Error('Id does not exit');
        }
        return todo.Item;
    }
    async updateTodo(id, todo) {
        const updated = await this.docClient
            .update({
            TableName: this.Tablename,
            Key: { todosId: id },
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ExpressionAttributeValues: {
                ':status': true,
            },
            ReturnValues: 'ALL_NEW',
        })
            .promise();
        return updated.Attributes;
    }
    async deleteTodo(id) {
        return await this.docClient
            .delete({
            TableName: this.Tablename,
            Key: {
                todosId: id,
            },
        })
            .promise();
    }
}
//# sourceMappingURL=service.js.map