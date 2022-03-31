import Category from '../../models/category'
import mongoose from 'mongoose'
import logging from '../../config/logging'
import Services from '../../models/hospital/services'
import Speciality from '../../models/doctors/speciality'

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

let categories = [];
let services = [];
let specialities = [];

const migrateData = async () => {

	// GETTING DATA FROM DB_1

	await mongoose.connect(MONGO_DB_1.url, MONGO_DB_1.options)

	console.log("Connected with DB_1...")
	// console.log("Clearing the documents Of DB_1...")

	// await Category.deleteMany({})
	// await Services.deleteMany({})
	// await Speciality.deleteMany({})

	console.log("Getting documents from DB_1");
	categories = await Category.find({});
	services = await Services.find({});
	specialities = await Speciality.find({});

	// CLOSING CONNECTION OF DB_1
	await mongoose.connection.close();

	// INSERTING DATA TO DB_2

	await mongoose.connect(MONGO_DB_2.url, MONGO_DB_2.options)

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

	process.exit()

}

migrateData()

// How to insert Lookups 
		// In the terminal, go to this directory first and then run following command
				// npx ts-node migrate_from_one_db_to_another.ts