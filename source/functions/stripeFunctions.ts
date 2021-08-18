import { Response } from 'express';
import IPackage from '../interfaces/package';
import { v4 as uuidv4 } from 'uuid';
import IBooking from '../interfaces/booking';
const stripe = require("stripe")("sk_test_ARHWzGgIlMdVS6JOHfZlouV600c8n1dVRC");

const createChargeForExistingCustomer = (res: Response,booking: IBooking, packge: IPackage, customerId: any, token: any):boolean => {
    return stripe.charges.create({
        amount: booking.totalCost * 100,
        currency: 'usd',
        customer: customerId,
        receipt_email: token.email,
        description: `purchase of ${packge.name}`
    }).then((result: any) => {
        // res.status(200).json(result);
        return true;
    }).catch((err: any) => {
        return false;
        // console.log(err);
    });
}

const createCustomerAndCharge = (res: Response,booking: IBooking , packge: IPackage, token: any) => {
    const idempotencyKey = uuidv4();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then((customer: any) => {
        stripe.charges.create({
            amount: booking.totalCost * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${packge.name}`
        }, { idempotencyKey });
    }).then((result: any) => {
        // res.status(200).json(result);
        return true;
    }).catch((err: any) => {
        // console.log(err);
        return false;
    });
}

export {
    createChargeForExistingCustomer,
    createCustomerAndCharge
}