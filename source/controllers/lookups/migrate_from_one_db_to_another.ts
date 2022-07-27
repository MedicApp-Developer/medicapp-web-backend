import Category from '../../models/category'
import mongoose from 'mongoose'
import Services from '../../models/hospital/services'
import Speciality from '../../models/doctors/speciality'
import Doctor from '../../models/doctors/doctor'
import Family from '../../models/family'
import Hospital from '../../models/hospital/hospital'
import PackageCategory from '../../models/vendors/packageCategory'
import Package from '../../models/vendors/package'
import Patient from '../../models/patient'
import PointsCode from '../../models/pointsCode'
import Slot from '../../models/doctors/slot'
import User from '../../models/user'
import Vendor from '../../models/vendors/vendor'

const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	poolSize: 50,
	autoIndex: false,
	retryWrites: false,
	useFindAndModify: false, useCreateIndex: true
}

const MONGO_DB_1 = {
	host: "mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority",
	username: "superuser",
	password: "supersecretpasswords",
	options: MONGO_OPTIONS,
	url: "mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority"
}

const MONGO_DB_2 = {
	host: "mongodb+srv://medicappae:Medicappae@123@cluster0.bse7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	username: "superuser",
	password: "supersecretpasswords",
	options: MONGO_OPTIONS,
	url: "mongodb+srv://medicappae:Medicappae@123@cluster0.bse7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
}

// mongodb+srv://Usama123:Usama123@cluster0.oeivl.mongodb.net/Cluster0?retryWrites=true&w=majority
// mongodb+srv://medicappae:Medicappae@123@cluster0.bse7o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

let categories = [], services = [], specialities = [], doctors = [], families = [], hospitals = [], packageCategories = [],
	packages = [], patients = [], pointCodes = [], slots = [], users = [], vendors = [];

const migrateData = async () => {

	// GETTING DATA FROM DB_1

	await mongoose.connect(MONGO_DB_1.url, MONGO_DB_1.options)

	

	
	categories = await Category.find({});
	services = await Services.find({});
	specialities = await Speciality.find({});
	doctors = await Doctor.find({});
	families = await Family.find({});
	hospitals = await Hospital.find({});
	packageCategories = await PackageCategory.find({});
	packages = await Package.find({});
	patients = await Patient.find({});
	pointCodes = await PointsCode.find({});
	slots = await Slot.find({});
	users = await User.find({});
	vendors = await Vendor.find({});


	// CLOSING CONNECTION OF DB_1
	await mongoose.connection.close();

	// INSERTING DATA TO DB_2

	await mongoose.connect(MONGO_DB_2.url, MONGO_DB_2.options)

	

	await Category.deleteMany({})
	await Services.deleteMany({})
	await Speciality.deleteMany({})

	

	const options = { ordered: true }

	await Category.insertMany(categories, options)
	//@ts-ignore
	

	await Services.insertMany(services, options)
	//@ts-ignore
	

	await Speciality.insertMany(specialities, options)
	// @ts-ignore
	

	await Doctor.insertMany(doctors, options)
	// @ts-ignore
	

	await Family.insertMany(families, options)
	// @ts-ignore
	

	await Hospital.insertMany(hospitals, options)
	// @ts-ignore
	

	await PackageCategory.insertMany(packageCategories, options)
	// @ts-ignore
	

	await Package.insertMany(packages, options)
	// @ts-ignore
	

	await Patient.insertMany(patients, options)
	// @ts-ignore
	

	await PointsCode.insertMany(pointCodes, options)
	// @ts-ignore
	

	await Slot.insertMany(slots, options)
	// @ts-ignore
	

	await User.insertMany(users, options)
	// @ts-ignore
	

	await Vendor.insertMany(vendors, options)
	// @ts-ignore
	

	process.exit()

}

migrateData()

// How to insert Lookups 
		// In the terminal, go to this directory first and then run following command
				// npx ts-node migrate_from_one_db_to_another.ts