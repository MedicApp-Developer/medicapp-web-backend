import { NextFunction, Request, Response } from 'express'
import makeResponse, { sendErrorResponse } from '../functions/makeResponse'
import { SERVER_ERROR_CODE } from '../constants/statusCode'
import Speciality from '../models/doctors/speciality'
import Hospital from '../models/hospital/hospital'
import Category from '../models/category'
import Services from '../models/hospital/services'
import Slot from '../models/doctors/slot'
import Gender from '../models/lookups/gender'
import Language from '../models/lookups/language'
import Country from '../models/lookups/country'
import Insurance from '../models/insurance'

const NAMESPACE = "Home"

const getHomeData = async (req: Request, res: Response, next: NextFunction) => {
  const { lat, lng } = req.body

  try {
    const specialities = await Speciality.find({}).sort({ 'order': 1 })
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
    }).populate('insurances').limit(10).skip(0)
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
          {
            path: 'hospitalId',
            populate: [
              { path: 'insurances' }
            ]
          }
        ]
      }).populate('familyMemberId')

    return makeResponse(res, 200, "Patient Appointments", { upcommingAppointments: upcommingAppointments.length === 0 ? null : upcommingAppointments[0], specialities, hospitals }, false)

  } catch (err: any) {
    return sendErrorResponse(res, 400, err.message, SERVER_ERROR_CODE)
  }
}

const getFilters = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const specialities = await Speciality.find({}).sort({ 'order': 1 })
    const hospitalCategories = await Category.find({})
    const hospitalServices = await Services.find({})
    const insurances = await Insurance.find({})

    const genderList = await Gender.find({})
    const languageList = await Language.find({})
    const nationalityList = await Country.find({})

    const filters = {
      hospitalFilters: {
        hospitalCategories,
        hospitalServices,
        insurances
      },
      doctorFilters: {
        specialities,
        genders: genderList,
        languages: languageList,
        nationalities: nationalityList
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
