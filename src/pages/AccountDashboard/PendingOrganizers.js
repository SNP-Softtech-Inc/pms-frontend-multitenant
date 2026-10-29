import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
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
import { organizerAPI } from "../../services/api";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { keepIfSame } from "../../lib/autoRefresh";

const PendingOrganizers = ({
  accountId,
  setOrganizersCount,
}) => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrganizers = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);

      const res =
        await organizerAPI.getPendingOrganizersByAccountId(
          accountId
        );

      console.log("organizer pending list", res);

      const pendingOrganizers =
        res.data?.pendingOrganizers || [];

      setOrganizers(keepIfSame(pendingOrganizers));

      // send count to parent
      setOrganizersCount?.(
        pendingOrganizers.length
      );
    } catch (error) {
      console.error(
        "Error fetching organizers:",
        error
      );

      if (!silent) setOrganizersCount?.(0);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchOrganizers();
    }
  }, [accountId]);

  // Auto refresh, quietly: no spinner, unchanged data kept as it is, and a
  // failed refresh leaves the widget and its count alone.
  useAutoRefresh(() => fetchOrganizers({ silent: true }), { enabled: Boolean(accountId) });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60">
      <ClipboardList className="text-5xl mb-3 opacity-50" />

      <p className="text-sm text-muted-foreground">
        No pending organizers found
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
                Loading organizers...
              </p>
            </div>
          ) : organizers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    Organizer Name
                  </TableHead>

                  <TableHead className="font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="font-semibold">
                    Created Date
                  </TableHead>

               
                </TableRow>
              </TableHeader>

              <TableBody>
                {organizers.map(
                  (organizer, index) => (
                    <TableRow
                      key={organizer._id || index}
                    >
                      {/* Organizer Name */}
                      <TableCell className="font-medium">
                        {organizer.organizerName ||
                          organizer.title ||
                          "Untitled Organizer"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge className="bg-orange-500 text-white border-0">
                          Pending
                        </Badge>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell>
                        {organizer.createdAt
                          ? new Date(
                              organizer.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      
                    </TableRow>
                  )
                )}
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

export default PendingOrganizers;