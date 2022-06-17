import moment from 'moment'

const generateHospitalFinanceReport = (hospital: any, appointments: any, fromDate: any, toDate: any) => {
	const appointmentFromDate = moment(fromDate).format("YYYY/MM/DD")
	const appointmentFromTime = moment(fromDate).format('hh:mm a')

	const appointmentToDate = moment(toDate).format("YYYY/MM/DD")
	const appointmentToTime = moment(toDate).format('hh:mm a')

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>Appointment Slip</title>
			<style>
			.container {
				margin-left: 1rem;
				margin-right: 1rem;
				margin-top: 3rem;
				font-family: 'Lato', sans-serif;
			}
			.logo {
				width: 5rem;
				float: right;
			}
			
			.heading {
				font-size: 1.5rem;
				text-align: center;
				padding-top: 1rem;
				text-decoration: underline;
			}
			
			.clinicName {
				float: right;
				font-weight: bold;
			}
			
			.list-item {
				border: 1px solid black;
				padding: 15px;
				margin-bottom: 3px;
			}
			
			.first {
				float: left;
				margin-top: -6px;
			}
			
			.second {
				float: right;
				margin-top: -6px;
			}
			.last-section {
				text-align: center;
			}
			
			.signatures {
				display: flex;
				justify-content: space-between;
				margin-top: 1rem;
			}
			.sig-second {
				float: right;
				margin-top: -19px;
			}
			</style>
		</head>
			<body>
			<div class="container">
			<img src="https://res.cloudinary.com/dsimhetcs/image/upload/v1642879618/jvk6lifa3ixqulihbdci.png" class="logo" />
			<p class="heading">Payment Details</p>
			<br />
			<p>From: ${appointmentFromDate}</p>
			<p>To: ${appointmentToDate}</p>
			<p class="clinicName">${hospital?.name || "MEDICAPP"}</p>
			<div>
				<br /><br />
				<p> Appointment List </p>
				${appointments.map((item: any) => (
		`<div class="list-item">
									<div class="first">
										${item?.patientId?.firstName + " " + item?.patientId?.lastName}
									</div>
									<div class="second">
										Date: ${moment(item.from).format("YYYY/MM/DD")} Time: ${moment(item.from).format('HH:mm a')}
									</div>
								</div>`
	))}

			</div>
			<br />
    <div class="last-section">
      <p>Total Appointments: ${appointments?.length}</p>
      <p>Total Amount: ${appointments?.length * 21} AED</p>
    </div>
				<hr />
				<div class="signatures">
					<div class="sig-first">
						Authorized Signature
					</div>
					<div class="sig-second">
						Clinic Signature
					</div>
				</div>
			</div>
			</body>
		</html>
	`
}

export default generateHospitalFinanceReport