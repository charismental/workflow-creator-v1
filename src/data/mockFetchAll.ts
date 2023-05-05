const processes = [
	{
		processId: 1,
		processName: "WA DSHS Immigrant Relief 3",
		roles: [
			{
				processId: 1,
				roleId: 1,
				isCluster: 0,
				isUniversal: 1,
				roleName: "system",
				transitions: [
					{
						stateTransitionId: 952,
						fromStateId: 1,
						toStateId: 1,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Application Received",
					},
					{
						stateTransitionId: 1,
						fromStateId: 1,
						toStateId: 2,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Review",
					},
					{
						stateTransitionId: 2,
						fromStateId: 1,
						toStateId: 4,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 3,
						fromStateId: 1,
						toStateId: 6,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Approved",
					},
					{
						stateTransitionId: 4,
						fromStateId: 1,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 5,
						fromStateId: 1,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 6,
						fromStateId: 1,
						toStateId: 9,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 7,
						fromStateId: 1,
						toStateId: 10,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Paid",
					},
				],
			},
			{
				processId: 1,
				roleId: 2,
				isCluster: 0,
				isUniversal: 0,
				roleName: "Review-Specialist",
				transitions: [
					{
						stateTransitionId: 8,
						fromStateId: 3,
						toStateId: 4,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 9,
						fromStateId: 3,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 10,
						fromStateId: 4,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC-Ready",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 11,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 12,
						fromStateId: 7,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 13,
						fromStateId: 9,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "Intake",
					},
				],
			},
			{
				processId: 1,
				roleId: 3,
				isCluster: 0,
				isUniversal: 1,
				roleName: "Intake-Specialist-Manager",
				transitions: [
					{
						stateTransitionId: 14,
						fromStateId: 1,
						toStateId: 1,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Application Received",
					},
					{
						stateTransitionId: 15,
						fromStateId: 1,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 16,
						fromStateId: 1,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Application Received",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 17,
						fromStateId: 2,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Review",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 18,
						fromStateId: 3,
						toStateId: 1,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "Application Received",
					},
					{
						stateTransitionId: 19,
						fromStateId: 3,
						toStateId: 2,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "Review",
					},
					{
						stateTransitionId: 20,
						fromStateId: 3,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 21,
						fromStateId: 3,
						toStateId: 4,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 22,
						fromStateId: 3,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Intake",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 23,
						fromStateId: 4,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC-Ready",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 24,
						fromStateId: 4,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC-Ready",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 25,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 26,
						fromStateId: 7,
						toStateId: 1,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Application Received",
					},
					{
						stateTransitionId: 27,
						fromStateId: 7,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 28,
						fromStateId: 7,
						toStateId: 4,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 29,
						fromStateId: 9,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "Intake",
					},
				],
			},
			{
				processId: 1,
				roleId: 4,
				isCluster: 0,
				isUniversal: 0,
				roleName: "QA/QC-Specialist",
				transitions: [
					{
						stateTransitionId: 30,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 31,
						fromStateId: 5,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 32,
						fromStateId: 5,
						toStateId: 9,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 33,
						fromStateId: 7,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 34,
						fromStateId: 9,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "QA/QC",
					},
				],
			},
			{
				processId: 1,
				roleId: 5,
				isCluster: 0,
				isUniversal: 1,
				roleName: "QA/QC-Lead",
				transitions: [
					{
						stateTransitionId: 35,
						fromStateId: 4,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC-Ready",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 36,
						fromStateId: 4,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC-Ready",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 37,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 38,
						fromStateId: 5,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 39,
						fromStateId: 5,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 40,
						fromStateId: 5,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 41,
						fromStateId: 5,
						toStateId: 9,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 42,
						fromStateId: 7,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 43,
						fromStateId: 7,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 44,
						fromStateId: 7,
						toStateId: 9,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 45,
						fromStateId: 7,
						toStateId: 11,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Fraud",
					},
					{
						stateTransitionId: 46,
						fromStateId: 8,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Denied",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 47,
						fromStateId: 8,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Denied",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 48,
						fromStateId: 8,
						toStateId: 11,
						internalOnly: false,
						processId: 1,
						fromStateName: "Denied",
						toStateName: "Fraud",
					},
					{
						stateTransitionId: 49,
						fromStateId: 9,
						toStateId: 3,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "Intake",
					},
					{
						stateTransitionId: 50,
						fromStateId: 9,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 51,
						fromStateId: 9,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 52,
						fromStateId: 11,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Fraud",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 53,
						fromStateId: 11,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "Fraud",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 224,
						fromStateId: 12,
						toStateId: 10,
						internalOnly: false,
						processId: 1,
						fromStateName: "Award-Outstanding",
						toStateName: "Paid",
					},
					{
						stateTransitionId: 225,
						fromStateId: 12,
						toStateId: 13,
						internalOnly: false,
						processId: 1,
						fromStateName: "Award-Outstanding",
						toStateName: "Award-Reissued",
					},
					{
						stateTransitionId: 226,
						fromStateId: 13,
						toStateId: 13,
						internalOnly: false,
						processId: 1,
						fromStateName: "Award-Reissued",
						toStateName: "Award-Reissued",
					},
				],
			},
			{
				processId: 1,
				roleId: 6,
				isCluster: 0,
				isUniversal: 0,
				roleName: "Finance",
				transitions: [
					{
						stateTransitionId: 54,
						fromStateId: 5,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "QA/QC",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 55,
						fromStateId: 6,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Approved",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 56,
						fromStateId: 6,
						toStateId: 9,
						internalOnly: false,
						processId: 1,
						fromStateName: "Approved",
						toStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 57,
						fromStateId: 6,
						toStateId: 10,
						internalOnly: false,
						processId: 1,
						fromStateName: "Approved",
						toStateName: "Paid",
					},
					{
						stateTransitionId: 58,
						fromStateId: 7,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 59,
						fromStateId: 7,
						toStateId: 9,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 60,
						fromStateId: 7,
						toStateId: 11,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Denial",
						toStateName: "Fraud",
					},
					{
						stateTransitionId: 61,
						fromStateId: 8,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Denied",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 62,
						fromStateId: 8,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Denied",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 63,
						fromStateId: 8,
						toStateId: 11,
						internalOnly: false,
						processId: 1,
						fromStateName: "Denied",
						toStateName: "Fraud",
					},
					{
						stateTransitionId: 64,
						fromStateId: 9,
						toStateId: 5,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "QA/QC",
					},
					{
						stateTransitionId: 65,
						fromStateId: 9,
						toStateId: 6,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "Approved",
					},
					{
						stateTransitionId: 66,
						fromStateId: 9,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Pending-Approval",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 67,
						fromStateId: 10,
						toStateId: 6,
						internalOnly: false,
						processId: 1,
						fromStateName: "Paid",
						toStateName: "Approved",
					},
					{
						stateTransitionId: 227,
						fromStateId: 10,
						toStateId: 12,
						internalOnly: false,
						processId: 1,
						fromStateName: "Paid",
						toStateName: "Award-Outstanding",
					},
					{
						stateTransitionId: 68,
						fromStateId: 11,
						toStateId: 7,
						internalOnly: false,
						processId: 1,
						fromStateName: "Fraud",
						toStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 69,
						fromStateId: 11,
						toStateId: 8,
						internalOnly: false,
						processId: 1,
						fromStateName: "Fraud",
						toStateName: "Denied",
					},
					{
						stateTransitionId: 228,
						fromStateId: 12,
						toStateId: 13,
						internalOnly: false,
						processId: 1,
						fromStateName: "Award-Outstanding",
						toStateName: "Award-Reissued",
					},
					{
						stateTransitionId: 229,
						fromStateId: 13,
						toStateId: 10,
						internalOnly: false,
						processId: 1,
						fromStateName: "Award-Reissued",
						toStateName: "Paid",
					},
				],
			},
			{
				processId: 1,
				roleId: 7,
				isCluster: 0,
				isUniversal: 0,
				roleName: "Multiple",
			},
		],
		states: [
			{
				stateId: 1,
				stateName: "Application Received",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 10,
			},
			{
				stateId: 2,
				stateName: "Review",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 15,
			},
			{
				stateId: 3,
				stateName: "Intake",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
				displayOrder: 20,
			},
			{
				stateId: 4,
				stateName: "QA/QC-Ready",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 30,
			},
			{
				stateId: 5,
				stateName: "QA/QC",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 1,
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
				requiresUserAssignment: 1,
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
				stateId: 10,
				stateName: "Paid",
				requiresRoleAssignment: 0,
				requiresUserAssignment: 0,
				displayOrder: 90,
			},
		],
	},
	{
		processId: 5,
		processName: "Long Beach 1st HomeBuyer P1",
		roles: [],
		states: [],
	},
	{
		processId: 9,
		processName: "Long Beach 1st HomeBuyer P2",
		roles: [],
		states: [],
	},
	{
		processId: 12,
		processName: "Whatcom-LTRG",
		roles: [],
		states: [],
	},
];

const roles = [
	{
		roleId: 1,
		roleName: "system",
	},
	{
		roleId: 2,
		roleName: "Intake-Specialist",
	},
	{
		roleId: 3,
		roleName: "Intake-Specialist-Manager",
	},
	{
		roleId: 4,
		roleName: "Case-Worker",
	},
	{
		roleId: 5,
		roleName: "Case-Worker-Manager",
	},
	{
		roleId: 6,
		roleName: "Finance",
	},
	{
		roleId: 7,
		roleName: "Multiple",
	},
	{
		roleId: 8,
		roleName: "Partner-Final-Reviewer",
	},
	{
		roleId: 9,
		roleName: "Partner-Reviewer",
	},
	{
		roleId: 10,
		roleName: "Customer-Success",
	},
	{
		roleId: 15,
		roleName: "Case-Manager",
	},
	{
		roleId: 16,
		roleName: "Case-Manager-Supervisor",
	},
	{
		roleId: 17,
		roleName: "Review-Specialist",
	},
	{
		roleId: 18,
		roleName: "QA/QC-Specialist",
	},
	{
		roleId: 19,
		roleName: "QA/QC-Lead",
	},
	{
		roleId: 20,
		roleName: "Review-Lead",
	 },
	 {
		roleId: 21,
		roleName: "Outreach-Specialist",
	 },
	 {
		roleId: 22,
		roleName: "Outreach-Lead",
	 }
];

const states = [
	{
		stateId: 1,
		stateName: "Application Received",
	},
	{
		stateId: 2,
		stateName: "Eligible",
	},
	{
		stateId: 3,
		stateName: "Intake",
	},
	{
		stateId: 4,
		stateName: "Intake-Complete",
	},
	{
		stateId: 5,
		stateName: "Case-Review",
	},
	{
		stateId: 6,
		stateName: "Approved",
	},
	{
		stateId: 7,
		stateName: "Pending-Denial",
	},
	{
		stateId: 8,
		stateName: "Denied",
	},
	{
		stateId: 9,
		stateName: "Pending-Approval",
	},
	{
		stateId: 10,
		stateName: "Paid",
	},
	{
		stateId: 11,
		stateName: "Fraud",
	},
	{
		stateId: 12,
		stateName: "Award-Outstanding",
	},
	{
		stateId: 13,
		stateName: "Award-Reissued",
	},
	{
		stateId: 14,
		stateName: "Eligibility",
	},
	{
		stateId: 15,
		stateName: "Outreach",
	},
	{
		stateId: 16,
		stateName: "Partner-Review",
	},
	{
		stateId: 17,
		stateName: "Partner-Final-Review",
	},
	{
		stateId: 27,
		stateName: "Funds-Reserved",
	},
	{
		stateId: 28,
		stateName: "Document-Review",
	},
	{
		stateId: 29,
		stateName: "Document-Complete",
	},
	{
		stateId: 30,
		stateName: "Closing-Document-Review",
	},
	{
		stateId: 31,
		stateName: "Closing-Document-Complete",
	},
	{
		stateId: 46,
		stateName: "Case-New",
	},
	{
		stateId: 47,
		stateName: "Case-Assigned",
	},
	{
		stateId: 48,
		stateName: "Review-Needed",
	},
	{
		stateId: 49,
		stateName: "Review-Scheduled",
	},
	{
		stateId: 50,
		stateName: "Review-Completed",
	},
	{
		stateId: 51,
		stateName: "Pending-Graduation",
	},
	{
		stateId: 52,
		stateName: "Graduated",
	},
	{
		stateId: 53,
		stateName: "Review",
	},
];

export default { processes, states, roles };
