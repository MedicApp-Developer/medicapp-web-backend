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

	console.log("Connected with DB_1...")

	console.log("Getting documents from DB_1");
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

	console.log("Clearing the documents Of DB_2...")

	await Category.deleteMany({})
	await Services.deleteMany({})
	await Speciality.deleteMany({})

	console.log("Inserting documents")

	const options = { ordered: true }

	await Category.insertMany(categories, options)
	//@ts-ignore
	console.log(`Categories were inserted`)

	await Services.insertMany(services, options)
	//@ts-ignore
	console.log("Services were inserted")

	await Speciality.insertMany(specialities, options)
	// @ts-ignore
	console.log("Specialities were inserted")

	await Doctor.insertMany(doctors, options)
	// @ts-ignore
	console.log("Doctors were inserted")

	await Family.insertMany(families, options)
	// @ts-ignore
	console.log("Families were inserted")

	await Hospital.insertMany(hospitals, options)
	// @ts-ignore
	console.log("Hospitals were inserted")

	await PackageCategory.insertMany(packageCategories, options)
	// @ts-ignore
	console.log("Package Categories were inserted")

	await Package.insertMany(packages, options)
	// @ts-ignore
	console.log("Packages were inserted")

	await Patient.insertMany(patients, options)
	// @ts-ignore
	console.log("Patients were inserted")

	await PointsCode.insertMany(pointCodes, options)
	// @ts-ignore
	console.log("Point Codes were inserted")

	await Slot.insertMany(slots, options)
	// @ts-ignore
	console.log("Slots were inserted")

	await User.insertMany(users, options)
	// @ts-ignore
	console.log("Users were inserted")

	await Vendor.insertMany(vendors, options)
	// @ts-ignore
	console.log("Vendors were inserted")

	process.exit()

}

migrateData()

// How to insert Lookups 
		// In the terminal, go to this directory first and then run following command
				// npx ts-node migrate_from_one_db_to_another.ts