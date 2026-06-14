import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const GroupUserSelect = ({
  groups = [],
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select User" />
      </SelectTrigger>

      <SelectContent className="max-h-[300px] overflow-y-auto">
        {groups.map((group) => (
          <SelectGroup
            key={group.groupId || group.groupName}
          >
            <SelectLabel className="text-xs font-semibold text-gray-500">
              {group.groupName}
            </SelectLabel>

            {group.users?.map((user) => {
              const isLeader =
                group.leader?._id === user._id;

              return (
                <SelectItem
                  key={user._id}
                  value={user._id}
                >
                  {isLeader
                    ? `👑 ${user.username}`
                    : user.username}
                </SelectItem>
              );
            })}
          </SelectGroup>
        ))}

        {groups.length === 0 && (
          <div className="p-2 text-sm text-gray-500">
            No users available
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default GroupUserSelect;