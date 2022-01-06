import { NextFunction, Request, Response } from 'express'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse'
import Appointment from '../models/appointment'
import { SERVER_ERROR_CODE } from '../constants/statusCode'
import Speciality from '../models/doctors/speciality'
import Hospital from '../models/hospital/hospital'
import Category from '../models/category'
import Services from '../models/hospital/services'
import Slot from '../models/doctors/slot'

const NAMESPACE = "Home"

const getHomeData = async (req: Request, res: Response, next: NextFunction) => {
  const { lat, lng } = req.body

  try {
    const specialities = await Speciality.find({})
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $maxDistance: 5000, // 5 KM
          $geometry: {
            type: "Point",
            coordinates: [lat, lng]
          }
        }
      }
    }).limit(10).skip(0)
    // @ts-ignore
    const upcommingAppointments = await Slot.find({
      patientId: res.locals.jwt.reference_id,
      from: {
        $gte: new Date()
      }
    }).select(['-hospitalId'])
      .populate("patientId")
      .populate({
        path: 'doctorId',
        populate: [
          { path: 'specialityId' },
          { path: 'hospitalId' }
        ]
      })

    return makeResponse(res, 200, "Patient Appointments", { upcommingAppointments: upcommingAppointments.length === 0 ? {} : upcommingAppointments[0], specialities, hospitals }, false)

  } catch (err: any) {
    return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
  }
}

const getFilters = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const specialities = await Speciality.find({})
    const hospitalCategories = await Category.find({})
    const hospitalServices = await Services.find({})

    const filters = {
      hospitalFilters: {
        hospitalCategories,
        hospitalServices
      },
      doctorFilters: {
        specialities
      }
    }

    return makeResponse(res, 200, "All Filters", { ...filters }, false)


  } catch (err: any) {
    return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
  }
}

export default {
  getHomeData,
  getFilters
}
