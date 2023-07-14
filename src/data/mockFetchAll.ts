const processes = [
	{
		ProcessId: 1,
		ProcessName: "WA DSHS Immigrant Relief 3",
		roles: [
			{
				ProcessId: 1,
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
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Application Received",
					},
					{
						stateTransitionId: 1,
						fromStateId: 1,
						toStateId: 2,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Review",
					},
					{
						stateTransitionId: 2,
						fromStateId: 1,
						toStateId: 4,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 3,
						fromStateId: 1,
						toStateId: 6,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Approved",
					},
					{
						stateTransitionId: 4,
						fromStateId: 1,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 5,
						fromStateId: 1,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 6,
						fromStateId: 1,
						toStateId: 9,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 7,
						fromStateId: 1,
						toStateId: 10,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Paid",
					},
				],
			},
			{
				ProcessId: 1,
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
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 9,
						fromStateId: 3,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 10,
						fromStateId: 4,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC-Ready",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 11,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 12,
						fromStateId: 7,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 13,
						fromStateId: 9,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "Intake",
					},
				],
			},
			{
				ProcessId: 1,
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
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Application Received",
					},
					{
						stateTransitionId: 15,
						fromStateId: 1,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 16,
						fromStateId: 1,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Application Received",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 17,
						fromStateId: 2,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Review",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 18,
						fromStateId: 3,
						toStateId: 1,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "Application Received",
					},
					{
						stateTransitionId: 19,
						fromStateId: 3,
						toStateId: 2,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "Review",
					},
					{
						stateTransitionId: 20,
						fromStateId: 3,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 21,
						fromStateId: 3,
						toStateId: 4,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 22,
						fromStateId: 3,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Intake",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 23,
						fromStateId: 4,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC-Ready",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 24,
						fromStateId: 4,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC-Ready",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 25,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 26,
						fromStateId: 7,
						toStateId: 1,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Application Received",
					},
					{
						stateTransitionId: 27,
						fromStateId: 7,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 28,
						fromStateId: 7,
						toStateId: 4,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "QA/QC-Ready",
					},
					{
						stateTransitionId: 29,
						fromStateId: 9,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "Intake",
					},
				],
			},
			{
				ProcessId: 1,
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
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 31,
						fromStateId: 5,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 32,
						fromStateId: 5,
						toStateId: 9,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 33,
						fromStateId: 7,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 34,
						fromStateId: 9,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "QA/QC",
					},
				],
			},
			{
				ProcessId: 1,
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
						ProcessId: 1,
						fromStateName: "QA/QC-Ready",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 36,
						fromStateId: 4,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC-Ready",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 37,
						fromStateId: 5,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 38,
						fromStateId: 5,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 39,
						fromStateId: 5,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 40,
						fromStateId: 5,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 41,
						fromStateId: 5,
						toStateId: 9,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 42,
						fromStateId: 7,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 43,
						fromStateId: 7,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 44,
						fromStateId: 7,
						toStateId: 9,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 45,
						fromStateId: 7,
						toStateId: 11,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Fraud",
					},
					{
						stateTransitionId: 46,
						fromStateId: 8,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Denied",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 47,
						fromStateId: 8,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Denied",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 48,
						fromStateId: 8,
						toStateId: 11,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Denied",
						ToStateName: "Fraud",
					},
					{
						stateTransitionId: 49,
						fromStateId: 9,
						toStateId: 3,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "Intake",
					},
					{
						stateTransitionId: 50,
						fromStateId: 9,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 51,
						fromStateId: 9,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 52,
						fromStateId: 11,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Fraud",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 53,
						fromStateId: 11,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Fraud",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 224,
						fromStateId: 12,
						toStateId: 10,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Award-Outstanding",
						ToStateName: "Paid",
					},
					{
						stateTransitionId: 225,
						fromStateId: 12,
						toStateId: 13,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Award-Outstanding",
						ToStateName: "Award-Reissued",
					},
					{
						stateTransitionId: 226,
						fromStateId: 13,
						toStateId: 13,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Award-Reissued",
						ToStateName: "Award-Reissued",
					},
				],
			},
			{
				ProcessId: 1,
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
						ProcessId: 1,
						fromStateName: "QA/QC",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 55,
						fromStateId: 6,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Approved",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 56,
						fromStateId: 6,
						toStateId: 9,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Approved",
						ToStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 57,
						fromStateId: 6,
						toStateId: 10,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Approved",
						ToStateName: "Paid",
					},
					{
						stateTransitionId: 58,
						fromStateId: 7,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 59,
						fromStateId: 7,
						toStateId: 9,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Pending-Approval",
					},
					{
						stateTransitionId: 60,
						fromStateId: 7,
						toStateId: 11,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Denial",
						ToStateName: "Fraud",
					},
					{
						stateTransitionId: 61,
						fromStateId: 8,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Denied",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 62,
						fromStateId: 8,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Denied",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 63,
						fromStateId: 8,
						toStateId: 11,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Denied",
						ToStateName: "Fraud",
					},
					{
						stateTransitionId: 64,
						fromStateId: 9,
						toStateId: 5,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "QA/QC",
					},
					{
						stateTransitionId: 65,
						fromStateId: 9,
						toStateId: 6,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "Approved",
					},
					{
						stateTransitionId: 66,
						fromStateId: 9,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Pending-Approval",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 67,
						fromStateId: 10,
						toStateId: 6,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Paid",
						ToStateName: "Approved",
					},
					{
						stateTransitionId: 227,
						fromStateId: 10,
						toStateId: 12,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Paid",
						ToStateName: "Award-Outstanding",
					},
					{
						stateTransitionId: 68,
						fromStateId: 11,
						toStateId: 7,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Fraud",
						ToStateName: "Pending-Denial",
					},
					{
						stateTransitionId: 69,
						fromStateId: 11,
						toStateId: 8,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Fraud",
						ToStateName: "Denied",
					},
					{
						stateTransitionId: 228,
						fromStateId: 12,
						toStateId: 13,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Award-Outstanding",
						ToStateName: "Award-Reissued",
					},
					{
						stateTransitionId: 229,
						fromStateId: 13,
						toStateId: 10,
						internalOnly: false,
						ProcessId: 1,
						fromStateName: "Award-Reissued",
						ToStateName: "Paid",
					},
				],
			},
			{
				ProcessId: 1,
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
		companies: [],
	},
	{
		ProcessId: 5,
		ProcessName: "Long Beach 1st HomeBuyer P1",
		roles: [],
		states: [],
	},
	{
		ProcessId: 9,
		ProcessName: "Long Beach 1st HomeBuyer P2",
		roles: [],
		states: [],
	},
	{
		ProcessId: 12,
		ProcessName: "Whatcom-LTRG",
		roles: [],
		states: [],
	},
];

const roles = [
	{
		roleId: 1,
		roleName: "system",
		isUniversal: 1,
		isCluster: 1,
	},
	{
		roleId: 2,
		roleName: "Intake-Specialist",
		isUniversal: 0,
		isCluster: 1,
	},
	{
		roleId: 3,
		roleName: "Intake-Specialist-Manager",
		isUniversal: 1,
		isCluster: 0,
	},
	{
		roleId: 4,
		roleName: "Case-Worker",
		isUniversal: 0,
		isCluster: 1,
	},
	{
		roleId: 5,
		roleName: "Case-Worker-Manager",
		isUniversal: 1,
		isCluster: 0,
	},
	{
		roleId: 6,
		roleName: "Finance",
		isUniversal: 0,
		isCluster: 1,
	},
	{
		roleId: 7,
		roleName: "Multiple",
		isUniversal: 0,
		isCluster: 1,
	},
	{
		roleId: 8,
		roleName: "Partner-Final-Reviewer",
		isUniversal: 1,
		isCluster: 1,
	},
	{
		roleId: 9,
		roleName: "Partner-Reviewer",
		isUniversal: 1,
		isCluster: 1,
	},
	{
		roleId: 10,
		roleName: "Customer-Success",
		isUniversal: 1,
		isCluster: 0,
	},
	{
		roleId: 15,
		roleName: "Case-Manager",
		isUniversal: 0,
		isCluster: 0,
	},
	{
		roleId: 16,
		roleName: "Case-Manager-Supervisor",
		isUniversal: 1,
		isCluster: 0,
	},
	{
		roleId: 17,
		roleName: "Review-Specialist",
		isUniversal: 0,
		isCluster: 0,
	},
	{
		roleId: 18,
		roleName: "QA/QC-Specialist",
		isUniversal: 0,
		isCluster: 0,
	},
	{
		roleId: 19,
		roleName: "QA/QC-Lead",
		isUniversal: 1,
		isCluster: 0,
	},
	{
		roleId: 20,
		roleName: "Review-Lead",
		isUniversal: 1,
		isCluster: 0,
	},
	{
		roleId: 21,
		roleName: "Outreach-Specialist",
		isUniversal: 0,
		isCluster: 0,
	},
	{
		roleId: 22,
		roleName: "Outreach-Lead",
		isUniversal: 1,
		isCluster: 0,
	},
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

const companies = [
	{
		CompanyId: -1,
		CompanyName: "No Association",
		isInternal: 0,
		IsTrusted: false,
	},
	{
		CompanyId: 1,
		CompanyName: "FORWARD",
		isInternal: 1,
		IsTrusted: false,
	},
	{
		CompanyId: 2,
		CompanyName: "Company2",
		isInternal: 0,
		IsTrusted: false,
	},
	{
		CompanyId: 3,
		CompanyName: "Company3",
		isInternal: 0,
		IsTrusted: false,
	},
	{
		CompanyId: 4,
		CompanyName: "PPL",
		isInternal: 0,
		IsTrusted: false,
	},
	{
		CompanyId: 5,
		CompanyName: "Long Beach",
		isInternal: 0,
		IsTrusted: false,
	},
	{
		CompanyId: 8,
		CompanyName: "Whatcom County",
		isInternal: 0,
		IsTrusted: false,
	},
];

export default { processes, states, roles, companies };
