import moment from 'moment'

const generateAppointmentSlip = (slot: any) => {
	const appointmentDate = moment.tz(slot?.from, moment.tz.guess()).format("DD/MM/YYYY")
	const appointmentTime = moment.tz(slot?.from, moment.tz.guess()).format('hh:mm a')
	const todayDate = moment.tz(new Date(), moment.tz.guess()).format("DD/MM/YYYY")
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>Appointment Slip</title>
			<style>
			.container {
				padding: 2rem;
				font-family: 'Lato', sans-serif; 
			}
			
			.logoImage {
				width: 6rem
			}
			
			.container h2{
				text-align: center;
				text-decoration: underline;
			}
			
			.underline {
				display: inline-block;
					padding-right: 1rem;
					padding-left: 1rem;
					border-bottom: 1px solid #888;
			}
			
			.container p {
				margin-top: 3rem;
				line-height: 2rem;
				font-size: 0.9rem
			}
			
			
			.container .note {
				font-size: 0.7rem;
				line-height: 1rem;
				font-style: italic;
				margin-top: 12rem;
			}
			
			</style>
		</head>
			<body>
			
			<div class="backgroundImage"></div>
			<div class="container">
				<image src="https://res.cloudinary.com/dsimhetcs/image/upload/v1642879618/jvk6lifa3ixqulihbdci.png" class="logoImage" />
				<h2>Appointment Slip</h2>
				<p> MedicApp L.L.C Confirms that patient <span class="underline"> ${slot?.patientId?.firstName + "  " + slot?.patientId?.lastName} </span> holder of Emirates ID number <span class="underline">${slot?.patientId?.emiratesId}</span> has booked an appointment on our platform with doctor <span class="underline">${slot?.doctorId?.firstName + " " + slot?.doctorId?.lastName}</span> on the agreed date <span class="underline">${appointmentDate} at ${appointmentTime}</span></p>
				<p class="note">  *Disclaimer: MedicApp L.L.C will not be responsible of how this appointment slip is used. This document is only to confirm that the above patient has booked an appointment on our platform" </p>
				<p>Data Issued: <span class="underline">${todayDate}</span></p>
			</div>

			</body>
		</html>
	`
}
export default generateAppointmentSlip