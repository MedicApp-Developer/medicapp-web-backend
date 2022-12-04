import { NextFunction, Request, Response } from 'express';
import makeResponse, { sendErrorResponse } from '../../functions/makeResponse';
import { TodoTypes } from '../../constants/todo';
import { SERVER_ERROR_CODE } from '../../constants/statusCode';
import Todo from '../../models/ceo/todo';
import moment from 'moment';

const NAMESPACE = 'todo';

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, title, type, description } = req.body;
    let todoTypes = [TodoTypes.GOVERNMENT, TodoTypes.INTERVIEWS, TodoTypes.MEETING];

    if (!todoTypes.includes(type)) {
        return makeResponse(res, 400, 'Validation Failed', null, true);
    }
    if (!(from && to && title)) {
        return makeResponse(res, 400, 'Validation Failed', null, true);
    }

    console.log( "new Date(from): ", )
    
    try {
        const newTodo = new Todo({
            from: new Date(from),
            to: new Date(to),
            title,
            description,
            type,
            date: moment(new Date(from)).format("YYYY-MM-DD")
        });
        newTodo
            .save()
            .then((result) => {
                return makeResponse(res, 200, 'Ceo', result, false);
            })
            .catch((err) => {
                return makeResponse(res, 400, 'Problem while creating the todo', null, true);
            });
    } catch (err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true);
    }
};

const getDateTodos = async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.params;
    let obj = {};
    if( date ){
        obj = { date}
    }
    try {
        const todos = await Todo.find(obj)
        return makeResponse(res, 201, "Ceo Todos", todos, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}
const getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await Todo.find()
        return makeResponse(res, 201, "Ceo Todos", todos, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const slot = await Todo.deleteOne({ _id: id });

        return makeResponse(res, 200, "Todo deleted successfully", slot, false)
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

export default {
    createTodo,
    getTodos,
    getDateTodos,
    deleteTodo
};
