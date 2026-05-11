import React, { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { jobAPI } from "../../services/api";

const ActiveJobs = ({ accountId, setJobsCount }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await jobAPI.getJobsByAccount(
        accountId,
        true
      );

      console.log("active job list", res);

      const activeJobs =
       res.data.jobList ||
        [];

      setJobs(activeJobs);

      // send count to parent
      setJobsCount?.(activeJobs.length);
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error
      );

      setJobsCount?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchJobs();
    }
  }, [accountId]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60">
      <BriefcaseBusiness className="text-5xl mb-3 opacity-50" />

      <p className="text-sm text-muted-foreground">
        No active jobs found
      </p>
    </div>
  );

  return (
    <div className="p-4">
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground">
                Loading jobs...
              </p>
            </div>
          ) : jobs.length > 0 ? (
            <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="font-semibold">
        Job Name
      </TableHead>

      <TableHead className="font-semibold">
        Pipeline
      </TableHead>

      <TableHead className="font-semibold">
        Stage
      </TableHead>

    

      <TableHead className="font-semibold">
        Priority
      </TableHead>

      <TableHead className="font-semibold">
        Created Date
      </TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {jobs.map((job, index) => (
      <TableRow key={job.id || index}>
        {/* Job Name */}
        <TableCell className="font-medium max-w-[280px]">
          <div className="flex flex-col">
            <span className="truncate">
              {job.Name || "-"}
            </span>

            {job.Description && (
              <span
                className="text-xs text-muted-foreground truncate max-w-[260px]"
                dangerouslySetInnerHTML={{
                  __html: job.Description,
                }}
              />
            )}
          </div>
        </TableCell>

        {/* Pipeline */}
        <TableCell>
          {job.Pipeline || "-"}
        </TableCell>

        {/* Stage */}
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {job.Stage?.length > 0 ? (
              job.Stage.map((stage, i) => (
                <Badge
                  key={i}
                  variant="outline"
                >
                  {stage}
                </Badge>
              ))
            ) : (
              <span>-</span>
            )}
          </div>
        </TableCell>

        

        {/* Priority */}
        <TableCell>
          <Badge
            className={
              job.Priority === "High"
                ? "bg-red-500 text-white border-0"
                : job.Priority === "Medium"
                ? "bg-yellow-500 text-white border-0"
                : "bg-green-500 text-white border-0"
            }
          >
            {job.Priority || "-"}
          </Badge>
        </TableCell>

        {/* Created Date */}
        <TableCell>
          {job.createdAt
            ? new Date(
                job.createdAt
              ).toLocaleDateString()
            : "-"}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveJobs;