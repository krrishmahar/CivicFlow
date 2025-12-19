import type { FlowContext } from 'motia';
import { v4 as uuidv4 } from 'uuid';
import {
  Issue,
  CreateIssueData,
  UpdateIssueData,
  IssueFilters,
  IssueStatus,
  IssuePriority,
} from '../types/issue.types';

// Service context type (matches your auth.service pattern)
type ServiceContext = Pick<FlowContext<any>, 'logger' | 'state'>;

/**
 * Create a new issue
 * Used by: create-issue-api.step.ts
 */
export async function createIssue(
  data: CreateIssueData,
  ctx: ServiceContext
): Promise<Issue> {
  const { logger, state } = ctx;
  const issueId = uuidv4();
  const now = new Date().toISOString();

  logger.info('issue.create.start', {
    userId: data.userId,
    category: data.category,
  });

  const newIssue: Issue = {
    id: issueId,
    userId: data.userId,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: IssuePriority.MEDIUM,
    status: IssueStatus.PENDING,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,
    imageUrls: data.imageUrls || [],
    assignedTo: undefined,
    createdAt: now,
    updatedAt: now,
    resolvedAt: undefined,
    isActive: true,
  };

  // Store issue
  await state.set(`issue:${issueId}`, newIssue);

  // Add to user's issues list
  const userIssuesKey = `user:${data.userId}:issues`;
  const userIssues = (await state.get<string[]>(userIssuesKey)) || [];
  userIssues.push(issueId);
  await state.set(userIssuesKey, userIssues);

  // Add to global issues index
  const allIssuesKey = 'issues:all';
  const allIssues = (await state.get<string[]>(allIssuesKey)) || [];
  allIssues.push(issueId);
  await state.set(allIssuesKey, allIssues);

  // Index by status
  const statusKey = `issues:status:${IssueStatus.PENDING}`;
  const statusIssues = (await state.get<string[]>(statusKey)) || [];
  statusIssues.push(issueId);
  await state.set(statusKey, statusIssues);

  // Index by category
  const categoryKey = `issues:category:${data.category}`;
  const categoryIssues = (await state.get<string[]>(categoryKey)) || [];
  categoryIssues.push(issueId);
  await state.set(categoryKey, categoryIssues);

  logger.info('issue.create.success', {
    issueId,
    userId: data.userId,
    category: data.category,
  });

  return newIssue;
}

/**
 * Find issue by ID
 * Used by: get-issue-by-id-api.step.ts, update-issue-api.step.ts, 
 *          delete-issue-api.step.ts, respond-to-issue-api.step.ts,
 *          resolve-issue-api.step.ts, get-issue-responses-api.step.ts
 */
export async function findIssueById(
  issueId: string,
  ctx: ServiceContext
): Promise<Issue | null> {
  const { state } = ctx;
  const issue = await state.get<Issue>(`issue:${issueId}`);
  return issue || null;
}

/**
 * Update an existing issue
 * Used by: update-issue-api.step.ts, resolve-issue-api.step.ts
 */
export async function updateIssue(
  issueId: string,
  updates: UpdateIssueData,
  ctx: ServiceContext
): Promise<Issue | null> {
  const { logger, state } = ctx;

  const issue = await findIssueById(issueId, ctx);

  if (!issue) {
    logger.warn('issue.update.not_found', { issueId });
    return null;
  }

  const oldStatus = issue.status;

  const updatedIssue: Issue = {
    ...issue,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await state.set(`issue:${issueId}`, updatedIssue);

  // If status changed, update indexes
  if (updates.status && updates.status !== oldStatus) {
    // Remove from old status index
    const oldStatusKey = `issues:status:${oldStatus}`;
    const oldStatusIssues = (await state.get<string[]>(oldStatusKey)) || [];
    const filteredOld = oldStatusIssues.filter((id) => id !== issueId);
    await state.set(oldStatusKey, filteredOld);

    // Add to new status index
    const newStatusKey = `issues:status:${updates.status}`;
    const newStatusIssues = (await state.get<string[]>(newStatusKey)) || [];
    newStatusIssues.push(issueId);
    await state.set(newStatusKey, newStatusIssues);

    logger.info('issue.update.status_changed', {
      issueId,
      oldStatus,
      newStatus: updates.status,
    });
  }

  logger.info('issue.update.success', {
    issueId,
    updatedFields: Object.keys(updates),
  });

  return updatedIssue;
}

/**
 * Soft delete an issue
 * Used by: delete-issue-api.step.ts
 */
export async function deleteIssue(
  issueId: string,
  ctx: ServiceContext
): Promise<boolean> {
  const { logger, state } = ctx;

  const issue = await findIssueById(issueId, ctx);

  if (!issue) {
    logger.warn('issue.delete.not_found', { issueId });
    return false;
  }

  // Soft delete
  const deletedIssue: Issue = {
    ...issue,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  await state.set(`issue:${issueId}`, deletedIssue);

  logger.info('issue.delete.success', { issueId });

  return true;
}

/**
 * Get all issues with filters and pagination
 * Used by: get-issues-api.step.ts, get-hotspots-api.step.ts
 */
export async function getAllIssues(
  filters: IssueFilters,
  ctx: ServiceContext
): Promise<Issue[]> {
  const { state } = ctx;
  const { status, category, limit = 20, offset = 0 } = filters;

  let issueIds: string[] = [];

  if (status) {
    issueIds = (await state.get<string[]>(`issues:status:${status}`)) || [];
  } else if (category) {
    issueIds = (await state.get<string[]>(`issues:category:${category}`)) || [];
  } else {
    issueIds = (await state.get<string[]>('issues:all')) || [];
  }

  // Fetch all issues in parallel
  const issuesPromises = issueIds.map((id) => state.get<Issue>(`issue:${id}`));
  const issues = await Promise.all(issuesPromises);

  // Filter active issues
  let filteredIssues = issues.filter(
    (issue): issue is Issue => issue !== null && issue.isActive
  );

  // Additional filtering
  if (category && !status) {
    filteredIssues = filteredIssues.filter((issue) => issue.category === category);
  }

  // Sort by createdAt descending
  filteredIssues.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Apply pagination
  return filteredIssues.slice(offset, offset + limit);
}

/**
 * Get all issues created by a specific user
 * Used by: get-user-issues-api.step.ts
 */
export async function getUserIssues(
  userId: string,
  ctx: ServiceContext
): Promise<Issue[]> {
  const { state } = ctx;
  const issueIds = (await state.get<string[]>(`user:${userId}:issues`)) || [];

  const issuesPromises = issueIds.map((id) => state.get<Issue>(`issue:${id}`));
  const issues = await Promise.all(issuesPromises);

  return issues
    .filter((issue): issue is Issue => issue !== null && issue.isActive)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Get issue statistics
 * Used by: get-issue-stats-api.step.ts
 */
export async function getIssueStats(ctx: ServiceContext): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}> {
  const { state } = ctx;

  const allIssues = (await state.get<string[]>('issues:all')) || [];
  const pending =
    (await state.get<string[]>(`issues:status:${IssueStatus.PENDING}`)) || [];
  const inProgress =
    (await state.get<string[]>(`issues:status:${IssueStatus.IN_PROGRESS}`)) || [];
  const resolved =
    (await state.get<string[]>(`issues:status:${IssueStatus.RESOLVED}`)) || [];
  const rejected =
    (await state.get<string[]>(`issues:status:${IssueStatus.REJECTED}`)) || [];

  return {
    total: allIssues.length,
    pending: pending.length,
    inProgress: inProgress.length,
    resolved: resolved.length,
    rejected: rejected.length,
  };
}
