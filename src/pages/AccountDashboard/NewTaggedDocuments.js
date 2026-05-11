
import React, { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";
import { accountDocsAPI } from "../../services/api";
import { PiFolderOpen } from "react-icons/pi";

const NewTaggedDocuments = ({ accountId, setDocumentsCount, }) => {
  console.log("accountid", accountId);

  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const res = await accountDocsAPI.getNewTaggedDocs({
        params: {
          accountId,
        },
      });

      console.log("API Response:", res.data);

      setDocuments(res.data.documents || []);

       const docs = res.data.documents || [];

    setDocuments(docs);
console.log("docs lenght", docs.length)
    // send count to parent
    setDocumentsCount?.(docs.length);

    } catch (error) {
      console.error("Error fetching documents:", error);
   setDocumentsCount?.(0);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchDocuments();
    }
  }, [accountId]);

  const EmptyState = ({
    label,
    icon: Icon = PiFolderOpen,
  }) => (
    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60">
      <Icon className="text-5xl mb-3 opacity-50" />
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );

  return (
    <div className="p-4">
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">
                    Document Name
                  </TableHead>

                  <TableHead className="font-semibold">
                    Tag
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {doc.name}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {doc?.meta?.tags?.map((tag, i) => (
                          <Badge
                            key={i}
                            className="text-white border-0"
                            style={{
                              backgroundColor:
                                tag.tagColour,
                            }}
                          >
                            {tag.tagName}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState label="No documents found" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTaggedDocuments;