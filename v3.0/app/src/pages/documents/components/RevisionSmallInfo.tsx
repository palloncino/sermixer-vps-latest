import { Typography } from "@mui/material";
import React, { FC } from "react";
import { StyledRevisionInfo } from "../styled-components/index.ts";
import { ChangeLogItem } from "../../../types/index.ts";

interface RevisionSmallInfoProps {
    selectedRevision: ChangeLogItem;
    borderColor: string;
}

const RevisionSmallInfo: FC<RevisionSmallInfoProps> = ({ selectedRevision, borderColor }: any) => {
    return (
        <StyledRevisionInfo border_color={borderColor}>
            <Typography variant="caption">
                {`Revision ID: ${selectedRevision.id}`}
                <br />
                {`${selectedRevision.actor.type} (ID: ${selectedRevision.actor.id})`}
                <br />
                {`${new Date(selectedRevision.timestamp).toLocaleString()}`}
            </Typography>
        </StyledRevisionInfo>
    );
};

export default RevisionSmallInfo;