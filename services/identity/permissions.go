package main

type Role string
type PermissionAction string
type TargetEnvironment string

const (
	RoleOwner     Role = "owner"
	RoleAdmin     Role = "admin"
	RoleDeveloper Role = "developer"
	RoleViewer    Role = "viewer"

	ActionDeploy          PermissionAction = "deploy:create"
	ActionRollback        PermissionAction = "deploy:rollback"
	ActionRepoDelete      PermissionAction = "repo:delete"
	ActionPRReview        PermissionAction = "pr:review"
	ActionReadLogs        PermissionAction = "logs:read"

	EnvProduction TargetEnvironment = "production"
	EnvPreview    TargetEnvironment = "preview"
)

type AuthContext struct {
	UserID string `json:"userId"`
	OrgID  string `json:"orgId"`
	Role   Role   `json:"role"`
}

type PermissionResult struct {
	Allowed bool   `json:"allowed"`
	Reason  string `json:"reason"`
}

// EvaluatePermission computes authorization decisions in O(1) time using role matrices and ABAC rules.
func EvaluatePermission(ctx AuthContext, action PermissionAction, env TargetEnvironment) PermissionResult {
	if ctx.Role == RoleOwner || ctx.Role == RoleAdmin {
		return PermissionResult{Allowed: true, Reason: "Full administrative permission granted."}
	}

	if ctx.Role == RoleDeveloper {
		if (action == ActionRollback || action == ActionRepoDelete) && env == EnvProduction {
			return PermissionResult{
				Allowed: false,
				Reason:  "Developer role is restricted from executing production rollbacks or repository deletions.",
			}
		}
		return PermissionResult{Allowed: true, Reason: "Developer permission granted for target environment."}
	}

	if ctx.Role == RoleViewer {
		if action == ActionPRReview || action == ActionReadLogs {
			return PermissionResult{Allowed: true, Reason: "Read-only viewer permission granted."}
		}
		return PermissionResult{Allowed: false, Reason: "Viewer role is restricted to read-only actions."}
	}

	return PermissionResult{Allowed: false, Reason: "Unknown role or unmapped action."}
}
