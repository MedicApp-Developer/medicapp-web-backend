import { NextFunction, Request, Response } from 'express'
import Checkin from '../../models/employees/checkin'
import makeResponse from '../../functions/makeResponse'

const NAMESPACE = "Employee Checkin"

const employeeCheckin = (req: Request, res: Response, next: NextFunction) => {
    const { checkin, date, employeeId } = req.body

    const newCheckin = new Checkin({ checkin, date, employeeId })
    newCheckin.save().then(result => {
        return makeResponse(res, 201, "Employee Checked In Successfully", result, false)
    })
        .catch(err => {
            return makeResponse(res, 400, err.message, null, true)
        })
}

const updateCheckout = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const filter = { _id: id }
    let update = { ...req.body }

    Checkin.findOneAndUpdate(filter, update).then(updatedRequest => {
        return makeResponse(res, 200, "Employee request updated Successfully", updatedRequest, false)
    }).catch(err => {
        return makeResponse(res, 400, err.message, null, true)
    })
}

const getSingleCheckinInfoWithDate = (req: Request, res: Response, next: NextFunction) => {
  const { date, employeeId } = req.body

  console.log("DATE => ", date);
  console.log("employeeId => ", employeeId);

  Checkin.find({ date, employeeId }).then(checkinInfoRes => {
    return makeResponse(res, 200, "Check in out info of a date of an employee", checkinInfoRes[0], false)
  })

}

const getEmployeeAttendance = (req: Request, res: Response, next: NextFunction) => {
  const { employeeId } = req.params
  Checkin.find({ employeeId }).then(checkinInfoRes => {
    return makeResponse(res, 200, "Employee Attendance", checkinInfoRes, false)
  })

}

const getRecentEmployeeAttendance = (req: Request, res: Response, next: NextFunction) => {
  Checkin.find({})
  .limit(20)
  .populate("employeeId")
  .sort({date:-1})
  .then(checkinInfoRes => {
    return makeResponse(res, 200, "Employee Attendance", checkinInfoRes, false)
  })
}

export default {
  employeeCheckin,
  updateCheckout,
  getSingleCheckinInfoWithDate,
  getEmployeeAttendance,
  getRecentEmployeeAttendance
}
