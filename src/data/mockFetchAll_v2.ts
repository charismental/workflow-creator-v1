import { WorkflowProcess } from "types/workflowTypes";

const process: WorkflowProcess = {
	ProcessID: 8,
	ProcessName: "ladv",
	SessionID: "5BB6AE0B-1B8D-4B28-A93F-03D2463E4992",
	Globals: {
		States: [
			{
				StateId: 1,
				StateName: "Application Received",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 10,
			},
			{
				StateId: 46,
				StateName: "Case-New",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 10,
			},
			{
				StateId: 54,
				StateName: "Review",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 15,
			},
			{
				StateId: 2,
				StateName: "Eligible",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 15,
			},
			{
				StateId: 14,
				StateName: "Eligibility",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 17,
			},
			{
				StateId: 15,
				StateName: "Outreach",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 18,
			},
			{
				StateId: 3,
				StateName: "Intake",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 20,
			},
			{
				StateId: 47,
				StateName: "Case-Assigned",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 20,
			},
			{
				StateId: 57,
				StateName: "Need-Outreach",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 28,
			},
			{
				StateId: 55,
				StateName: "QA/QC-Ready",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 30,
			},
			{
				StateId: 48,
				StateName: "Review-Needed",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 30,
			},
			{
				StateId: 4,
				StateName: "Intake-Complete",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 30,
			},
			{
				StateId: 5,
				StateName: "Case-Review",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 40,
			},
			{
				StateId: 49,
				StateName: "Review-Scheduled",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 40,
			},
			{
				StateId: 56,
				StateName: "QA/QC",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 40,
			},
			{
				StateId: 50,
				StateName: "Review-Completed",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 50,
			},
			{
				StateId: 6,
				StateName: "Approved",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 50,
			},
			{
				StateId: 7,
				StateName: "Pending-Denial",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 60,
			},
			{
				StateId: 51,
				StateName: "Pending-Graduation",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 60,
			},
			{
				StateId: 11,
				StateName: "Fraud",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 65,
			},
			{
				StateId: 52,
				StateName: "Graduated",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 70,
			},
			{
				StateId: 53,
				StateName: "Ineligible",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 70,
			},
			{
				StateId: 8,
				StateName: "Denied",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 70,
			},
			{
				StateId: 9,
				StateName: "Pending-Approval",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 80,
			},
			{
				StateId: 16,
				StateName: "Partner-Review",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 85,
			},
			{
				StateId: 17,
				StateName: "Partner-Final-Review",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 87,
			},
			{
				StateId: 27,
				StateName: "Funds-Reserved",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 87,
			},
			{
				StateId: 28,
				StateName: "Document-Review",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 87,
			},
			{
				StateId: 29,
				StateName: "Document-Complete",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 87,
			},
			{
				StateId: 10,
				StateName: "Paid",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 90,
			},
			{
				StateId: 30,
				StateName: "Closing-Document-Review",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 91,
			},
			{
				StateId: 31,
				StateName: "Closing-Document-Complete",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 1,
				DisplayOrder: 92,
			},
			{
				StateId: 58,
				StateName: "Appeal",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 99,
			},
			{
				StateId: 12,
				StateName: "Award-Outstanding",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 100,
			},
			{
				StateId: 13,
				StateName: "Award-Reissued",
				RequiresRoleAssignment: 0,
				RequiresUserAssignment: 0,
				DisplayOrder: 110,
			},
		],
		Roles: [
			{
				RoleId: 1,
				IsCluster: 1,
				IsUniversal: 1,
				RoleName: "system",
			},
			{
				RoleId: 2,
				IsCluster: 1,
				IsUniversal: 0,
				RoleName: "Intake-Specialist",
			},
			{
				RoleId: 3,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "Intake-Specialist-Manager",
			},
			{
				RoleId: 4,
				IsCluster: 1,
				IsUniversal: 0,
				RoleName: "Case-Worker",
			},
			{
				RoleId: 5,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "Case-Worker-Manager",
			},
			{
				RoleId: 6,
				IsCluster: 1,
				IsUniversal: 0,
				RoleName: "Finance",
			},
			{
				RoleId: 7,
				IsCluster: 1,
				IsUniversal: 0,
				RoleName: "Multiple",
			},
			{
				RoleId: 8,
				IsCluster: 1,
				IsUniversal: 1,
				RoleName: "Partner-Final-Reviewer",
			},
			{
				RoleId: 9,
				IsCluster: 1,
				IsUniversal: 1,
				RoleName: "Partner-Reviewer",
			},
			{
				RoleId: 10,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "Customer-Success",
			},
			{
				RoleId: 15,
				IsCluster: 0,
				IsUniversal: 0,
				RoleName: "Case-Manager",
			},
			{
				RoleId: 16,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "Case-Manager-Supervisor",
			},
			{
				RoleId: 17,
				IsCluster: 0,
				IsUniversal: 0,
				RoleName: "Review-Specialist",
			},
			{
				RoleId: 18,
				IsCluster: 0,
				IsUniversal: 0,
				RoleName: "QA/QC-Specialist",
			},
			{
				RoleId: 19,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "QA/QC-Lead",
			},
			{
				RoleId: 20,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "Review-Lead",
			},
			{
				RoleId: 21,
				IsCluster: 0,
				IsUniversal: 0,
				RoleName: "Outreach-Specialist",
			},
			{
				RoleId: 22,
				IsCluster: 0,
				IsUniversal: 1,
				RoleName: "Outreach-Lead",
			},
		],
		Companies: [
			{
				CompanyID: -1,
				CompanyName: "No Association",
				isInternal: 0,
				IsTrusted: false,
			},
			{
				CompanyID: 1,
				CompanyName: "FORWARD",
				isInternal: 1,
				IsTrusted: false,
			},
			{
				CompanyID: 2,
				CompanyName: "Company2",
				isInternal: 0,
				IsTrusted: false,
			},
			{
				CompanyID: 3,
				CompanyName: "Company3",
				isInternal: 0,
				IsTrusted: false,
			},
			{
				CompanyID: 4,
				CompanyName: "PPL",
				isInternal: 0,
				IsTrusted: false,
			},
			{
				CompanyID: 5,
				CompanyName: "Long Beach",
				isInternal: 0,
				IsTrusted: false,
			},
			{
				CompanyID: 8,
				CompanyName: "Whatcom County",
				isInternal: 0,
				IsTrusted: false,
			},
		],
	},
	States: [
		{
			StateId: 1,
			StateName: "Application Received",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 10,
		},
		{
			StateId: 54,
			StateName: "Review",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 15,
		},
		{
			StateId: 15,
			StateName: "Outreach",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 1,
			DisplayOrder: 18,
		},
		{
			StateId: 14,
			StateName: "Eligibility",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 1,
			DisplayOrder: 20,
		},
		{
			StateId: 57,
			StateName: "Need-Outreach",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 28,
		},
		{
			StateId: 55,
			StateName: "QA/QC-Ready",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 30,
		},
		{
			StateId: 56,
			StateName: "QA/QC",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 1,
			DisplayOrder: 40,
		},
		{
			StateId: 4,
			StateName: "Intake-Complete",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 40,
		},
		{
			StateId: 6,
			StateName: "Approved",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 50,
		},
		{
			StateId: 5,
			StateName: "Case-Review",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 1,
			DisplayOrder: 50,
		},
		{
			StateId: 7,
			StateName: "Pending-Denial",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 60,
		},
		{
			StateId: 11,
			StateName: "Fraud",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 65,
		},
		{
			StateId: 8,
			StateName: "Denied",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 70,
		},
		{
			StateId: 16,
			StateName: "Partner-Review",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 1,
			DisplayOrder: 80,
		},
		{
			StateId: 9,
			StateName: "Pending-Approval",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 80,
		},
		{
			StateId: 10,
			StateName: "Paid",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 90,
		},
		{
			StateId: 58,
			StateName: "Appeal",
			RequiresRoleAssignment: 0,
			RequiresUserAssignment: 0,
			DisplayOrder: 99,
		},
	],
	Roles: [
		{
			RoleId: 4,
			IsCluster: 1,
			IsUniversal: 0,
			RoleName: "Case-Worker",
			Transitions: [
				{
					StateTransitionID: 444,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 4,
					RoleName: "Case-Worker",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 443,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 4,
					RoleName: "Case-Worker",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 442,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 4,
					RoleName: "Case-Worker",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 5,
			IsCluster: 0,
			IsUniversal: 1,
			RoleName: "Case-Worker-Manager",
			Transitions: [
				{
					StateTransitionID: 449,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 5,
					RoleName: "Case-Worker-Manager",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 448,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 5,
					RoleName: "Case-Worker-Manager",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 446,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 5,
					RoleName: "Case-Worker-Manager",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 445,
					StateId: 4,
					StateName: "Intake-Complete",
					RoleId: 5,
					RoleName: "Case-Worker-Manager",
					AltStateId: 5,
					ToStateName: "Case-Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 450,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 5,
					RoleName: "Case-Worker-Manager",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 447,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 5,
					RoleName: "Case-Worker-Manager",
					AltStateId: 5,
					ToStateName: "Case-Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 10,
			IsCluster: 0,
			IsUniversal: 1,
			RoleName: "Customer-Success",
			Transitions: [
				{
					StateTransitionID: 521,
					StateId: 58,
					StateName: "Appeal",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 58,
					ToStateName: "Appeal",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 510,
					StateId: 1,
					StateName: "Application Received",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 1,
					ToStateName: "Application Received",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 517,
					StateId: 6,
					StateName: "Approved",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 6,
					ToStateName: "Approved",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 520,
					StateId: 8,
					StateName: "Denied",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 8,
					ToStateName: "Denied",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 512,
					StateId: 57,
					StateName: "Need-Outreach",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 57,
					ToStateName: "Need-Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 513,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 518,
					StateId: 10,
					StateName: "Paid",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 10,
					ToStateName: "Paid",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 516,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 519,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 515,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 56,
					ToStateName: "QA/QC",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 514,
					StateId: 55,
					StateName: "QA/QC-Ready",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 511,
					StateId: 54,
					StateName: "Review",
					RoleId: 10,
					RoleName: "Customer-Success",
					AltStateId: 54,
					ToStateName: "Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 6,
			IsCluster: 1,
			IsUniversal: 0,
			RoleName: "Finance",
			Transitions: [
				{
					StateTransitionID: 508,
					StateId: 6,
					StateName: "Approved",
					RoleId: 6,
					RoleName: "Finance",
					AltStateId: 10,
					ToStateName: "Paid",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 509,
					StateId: 10,
					StateName: "Paid",
					RoleId: 6,
					RoleName: "Finance",
					AltStateId: 10,
					ToStateName: "Paid",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 2,
			IsCluster: 1,
			IsUniversal: 0,
			RoleName: "Intake-Specialist",
			Transitions: [
				{
					StateTransitionID: 430,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 2,
					RoleName: "Intake-Specialist",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 425,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 2,
					RoleName: "Intake-Specialist",
					AltStateId: 4,
					ToStateName: "Intake-Complete",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 427,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 2,
					RoleName: "Intake-Specialist",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 426,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 2,
					RoleName: "Intake-Specialist",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 429,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 2,
					RoleName: "Intake-Specialist",
					AltStateId: 4,
					ToStateName: "Intake-Complete",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 428,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 2,
					RoleName: "Intake-Specialist",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 3,
			IsCluster: 0,
			IsUniversal: 1,
			RoleName: "Intake-Specialist-Manager",
			Transitions: [
				{
					StateTransitionID: 431,
					StateId: 1,
					StateName: "Application Received",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 1,
					ToStateName: "Application Received",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 432,
					StateId: 1,
					StateName: "Application Received",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 14,
					ToStateName: "Eligibility",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 440,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 433,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 1,
					ToStateName: "Application Received",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 435,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 4,
					ToStateName: "Intake-Complete",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 434,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 436,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 439,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 4,
					ToStateName: "Intake-Complete",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 437,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 441,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 438,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 3,
					RoleName: "Intake-Specialist-Manager",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 22,
			IsCluster: 0,
			IsUniversal: 1,
			RoleName: "Outreach-Lead",
			Transitions: [
				{
					StateTransitionID: 478,
					StateId: 57,
					StateName: "Need-Outreach",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 477,
					StateId: 57,
					StateName: "Need-Outreach",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 54,
					ToStateName: "Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 479,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 57,
					ToStateName: "Need-Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 480,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 482,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 481,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 483,
					StateId: 55,
					StateName: "QA/QC-Ready",
					RoleId: 22,
					RoleName: "Outreach-Lead",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 21,
			IsCluster: 0,
			IsUniversal: 0,
			RoleName: "Outreach-Specialist",
			Transitions: [
				{
					StateTransitionID: 474,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 21,
					RoleName: "Outreach-Specialist",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 475,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 21,
					RoleName: "Outreach-Specialist",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 473,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 21,
					RoleName: "Outreach-Specialist",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 476,
					StateId: 55,
					StateName: "QA/QC-Ready",
					RoleId: 21,
					RoleName: "Outreach-Specialist",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 9,
			IsCluster: 1,
			IsUniversal: 1,
			RoleName: "Partner-Reviewer",
			Transitions: [
				{
					StateTransitionID: 451,
					StateId: 1,
					StateName: "Application Received",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 1,
					ToStateName: "Application Received",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 455,
					StateId: 5,
					StateName: "Case-Review",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 5,
					ToStateName: "Case-Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 461,
					StateId: 8,
					StateName: "Denied",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 16,
					ToStateName: "Partner-Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 452,
					StateId: 14,
					StateName: "Eligibility",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 14,
					ToStateName: "Eligibility",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 454,
					StateId: 4,
					StateName: "Intake-Complete",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 4,
					ToStateName: "Intake-Complete",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 453,
					StateId: 15,
					StateName: "Outreach",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 462,
					StateId: 16,
					StateName: "Partner-Review",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 6,
					ToStateName: "Approved",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 460,
					StateId: 16,
					StateName: "Partner-Review",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 8,
					ToStateName: "Denied",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 457,
					StateId: 16,
					StateName: "Partner-Review",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 456,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 16,
					ToStateName: "Partner-Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 459,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 8,
					ToStateName: "Denied",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 458,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 9,
					RoleName: "Partner-Reviewer",
					AltStateId: 16,
					ToStateName: "Partner-Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 19,
			IsCluster: 0,
			IsUniversal: 1,
			RoleName: "QA/QC-Lead",
			Transitions: [
				{
					StateTransitionID: 506,
					StateId: 58,
					StateName: "Appeal",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 6,
					ToStateName: "Approved",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 503,
					StateId: 6,
					StateName: "Approved",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 6,
					ToStateName: "Approved",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 505,
					StateId: 8,
					StateName: "Denied",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 58,
					ToStateName: "Appeal",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 504,
					StateId: 11,
					StateName: "Fraud",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 8,
					ToStateName: "Denied",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 501,
					StateId: 11,
					StateName: "Fraud",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 507,
					StateId: 10,
					StateName: "Paid",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 10,
					ToStateName: "Paid",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 502,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 6,
					ToStateName: "Approved",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 500,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 11,
					ToStateName: "Fraud",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 498,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 495,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 56,
					ToStateName: "QA/QC",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 497,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 8,
					ToStateName: "Denied",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 496,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 11,
					ToStateName: "Fraud",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 493,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 56,
					ToStateName: "QA/QC",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 499,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 494,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 492,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 491,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 490,
					StateId: 55,
					StateName: "QA/QC-Ready",
					RoleId: 19,
					RoleName: "QA/QC-Lead",
					AltStateId: 56,
					ToStateName: "QA/QC",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 18,
			IsCluster: 0,
			IsUniversal: 0,
			RoleName: "QA/QC-Specialist",
			Transitions: [
				{
					StateTransitionID: 489,
					StateId: 11,
					StateName: "Fraud",
					RoleId: 18,
					RoleName: "QA/QC-Specialist",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 488,
					StateId: 9,
					StateName: "Pending-Approval",
					RoleId: 18,
					RoleName: "QA/QC-Specialist",
					AltStateId: 11,
					ToStateName: "Fraud",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 486,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 18,
					RoleName: "QA/QC-Specialist",
					AltStateId: 56,
					ToStateName: "QA/QC",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 484,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 18,
					RoleName: "QA/QC-Specialist",
					AltStateId: 15,
					ToStateName: "Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 487,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 18,
					RoleName: "QA/QC-Specialist",
					AltStateId: 9,
					ToStateName: "Pending-Approval",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 485,
					StateId: 56,
					StateName: "QA/QC",
					RoleId: 18,
					RoleName: "QA/QC-Specialist",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 20,
			IsCluster: 0,
			IsUniversal: 1,
			RoleName: "Review-Lead",
			Transitions: [
				{
					StateTransitionID: 467,
					StateId: 1,
					StateName: "Application Received",
					RoleId: 20,
					RoleName: "Review-Lead",
					AltStateId: 54,
					ToStateName: "Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 470,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 20,
					RoleName: "Review-Lead",
					AltStateId: 54,
					ToStateName: "Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 468,
					StateId: 54,
					StateName: "Review",
					RoleId: 20,
					RoleName: "Review-Lead",
					AltStateId: 1,
					ToStateName: "Application Received",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 471,
					StateId: 54,
					StateName: "Review",
					RoleId: 20,
					RoleName: "Review-Lead",
					AltStateId: 57,
					ToStateName: "Need-Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 469,
					StateId: 54,
					StateName: "Review",
					RoleId: 20,
					RoleName: "Review-Lead",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 472,
					StateId: 54,
					StateName: "Review",
					RoleId: 20,
					RoleName: "Review-Lead",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 17,
			IsCluster: 0,
			IsUniversal: 0,
			RoleName: "Review-Specialist",
			Transitions: [
				{
					StateTransitionID: 464,
					StateId: 7,
					StateName: "Pending-Denial",
					RoleId: 17,
					RoleName: "Review-Specialist",
					AltStateId: 54,
					ToStateName: "Review",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 466,
					StateId: 54,
					StateName: "Review",
					RoleId: 17,
					RoleName: "Review-Specialist",
					AltStateId: 57,
					ToStateName: "Need-Outreach",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 465,
					StateId: 54,
					StateName: "Review",
					RoleId: 17,
					RoleName: "Review-Specialist",
					AltStateId: 7,
					ToStateName: "Pending-Denial",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
				{
					StateTransitionID: 463,
					StateId: 54,
					StateName: "Review",
					RoleId: 17,
					RoleName: "Review-Specialist",
					AltStateId: 55,
					ToStateName: "QA/QC-Ready",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
		{
			RoleId: 1,
			IsCluster: 1,
			IsUniversal: 1,
			RoleName: "system",
			Transitions: [
				{
					StateTransitionID: 424,
					StateId: 1,
					StateName: "Application Received",
					RoleId: 1,
					RoleName: "system",
					AltStateId: 1,
					ToStateName: "Application Received",
					ProcessID: 8,
					ProcessName: "LADV",
					InternalOnly: false,
				},
			],
		},
	],
	Companies: [
		{
			CompanyID: 1,
			CompanyName: "FORWARD",
			isInternal: 1,
			IsTrusted: false,
		},
		{
			CompanyID: 5,
			CompanyName: "Long Beach",
			isInternal: 0,
			IsTrusted: false,
		},
	],
};

export default { process };
