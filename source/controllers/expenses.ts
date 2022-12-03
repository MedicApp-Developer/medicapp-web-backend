import { NextFunction, Request, Response } from 'express';
import makeResponse, { sendErrorResponse } from '../functions/makeResponse';
import { ExpenseTypes } from '../constants/expense';
import { SERVER_ERROR_CODE } from '../constants/statusCode';
import Expenses from '../models/expenses';
import Slot from '../models/doctors/slot'

import employee from './employees/employee';

const NAMESPACE = 'expense';
const expenseTypes = [ExpenseTypes.EXPENSETYE_SALARY,
    ExpenseTypes.EXPENSETYE_ELECTICITY_WATER,
    ExpenseTypes.EXPENSETYE_OFFICE_RENT,
    ExpenseTypes.EXPENSETYE_VEHICLE_CONSUMABLE,
    ExpenseTypes.EXPENSETYE_UN_EXPECTED];

const createExpense = async (req: Request, res: Response, next: NextFunction) => {
    const { title, type, description, date, amount, employeeId } = req.body;

    if (!expenseTypes.includes(type)) {
        return makeResponse(res, 400, 'Invalid Expense Type', null, true);
    }
    if (!(date && amount && title && description)) {
        return makeResponse(res, 400, 'Validation Failed', null, true);
    }
    console.log( "employeeId ", employeeId );
    try {
        let dataObject = {
            title,
            description,
            type,
            date, 
            amount,
            month: parseInt(`${new Date(date).getMonth()}`) + 1,
            year: parseInt(`${new Date(date).getFullYear()}`),
            employeeId: employeeId ? employeeId : null
        }
        // if( employeeId ){
        //     dataObject= {...dataObject, employeeId }
        // }
        const newExpense = new Expenses(dataObject);
        newExpense
            .save()
            .then((result) => {
                return makeResponse(res, 200, 'Expense', result, false);
            })
            .catch((err) => {
                console.log( err )
                return makeResponse(res, 400, 'Problem while creating the expense', null, true);
            });
    } catch (err) {
        // @ts-ignore
        return makeResponse(res, 400, err.message, null, true);
    }
};

const getAllExpenses = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const expenses = await Expenses.find().populate("employeeId")
        return makeResponse(res, 201, "Expenses", expenses, false)

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const forDataManageAppointments =( groupAppointments: any[],  expenses: any[])=> {
    let prepArray = [];
    for (let index = 0; index < expenses.length; index++) {
        let element = expenses[index];
        let appointments = 0;

        let fIndex = groupAppointments.findIndex( ls => ls.date == element.date )
        if(fIndex >= 0){
            appointments = groupAppointments[fIndex].count;
        }
        prepArray.push({...element, appointments })
    }
    return prepArray;
}
const getMonthlyAllExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // todo
        let respAppointments = await Slot.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$to" } },
                    count: {$sum: 1}
                }
            },
            {$project: {
                date: "$_id",
                count: 1,
                _id: 0
            }}
        ]);
        
        Expenses.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    amount:{
                        $sum: "$amount"
                    },
                    count: {$sum: 1}
                },
            },
            {$project: {
                date: "$_id",
                amount: "$amount",
                count: 1,
                _id: 0
            }},
            {$sort: {"date": 1} } 
            ])
            .then( async resp => {
                let prepArray = [];
                if( respAppointments?.length > 0 && resp?.length > 0){
                    prepArray = await forDataManageAppointments(respAppointments, resp )
                }else if (resp?.length > 0){
                    prepArray = resp;
                }
                
                console.log( "expenses: ", resp )  
                console.log( "respAppointments: ", prepArray )
                return makeResponse(res, 201, "Monthly Expenses", prepArray, false)
            } )
            .catch( err => {
                return makeResponse(res, 400, err.message, null, true);
            } )
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getMonthlyAllExpensesTypes = async (req: Request, res: Response, next: NextFunction) => {
    const { month, year } = req.params;
    console.log( "month: ", req.params.month )
    if(!(month && year)){
        return makeResponse(res, 400, 'Validation Failed', null, true);
    }
    try {
        // Slot.aggregate([

        // ])
        Expenses.aggregate([
            { "$match": { "month": parseInt(`${month}`) } },
            { "$match": { "year": parseInt(`${year}`) } },
            {
                $group: {
                    _id: { "type": "$type"},
                    amount:{
                        $sum: "$amount"
                    },
                    count: {$sum: 1}
                },
            },
            {$project: {
                amount: "$amount",
                type: "$_id.type",
                count: 1,
                _id: 0
            }},
            ])
            .then( resp => {
                console.log( "expenses: ", resp )  
                return makeResponse(res, 201, "Monthly, Expense Type Based Expenses", resp, false)
            } )
            .catch( err => {
                return makeResponse(res, 400, err.message, null, true);
            } )

    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const getMonthlyAllSingleExpensesTypes = async (req: Request, res: Response, next: NextFunction) => {
    const { month, year, type } = req.params;
    if(!(month && year && type)){
        return makeResponse(res, 400, 'Validation Failed', null, true);
    }
    try {
        Expenses.find({
            month: parseInt(`${month}`) ,
            year: parseInt(`${year}`),
            type
        }).populate("employeeId")
        .then( resp => {
            // console.log( "expenses: ", resp )  
            return makeResponse(res, 201, `Single Type Expenses`, resp, false)
        } )
        .catch( err => {
            return makeResponse(err, 400, err.message, null, true);
        } )
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
    }
}

const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, title, type, description, date, amount, employeeId } = req.body;
    if (!expenseTypes.includes(type)) {
        return makeResponse(res, 400, 'Invalid Expense Type', null, true);
    }
    if (!(date && amount && type && title && description && _id)) {
        return makeResponse(res, 400, 'Validation Failed', null, true);
    }
    Expenses.findOneAndUpdate({ _id: _id }, { date, amount, title, description,  
        month: parseInt(`${new Date(date).getMonth()}`) + 1 ,
        year: parseInt(`${new Date(date).getFullYear()}`),
        employeeId,
        type
    }, { new: true }).populate('employeeId').then(updatedExpense => {
        return makeResponse(res, 200, "Expense Updated Successfully", updatedExpense, false);
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true);
    });
}

const removeExpense = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    try {
        const expense = await Expenses.findByIdAndDelete(_id);
        if (!expense) return sendErrorResponse(res, 400, "Expense not found with this ID", SERVER_ERROR_CODE);
        return makeResponse(res, 200, "Deleted Successfully", expense, false);
    } catch (err) {
        // @ts-ignore
        return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE);
    }
}

export default {
    createExpense,
    getAllExpenses,
    getMonthlyAllExpenses,
    getMonthlyAllExpensesTypes,
    getMonthlyAllSingleExpensesTypes,
    updateExpense,
    removeExpense
};
