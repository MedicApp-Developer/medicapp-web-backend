import moment from 'moment'
import 'moment-timezone';
import { getAge } from './SickLeave'

const generatePrescriptionSlip = (prescription: any, zone: string) => {
	const prescriptionDate = moment.tz(prescription?.date, zone).format("DD/MM/YYYY")

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>Appointment Slip</title>
			<style>

			p {
				font-size: 0.7rem;
			}

			.container {
				margin-top: 2rem;
				margin-left: 1rem;
				margin-right: 1rem;
				font-family: 'Lato', sans-serif;
			}
			
			.heading {
				background-color: #417EBF;
				margin-bottom: 1rem;
        padding: 1rem;
			}
			
			.heading h4 {
				color: white;
				padding-left: 1.5rem;
			}
			
			.heading p {
				padding-left: 1rem;
				color: white;
				font-size: 0.8rem;
			}
			
			.column {
				float: left;
				width: 50%;
			}
			
			/* Clear floats after the columns */
			.row:after {
				content: "";
				display: table;
				clear: both;
			}
			
			.date {
				font-size: 0.7rem;
				margin-bottom: 0.5rem;
			}
			
			.bold {
				font-weight: bold;
			}
			
			.blue {
				color: #417EBF;
			}
			
			.border {
				border: 1px dotted lightgray;
				padding: 1rem;
				margin-bottom: 1rem;
			}
			
			.bg-blue {
				background-color: #417EBF;
				padding: 0.5rem;
				color: white;
			}
			
			.space-bottom {
				margin-top: 0.4rem;
			}
			
			.small {
				font-size: 0.7rem;
			}
			</style>
		</head>
			<body>
			
			<div class="container">
				<div class="heading">
					<h4>${prescription?.doctorId?.hospitalId?.name}</h4>
				</div>
				<hr />
				<div class="row border">
					<div class="column">
						<h5 class="date">Doctor: Dr. ${prescription?.doctorId?.firstName + " " + prescription?.doctorId?.lastName}</h5>
						<p>Hospital: ${prescription?.doctorId?.hospitalId?.name}</p>
						<p>Email: ${prescription?.doctorId?.email}</p>
					</div>
					<div class="column" >
						<p>Prescription no: 12121212</p>
						<p>Date: ${prescriptionDate}</p>
					</div>
				</div>
				<hr />
				<div class="border">
						<p> <span class="bold">Treatment Type: </span> ${prescription?.treatmentType}</p>
						<p> <span class="bold">Prescription: </span> ${prescription?.prescription}</p>
						<p> <span class="bold">Dosage A Day: </span> ${prescription?.dosageADay} Dosage</p>
						<p> <span class="bold">Total Days: </span> ${prescription?.consumptionDays} Days</p>
				</div>
				
				<div class="border space-bottom">
						<p> <span class="bold blue">Patient Name: </span> ${prescription?.patientId?.firstName + " " + prescription?.patientId?.lastName}</p>
						<p> <span class="bold blue">Age: </span> ${getAge(prescription?.patientId?.birthday)}</p>
						<p> <span class="bold blue">Address: </span> [${prescription?.patientId?.location}]</p>
						<p> <span class="bold blue">Email: </span> ${prescription?.patientId?.email}</p>
				</div>
				
				<br />
				<div class="row bg-blue">
					<div class="column small">
						${prescription?.doctorId?.hospitalId?.name}
					</div>
					<div class="column small" >
						${prescription?.doctorId?.hospitalId?.email}
					</div>
				</div>
			</div>

			</body>
		</html>
	`
}

export default generatePrescriptionSlip