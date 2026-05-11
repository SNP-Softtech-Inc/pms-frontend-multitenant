import React, { useEffect, useState } from "react";
import { FileSignature } from "lucide-react";
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
import { proposalAPI } from "../../services/api";

const PendingProposals = ({
  accountId,
  setProposalsCount,
}) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProposalsAllData = async () => {
    try {
      setLoading(true);

      const res =
        await proposalAPI.getPendingAccountProposalsByAccountId(
          accountId
        );

      const proposalList =
        res.data.proposallist || [];

      setProposals(proposalList);

      console.log(
        "pending proposals",
        res.data
      );

      // send count to parent
      setProposalsCount?.(
        proposalList.length
      );
    } catch (error) {
      console.error(
        "Error fetching proposals:",
        error
      );

      setProposalsCount?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchProposalsAllData();
    }
  }, [accountId]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60">
      <FileSignature className="text-5xl mb-3 opacity-50" />

      <p className="text-sm text-muted-foreground">
        No pending proposals found
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
                Loading proposals...
              </p>
            </div>
          ) : proposals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    Proposal Name
                  </TableHead>

                  <TableHead className="font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="font-semibold">
                    Created Date
                  </TableHead>

                  <TableHead className="font-semibold">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {proposals.map(
                  (proposal, index) => (
                    <TableRow
                      key={proposal._id || index}
                    >
                      {/* Proposal Name */}
                      <TableCell className="font-medium">
                        {proposal.general.proposalName ||
                          proposal.title ||
                          "Untitled Proposal"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge className="bg-yellow-500 text-white border-0">
                          Pending
                        </Badge>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell>
                        {proposal.createdAt
                          ? new Date(
                              proposal.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full"
                        >
                          $
                          {proposal.totalAmount ||
                            proposal.amount ||
                            0}
                        </Badge>
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

export default PendingProposals;