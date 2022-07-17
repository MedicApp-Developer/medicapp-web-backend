import { NextFunction, Request, Response } from 'express'
import makeResponse from '../../functions/makeResponse'
import Country from '../../models/lookups/country'
import Gender from '../../models/lookups/gender'
import Language from '../../models/lookups/language'
import Insurance from '../../models/insurance'

const NAMESPACE = "Country"

const getCountries = async (req: Request, res: Response, next: NextFunction) => {
	const countries = await Country.find({})
	return makeResponse(res, 200, "Countries List", countries, false)
}

const getGenders = async (req: Request, res: Response, next: NextFunction) => {
	const genders = await Gender.find({})
	return makeResponse(res, 200, "Gender List", genders, false)
}

const getLanguages = async (req: Request, res: Response, next: NextFunction) => {
	const languages = await Language.find({})
	return makeResponse(res, 200, "Languages List", languages, false)
}

const getInsurances = async (req: Request, res: Response, next: NextFunction) => {
	const insurances = await Insurance.find({})
	return makeResponse(res, 200, "Insurances List", insurances, false)
}

export default {
	getCountries,
	getGenders,
	getLanguages,
	getInsurances
}
