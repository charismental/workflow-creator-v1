const processes = [
    {
        ProcessId: 1,
        ProcessName: "WA DSHS Immigrant Relief 3",
        Roles: [
            {
                ProcessId: 1,
                RoleId: 1,
                IsCluster: 0,
                isUniversal: 1,
                RoleName: "system",
                Transitions: [
                    {
                        StateTransitionId: 952,
                        FromStateId: 1,
                        ToStateId: 1,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Application Received"
                    },
                    {
                        StateTransitionId: 1,
                        FromStateId: 1,
                        ToStateId: 2,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Review"
                    },
                    {
                        StateTransitionId: 2,
                        FromStateId: 1,
                        ToStateId: 4,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "QA\/QC-Ready"
                    },
                    {
                        StateTransitionId: 3,
                        FromStateId: 1,
                        ToStateId: 6,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Approved"
                    },
                    {
                        StateTransitionId: 4,
                        FromStateId: 1,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 5,
                        FromStateId: 1,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 6,
                        FromStateId: 1,
                        ToStateId: 9,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Pending-Approval"
                    },
                    {
                        StateTransitionId: 7,
                        FromStateId: 1,
                        ToStateId: 10,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Paid"
                    }
                ]
            },
            {
                ProcessId: 1,
                RoleId: 2,
                IsCluster: 0,
                isUniversal: 0,
                RoleName: "Review-Specialist",
                Transitions: [
                    {
                        StateTransitionId: 8,
                        FromStateId: 3,
                        ToStateId: 4,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "QA\/QC-Ready"
                    },
                    {
                        StateTransitionId: 9,
                        FromStateId: 3,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 10,
                        FromStateId: 4,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC-Ready",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 11,
                        FromStateId: 5,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 12,
                        FromStateId: 7,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 13,
                        FromStateId: 9,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "Intake"
                    }
                ]
            },
            {
                ProcessId: 1,
                RoleId: 3,
                IsCluster: 0,
                isUniversal: 1,
                RoleName: "Intake-Specialist-Manager",
                Transitions: [
                    {
                        StateTransitionId: 14,
                        FromStateId: 1,
                        ToStateId: 1,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Application Received"
                    },
                    {
                        StateTransitionId: 15,
                        FromStateId: 1,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 16,
                        FromStateId: 1,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Application Received",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 17,
                        FromStateId: 2,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Review",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 18,
                        FromStateId: 3,
                        ToStateId: 1,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "Application Received"
                    },
                    {
                        StateTransitionId: 19,
                        FromStateId: 3,
                        ToStateId: 2,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "Review"
                    },
                    {
                        StateTransitionId: 20,
                        FromStateId: 3,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 21,
                        FromStateId: 3,
                        ToStateId: 4,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "QA\/QC-Ready"
                    },
                    {
                        StateTransitionId: 22,
                        FromStateId: 3,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Intake",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 23,
                        FromStateId: 4,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC-Ready",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 24,
                        FromStateId: 4,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC-Ready",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 25,
                        FromStateId: 5,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 26,
                        FromStateId: 7,
                        ToStateId: 1,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Application Received"
                    },
                    {
                        StateTransitionId: 27,
                        FromStateId: 7,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 28,
                        FromStateId: 7,
                        ToStateId: 4,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "QA\/QC-Ready"
                    },
                    {
                        StateTransitionId: 29,
                        FromStateId: 9,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "Intake"
                    }
                ]
            },
            {
                ProcessId: 1,
                RoleId: 4,
                IsCluster: 0,
                isUniversal: 0,
                RoleName: "QA\/QC-Specialist",
                Transitions: [
                    {
                        StateTransitionId: 30,
                        FromStateId: 5,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 31,
                        FromStateId: 5,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 32,
                        FromStateId: 5,
                        ToStateId: 9,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Pending-Approval"
                    },
                    {
                        StateTransitionId: 33,
                        FromStateId: 7,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 34,
                        FromStateId: 9,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "QA\/QC"
                    }
                ]
            },
            {
                ProcessId: 1,
                RoleId: 5,
                IsCluster: 0,
                isUniversal: 1,
                RoleName: "QA\/QC-Lead",
                Transitions: [
                    {
                        StateTransitionId: 35,
                        FromStateId: 4,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC-Ready",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 36,
                        FromStateId: 4,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC-Ready",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 37,
                        FromStateId: 5,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 38,
                        FromStateId: 5,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 39,
                        FromStateId: 5,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 40,
                        FromStateId: 5,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 41,
                        FromStateId: 5,
                        ToStateId: 9,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Pending-Approval"
                    },
                    {
                        StateTransitionId: 42,
                        FromStateId: 7,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 43,
                        FromStateId: 7,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 44,
                        FromStateId: 7,
                        ToStateId: 9,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Pending-Approval"
                    },
                    {
                        StateTransitionId: 45,
                        FromStateId: 7,
                        ToStateId: 11,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Fraud"
                    },
                    {
                        StateTransitionId: 46,
                        FromStateId: 8,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Denied",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 47,
                        FromStateId: 8,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Denied",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 48,
                        FromStateId: 8,
                        ToStateId: 11,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Denied",
                        ToStateName: "Fraud"
                    },
                    {
                        StateTransitionId: 49,
                        FromStateId: 9,
                        ToStateId: 3,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "Intake"
                    },
                    {
                        StateTransitionId: 50,
                        FromStateId: 9,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 51,
                        FromStateId: 9,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 52,
                        FromStateId: 11,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Fraud",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 53,
                        FromStateId: 11,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Fraud",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 224,
                        FromStateId: 12,
                        ToStateId: 10,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Award-Outstanding",
                        ToStateName: "Paid"
                    },
                    {
                        StateTransitionId: 225,
                        FromStateId: 12,
                        ToStateId: 13,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Award-Outstanding",
                        ToStateName: "Award-Reissued"
                    },
                    {
                        StateTransitionId: 226,
                        FromStateId: 13,
                        ToStateId: 13,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Award-Reissued",
                        ToStateName: "Award-Reissued"
                    }
                ]
            },
            {
                ProcessId: 1,
                RoleId: 6,
                IsCluster: 0,
                isUniversal: 0,
                RoleName: "Finance",
                Transitions: [
                    {
                        StateTransitionId: 54,
                        FromStateId: 5,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "QA\/QC",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 55,
                        FromStateId: 6,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Approved",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 56,
                        FromStateId: 6,
                        ToStateId: 9,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Approved",
                        ToStateName: "Pending-Approval"
                    },
                    {
                        StateTransitionId: 57,
                        FromStateId: 6,
                        ToStateId: 10,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Approved",
                        ToStateName: "Paid"
                    },
                    {
                        StateTransitionId: 58,
                        FromStateId: 7,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 59,
                        FromStateId: 7,
                        ToStateId: 9,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Pending-Approval"
                    },
                    {
                        StateTransitionId: 60,
                        FromStateId: 7,
                        ToStateId: 11,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Denial",
                        ToStateName: "Fraud"
                    },
                    {
                        StateTransitionId: 61,
                        FromStateId: 8,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Denied",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 62,
                        FromStateId: 8,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Denied",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 63,
                        FromStateId: 8,
                        ToStateId: 11,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Denied",
                        ToStateName: "Fraud"
                    },
                    {
                        StateTransitionId: 64,
                        FromStateId: 9,
                        ToStateId: 5,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "QA\/QC"
                    },
                    {
                        StateTransitionId: 65,
                        FromStateId: 9,
                        ToStateId: 6,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "Approved"
                    },
                    {
                        StateTransitionId: 66,
                        FromStateId: 9,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Pending-Approval",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 67,
                        FromStateId: 10,
                        ToStateId: 6,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Paid",
                        ToStateName: "Approved"
                    },
                    {
                        StateTransitionId: 227,
                        FromStateId: 10,
                        ToStateId: 12,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Paid",
                        ToStateName: "Award-Outstanding"
                    },
                    {
                        StateTransitionId: 68,
                        FromStateId: 11,
                        ToStateId: 7,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Fraud",
                        ToStateName: "Pending-Denial"
                    },
                    {
                        StateTransitionId: 69,
                        FromStateId: 11,
                        ToStateId: 8,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Fraud",
                        ToStateName: "Denied"
                    },
                    {
                        StateTransitionId: 228,
                        FromStateId: 12,
                        ToStateId: 13,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Award-Outstanding",
                        ToStateName: "Award-Reissued"
                    },
                    {
                        StateTransitionId: 229,
                        FromStateId: 13,
                        ToStateId: 10,
                        InternalOnly: false,
                        ProcessId: 1,
                        FromStateName: "Award-Reissued",
                        ToStateName: "Paid"
                    }
                ]
            },
            {
                ProcessId: 1,
                RoleId: 7,
                IsCluster: 0,
                isUniversal: 0,
                RoleName: "Multiple"
            }
        ],
        States: [
            {
                StateId: 1,
                StateName: "Application Received",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 10
            },
            {
                StateId: 2,
                StateName: "Review",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 15
            },
            {
                StateId: 3,
                StateName: "Intake",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 1,
                DisplayOrder: 20
            },
            {
                StateId: 4,
                StateName: "QA\/QC-Ready",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 30
            },
            {
                StateId: 5,
                StateName: "QA\/QC",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 1,
                DisplayOrder: 40
            },
            {
                StateId: 6,
                StateName: "Approved",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 50
            },
            {
                StateId: 7,
                StateName: "Pending-Denial",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 60
            },
            {
                StateId: 11,
                StateName: "Fraud",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 65
            },
            {
                StateId: 8,
                StateName: "Denied",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 1,
                DisplayOrder: 70
            },
            {
                StateId: 9,
                StateName: "Pending-Approval",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 80
            },
            {
                StateId: 10,
                StateName: "Paid",
                RequiresRoleAssignment: 0,
                RequiresUserAssignment: 0,
                DisplayOrder: 90
            }
        ]
    },
    {
        ProcessId: 5,
        ProcessName: "Long Beach 1st HomeBuyer P1",
        Roles: [],
        States: []
    },
    {
        ProcessId: 9,
        ProcessName: "Long Beach 1st HomeBuyer P2",
        Roles: [],
        States: []
    },
    {
        ProcessId: 12,
        ProcessName: "Whatcom-LTRG",
        Roles: [],
        States: []
    }
];

const roles = [
    {
        RoleId: 1,
        RoleName: "system"
    },
    {
        RoleId: 2,
        RoleName: "Intake-Specialist"
    },
    {
        RoleId: 3,
        RoleName: "Intake-Specialist-Manager"
    },
    {
        RoleId: 4,
        RoleName: "Case-Worker"
    },
    {
        RoleId: 5,
        RoleName: "Case-Worker-Manager"
    },
    {
        RoleId: 6,
        RoleName: "Finance"
    },
    {
        RoleId: 7,
        RoleName: "Multiple"
    },
    {
        RoleId: 8,
        RoleName: "Partner-Final-Reviewer"
    },
    {
        RoleId: 9,
        RoleName: "Partner-Reviewer"
    },
    {
        RoleId: 10,
        RoleName: "Customer-Success"
    },
    {
        RoleId: 15,
        RoleName: "Case-Manager"
    },
    {
        RoleId: 16,
        RoleName: "Case-Manager-Supervisor"
    },
    {
        RoleId: 17,
        RoleName: "Review-Specialist"
    },
    {
        RoleId: 18,
        RoleName: "QA\/QC-Specialist"
    },
    {
        RoleId: 19,
        RoleName: "QA\/QC-Lead"
    }
];

const states = [
    {
        StateId: 1,
        StateName: "Application Received"
    },
    {
        StateId: 2,
        StateName: "Eligible"
    },
    {
        StateId: 3,
        StateName: "Intake"
    },
    {
        StateId: 4,
        StateName: "Intake-Complete"
    },
    {
        StateId: 5,
        StateName: "Case-Review"
    },
    {
        StateId: 6,
        StateName: "Approved"
    },
    {
        StateId: 7,
        StateName: "Pending-Denial"
    },
    {
        StateId: 8,
        StateName: "Denied"
    },
    {
        StateId: 9,
        StateName: "Pending-Approval"
    },
    {
        StateId: 10,
        StateName: "Paid"
    },
    {
        StateId: 11,
        StateName: "Fraud"
    },
    {
        StateId: 12,
        StateName: "Award-Outstanding"
    },
    {
        StateId: 13,
        StateName: "Award-Reissued"
    },
    {
        StateId: 14,
        StateName: "Eligibility"
    },
    {
        StateId: 15,
        StateName: "Outreach"
    },
    {
        StateId: 16,
        StateName: "Partner-Review"
    },
    {
        StateId: 17,
        StateName: "Partner-Final-Review"
    },
    {
        StateId: 27,
        StateName: "Funds-Reserved"
    },
    {
        StateId: 28,
        StateName: "Document-Review"
    },
    {
        StateId: 29,
        StateName: "Document-Complete"
    },
    {
        StateId: 30,
        StateName: "Closing-Document-Review"
    },
    {
        StateId: 31,
        StateName: "Closing-Document-Complete"
    },
    {
        StateId: 46,
        StateName: "Case-New"
    },
    {
        StateId: 47,
        StateName: "Case-Assigned"
    },
    {
        StateId: 48,
        StateName: "Review-Needed"
    },
    {
        StateId: 49,
        StateName: "Review-Scheduled"
    },
    {
        StateId: 50,
        StateName: "Review-Completed"
    },
    {
        StateId: 51,
        StateName: "Pending-Graduation"
    },
    {
        StateId: 52,
        StateName: "Graduated"
    },
    {
        StateId: 53,
        StateName: "Review"
    }
];

export default { processes, states, roles };