import dynamoDBClient from '../model/index';
import TodoService from './service';
const todosService = new TodoService(dynamoDBClient());
export default todosService;
//# sourceMappingURL=index.js.map