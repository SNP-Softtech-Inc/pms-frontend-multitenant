// import React, { useEffect, useState, useContext } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Divider,
//   Checkbox,
//   Button,
//   ToggleButton,
//   ToggleButtonGroup,
// } from "@mui/material";
// import TelegramIcon from "@mui/icons-material/Telegram";
// import Delete from "@mui/icons-material/Delete";
// import Archive from "@mui/icons-material/Archive";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { chatAPI, accountsAPI } from "../../services/api";
// import ChatDetails from "./Communication/ChatDetails";
// import NewChatDrawer from "./Communication/NewChatDrawer";
// import { useConfirm } from "../../components/ConfirmDialogContext";
// const Communication = () => {
//   const { accountId } = useParams();
//   const confirm = useConfirm();
//   const [chatList, setChatList] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatId, setChatId] = useState("");
//   const [open, setOpen] = useState(false);
//   const [selectedChatIds, setSelectedChatIds] = useState([]);
//   const [isActiveTrue, setIsActiveTrue] = useState(true);
//   const [accountName, setAccountName] = useState("");
//   // ================= ACCOUNT DETAILS =================
// const fetchAccountDetails = async (accountId) => {
//   try {
//     console.log("Calling API with accountId:", accountId);
//     const res = await accountsAPI.getAccountById(accountId);
//     console.log("Full response:", res);
//     console.log("Account details:", res.data);
//     setAccountName(res.data.accountName);
//   } catch (error) {
//     console.error("Error fetching account:", error);
//   }
// };
// useEffect(() => {
//   // console.log("accountId changed:", accountId);
//   if (accountId) {
//     fetchAccountDetails(accountId);
//   }
// }, [accountId]);

//   // ================= CHAT LIST =================
//   const accountwiseChatlist = async (accId, active) => {
//     try {
//       const res = await chatAPI.getChatsByAccountAndStatus(
//         accId,
//         active
//       );
//       setChatList(res.data.chataccountwise || []);
//     } catch (error) {
//       console.error("Error fetching chat list:", error);
//     }
//   };

//   useEffect(() => {
//     accountwiseChatlist(accountId, isActiveTrue);
//   }, [accountId, isActiveTrue]);

//   // ================= HELPERS =================
//   const countUnreadAdminMessages = (chat) => {
//     if (!chat.description) return 0;

//     return chat.description.reduce((count, msg) => {
//       return msg.isRead === false && msg.fromwhome === "client"
//         ? count + 1
//         : count;
//     }, 0);
//   };

//   const formatTime = (time) => {
//     return new Date(time).toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//     });
//   };

//   // ================= CHAT ACTIONS =================
//   const handleShowChat = async (chatId) => {
//     try {
//       await chatAPI.markAllAsRead(chatId, accountId, "Admin");

//       const chat = chatList.find((c) => c._id === chatId);
//       setSelectedChat(chat);
//       setChatId(chatId);

//       accountwiseChatlist(accountId, isActiveTrue);
//     } catch (error) {
//       console.error("Mark read error:", error);
//     }
//   };

//   const getsChatDetails = async () => {
//     try {
//       const res = await chatAPI.getChatById(chatId);
//       setSelectedChat(res.data.chat);
//     } catch (error) {
//       console.error("Error fetching chat details:", error);
//     }
//   };

//   // ================= BULK ACTIONS =================
//   const handleCheckboxChange = (id) => {
//     setSelectedChatIds((prev) =>
//       prev.includes(id)
//         ? prev.filter((i) => i !== id)
//         : [...prev, id]
//     );
//   };

//   const isChatSelected = (id) => selectedChatIds.includes(id);

//  const handleBulkDelete = () => {
//   confirm({
//     title: "Delete Chats",
//     description: "Are you sure you want to delete selected chats?",
//     onConfirm: async () => {
//       try {
//         await Promise.all(
//           selectedChatIds.map((id) => chatAPI.deleteChat(id))
//         );

//         toast.success("Chats deleted");
//         setSelectedChatIds([]);
//         accountwiseChatlist(accountId, isActiveTrue);
//       } catch (error) {
//         toast.error("Delete failed");
//       }
//     },
//   });
  
// };

//   const handleArchiveJob = async (id) => {
//     try {
//       await chatAPI.updateChat(id, { active: !isActiveTrue });
//       toast.success("Updated successfully");
//       accountwiseChatlist(accountId, isActiveTrue);
//       setSelectedChatIds([]);
//     } catch (err) {
//       toast.error("Failed");
//     }
//   };

//   const handleBulkArchive = () => {
//     selectedChatIds.forEach(handleArchiveJob);
//   };

//   // ================= UI =================
//   return (
//     <Box mt={2}>
//       {/* HEADER */}
//      <Box
//   display="flex"
//   justifyContent="space-between"
//   alignItems="center"
//   mb={2}
//   px={2}
//   py={1.5}
//   sx={{
//     background: "#fff",
//     borderRadius: 2,
//     boxShadow: 1,
//   }}
// >
//   <Box display="flex" alignItems="center" gap={2}>
//     <Typography variant="h5" fontWeight={600}>
//       Chats & Tasks
//     </Typography>

//     <ToggleButtonGroup
//       value={isActiveTrue}
//       exclusive
//       size="small"
//       onChange={(e, val) => val !== null && setIsActiveTrue(val)}
//       sx={{
//         background: "#f5f5f5",
//         borderRadius: 2,
//       }}
//     >
//       <ToggleButton value={true}>Active</ToggleButton>
//       <ToggleButton value={false}>Archived</ToggleButton>
//     </ToggleButtonGroup>

//     {selectedChatIds.length > 0 && (
//       <>
//         <Button
//           color="error"
//           variant="outlined"
//           size="small"
//           onClick={handleBulkDelete}
//         >
//           <Delete sx={{ mr: 0.5 }} /> Delete
//         </Button>
//         <Button
//           variant="outlined"
//           size="small"
//           onClick={handleBulkArchive}
//         >
//           <Archive sx={{ mr: 0.5 }} />
//           {isActiveTrue ? "Archive" : "Unarchive"}
//         </Button>
//       </>
//     )}
//   </Box>

//   <Button
//     variant="contained"
//     sx={{
//       borderRadius: 2,
//       textTransform: "none",
//       fontWeight: 500,
//     }}
//     onClick={() => setOpen(true)}
//   >
//     New Chat
//   </Button>
// </Box>

//       {/* MAIN */}
//       <Box
//   display="flex"
//   height="85vh"
//   gap={2}
//   sx={{
//     background: "#f9fafb",
//     borderRadius: 2,
//     p: 1,
//   }}
// >
//         {/* CHAT LIST */}
//        <Box
//   width="30%"
//   overflow="auto"
//   sx={{
//     background: "#fff",
//     borderRadius: 2,
//     boxShadow: 1,
//   }}
// >
//           {chatList.map((chat) => {
//             const unread = countUnreadAdminMessages(chat);

//             return (
//               <Box key={chat._id}>
//                 <Paper
//   sx={{
//     p: 1.5,
//     m:2,
//     cursor: "pointer",
//     borderRadius: 2,
//     transition: "all 0.2s ease",
//     background:
//       selectedChat?._id === chat._id ? "#e3f2fd" : "#fff",
//     "&:hover": {
//       background: "#f1f5f9",
//       transform: "translateY(-1px)",
//       boxShadow: 2,
//     },
//   }}
//   onClick={() => handleShowChat(chat._id)}
// >
//                   <Box display="flex" justifyContent="space-between" alignItems="center">
//   <Box display="flex" alignItems="center" gap={1}>
//     <Checkbox
//       size="small"
//       checked={isChatSelected(chat._id)}
//       onChange={() => handleCheckboxChange(chat._id)}
//       onClick={(e) => e.stopPropagation()}
//     />
//     <TelegramIcon fontSize="small" color="primary" />
//     <Typography variant="caption" fontWeight={500}>
//       {chat.accountid?.accountName}
//     </Typography>
//   </Box>

//                     {unread > 0 && (
//   <Box
//     sx={{
//       background: "#25D366",
//       color: "#fff",
//       borderRadius: "50%",
//       minWidth: 22,
//       height: 22,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontSize: 11,
//       fontWeight: 600,
//     }}
//   >
//     {unread}
//   </Box>
// )}
//                   </Box>

//                 <Typography fontWeight={600} mt={0.5}>
//   {chat.chatsubject}
// </Typography>

//                  <Typography
//   variant="caption"
//   color="text.secondary"
//   sx={{
//     display: "block",
//     mt: 0.3,
//   }}
// >
//                     {(() => {
//                         const messages = chat.description || [];
//                         const latest = messages[messages.length - 1];
//                         if (!latest) return "No messages yet";

//                         const clean =
//                           latest.message?.replace(/<[^>]+>/g, "") || "";
//                         const sender =
//                           // latest.fromwhome === "Admin"
//                           //   ? "You"
//                           //   : latest.senderid || "";
//                           latest.fromwhome === "Admin" && latest.senderid;

//                         return `${sender}: ${
//                           clean.length > 35 ? clean.slice(0, 35) + "..." : clean
//                         }`;
//                       })()}
//                     {/* {chat.description?.slice(-1)[0]?.message || "No messages"} */}
//                   </Typography>

//                   <Box textAlign="right" mt={0.5}>
//   <Typography variant="caption" color="text.secondary">
//     {formatTime(chat.updatedAt)}
//   </Typography>
// </Box>
//                 </Paper>
//                 <Divider />
//               </Box>
//             );
//           })}
//         </Box>

//         {/* CHAT DETAILS */}
//       <Box
//   width="70%"
//   sx={{
//     background: "#fff",
//     borderRadius: 2,
//     boxShadow: 1,
//     p: 2,
//   }}
// >
//           {selectedChat ? (
//             <ChatDetails
//               chat={selectedChat}
//               getsChatDetails={getsChatDetails}
//               accountwiseChatlist={accountwiseChatlist}
//               data={accountId}
//               accountName={accountName}
//               isActiveTrue={isActiveTrue}
//               onChatAction={() => setSelectedChat(null)}
//             />
//             // <Box>Chat details component goes here</Box>
//           ) : (
//             <Typography>Select a chat</Typography>
//           )}
//         </Box>
//       </Box>

//       {/* DRAWER */}
//       <NewChatDrawer
//         open={open}
//         handleClose={() => setOpen(false)}
//         accountwiseChatlist={accountwiseChatlist}
//         data={accountId}
//         isActiveTrue={isActiveTrue}
//       />
//     </Box>
//   );
// };

// export default Communication;


import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { chatAPI, accountsAPI } from "../../services/api";
import ChatDetails from "./Communication/ChatDetails";
import NewChatDrawer from "./Communication/NewChatDrawer";
import { useConfirm } from "../../components/ConfirmDialogContext";
import {
  // Telegram,
  Trash2,
  Archive,
  X,
  Check,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
// shadcn/ui components
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Card } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const Communication = () => {
  const { accountId } = useParams();
  const confirm = useConfirm();
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [accountName, setAccountName] = useState("");
console.log("chat list by account",chatList)
  // ================= ACCOUNT DETAILS =================
  const fetchAccountDetails = async (accountId) => {
    try {
      console.log("Calling API with accountId:", accountId);
      const res = await accountsAPI.getAccountById(accountId);
      console.log("Full response:", res);
      console.log("Account details:", res.data);
      setAccountName(res.data.accountName);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails(accountId);
    }
  }, [accountId]);

  // ================= CHAT LIST =================
  const accountwiseChatlist = async (accId, active) => {
    try {
      const res = await chatAPI.getChatsByAccountAndStatus(
        accId,
        active,"admin"
      );
      setChatList(res.data.chataccountwise || []);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    accountwiseChatlist(accountId, isActiveTrue);
  }, [accountId, isActiveTrue]);

  // ================= HELPERS =================
  const countUnreadAdminMessages = (chat) => {
    if (!chat.description) return 0;

    return chat.description.reduce((count, msg) => {
      return msg.isRead === false && msg.fromwhome === "client"
        ? count + 1
        : count;
    }, 0);
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  // ================= CHAT ACTIONS =================
  const handleShowChat = async (chatId) => {
    try {
      await chatAPI.markAllAsRead(chatId, accountId, "Admin");

      const chat = chatList.find((c) => c._id === chatId);
      setSelectedChat(chat);
      setChatId(chatId);

      accountwiseChatlist(accountId, isActiveTrue);
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const getsChatDetails = async () => {
    try {
      const res = await chatAPI.getChatById(chatId);
      setSelectedChat(res.data.chat);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  // ================= BULK ACTIONS =================
  const handleCheckboxChange = (id) => {
    setSelectedChatIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const isChatSelected = (id) => selectedChatIds.includes(id);

  // const handleBulkDelete = () => {
  //   confirm({
  //     title: "Delete Chats",
  //     description: "Are you sure you want to delete selected chats?",
  //     onConfirm: async () => {
  //       try {
  //         await Promise.all(
  //           selectedChatIds.map((id) => chatAPI.deleteChat(id))
  //         );

  //         toast.success("Chats deleted");
  //         setSelectedChatIds([]);
  //         accountwiseChatlist(accountId, isActiveTrue);
  //       } catch (error) {
  //         toast.error("Delete failed");
  //       }
  //     },
  //   });
  // };
const handleBulkDelete = () => {
  confirm({
    title: "Delete Chats",
    description: "Are you sure you want to delete selected chats?",
    onConfirm: async () => {
      try {

        await Promise.all(
          selectedChatIds.map((id) =>
            chatAPI.deleteChatForAdmin(id)
          )
        );

        toast.success("Chats deleted");

        setSelectedChatIds([]);

        // remove selected chat if deleted
        if (
          selectedChat &&
          selectedChatIds.includes(selectedChat._id)
        ) {
          setSelectedChat(null);
        }

        accountwiseChatlist(accountId, isActiveTrue);

      } catch (error) {
        console.error(error);

        toast.error("Delete failed");
      }
    },
  });
};
  const handleArchiveJob = async (id) => {
    try {
      await chatAPI.updateChat(id, { active: !isActiveTrue });
      toast.success("Updated successfully");
      accountwiseChatlist(accountId, isActiveTrue);
      setSelectedChatIds([]);
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleBulkArchive = () => {
    selectedChatIds.forEach(handleArchiveJob);
  };

  // ================= UI =================
  return (
    <div className="mt-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 px-4 py-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Chats & Tasks
          </h1>

          <Tabs 
            value={isActiveTrue ? "active" : "archived"} 
            onValueChange={(val) => setIsActiveTrue(val === "active")}
            className="w-auto"
          >
            <TabsList className="bg-gray-100 rounded-lg">
              <TabsTrigger value="active" className="text-sm px-3 py-1">
                Active
              </TabsTrigger>
              <TabsTrigger value="archived" className="text-sm px-3 py-1">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedChatIds.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
              >
                <Archive className="w-4 h-4 mr-1" />
                {isActiveTrue ? "Archive" : "Unarchive"}
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="rounded-lg"
        >
          New Chat
        </Button>
      </div>

      {/* MAIN */}
      <div className="flex h-[85vh] gap-3  rounded-lg p-1">
        {/* CHAT LIST */}
        <ScrollArea className="w-[30%]  rounded-lg shadow-sm">
          <div className="space-y-0">
            {chatList.map((chat) => {
              const unread = countUnreadAdminMessages(chat);

              return (
                <div key={chat._id}>
                  <Card
                    className={`p-4 m-2 cursor-pointer transition-all duration-200 rounded-lg ${
                      selectedChat?._id === chat._id
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                    onClick={() => handleShowChat(chat._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isChatSelected(chat._id)}
                          onCheckedChange={() => handleCheckboxChange(chat._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="border-gray-300"
                        />
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            <FaTelegramPlane  className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-gray-600">
                          {chat.accountid?.accountName}
                        </span>
                      </div>

                      {unread > 0 && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold">
                          {unread}
                        </Badge>
                      )}
                    </div>

                    <p className="font-semibold mt-1 text-sm text-gray-900">
                      {chat.chatsubject}
                    </p>

                    <p className="text-xs text-gray-500 block mt-0.5">
                      {(() => {
                        const messages = chat.description || [];
                        const latest = messages[messages.length - 1];
                        if (!latest) return "No messages yet";

                        const clean =
                          latest.message?.replace(/<[^>]+>/g, "") || "";
                        // const sender =
                        //   latest.fromwhome === "Admin" && latest.senderid;
const sender =
  latest.fromwhome === "Admin"
    ? latest.senderid
    : latest.senderid || "Client";
                        return `${sender || ""} : ${
                          clean.length > 35 ? clean.slice(0, 35) + "..." : clean
                        }`;
                      })()}
                    </p>

                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-400">
                        {formatTime(chat.updatedAt)}
                      </span>
                    </div>
                  </Card>
                  <Separator />
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* CHAT DETAILS */}
        <div className="w-[70%]  rounded-lg shadow-sm p-4">
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              accountwiseChatlist={accountwiseChatlist}
              data={accountId}
              accountName={accountName}
              isActiveTrue={isActiveTrue}
              onChatAction={() => setSelectedChat(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a chat</p>
            </div>
          )}
        </div>
      </div>

      {/* DRAWER */}
      <NewChatDrawer
                open={open}
                handleClose={() => setOpen(false)}
                accountwiseChatlist={accountwiseChatlist}
                data={accountId}
                isActiveTrue={isActiveTrue}
              />
    </div>
  );
};

export default Communication;