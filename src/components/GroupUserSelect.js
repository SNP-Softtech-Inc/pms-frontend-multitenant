import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GroupUserSelect = ({
  groups,
  value,
  onChange,
}) => {
  return (
   <Select value={selectedUser} onValueChange={setSelectedUser}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select User" />
  </SelectTrigger>

  <SelectContent>
    {groups?.map((group) => (
      <SelectGroup key={group._id}>
        <SelectLabel>
          {group.groupName} (Leader: {group.leader?.username})
        </SelectLabel>

        {group.leader && (
          <SelectItem value={group.leader._id}>
            👑 {group.leader.username}
          </SelectItem>
        )}

        {group.members?.map((member) => (
          <SelectItem
            key={member._id}
            value={member._id}
          >
            {member.username}
          </SelectItem>
        ))}
      </SelectGroup>
    ))}

    {ungroupedUsers?.length > 0 && (
      <SelectGroup>
        <SelectLabel>Ungrouped Users</SelectLabel>

        {ungroupedUsers.map((user) => (
          <SelectItem
            key={user._id}
            value={user._id}
          >
            {user.username}
          </SelectItem>
        ))}
      </SelectGroup>
    )}
  </SelectContent>
</Select>
  );
};

export default GroupUserSelect;