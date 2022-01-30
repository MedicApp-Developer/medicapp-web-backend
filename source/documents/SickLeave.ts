import moment from 'moment'

export function getAge(dateString: any) {
	var today = new Date()
	var birthDate = new Date(dateString)
	var age = today.getFullYear() - birthDate.getFullYear()
	var m = today.getMonth() - birthDate.getMonth()
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--
	}
	return age
}

const generateSickLeaveDocument = (leave: any) => {
	console.log("leave => ", leave)
	const todayDate = moment(new Date()).format("YYYY/MM/DD")
	const fromDate = moment(leave?.from).format("YYYY/MM/DD")
	const toDate = moment(leave?.to).format("YYYY/MM/DD")
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>Sick Leave Approval</title>
			<style>
			.container {
				padding: 2rem;
			}
			
			.underline {
				text-decoration: underline;
			}
			
			.center {
				text-align: center
			}
			
			.contact-box {
				padding-left: 1.5rem;
				border: 1px solid gray;
				width: 20rem;
				border-radius: 1rem
			}
			
			.bold {
				 font-weight: bold
			}
			
			.space { 
				 margin: 0.5rem
			}
			
			.heading: {
				margin-top: 1rem;
				margin-bottom: 1rem;
			}
			
			.imageContainer {
				text-align: center;
				margin-top: 1rem;
				margin-bottom: 1rem;
			}
			
			.signature {
				float: right;
			}
			
			.underline-signature {
				display: inline-block;
								padding-right: 1rem;
								padding-left: 1rem;
								border-bottom: 1px solid #888;
			}
			
			.disclaimer {
				text-align: center;
				font-style: italic;
				font-size: 0.7rem;
			}
			</style>
		</head>
			<body>
			
			<div class="container">
  
  <div class="contact-box">
    <p> <span class="underline bold space">Name:</span> ${leave?.patientId?.firstName + " " + leave?.patientId?.lastName} </p>
    <p><span class="underline bold space">ID:</span> ${leave?.patientId?.emiratesId}</p>
    <p><span class="underline bold space">Gender:</span> ${leave?.patientId?.gender}</p>
    <p><span class="underline bold space">Age:</span> ${getAge(leave?.patientId.birthday)}</p>
    <p><span class="underline bold space">Contact: </span> ${leave?.patientId?.phone}</p>
  </div>
  
  <h1 class="underline center heading">Sick Leave</h1>
  <p>Doctor's diagnose and remarks: ${leave?.description}</p>
  <p>From: ${fromDate}</p>
  <p>To: ${toDate}</p>
  <div class="imageContainer">
      <img src="https://res.cloudinary.com/dsimhetcs/image/upload/v1642879618/jvk6lifa3ixqulihbdci.png" class="image" />
  </div>
  
  <div class="signature">
    <p> <span class="bold space">Doctor:</span> <span class="underline-signature">${leave?.doctorId?.firstName + " " + leave?.doctorId?.lastName}</span></p>
    <p><span class="bold space">Hospital:</span> <span class="underline-signature">${leave?.doctorId?.hospitalId?.name}</span></p>
    <p><span class="bold space">Signature:</span> <span class="underline-signature">${leave?.doctorId?.firstName + " " + leave?.doctorId?.lastName}<span/></p>
  </div>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  
  <div class="disclaimer">
    <p>*Disclaimer: MedicApp L.L.C will not be responsible of how this document is used</p>
  </div>
  
  <p class="underline-signature"> Date Issued: ${todayDate} </p>
</div>

			</body>
		</html>
	`
}

export default generateSickLeaveDocument