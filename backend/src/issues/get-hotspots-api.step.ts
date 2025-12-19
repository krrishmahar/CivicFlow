import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { coreMiddleware } from '../middlewares/core.middleware';
import { getAllIssues } from '../services/issue.service';
import { IssueCategory } from '../types/issue.types';

interface Hotspot {
  id: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  issueCount: number;
  category: IssueCategory;
  issueIds: string[];
}

export const config: ApiRouteConfig = {
  name: 'GetHotspots',
  type: 'api',
  path: '/issues/hotspots',
  method: 'GET',
  description: 'Get issue hotspots (clusters of nearby similar issues)',
  emits: [],
  flows: ['issue-flow'],
  responseSchema: {
    200: z.object({
      success: z.boolean(),
      data: z.array(z.any()),
      count: z.number(),
    }),
  },
  middleware: [coreMiddleware],
};

export const handler: Handlers['GetHotspots'] = async (req, ctx) => {
  const { logger, state } = ctx;

  const category = req.query.category as IssueCategory | undefined;
  const radiusMeters = parseInt(req.query.radius as string) || 500;
  const minIssues = parseInt(req.query.minIssues as string) || 3;

  try {
    // Get all active pending issues
    const issues = await getAllIssues(
      {
        status: undefined,
        category,
        limit: 1000,
        offset: 0,
      },
      { logger, state }
    );

    if (issues.length === 0) {
      return {
        status: 200,
        body: {
          success: true,
          data: [],
          count: 0,
        },
      };
    }

    const hotspots: Hotspot[] = [];
    const processedIssues = new Set<string>();

    // Cluster detection algorithm
    for (const issue of issues) {
      if (processedIssues.has(issue.id)) continue;

      const nearbyIssues = issues.filter((other) => {
        if (processedIssues.has(other.id) || issue.id === other.id) return false;
        if (category && other.category !== issue.category) return false;

        const distance = getDistanceFromLatLonInMeters(
          issue.latitude,
          issue.longitude,
          other.latitude,
          other.longitude
        );

        return distance <= radiusMeters;
      });

      // If cluster meets minimum threshold
      if (nearbyIssues.length + 1 >= minIssues) {
        const clusterIssues = [issue, ...nearbyIssues];

        // Calculate centroid
        const avgLat =
          clusterIssues.reduce((sum, i) => sum + i.latitude, 0) /
          clusterIssues.length;
        const avgLng =
          clusterIssues.reduce((sum, i) => sum + i.longitude, 0) /
          clusterIssues.length;

        const hotspot: Hotspot = {
          id: `hotspot_${issue.category}_${Date.now()}`,
          centerLat: avgLat,
          centerLng: avgLng,
          radiusMeters,
          issueCount: clusterIssues.length,
          category: issue.category,
          issueIds: clusterIssues.map((i) => i.id),
        };

        hotspots.push(hotspot);

        // Mark issues as processed
        clusterIssues.forEach((i) => processedIssues.add(i.id));
      }
    }

    // Sort by issue count descending
    hotspots.sort((a, b) => b.issueCount - a.issueCount);

    logger.info('issue.hotspots.success', {
      count: hotspots.length,
      category,
      radiusMeters,
    });

    return {
      status: 200,
      body: {
        success: true,
        data: hotspots,
        count: hotspots.length,
      },
    };
  } catch (error) {
    logger.error('issue.hotspots.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      status: 500,
      body: { error: 'Failed to fetch hotspots' },
    };
  }
};
