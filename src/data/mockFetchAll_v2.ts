import { WorkflowProcess } from "types";

const process: WorkflowProcess = {
	processName: 'LADV',
	processId: 8,
	sessionId: "5BB6AE0B-1B8D-4B28-A93F-03D2463E4992",
	dateCreated: "2023-05-18T00:27:20.9533333Z",
	dateUpdated: "2023-06-29T23:10:21.1566667Z",
	datePublished: null,
	globals: {
		states: [
			{
				stateId: 1,
				stateName: "Application Received",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 10,
			},
			{
				stateId: 46,
				stateName: "Case-New",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 10,
			},
			{
				stateId: 54,
				stateName: "Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 15,
			},
			{
				stateId: 2,
				stateName: "Eligible",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 15,
			},
			{
				stateId: 14,
				stateName: "Eligibility",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 17,
			},
			{
				stateId: 15,
				stateName: "Outreach",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 18,
			},
			{
				stateId: 3,
				stateName: "Intake",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 20,
			},
			{
				stateId: 47,
				stateName: "Case-Assigned",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 20,
			},
			{
				stateId: 57,
				stateName: "Need-Outreach",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 28,
			},
			{
				stateId: 55,
				stateName: "QA/QC-Ready",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 30,
			},
			{
				stateId: 48,
				stateName: "Review-Needed",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 30,
			},
			{
				stateId: 4,
				stateName: "Intake-Complete",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 30,
			},
			{
				stateId: 5,
				stateName: "Case-Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 40,
			},
			{
				stateId: 49,
				stateName: "Review-Scheduled",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 40,
			},
			{
				stateId: 56,
				stateName: "QA/QC",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 40,
			},
			{
				stateId: 50,
				stateName: "Review-Completed",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 50,
			},
			{
				stateId: 6,
				stateName: "Approved",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 50,
			},
			{
				stateId: 7,
				stateName: "Pending-Denial",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 60,
			},
			{
				stateId: 51,
				stateName: "Pending-Graduation",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 60,
			},
			{
				stateId: 11,
				stateName: "Fraud",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 65,
			},
			{
				stateId: 52,
				stateName: "Graduated",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 70,
			},
			{
				stateId: 53,
				stateName: "Ineligible",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 70,
			},
			{
				stateId: 8,
				stateName: "Denied",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 70,
			},
			{
				stateId: 9,
				stateName: "Pending-Approval",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 80,
			},
			{
				stateId: 16,
				stateName: "Partner-Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 85,
			},
			{
				stateId: 17,
				stateName: "Partner-Final-Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 87,
			},
			{
				stateId: 27,
				stateName: "Funds-Reserved",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 87,
			},
			{
				stateId: 28,
				stateName: "Document-Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 87,
			},
			{
				stateId: 29,
				stateName: "Document-Complete",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 87,
			},
			{
				stateId: 10,
				stateName: "Paid",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 90,
			},
			{
				stateId: 30,
				stateName: "Closing-Document-Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 91,
			},
			{
				stateId: 31,
				stateName: "Closing-Document-Complete",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 92,
			},
			{
				stateId: 58,
				stateName: "Appeal",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 99,
			},
			{
				stateId: 12,
				stateName: "Award-Outstanding",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 100,
			},
			{
				stateId: 13,
				stateName: "Award-Reissued",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 110,
			},
		],
		roles: [
			{
				roleId: 1,
				isCluster: 1,
				isUniversal: 1,
				roleName: "system",
			},
			{
				roleId: 2,
				isCluster: 1,
				isUniversal: 0,
				roleName: "Intake-Specialist",
			},
			{
				roleId: 3,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Intake-Specialist-Manager",
			},
			{
				roleId: 4,
				isCluster: 1,
				isUniversal: 0,
				roleName: "Case-Worker",
			},
			{
				roleId: 5,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Case-Worker-Manager",
			},
			{
				roleId: 6,
				isCluster: 1,
				isUniversal: 0,
				roleName: "Finance",
			},
			{
				roleId: 7,
				isCluster: 1,
				isUniversal: 0,
				roleName: "Multiple",
			},
			{
				roleId: 8,
				isCluster: 1,
				isUniversal: 1,
				roleName: "Partner-Final-Reviewer",
			},
			{
				roleId: 9,
				isCluster: 1,
				isUniversal: 1,
				roleName: "Partner-Reviewer",
			},
			{
				roleId: 10,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Customer-Success",
			},
			{
				roleId: 15,
				isCluster: 0,
				isUniversal: 0,
				roleName: "Case-Manager",
			},
			{
				roleId: 16,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Case-Manager-Supervisor",
			},
			{
				roleId: 17,
				isCluster: 0,
				isUniversal: 0,
				roleName: "Review-Specialist",
			},
			{
				roleId: 18,
				isCluster: 0,
				isUniversal: 0,
				roleName: "QA/QC-Specialist",
			},
			{
				roleId: 19,
				isCluster: 0,
				isUniversal: 1,
				roleName: "QA/QC-Lead",
			},
			{
				roleId: 20,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Review-Lead",
			},
			{
				roleId: 21,
				isCluster: 0,
				isUniversal: 0,
				roleName: "Outreach-Specialist",
			},
			{
				roleId: 22,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Outreach-Lead",
			},
		],
		companies: [
			{
				companyId: -1,
				companyName: "No Association",
				isInternal: 0,
				isTrusted: false,
			},
			{
				companyId: 1,
				companyName: "FORWARD",
				isInternal: 1,
				isTrusted: false,
			},
			{
				companyId: 2,
				companyName: "Company2",
				isInternal: 0,
				isTrusted: false,
			},
			{
				companyId: 3,
				companyName: "Company3",
				isInternal: 0,
				isTrusted: false,
			},
			{
				companyId: 4,
				companyName: "PPL",
				isInternal: 0,
				isTrusted: false,
			},
			{
				companyId: 5,
				companyName: "Long Beach",
				isInternal: 0,
				isTrusted: false,
			},
			{
				companyId: 8,
				companyName: "Whatcom County",
				isInternal: 0,
				isTrusted: false,
			},
		],
	},
	states: [
		{
			stateId: 1,
			stateName: "Application Received",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 10,
		},
		{
			stateId: 54,
			stateName: "Review",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 15,
		},
		{
			stateId: 15,
			stateName: "Outreach",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 1,
			displayOrder: 18,
		},
		{
			stateId: 14,
			stateName: "Eligibility",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 1,
			displayOrder: 20,
		},
		{
			stateId: 57,
			stateName: "Need-Outreach",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 28,
		},
		{
			stateId: 55,
			stateName: "QA/QC-Ready",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 30,
		},
		{
			stateId: 56,
			stateName: "QA/QC",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 1,
			displayOrder: 40,
		},
		{
			stateId: 4,
			stateName: "Intake-Complete",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 40,
		},
		{
			stateId: 6,
			stateName: "Approved",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 50,
		},
		{
			stateId: 5,
			stateName: "Case-Review",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 1,
			displayOrder: 50,
		},
		{
			stateId: 7,
			stateName: "Pending-Denial",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 60,
		},
		{
			stateId: 11,
			stateName: "Fraud",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 65,
		},
		{
			stateId: 8,
			stateName: "Denied",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 70,
		},
		{
			stateId: 16,
			stateName: "Partner-Review",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 1,
			displayOrder: 80,
		},
		{
			stateId: 9,
			stateName: "Pending-Approval",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 80,
		},
		{
			stateId: 10,
			stateName: "Paid",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 90,
		},
		{
			stateId: 58,
			stateName: "Appeal",
			requiresRoleAssignment: 0,
			requiresUserAssignment: 0,
			displayOrder: 99,
		},
	],
	roles: [
		{
			roleId: 4,
			isCluster: 1,
			isUniversal: 0,
			roleName: "Case-Worker",
			transitions: [
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 4,
					roleName: "Case-Worker",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 4,
					roleName: "Case-Worker",
					altStateId: 9,
					toStateName: "Pending-Approval",
					internalOnly: false,
				},
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 4,
					roleName: "Case-Worker",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 5,
			isCluster: 0,
			isUniversal: 1,
			roleName: "Case-Worker-Manager",
			transitions: [
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 5,
					roleName: "Case-Worker-Manager",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 5,
					roleName: "Case-Worker-Manager",
					altStateId: 9,
					toStateName: "Pending-Approval",
					internalOnly: false,
				},
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 5,
					roleName: "Case-Worker-Manager",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 4,
					stateName: "Intake-Complete",
					roleId: 5,
					roleName: "Case-Worker-Manager",
					altStateId: 5,
					toStateName: "Case-Review",
					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 5,
					roleName: "Case-Worker-Manager",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 5,
					roleName: "Case-Worker-Manager",
					altStateId: 5,
					toStateName: "Case-Review",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 10,
			isCluster: 0,
			isUniversal: 1,
			roleName: "Customer-Success",
			transitions: [
				{
					stateId: 58,
					stateName: "Appeal",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 58,
					toStateName: "Appeal",
					internalOnly: false,
				},
				{
					stateId: 1,
					stateName: "Application Received",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 1,
					toStateName: "Application Received",
					internalOnly: false,
				},
				{
					stateId: 6,
					stateName: "Approved",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 6,
					toStateName: "Approved",
					internalOnly: false,
				},
				{
					stateId: 8,
					stateName: "Denied",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 8,
					toStateName: "Denied",
					internalOnly: false,
				},
				{
					stateId: 57,
					stateName: "Need-Outreach",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 57,
					toStateName: "Need-Outreach",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 10,
					stateName: "Paid",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 10,
					toStateName: "Paid",
					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 9,
					toStateName: "Pending-Approval",
					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 56,
					toStateName: "QA/QC",
					internalOnly: false,
				},
				{
					stateId: 55,
					stateName: "QA/QC-Ready",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 55,
					toStateName: "QA/QC-Ready",
					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 10,
					roleName: "Customer-Success",
					altStateId: 54,
					toStateName: "Review",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 6,
			isCluster: 1,
			isUniversal: 0,
			roleName: "Finance",
			transitions: [
				{
					stateId: 6,
					stateName: "Approved",
					roleId: 6,
					roleName: "Finance",
					altStateId: 10,
					toStateName: "Paid",
					internalOnly: false,
				},
				{
					stateId: 10,
					stateName: "Paid",
					roleId: 6,
					roleName: "Finance",
					altStateId: 10,
					toStateName: "Paid",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 2,
			isCluster: 1,
			isUniversal: 0,
			roleName: "Intake-Specialist",
			transitions: [
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 2,
					roleName: "Intake-Specialist",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 2,
					roleName: "Intake-Specialist",
					altStateId: 4,
					toStateName: "Intake-Complete",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 2,
					roleName: "Intake-Specialist",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 2,
					roleName: "Intake-Specialist",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 2,
					roleName: "Intake-Specialist",
					altStateId: 4,
					toStateName: "Intake-Complete",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 2,
					roleName: "Intake-Specialist",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 3,
			isCluster: 0,
			isUniversal: 1,
			roleName: "Intake-Specialist-Manager",
			transitions: [
				{
					stateId: 1,
					stateName: "Application Received",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 1,
					toStateName: "Application Received",
					internalOnly: false,
				},
				{
					stateId: 1,
					stateName: "Application Received",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 14,
					toStateName: "Eligibility",
					internalOnly: false,
				},
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 1,
					toStateName: "Application Received",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 4,
					toStateName: "Intake-Complete",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 4,
					toStateName: "Intake-Complete",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 3,
					roleName: "Intake-Specialist-Manager",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 22,
			isCluster: 0,
			isUniversal: 1,
			roleName: "Outreach-Lead",
			transitions: [
				{
					stateId: 57,
					stateName: "Need-Outreach",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 57,
					stateName: "Need-Outreach",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 54,
					toStateName: "Review",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 57,
					toStateName: "Need-Outreach",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 55,
					toStateName: "QA/QC-Ready",
					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 55,
					stateName: "QA/QC-Ready",
					roleId: 22,
					roleName: "Outreach-Lead",
					altStateId: 55,
					toStateName: "QA/QC-Ready",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 21,
			isCluster: 0,
			isUniversal: 0,
			roleName: "Outreach-Specialist",
			transitions: [
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 21,
					roleName: "Outreach-Specialist",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 21,
					roleName: "Outreach-Specialist",
					altStateId: 55,
					toStateName: "QA/QC-Ready",
					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 21,
					roleName: "Outreach-Specialist",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 55,
					stateName: "QA/QC-Ready",
					roleId: 21,
					roleName: "Outreach-Specialist",
					altStateId: 55,
					toStateName: "QA/QC-Ready",
					internalOnly: false,
				},
			],
		},
		{
			roleId: 9,
			isCluster: 1,
			isUniversal: 1,
			roleName: "Partner-Reviewer",
			transitions: [
				{
					stateId: 1,
					stateName: "Application Received",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 1,
					toStateName: "Application Received",
					internalOnly: false,
				},
				{
					stateId: 5,
					stateName: "Case-Review",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 5,
					toStateName: "Case-Review",
					internalOnly: false,
				},
				{
					stateId: 8,
					stateName: "Denied",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 16,
					toStateName: "Partner-Review",
					internalOnly: false,
				},
				{
					stateId: 14,
					stateName: "Eligibility",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 14,
					toStateName: "Eligibility",
					internalOnly: false,
				},
				{
					stateId: 4,
					stateName: "Intake-Complete",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 4,
					toStateName: "Intake-Complete",
					internalOnly: false,
				},
				{
					stateId: 15,
					stateName: "Outreach",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 15,
					toStateName: "Outreach",
					internalOnly: false,
				},
				{
					stateId: 16,
					stateName: "Partner-Review",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 6,
					toStateName: "Approved",
					internalOnly: false,
				},
				{
					stateId: 16,
					stateName: "Partner-Review",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 8,
					toStateName: "Denied",
					internalOnly: false,
				},
				{
					stateId: 16,
					stateName: "Partner-Review",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 7,
					toStateName: "Pending-Denial",
					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 16,
					toStateName: "Partner-Review",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 8,
					toStateName: "Denied",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 9,
					roleName: "Partner-Reviewer",
					altStateId: 16,
					toStateName: "Partner-Review",


					internalOnly: false,
				},
			],
		},
		{
			roleId: 19,
			isCluster: 0,
			isUniversal: 1,
			roleName: "QA/QC-Lead",
			transitions: [
				{
					stateId: 58,
					stateName: "Appeal",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 6,
					toStateName: "Approved",


					internalOnly: false,
				},
				{
					stateId: 6,
					stateName: "Approved",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 6,
					toStateName: "Approved",


					internalOnly: false,
				},
				{
					stateId: 8,
					stateName: "Denied",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 58,
					toStateName: "Appeal",


					internalOnly: false,
				},
				{
					stateId: 11,
					stateName: "Fraud",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 8,
					toStateName: "Denied",


					internalOnly: false,
				},
				{
					stateId: 11,
					stateName: "Fraud",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 9,
					toStateName: "Pending-Approval",


					internalOnly: false,
				},
				{
					stateId: 10,
					stateName: "Paid",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 10,
					toStateName: "Paid",


					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 6,
					toStateName: "Approved",


					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 11,
					toStateName: "Fraud",


					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 15,
					toStateName: "Outreach",


					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 56,
					toStateName: "QA/QC",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 8,
					toStateName: "Denied",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 11,
					toStateName: "Fraud",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 56,
					toStateName: "QA/QC",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 15,
					toStateName: "Outreach",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 9,
					toStateName: "Pending-Approval",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 7,
					toStateName: "Pending-Denial",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 55,
					toStateName: "QA/QC-Ready",


					internalOnly: false,
				},
				{
					stateId: 55,
					stateName: "QA/QC-Ready",
					roleId: 19,
					roleName: "QA/QC-Lead",
					altStateId: 56,
					toStateName: "QA/QC",


					internalOnly: false,
				},
			],
		},
		{
			roleId: 18,
			isCluster: 0,
			isUniversal: 0,
			roleName: "QA/QC-Specialist",
			transitions: [
				{
					stateId: 11,
					stateName: "Fraud",
					roleId: 18,
					roleName: "QA/QC-Specialist",
					altStateId: 9,
					toStateName: "Pending-Approval",


					internalOnly: false,
				},
				{
					stateId: 9,
					stateName: "Pending-Approval",
					roleId: 18,
					roleName: "QA/QC-Specialist",
					altStateId: 11,
					toStateName: "Fraud",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 18,
					roleName: "QA/QC-Specialist",
					altStateId: 56,
					toStateName: "QA/QC",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 18,
					roleName: "QA/QC-Specialist",
					altStateId: 15,
					toStateName: "Outreach",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 18,
					roleName: "QA/QC-Specialist",
					altStateId: 9,
					toStateName: "Pending-Approval",


					internalOnly: false,
				},
				{
					stateId: 56,
					stateName: "QA/QC",
					roleId: 18,
					roleName: "QA/QC-Specialist",
					altStateId: 7,
					toStateName: "Pending-Denial",


					internalOnly: false,
				},
			],
		},
		{
			roleId: 20,
			isCluster: 0,
			isUniversal: 1,
			roleName: "Review-Lead",
			transitions: [
				{
					stateId: 1,
					stateName: "Application Received",
					roleId: 20,
					roleName: "Review-Lead",
					altStateId: 54,
					toStateName: "Review",


					internalOnly: false,
				},
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 20,
					roleName: "Review-Lead",
					altStateId: 54,
					toStateName: "Review",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 20,
					roleName: "Review-Lead",
					altStateId: 1,
					toStateName: "Application Received",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 20,
					roleName: "Review-Lead",
					altStateId: 57,
					toStateName: "Need-Outreach",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 20,
					roleName: "Review-Lead",
					altStateId: 7,
					toStateName: "Pending-Denial",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 20,
					roleName: "Review-Lead",
					altStateId: 55,
					toStateName: "QA/QC-Ready",


					internalOnly: false,
				},
			],
		},
		{
			roleId: 17,
			isCluster: 0,
			isUniversal: 0,
			roleName: "Review-Specialist",
			transitions: [
				{
					stateId: 7,
					stateName: "Pending-Denial",
					roleId: 17,
					roleName: "Review-Specialist",
					altStateId: 54,
					toStateName: "Review",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 17,
					roleName: "Review-Specialist",
					altStateId: 57,
					toStateName: "Need-Outreach",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 17,
					roleName: "Review-Specialist",
					altStateId: 7,
					toStateName: "Pending-Denial",


					internalOnly: false,
				},
				{
					stateId: 54,
					stateName: "Review",
					roleId: 17,
					roleName: "Review-Specialist",
					altStateId: 55,
					toStateName: "QA/QC-Ready",


					internalOnly: false,
				},
			],
		},
		{
			roleId: 1,
			isCluster: 1,
			isUniversal: 1,
			roleName: "system",
			transitions: [
				{
					stateId: 1,
					stateName: "Application Received",
					roleId: 1,
					roleName: "system",
					altStateId: 1,
					toStateName: "Application Received",


					internalOnly: false,
				},
			],
		},
	],
	companies: [
		{
			companyId: 1,
			companyName: "FORWARD",
			isInternal: 1,
			isTrusted: false,
		},
		{
			companyId: 5,
			companyName: "Long Beach",
			isInternal: 0,
			isTrusted: false,
		},
	],
};

export default { process };
